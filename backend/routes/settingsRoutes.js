import { Router } from 'express';
import { getSettings, updateSettings, uploadAboutImage } from '../controllers/settingsController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', getSettings);
router.put('/', protect, updateSettings);
router.post('/about-image', protect, upload.single('image'), uploadAboutImage);

export default router;
