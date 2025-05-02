import { Request, Response } from 'express';
import { ExcelError } from '../../types/excel.types';
import * as XLSX from 'xlsx';

export const mockRequest = (file?: Express.Multer.File) => {
  const req = {
    file,
  } as Request;
  return req;
};

export const mockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
};

export const mockNext = jest.fn();

export const createMockExcelError = (
  message: string,
  statusCode: number,
  code: string
): ExcelError => {
  const error = new Error(message) as ExcelError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
};

export const createMockExcelBuffer = (data: any[]): Buffer => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};
