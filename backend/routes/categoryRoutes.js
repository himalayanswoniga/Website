import { Router } from 'express';
import { body } from 'express-validator';
import {
  getCategories, getCategory, createCategory, updateCategory, deleteCategory,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategory);

router.post('/', protect, [body('name').trim().notEmpty().withMessage('Name is required')], validateRequest, createCategory);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

export default router;
