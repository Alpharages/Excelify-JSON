import { pino } from 'pino';
import { Request } from 'express';

/**
 * Determines if the application is running in development mode
 * @type {boolean}
 */
const isDevelopment: boolean = process.env.NODE_ENV !== 'production';

/**
 * Configuration for the logger transport
 * In development mode:
 * - Uses pino-pretty for formatted output
 * - Enables colorization
 * - Shows log level first
 * - Formats timestamps using system standard
 * In production mode:
 * - Uses default JSON transport
 */
const transport = isDevelopment
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
      },
      autoLogging: {
        ignore: (req: Request) => req.url === '/health' || req.url === '/metrics',
      },
      redact: {
        paths: ['req.headers.authorization'],
        remove: true,
      },
    }
  : undefined;

/**
 * Creates and configures the Pino logger instance
 * Configuration:
 * - Development: Uses pretty printing with colors and debug level
 * - Production: Uses JSON format with info level
 * - Log level can be overridden by LOG_LEVEL environment variable
 */
const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  transport,
  base: {
    env: process.env.NODE_ENV,
  },
});

export default logger;
