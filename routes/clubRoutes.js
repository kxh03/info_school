
import express from 'express';
import {
  getClubs,
  getClubById,
  createClub,
  updateClub,
  joinClub,
  leaveClub
} from '../controllers/clubController.js';
import { auth, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getClubs);
router.get('/:id', getClubById);

// Protected routes
router.post('/', requireAuth, createClub);
router.put('/:id', requireAuth, updateClub);
router.post('/:id/join', requireAuth, joinClub);
router.post('/:id/leave', requireAuth, leaveClub);

export default router;
