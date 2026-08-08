import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct, deleteProductImage,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.get('/', getProducts);
router.get('/:idOrSlug', getProduct);

router.post(
  '/',
  protect,
  upload.array('images', 5),
  [body('name').trim().notEmpty().withMessage('Name is required')],
  validateRequest,
  createProduct
);
router.put('/:id', protect, upload.array('images', 5), updateProduct);
router.delete('/:id/images/:imageId', protect, deleteProductImage);
router.delete('/:id', protect, deleteProduct);

export default router;
