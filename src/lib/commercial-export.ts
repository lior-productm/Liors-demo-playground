export type ExcelSheetInput = {
  name: string;
  columns: string[];
  rows: (string | number)[][];
};

function sanitizeSheetName(name: string) {
  const cleaned = name.replace(/[:\\/?*[\]]/g, "").trim();
  return (cleaned || "Sheet").slice(0, 31);
}

export async function downloadExcelWorkbook(
  sheets: ExcelSheetInput[],
  fileBaseName: string,
) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  for (const s of sheets) {
    const aoa = [s.columns, ...s.rows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    XLSX.utils.book_append_sheet(wb, ws, sanitizeSheetName(s.name));
  }
  XLSX.writeFile(wb, `${fileBaseName}.xlsx`);
}

export async function downloadExcelSingle(
  columns: string[],
  rows: (string | number)[][],
  fileBaseName: string,
) {
  await downloadExcelWorkbook([{ name: "Export", columns, rows }], fileBaseName);
}
