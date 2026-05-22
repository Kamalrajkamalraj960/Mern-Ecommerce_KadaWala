import express from 'express';
import { getUsers } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/', protect, admin, getUsers);

export default router;
