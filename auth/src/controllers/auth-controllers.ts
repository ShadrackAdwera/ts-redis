import brypto from 'crypto';
import { HttpError } from '@adwesh/common';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { natsWraper } from '@adwesh/common';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { UserCreatedPublisher } from '../events/publishers/user-created-publisher';
import { User, userRoles } from '../models/User';

const DEFAULT_PASSWORD = '123456';

const addUsers = async (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }
  let foundUser;
  let hashedPassword: string;
  const { username, email, role, category } = req.body;

  //check if email exists in the DB
  try {
    foundUser = await User.findOne({ email }).exec();
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }
  if (foundUser) {
    return next(new HttpError('Email exists!', 400));
  }

  //hash password
  try {
    hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }

  // create new user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    section: '',
    roles: [role],
    resetToken: null,
    tokenExpirationDate: undefined,
  });

  try {
    await newUser.save();
    if (role === userRoles.Agent) {
      newUser.category = category;
      await newUser.save();
      //publish to cron jobs service (userId, categoryId);
      await new UserCreatedPublisher(natsWraper.client).publish({
        id: newUser.id,
        email: newUser.email,
        category: newUser.category,
      });
    }
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }
  res.status(201).json({ message: 'User created' });
};

const currentUser = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id))
    return new HttpError('Invalid ID provided', 422);
  let foundUser;
  try {
    foundUser = await User.findById(id).projection('-password');
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }
  if (!foundUser) {
    return next(new HttpError('Email does not exist, sign up instead', 404));
  }
  res.status(200).json({ user: foundUser });
};

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }
  let foundUser;
  let hashedPassword: string;
  let token: string;
  const { username, email, password } = req.body;

  //check if email exists in the DB
  try {
    foundUser = await User.findOne({ email }).exec();
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }
  if (foundUser) {
    return next(new HttpError('Email exists, login instead', 400));
  }

  //hash password
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }

  // create new user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    section: '',
    roles: ['Admin'],
    resetToken: null,
    tokenExpirationDate: undefined,
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }

  try {
    token = await jwt.sign({ id: newUser.id, email }, process.env.JWT_KEY!, {
      expiresIn: '1h',
    });
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }

  res.status(201).json({
    message: 'Sign Up successful',
    user: { id: newUser.id, email, token },
  });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }
  let foundUser;
  let isPassword: boolean;
  let token: string;
  const { email, password } = req.body;

  //check if email exists in the DB
  try {
    foundUser = await User.findOne({ email }).exec();
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }
  if (!foundUser) {
    return next(new HttpError('Email does not exist, sign up instead', 404));
  }

  //compare passwords
  try {
    isPassword = await bcrypt.compare(password, foundUser.password);
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }

  if (!isPassword) {
    return next(new HttpError('Invalid password', 422));
  }

  //generate token --- also sign using tenant id
  try {
    token = await jwt.sign(
      { id: foundUser.id, email: foundUser.email },
      process.env.JWT_KEY!,
      { expiresIn: '1h' }
    );
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }

  res.status(200).json({
    message: 'Login Successful',
    user: { id: foundUser.id, email, token, roles: foundUser.roles },
  });
};

const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  let foundUser;

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Invalid email', 422));
  }

  // check if user exists in DB
  try {
    foundUser = await User.findOne({ email }).exec();
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }

  if (!foundUser) {
    return next(new HttpError('This account does not exist', 404));
  }
  const resetTkn = brypto.randomBytes(64).toString('hex');
  const resetDate = new Date(Date.now() + 3600000);
  foundUser.resetToken = resetTkn;
  foundUser.tokenExpirationDate = resetDate;

  //TODO: Send email with reset link to user : https://my-frontend-url/reset-token/${resetTkn}
  res.status(200).json({ message: 'Check your email for a reset email link' });
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password, confirmPassword } = req.body;
  const { resetToken } = req.params;
  let foundUser;
  let hashedPassword: string;

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Invalid email', 422));
  }

  //check if passwords match
  if (password !== confirmPassword) {
    return next(new HttpError('The passwords do not match', 422));
  }

  // check if user exists in DB
  try {
    foundUser = await User.findOne({
      resetToken,
      tokenExpirationDate: { $gt: Date.now() },
    }).exec();
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }

  if (!foundUser) {
    return next(new HttpError('The password reset request is invalid', 400));
  }

  // hash new password
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }
  foundUser.password = hashedPassword;
  foundUser.tokenExpirationDate = undefined;
  foundUser.resetToken = undefined;

  try {
    await foundUser.save();
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }

  res.status(200).json({ message: 'Password reset successful' });
};

const modifyUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }
  let foundUser;
  const { userRole } = req.body;
  const userId = req.params.userId;

  //check if email exists in the DB
  try {
    foundUser = await User.findById(userId).exec();
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }
  if (!foundUser) {
    return next(new HttpError('This user does not exist!', 404));
  }

  const isAgent = foundUser.roles.find(
    (role) =>
      role === userRoles.Agent ||
      role === userRoles.Admin ||
      role === userRoles.User
  );
  if (isAgent) {
    if (isAgent === userRole) {
      return next(new HttpError('This user has the role provided', 400));
    }
  }
  foundUser.roles.push(userRole);
  try {
    await foundUser.save();
    if (userRole === userRoles.Agent) {
      await new UserCreatedPublisher(natsWraper.client).publish({
        id: foundUser.id,
        email: foundUser.email,
        category: foundUser.category,
      });
      //publish update userRole event to cron jobs service
    }
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }
  res.status(201).json({
    message: `${userRole} role has been added to ${foundUser.username}'s roles`,
  });
};

export {
  signUp,
  login,
  requestPasswordReset,
  resetPassword,
  addUsers,
  modifyUserRole,
  currentUser,
};
