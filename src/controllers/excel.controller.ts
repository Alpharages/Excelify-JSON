import { Request, Response, NextFunction } from 'express';
import { ExcelService } from '../services/excel.service.js';
import { ExcelError } from '../types/excel.types.js';

export class ExcelController {
  public static async convertToJson(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.file) {
        const error = new Error('No file uploaded') as ExcelError;
        error.statusCode = 400;
        error.code = 'NO_FILE_UPLOADED';
        throw error;
      }

      const result = ExcelService.processExcelFile(req.file.buffer);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
