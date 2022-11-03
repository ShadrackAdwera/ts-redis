import { checkAuth } from '@adwesh/common';
import { body } from 'express-validator';
import express from 'express';

import {
  signUp,
  login,
  requestPasswordReset,
  resetPassword,
  modifyUserRole,
  addUsers,
  currentUser,
} from '../controllers/auth-controllers';

const router = express.Router();

router.post(
  '/sign-up',
  [
    body('username')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Please provide your username'),
    body('email')
      .normalizeEmail()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  signUp
);

router.post(
  '/login',
  [
    body('email')
      .normalizeEmail()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  login
);

router.patch(
  '/request-reset-token',
  [
    body('email')
      .normalizeEmail()
      .isEmail()
      .withMessage('Please provide a valid email'),
  ],
  requestPasswordReset
);

router.patch(
  '/reset-password/:resetToken',
  [
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  resetPassword
);

router.use(checkAuth);
router.get('/user/:id', currentUser);
router.post(
  '/new-user',
  [
    body('username')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Please provide your username'),
    body('email')
      .normalizeEmail()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('role')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Provide a role for this user'),
  ],
  addUsers
);
router.patch(
  '/modify-user/:userId',
  [
    body('userRole')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Provide a role for this user'),
  ],
  modifyUserRole
);

export { router as authRouter };
