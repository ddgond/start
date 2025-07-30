import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod/v4';
import { env } from '../env.js';

const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;

export interface AuthenticatedRequest extends Request {
  userId: number;
}

const authTokenSchema = z.object({
  userId: z.number().int().nonnegative(),
});

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const payload = authTokenSchema.parse(
      jwt.verify(token, ACCESS_TOKEN_SECRET)
    );
    (req as AuthenticatedRequest).userId = payload.userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}
