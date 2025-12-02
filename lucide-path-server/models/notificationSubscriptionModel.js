import mongoose from 'mongoose';

const notificationSubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  subscription: { type: Object, required: true },
}, { timestamps: true });

const NotificationSubscription = mongoose.models.NotificationSubscription || mongoose.model('NotificationSubscription', notificationSubscriptionSchema);

export default NotificationSubscription;
