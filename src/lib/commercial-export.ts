import * as XLSX from "xlsx";

export type ExcelSheetInput = {
  name: string;
  columns: string[];
  rows: (string | number)[][];
};

function sanitizeSheetName(name: string) {
  const cleaned = name.replace(/[:\\/?*[\]]/g, "").trim();
  return (cleaned || "Sheet").slice(0, 31);
}

export function downloadExcelWorkbook(
  sheets: ExcelSheetInput[],
  fileBaseName: string,
) {
  const wb = XLSX.utils.book_new();
  for (const s of sheets) {
    const aoa = [s.columns, ...s.rows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    XLSX.utils.book_append_sheet(wb, ws, sanitizeSheetName(s.name));
  }
  XLSX.writeFile(wb, `${fileBaseName}.xlsx`);
}

export function downloadExcelSingle(
  columns: string[],
  rows: (string | number)[][],
  fileBaseName: string,
) {
  downloadExcelWorkbook([{ name: "Export", columns, rows }], fileBaseName);
}
