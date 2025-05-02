import { Router } from 'express';
import multer from 'multer';
import { ExcelController } from '../controllers/excel.controller';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 50MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || '.xlsx,.xls').split(',');
    const ext = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();

    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel files are allowed.'));
    }
  },
});

// Excel to JSON conversion endpoint
router.post('/excel-to-json', upload.single('excelFile'), ExcelController.convertToJson);

export const excelRouter = router;
