
import express from 'express';
import * as postController from '../controllers/postController.js';
import * as commentController from '../controllers/commentController.js';
import { auth, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes (may still filter based on visibility and approval internally)
router.get('/', auth, postController.getPosts);
router.get('/:id', auth, postController.getPostById);

// Protected routes
router.post('/', requireAuth, postController.createPost);
router.put('/:id', requireAuth, postController.updatePost);
router.delete('/:id', requireAuth, postController.deletePost);

// Post approval routes
router.put('/:id/approve', requireAuth, postController.approvePost);
router.get('/admin/pending', requireAuth, postController.getPendingPosts);

// Like/Unlike routes
router.post('/:id/like', requireAuth, postController.likePost);
router.post('/:id/unlike', requireAuth, postController.unlikePost);

// Comment routes
router.post('/comment', requireAuth, commentController.createComment);
router.delete('/comment/:id', requireAuth, commentController.deleteComment);

export default router;
