import request from 'supertest';
import express from 'express';
import { excelRouter } from '@/routes/excel.routes';
import { errorHandler } from '@/middleware/error.middleware';
import { createMockExcelBuffer } from '../helpers/test.helper';

describe('API Endpoints', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api', excelRouter);
    app.use(errorHandler);
  });

  describe('POST /api/excel-to-json', () => {
    it('should convert Excel file to JSON successfully', async () => {
      const mockData = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ];
      const buffer = createMockExcelBuffer(mockData);

      const response = await request(app).post('/api/excel-to-json').attach('excelFile', buffer, {
        filename: 'test.xlsx',
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('metadata');
      expect(response.body).toHaveProperty('data');
      expect(response.body.metadata.totalSheets).toBe(1);
      expect(response.body.data['Sheet1']).toEqual(mockData);
    });

    it('should handle missing file upload', async () => {
      const response = await request(app).post('/api/excel-to-json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'NO_FILE_UPLOADED');
    });

    it('should handle invalid file type', async () => {
      const response = await request(app)
        .post('/api/excel-to-json')
        .attach('excelFile', Buffer.from('invalid data'), {
          filename: 'test.txt',
          contentType: 'text/plain',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty(
        'message',
        'Invalid file type. Only Excel files are allowed.'
      );
    });

    it('should handle file size limit', async () => {
      // Create a large buffer (51MB)
      const largeBuffer = Buffer.alloc(51 * 1024 * 1024);

      const response = await request(app)
        .post('/api/excel-to-json')
        .attach('excelFile', largeBuffer, {
          filename: 'large.xlsx',
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

      expect(response.status).toBe(413);
      expect(response.body).toHaveProperty('success', false);
    });
  });
});
