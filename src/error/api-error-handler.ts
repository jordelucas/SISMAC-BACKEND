import { ApiError } from './ApiError';
import { NextFunction, Request, Response } from "express";
import logger from '../logger';

function apiErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error(err);
  if (err instanceof ApiError) {
    res.status(err.code).json(err.message);
    return;
  }

  res.status(500).json('something went wrong');
}

export { apiErrorHandler };