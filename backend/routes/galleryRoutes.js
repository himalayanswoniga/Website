import { Router } from 'express';
import {
  getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem,
} from '../controllers/galleryController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', getGalleryItems);
router.post('/', protect, upload.single('image'), createGalleryItem);
router.put('/:id', protect, upload.single('image'), updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

export default router;
