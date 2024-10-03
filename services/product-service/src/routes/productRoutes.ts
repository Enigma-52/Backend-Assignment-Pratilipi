import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { createProduct, getProduct, updateProduct, deleteProduct, getAllProducts } from '../controllers/productController';

const router = express.Router();

router.post('/', authMiddleware, createProduct);
router.get('/', authMiddleware, getAllProducts);
router.get('/:id',authMiddleware,  getProduct);
router.put('/:id',authMiddleware,  updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;