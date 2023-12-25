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

export const checkAppVersion = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const version = process.env.REQUIRED_APP_VERSION;
  if (!version) {
    debug('No app version set in environment variables!');
    next();
    return;
  }

  const appVersion = req.get('App-Version');
  if (!appVersion) {
    next();
    return;
  }

  if (appVersion === version) {
    next();
  } else {
    debug(`App version: ${appVersion}, required: ${version}`);
    res.status(400).send('App version mismatch');
  }
};
