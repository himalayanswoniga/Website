import { Router } from 'express';
import {
  getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember,
} from '../controllers/teamController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', getTeamMembers);
router.post('/', protect, upload.single('photo'), createTeamMember);
router.put('/:id', protect, upload.single('photo'), updateTeamMember);
router.delete('/:id', protect, deleteTeamMember);

export default router;
