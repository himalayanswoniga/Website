import { Router } from 'express';
import { body } from 'express-validator';
import {
  getBlogs, getBlog, createBlog, updateBlog, deleteBlog,
} from '../controllers/blogController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.get('/', getBlogs);
router.get('/:idOrSlug', getBlog);

router.post(
  '/',
  protect,
  upload.single('featuredImage'),
  [body('title').trim().notEmpty().withMessage('Title is required'), body('content').notEmpty().withMessage('Content is required')],
  validateRequest,
  createBlog
);
router.put('/:id', protect, upload.single('featuredImage'), updateBlog);
router.delete('/:id', protect, deleteBlog);

export default router;
