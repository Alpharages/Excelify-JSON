import { ExcelService } from '../../services/excel.service';
import { createMockExcelBuffer } from '../helpers/test.helper';
import * as XLSX from 'xlsx';

describe('ExcelService', () => {
  describe('processExcelFile', () => {
    it('should process a valid Excel file and return structured data', () => {
      const mockData = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ];
      const buffer = createMockExcelBuffer(mockData);

      const result = ExcelService.processExcelFile(buffer);

      expect(result.metadata.totalSheets).toBe(1);
      expect(result.metadata.sheetNames).toContain('Sheet1');
      expect(result.metadata.sheets['Sheet1'].totalRows).toBe(2);
      expect(result.metadata.sheets['Sheet1'].columns).toEqual(['name', 'age']);
      expect(result.data['Sheet1']).toEqual(mockData);
    });

    it('should handle multiple sheets', () => {
      const workbook = XLSX.utils.book_new();

      const sheet1Data = [{ id: 1, value: 'A' }];
      const sheet2Data = [{ id: 2, value: 'B' }];

      const sheet1 = XLSX.utils.json_to_sheet(sheet1Data);
      const sheet2 = XLSX.utils.json_to_sheet(sheet2Data);

      XLSX.utils.book_append_sheet(workbook, sheet1, 'Sheet1');
      XLSX.utils.book_append_sheet(workbook, sheet2, 'Sheet2');

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      const result = ExcelService.processExcelFile(buffer);

      expect(result.metadata.totalSheets).toBe(2);
      expect(result.metadata.sheetNames).toEqual(['Sheet1', 'Sheet2']);
      expect(result.data['Sheet1']).toEqual(sheet1Data);
      expect(result.data['Sheet2']).toEqual(sheet2Data);
    });

    it('should throw an error for invalid Excel file', () => {
      const invalidBuffer = Buffer.from('invalid data');

      expect(() => {
        ExcelService.processExcelFile(invalidBuffer);
      }).toThrow('Failed to process Excel file');
    });

    it('should handle empty sheets', () => {
      const workbook = XLSX.utils.book_new();
      const emptySheet = XLSX.utils.aoa_to_sheet([[]]);
      XLSX.utils.book_append_sheet(workbook, emptySheet, 'EmptySheet');

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      const result = ExcelService.processExcelFile(buffer);

      expect(result.metadata.totalSheets).toBe(1);
      expect(result.metadata.sheets['EmptySheet'].totalRows).toBe(0);
      expect(result.metadata.sheets['EmptySheet'].columns).toEqual([]);
      expect(result.data['EmptySheet']).toEqual([]);
    });
  });
});
