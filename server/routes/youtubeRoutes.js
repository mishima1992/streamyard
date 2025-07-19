import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  generateAuthUrl,
  handleCallback,
  getLinkedChannels,
  unlinkChannel,
} from '../controllers/youtubeController.js';

const router = express.Router();

router.get('/auth-url', protect, generateAuthUrl);
router.get('/callback', handleCallback);
router.get('/channels', protect, getLinkedChannels);
router.delete('/channels/:channelId', protect, unlinkChannel);

export default router;
