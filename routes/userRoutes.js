
import express from 'express';
import { 
  registerUser,
  loginUser,
  getUserProfile,
  getUserByUsername,
  updateUserProfile
} from '../controllers/userController.js';
import { auth, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:username', getUserByUsername);

// Protected routes
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);

export default router;
