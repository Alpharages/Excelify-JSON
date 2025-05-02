import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { excelRouter } from './routes/excel.routes';
import { errorHandler } from './middleware/error.middleware';
import { requestLogger, errorLogger } from './middleware/logging.middleware';
import logger from './config/logger.config';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Logging middleware
app.use(requestLogger);

// Routes
app.use('/api', excelRouter);

// Error handling
app.use(errorLogger);
app.use(errorHandler);

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
