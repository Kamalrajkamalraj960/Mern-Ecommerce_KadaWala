import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  getDashboardStats,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Private routes (JWT protected)
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin-only routes
router.get('/', protect, admin, getOrders);
router.get('/stats/dashboard', protect, admin, getDashboardStats);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
