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
    body('email').normalizeEmail().isEmail(),
    body('password').trim().isLength({ min: 6 }),
  ],
  login
);

router.patch(
  '/request-reset-token',
  [body('email').normalizeEmail().isEmail()],
  requestPasswordReset
);

router.patch(
  '/reset-password/:resetToken',
  [body('password').trim().isLength({ min: 6 })],
  resetPassword
);

router.use(checkAuth);
router.post(
  '/new-user',
  [
    body('username').trim().not().isEmpty(),
    body('email').normalizeEmail().isEmail(),
    body('role').trim().not().isEmpty(),
  ],
  addUsers
);
router.patch(
  '/modify-user/:userId',
  [body('userRole').trim().not().isEmpty()],
  modifyUserRole
);

export { router as authRouter };
