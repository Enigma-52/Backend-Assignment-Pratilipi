import express from 'express';
import { createOrder, getOrder, getUserOrders, updateOrderStatus, getAllOrders } from '../controllers/orderController';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrder);
router.get('/user/:userId', getUserOrders);
router.put('/:id/status', updateOrderStatus);

export default router;