import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.config';

/**
 * Middleware for logging HTTP requests and responses
 * Logs request details and response time for each HTTP request
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 *
 * @example
 * // Logs request details
 * {
 *   type: 'request',
 *   method: 'GET',
 *   url: '/api/users',
 *   query: { page: '1' },
 *   body: { name: 'John' },
 *   headers: {
 *     'user-agent': 'Mozilla/5.0...',
 *     'content-type': 'application/json'
 *   }
 * }
 *
 * // Logs response details
 * {
 *   type: 'response',
 *   method: 'GET',
 *   url: '/api/users',
 *   statusCode: 200,
 *   duration: '123ms'
 * }
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log request
  logger.info({
    type: 'request',
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type'],
    },
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      type: 'response',
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
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
    error: {
      message: err.message,
      stack: err.stack,
    },
  });

  next(err);
};
