import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { excelRouter } from './routes/excel.routes.js';
import { requestLogger, errorLogger } from './middleware/logging.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/v1', excelRouter);

// Error handling
app.use(errorLogger);
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { app };
