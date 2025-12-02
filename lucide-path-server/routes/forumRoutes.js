import express from 'express';
import {
  listThreads,
  getThread,
  createThread,
  addPost,
  flagThread,
  listFlagged,
  listFlaggedPosts,
  moderateThread,
  moderatePost
} from '../controllers/forumController.js';

import userAuth from '../middleware/userAuth.js';
import { requireFields, validateModerationAction } from '../middleware/validateForum.js';
import providerAuth from '../middleware/providerAuth.js';
import adminOnly from '../middleware/admin.js';

const router = express.Router();

// Public: list and read
router.get('/', listThreads);
router.get('/:id', getThread);

// User actions
router.post('/', userAuth, requireFields(['title', 'body']), createThread);
router.post('/:id/posts', userAuth, requireFields(['content']), addPost);
router.post('/:id/flag', userAuth, flagThread);

// Moderation - provider admin only
router.get('/moderation/flagged', providerAuth, adminOnly, listFlagged);
router.get('/moderation/flagged-posts', providerAuth, adminOnly, listFlaggedPosts);
router.post('/moderation/thread/:id', providerAuth, adminOnly, validateModerationAction, moderateThread);
router.post('/moderation/post/:postId', providerAuth, adminOnly, validateModerationAction, moderatePost);

export default router;
