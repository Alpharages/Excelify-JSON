import pino from 'pino';

/**
 * Determines if the application is running in development mode
 * @type {boolean}
 */
const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Configures the transport for development environment with pretty printing
 * @type {Object|undefined}
 */
const transport = isDevelopment
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: 'SYS:standard',
      },
    }
  : undefined;

/**
 * Creates and configures the Pino logger instance
 * @type {pino.Logger}
 *
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
