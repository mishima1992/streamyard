import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import {
  uploadVideo,
  importFromGoogleDrive,
  getUserVideos,
} from '../controllers/videoController.js';

const router = express.Router();

router.route('/')
  .get(protect, getUserVideos);

router.route('/upload')
  .post(protect, upload.single('video'), uploadVideo);

router.route('/import/google-drive')
  .post(protect, importFromGoogleDrive);

export default router;
