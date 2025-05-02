import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.config.js';

/**
 * Middleware for logging HTTP requests and responses
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log request
  logger.info({
    type: 'request',
    method: req.method,
    url: req.url,
    query: req.query,
    params: req.params,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length'],
    },
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      type: 'response',
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      headers: {
        'content-type': res.getHeader('content-type'),
        'content-length': res.getHeader('content-length'),
      },
    });
  });

  next();
};

/**
 * Middleware for logging errors
 * Logs detailed error information including stack trace
 *
 * @param {Error} err - The error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 *
 * @example
 * // Logs error details
 * {
 *   type: 'error',
 *   method: 'POST',
 *   url: '/api/users',
 *   error: {
 *     message: 'User not found',
 *     stack: 'Error: User not found\n    at...'
 *   }
 * }
 */
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    type: 'error',
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    error: {
      message: err.message,
      stack: err.stack,
    },
  });

  next(err);
};
