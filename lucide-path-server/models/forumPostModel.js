import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema({
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumThread', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true },
  status: { type: String, enum: ['active', 'flagged', 'deleted'], default: 'active' },
  flaggedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

forumPostSchema.index({ content: 'text' });

const ForumPost = mongoose.models.ForumPost || mongoose.model('ForumPost', forumPostSchema);

export default ForumPost;
