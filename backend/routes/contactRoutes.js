import { Router } from 'express';
import { body } from 'express-validator';
import {
  submitMessage, getMessages, getMessage, markMessageRead, deleteMessage,
} from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post(
  '/',
  contactLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  validateRequest,
  submitMessage
);

router.get('/', protect, getMessages);
router.get('/:id', protect, getMessage);
router.patch('/:id/read', protect, markMessageRead);
router.delete('/:id', protect, deleteMessage);

export default router;
