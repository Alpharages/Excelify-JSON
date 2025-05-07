import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { ExcelError } from '../types/excel.types.js';

// Middleware to handle multer errors with proper type narrowing
export const handleMulterError = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    // Handle multer-specific errors
    const excelError: ExcelError = Object.assign(new Error(err.message), {
      statusCode: err.code === 'LIMIT_FILE_SIZE' ? 413 : 400,
      code: err.code === 'LIMIT_FILE_SIZE' ? 'FILE_TOO_LARGE' : 'UPLOAD_ERROR',
    });
    next(excelError);
  } else if (err) {
    // Handle other errors from multer (including our custom file type error)
    if (typeof err === 'object') {
      const excelError = err as ExcelError;
      excelError.statusCode ??= 400;
      excelError.code ??= 'UPLOAD_ERROR';
      next(excelError);
    } else {
      // If err is not an object, wrap it in a generic error
      const excelError: ExcelError = Object.assign(new Error(String(err)), {
        statusCode: 400,
        code: 'UPLOAD_ERROR',
      });
      next(excelError);
    }
  } else {
    next();
  }
};

// Configure multer for memory storage
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 50MB default
  },
  fileFilter: (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allowed file extensions (immutable, type-inferred)
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || '.xlsx,.xls').split(',');
    // Get file extension in lowercase
    const ext = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
    // Allowed Excel MIME types (immutable, type-inferred)
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
      'application/vnd.ms-excel', // xls
    ] as const;

    // Check both extension and mimetype
    if (
      allowedTypes.includes(ext) &&
      allowedMimeTypes.includes(file.mimetype as (typeof allowedMimeTypes)[number])
    ) {
      cb(null, true);
    } else {
      const error = Object.assign(new Error('Invalid file type. Only Excel files are allowed.'), {
        statusCode: 400,
        code: 'INVALID_FILE_TYPE',
      });
      cb(error);
    }
  },
});

// Combined middleware that handles file upload and error handling
export const uploadExcelFile = (fieldName: string = 'excelFile') => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, (err) => {
      handleMulterError(err, req, res, next);
    });
  };
};
