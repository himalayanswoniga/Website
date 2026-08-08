import { Router } from 'express';
import {
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
} from '../controllers/testimonialController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', getTestimonials);
router.post('/', protect, upload.single('avatar'), createTestimonial);
router.put('/:id', protect, upload.single('avatar'), updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

export default router;
