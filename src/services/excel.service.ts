import * as XLSX from 'xlsx';
import { ExcelResponse, ExcelMetadata, ExcelCellValue } from '../types/excel.types.js';
import logger from '../config/logger.config.js';

/**
 * Service class for handling Excel file processing and conversion to JSON
 * Provides functionality to parse Excel files and extract structured data
 */
export class ExcelService {
  /**
   * Processes an Excel file and converts it to structured JSON data
   *
   * @param {Buffer} buffer - The Excel file buffer to process
   * @returns {ExcelResponse} Object containing metadata and structured data
   * @throws {Error} If the Excel file cannot be processed
   *
   * @example
   * const buffer = fs.readFileSync('data.xlsx');
   * const result = ExcelService.processExcelFile(buffer);
   * // Returns:
   * // {
   * //   metadata: {
   * //     totalSheets: 2,
   * //     sheetNames: ['Sheet1', 'Sheet2'],
   * //     sheets: {
   * //       'Sheet1': { totalRows: 10, columns: ['A', 'B'] },
   * //       'Sheet2': { totalRows: 5, columns: ['X', 'Y'] }
   * //     }
   * //   },
   * //   data: {
   * //     'Sheet1': [{ A: 1, B: 2 }, ...],
   * //     'Sheet2': [{ X: 'a', Y: 'b' }, ...]
   * //   }
   * // }
   */
  public static processExcelFile(buffer: Buffer): ExcelResponse {
    try {
      logger.debug('Starting Excel file processing');

      // Basic validation: check if buffer is valid
      if (!buffer || buffer.length === 0) {
        throw new Error('Invalid Excel file: Empty buffer');
      }

      // Check for Excel file signature (magic numbers)
      // Excel files start with these bytes: 50 4B 03 04 (PK..)
      if (
        buffer.length < 4 ||
        buffer[0] !== 0x50 ||
        buffer[1] !== 0x4b ||
        buffer[2] !== 0x03 ||
        buffer[3] !== 0x04
      ) {
        throw new Error('Invalid Excel file: Not a valid XLSX format');
      }

      // This will throw an error if the buffer is not a valid Excel file
      const workbook = XLSX.read(buffer, { type: 'buffer' });

      // Additional validation: check if it has valid sheets
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('Invalid Excel file: No sheets found');
      }

      const sheetNames = workbook.SheetNames;

      logger.debug({ sheetCount: sheetNames.length, sheetNames }, 'Processing sheets');

      const metadata: ExcelMetadata = {
        totalSheets: sheetNames.length,
        sheetNames,
        sheets: {},
      };

      const data: Record<string, Record<string, ExcelCellValue>[]> = {};

      sheetNames.forEach((sheetName: string) => {
        logger.debug({ sheetName }, 'Processing sheet');
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, ExcelCellValue>[];

        // Extract column headers from the first row
        const columns = Object.keys(jsonData[0] || {});

        metadata.sheets[sheetName] = {
          totalRows: jsonData.length,
          columns,
        };

        data[sheetName] = jsonData;

        logger.debug(
          { sheetName, rowCount: jsonData.length, columnCount: columns.length },
          'Sheet processed successfully'
        );
      });

      logger.info(
        {
          totalSheets: sheetNames.length,
          totalRows: Object.values(metadata.sheets).reduce(
            (sum, sheet) => sum + sheet.totalRows,
            0
          ),
        },
        'Excel file processed successfully'
      );

      return { metadata, data };
    } catch (error) {
      logger.error({ error }, 'Failed to process Excel file');
      throw new Error('Failed to process Excel file');
    }
  }
}
