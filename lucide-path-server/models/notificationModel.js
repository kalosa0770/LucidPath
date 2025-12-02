import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actor: { type: mongoose.Schema.Types.ObjectId, refPath: 'actorModel' },
  actorModel: { type: String, enum: ['User', 'Provider'], default: 'User' },
  type: { type: String, enum: ['forum_reply','forum_thread','provider_message','system'], required: true },
  reference: { type: mongoose.Schema.Types.ObjectId },
  message: { type: String },
  read: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ recipient: 1, read: 1 });

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;
