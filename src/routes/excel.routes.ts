import { Router } from 'express';
import { ExcelController } from '../controllers/excel.controller.js';
import { uploadExcelFile } from '../middleware/multer.middleware.js';

const router: Router = Router();

// Excel to JSON conversion endpoint
router.post('/excel-to-json', uploadExcelFile('excelFile'), ExcelController.convertToJson);

export const excelRouter = router;
