import express from 'express';
import { listNotifications, unreadCount, markRead } from '../controllers/notificationController.js';
import { getVapidPublicKey, subscribe, unsubscribe } from '../controllers/notificationController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.get('/', userAuth, listNotifications);
router.get('/unread', userAuth, unreadCount);
router.post('/mark-read', userAuth, markRead);
router.get('/vapidPublicKey', getVapidPublicKey);
router.post('/subscribe', userAuth, subscribe);
router.post('/unsubscribe', userAuth, unsubscribe);

export default router;
