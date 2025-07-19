import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import avatarUpload from '../middleware/avatarUploadMiddleware.js';
import {
    updateUserProfile,
    updateUserPassword,
    updateUserAvatar,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/profile').put(protect, updateUserProfile);
router.route('/password').put(protect, updateUserPassword);
router.route('/avatar').put(protect, avatarUpload.single('avatar'), updateUserAvatar);

export default router;
