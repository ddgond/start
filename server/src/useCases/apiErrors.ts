import type { Response } from 'express';
import { ApiError } from '../domain/ApiError.js';

export function respondWithApiError(res: Response, error: ApiError): void {
  res.status(error.status).json({ message: error.message });
}
