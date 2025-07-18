import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
} from '../controllers/authController.js';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const registerValidation = [
  body('username', 'Username is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
];

const loginValidation = [
    body('login', 'Login credential is required').not().isEmpty(),
    body('password', 'Password is required').exists()
];

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.get('/profile', protect, getUserProfile);

export default router;
