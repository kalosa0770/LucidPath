import mongoose from 'mongoose';

const forumThreadSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  flaggedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['active', 'flagged', 'deleted', 'archived'], default: 'active' },
  pinned: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  postsCount: { type: Number, default: 0 },
  lastActivityAt: { type: Date, default: Date.now }
}, { timestamps: true });

// text index for searching
forumThreadSchema.index({ title: 'text' });

const ForumThread = mongoose.models.ForumThread || mongoose.model('ForumThread', forumThreadSchema);

export default ForumThread;
