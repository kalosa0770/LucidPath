import Notification from '../models/notificationModel.js';
import NotificationSubscription from '../models/notificationSubscriptionModel.js';
import webpush from 'web-push';
import 'dotenv/config';
import User from '../models/userModel.js';

export const listNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20, unread } = req.query;
    const q = { recipient: userId };
    if (unread === 'true') q.read = false;

    const notifications = await Notification.find(q)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate('actor', 'firstName lastName email')
      .lean();

    const total = await Notification.countDocuments(q);

    return res.json({ success: true, data: notifications, meta: { page: +page, limit: +limit, total } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const unreadCount = async (req, res) => {
  try {
    const userId = req.userId;
    const count = await Notification.countDocuments({ recipient: userId, read: false });
    return res.json({ success: true, data: { unread: count } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const markRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body || {};
    if (id) {
      await Notification.updateOne({ _id: id, recipient: userId }, { $set: { read: true } });
    } else {
      // mark all as read
      await Notification.updateMany({ recipient: userId, read: false }, { $set: { read: true } });
    }

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Return vapid public key so clients can subscribe
export const getVapidPublicKey = (req, res) => {
  const key = process.env.VAPID_PUBLIC_KEY;
  if (!key) return res.status(500).json({ success: false, message: 'VAPID_PUBLIC_KEY not configured' });
  return res.json({ success: true, data: { publicKey: key } });
};

export const subscribe = async (req, res) => {
  try {
    const userId = req.userId;
    const { subscription } = req.body || {};
    if (!subscription) return res.status(400).json({ success: false, message: 'subscription required' });

    await NotificationSubscription.findOneAndUpdate({ user: userId }, { user: userId, subscription }, { upsert: true });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const userId = req.userId;
    await NotificationSubscription.deleteOne({ user: userId });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// helper to send push to a user when they have an active subscription
export const sendPushToUser = async (userId, payload = {}) => {
  try {
    const record = await NotificationSubscription.findOne({ user: userId }).lean();
    if (!record || !record.subscription) return false;

    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    if (!publicKey || !privateKey) {
      console.warn('VAPID keys not configured — cannot send push');
      return false;
    }

    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
      publicKey,
      privateKey
    );

    const sub = record.subscription;
    await webpush.sendNotification(sub, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error('sendPushToUser error', err?.body || err.message || err);
    return false;
  }
};
