import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../utils/AppError';
import { Logger } from '../../../infrastructure/logger/Logger';

const logger = Logger.getInstance();

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unexpected error', { error: err.message, stack: err.stack, path: req.path, method: req.method });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  // Fallback for unhandled errors
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.',
    },
  });
};
