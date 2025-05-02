import { Request, Response, NextFunction } from 'express';
import { ExcelError } from '@/types/excel.types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: ExcelError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
    },
  });
};
