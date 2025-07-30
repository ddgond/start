import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod/v4';
import { ApiError } from '../domain/ApiError.js';
import { env } from '../env.js';
import { respondWithApiError } from '../useCases/apiErrors.js';
import * as authUseCase from '../useCases/auth.js';
import { REFRESH_TOKEN_EXPIRATION_DAYS } from '../useCases/auth.js';
import userRouter from './user.js';

const router: Router = Router();

router.use(compression());
router.use(cookieParser());
router.use(express.json());

router.use('/user', userRouter);

const authUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(40),
});

router.post(
  '/register',
  async (req: Request, res: Response<{ accessToken: string } | ApiError>) => {
    try {
      const { email, password } = authUserSchema.parse(req.body);
      const tokens = await authUseCase.registerUser(email, password);
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
      });
      return res.json({ accessToken: tokens.accessToken });
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        return respondWithApiError(res, {
          message: 'Invalid registration data',
          status: 400,
        });
      }
      return respondWithApiError(res, {
        message: 'Error registering user',
        status: 400,
      });
    }
  }
);

router.post(
  '/login',
  async (req: Request, res: Response<{ accessToken: string } | ApiError>) => {
    try {
      const { email, password } = authUserSchema.parse(req.body);
      const tokens = await authUseCase.loginUser(email, password);
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
      });
      return res.json({ accessToken: tokens.accessToken });
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        return respondWithApiError(res, {
          message: 'Invalid login data',
          status: 400,
        });
      }
      return respondWithApiError(res, {
        message: 'Error logging in',
        status: 400,
      });
    }
  }
);

router.post(
  '/logout',
  async (req: Request, res: Response<{ success: boolean } | ApiError>) => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) {
        await authUseCase.invalidateRefreshToken(refreshToken);
      }
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      return res.json({ success: true });
    } catch (error) {
      console.error(error);
      return respondWithApiError(res, {
        message: 'Error logging out',
        status: 400,
      });
    }
  }
);

router.post(
  '/refresh-tokens',
  async (req: Request, res: Response<{ accessToken: string } | ApiError>) => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return respondWithApiError(res, {
          message: 'No refresh token provided',
          status: 400,
        });
      }
      const tokens = await authUseCase.refreshTokens(refreshToken);
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
      });
      return res.json({ accessToken: tokens.accessToken });
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        return respondWithApiError(res, {
          message: 'Invalid refresh token',
          status: 400,
        });
      }
      return respondWithApiError(res, {
        message: 'Error refreshing tokens',
        status: 400,
      });
    }
  }
);

router.get('/health', (req: Request, res: Response<{ status: string }>) => {
  return res.json({ status: 'ok' });
});

export default router;
