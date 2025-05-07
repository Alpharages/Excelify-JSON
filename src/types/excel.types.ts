/**
 * Represents metadata about a single sheet in an Excel file
 */
export interface SheetMetadata {
  /** Total number of rows in the sheet */
  totalRows: number;
  /** Array of column names/headers in the sheet */
  columns: string[];
}

/**
 * Represents metadata about an entire Excel file
 */
export interface ExcelMetadata {
  /** Total number of sheets in the Excel file */
  totalSheets: number;
  /** Array of sheet names in the Excel file */
  sheetNames: string[];
  /** Object containing metadata for each sheet, keyed by sheet name */
  sheets: Record<string, SheetMetadata>;
}

/**
 * Represents possible values in an Excel cell
 */
export type ExcelCellValue = string | number | boolean | Date | null;

/**
 * Represents the complete response from processing an Excel file
 */
export interface ExcelResponse {
  /** Metadata about the Excel file and its sheets */
  metadata: ExcelMetadata;
  /** The actual data from each sheet, keyed by sheet name */
  data: Record<string, Record<string, ExcelCellValue>[]>;
}

export interface ExcelError extends Error {
  statusCode?: number;
  code?: string;
}
