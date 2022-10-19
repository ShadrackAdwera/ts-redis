import { Request, Response, NextFunction } from 'express';
import { clearHash } from './cache';

export const clearCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await next();
  await clearHash(req.user ? req.user.userId : '');
};
