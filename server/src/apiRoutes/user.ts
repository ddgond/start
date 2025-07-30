import { Router } from 'express';
import type { Request, Response } from 'express';
import {
  AuthenticatedRequest,
  authenticateUser,
} from '../apiMiddleware/auth.js';
import { ApiError } from '../domain/ApiError.js';
import { PublicUser } from '../domain/User.js';
import { respondWithApiError } from '../useCases/apiErrors.js';
import * as userUseCase from '../useCases/users.js';

const router: Router = Router();

router.get(
  '/me',
  authenticateUser,
  async (req: Request, res: Response<PublicUser | ApiError>) => {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const user = await userUseCase.getUser(userId);
      return res.json(user);
    } catch (error) {
      console.error(error);
      return respondWithApiError(res, {
        message: 'Error getting user',
        status: 500,
      });
    }
  }
);

export default router;
