import ForumThread from '../models/forumThreadModel.js';
import ForumPost from '../models/forumPostModel.js';
import User from '../models/userModel.js';
import Notification from '../models/notificationModel.js';
import { sendPushToUser } from './notificationController.js';

// List threads (pagination + search). Admins can include flagged/deleted if ?all=true
export const listThreads = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', tag, all = false } = req.query;
    const q = {};

    if (!all) {
      q.status = 'active';
    }

    if (tag) q.tags = tag;
    if (search) q.$text = { $search: search };

    const threads = await ForumThread.find(q)
      .sort({ pinned: -1, lastActivityAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate('author', 'firstName lastName email')
      .lean();

    const total = await ForumThread.countDocuments(q);

    return res.json({ success: true, data: threads, meta: { page: +page, limit: +limit, total } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getThread = async (req, res) => {
  try {
    const { id } = req.params;
    const thread = await ForumThread.findById(id).populate('author', 'firstName lastName email').lean();
    if (!thread) return res.status(404).json({ success: false, message: 'Thread not found' });

    // read posts (exclude deleted unless admin flagged)
    const posts = await ForumPost.find({ thread: id, status: { $ne: 'deleted' } }).sort({ createdAt: 1 }).populate('author', 'firstName lastName email').lean();

    return res.json({ success: true, data: { thread, posts } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createThread = async (req, res) => {
  try {
    const { title, body, tags = [] } = req.body || {};
    if (!title || !body) return res.status(400).json({ success: false, message: 'Title and content required' });

    const userId = req.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'Not authorized' });

    const thread = new ForumThread({ title, author: user._id, tags, lastActivityAt: Date.now() });
    await thread.save();

    const post = new ForumPost({ thread: thread._id, author: user._id, content: body });
    await post.save();

    thread.postsCount = 1;
    await thread.save();

    const result = await ForumThread.findById(thread._id).populate('author', 'firstName lastName email');

    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const addPost = async (req, res) => {
  try {
    const { id: threadId } = req.params;
    const { content } = req.body || {};
    if (!content) return res.status(400).json({ success: false, message: 'Content required' });

    const thread = await ForumThread.findById(threadId);
    if (!thread || thread.status === 'deleted') return res.status(404).json({ success: false, message: 'Thread not found' });

    const userId = req.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'Not authorized' });

    const post = new ForumPost({ thread: thread._id, author: user._id, content });
    await post.save();

    thread.postsCount = (thread.postsCount || 0) + 1;
    thread.lastActivityAt = Date.now();
    await thread.save();

    const newPost = await ForumPost.findById(post._id).populate('author', 'firstName lastName email');

    // create notification for thread author when a new post is added
    try {
      if (String(thread.author) !== String(user._id)) {
        const notif = await Notification.create({
          recipient: thread.author,
          actor: user._id,
          actorModel: 'User',
          type: 'forum_reply',
          reference: newPost._id,
          message: `${user.firstName || user.email} replied to "${thread.title}"`,
        });
        // send a push notification if the recipient is subscribed
        sendPushToUser(thread.author, { title: 'New reply', body: notif.message, data: { type: 'forum_reply', threadId: thread._id, postId: notif.reference } }).catch(() => {});
      }
    } catch (createNotifErr) {
      console.error('Failed to create notification for forum reply', createNotifErr.message);
    }

    return res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// User-level flagging (non-admin) — marks thread as flagged and records who flagged it
export const flagThread = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const thread = await ForumThread.findById(id);
    if (!thread) return res.status(404).json({ success: false, message: 'Thread not found' });

    // record flaggers and set status to flagged
    if (!thread.flaggedBy) thread.flaggedBy = [];
    if (!thread.flaggedBy.find(id => String(id) === String(userId))) thread.flaggedBy.push(userId);
    thread.status = 'flagged';
    await thread.save();

    return res.json({ success: true, message: 'Thread flagged for review' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin actions: remove thread (soft delete), restore, list flagged threads
export const listFlagged = async (req, res) => {
  try {
    const flagged = await ForumThread.find({ status: 'flagged' }).populate('author', 'firstName lastName email').lean();
    return res.json({ success: true, data: flagged });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const listFlaggedPosts = async (req, res) => {
  try {
    const flagged = await ForumPost.find({ status: 'flagged' }).populate('author', 'firstName lastName email').populate('thread', 'title').lean();
    return res.json({ success: true, data: flagged });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const moderateThread = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // action: delete | restore | archive | pin
    const thread = await ForumThread.findById(id);
    if (!thread) return res.status(404).json({ success: false, message: 'Thread not found' });

    switch (action) {
      case 'delete':
        thread.status = 'deleted';
        break;
      case 'restore':
        thread.status = 'active';
        thread.flaggedBy = [];
        break;
      case 'archive':
        thread.status = 'archived';
        break;
      case 'pin':
        thread.pinned = true;
        break;
      case 'unpin':
        thread.pinned = false;
        break;
      default:
        return res.status(400).json({ success: false, message: 'Unknown action' });
    }

    await thread.save();
    return res.json({ success: true, data: thread });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const moderatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { action } = req.body; // delete | restore | flag
    const post = await ForumPost.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    switch (action) {
      case 'delete':
        post.status = 'deleted';
        break;
      case 'restore':
        post.status = 'active';
        break;
      case 'flag':
        if (!post.flaggedBy) post.flaggedBy = [];
        if (!post.flaggedBy.find(id => String(id) === String(req.userId))) post.flaggedBy.push(req.userId);
        post.status = 'flagged';
        break;
      default:
        return res.status(400).json({ success: false, message: 'Unknown action' });
    }

    await post.save();
    return res.json({ success: true, data: post });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
