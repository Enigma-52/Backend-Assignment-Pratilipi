import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { createOrder, getOrder, getUserOrders, updateOrderStatus, getAllOrders } from '../controllers/orderController';

const router = express.Router();

router.post('/', authMiddleware,createOrder);
router.get('/', authMiddleware, getAllOrders);
router.get('/:id', authMiddleware, getOrder);
router.get('/user/:userId',authMiddleware,  getUserOrders);
router.put('/:id/status', authMiddleware, updateOrderStatus);

export default router;