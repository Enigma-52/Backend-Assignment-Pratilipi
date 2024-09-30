import express from 'express';
import { ProductController } from '../controllers/productController';

const router = express.Router();

router.post('/', ProductController.createProduct);
router.get('/:id', ProductController.getProduct);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);
router.get('/', ProductController.getAllProducts);

export { router as productRouter };