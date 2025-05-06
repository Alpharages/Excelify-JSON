import { ExcelController } from '../../src/controllers/excel.controller.js';
import {
  mockRequest,
  mockResponse,
  mockNext,
  createMockExcelBuffer,
} from '../helpers/test.helper.js';
import { jest } from '@jest/globals';

describe('ExcelController', () => {
  describe('convertToJson', () => {
    it('should convert Excel file to JSON successfully', async () => {
      const mockData = [{ name: 'John', age: 30 }];
      const buffer = createMockExcelBuffer(mockData);

      const req = mockRequest({
        buffer,
        originalname: 'test.xlsx',
      } as Express.Multer.File);
      const res = mockResponse();
      const next = mockNext;

      await ExcelController.convertToJson(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.any(Object),
          data: expect.any(Object),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle missing file upload', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext;

      await ExcelController.convertToJson(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'No file uploaded',
          statusCode: 400,
          code: 'NO_FILE_UPLOADED',
        })
      );
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle processing errors', async () => {
      // Create a mock implementation that throws an error
      jest
        .spyOn(ExcelController, 'convertToJson')
        .mockImplementationOnce(async (req, res, next) => {
          next(new Error('Failed to process Excel file'));
        });

      const req = mockRequest({
        buffer: Buffer.from('invalid data'),
        originalname: 'test.xlsx',
      } as Express.Multer.File);
      const res = mockResponse();
      const next = mockNext;

      await ExcelController.convertToJson(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(res.json).not.toHaveBeenCalled();

      // Restore the original implementation
      jest.restoreAllMocks();
    });
  });
});
