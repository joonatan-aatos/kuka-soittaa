import { NextFunction, Request, Response } from 'express';
import debug from './debug';

export const requireAdminToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.get('Admin-Token');

  if (!token) {
    res.sendStatus(401);
    return;
  }

  if (!process.env.ADMIN_TOKEN) {
    debug('No admin token set in environment variables!');
    res.sendStatus(401);
  }

  if (token === process.env.ADMIN_TOKEN) {
    next();
  } else {
    res.sendStatus(401);
  }
};
