import {Request, Response, NextFunction} from 'express';

export function authAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }

  res.sendStatus(401);
}

export function auth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.sendStatus(401);
}
