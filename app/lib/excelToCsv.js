import * as XLSX from "xlsx";

/**
 * ExcelファイルをCSV文字列に変換する
 * @param {ArrayBuffer} buffer - Excelファイルのバイナリ
 * @param {{ encoding: "utf8bom" | "utf8" }} options
 * @returns {{ csv: string, error: string | null, rows: number, cols: number }}
 */
export function excelToCsv(buffer, { encoding = "utf8bom" } = {}) {
  let workbook;
  try {
    workbook = XLSX.read(buffer, { type: "array" });
  } catch {
    return { csv: "", error: "Excelファイルの読み込みに失敗しました。", rows: 0, cols: 0 };
  }

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return { csv: "", error: "シートが見つかりませんでした。", rows: 0, cols: 0 };
  }

  const sheet = workbook.Sheets[sheetName];
  const csv = XLSX.utils.sheet_to_csv(sheet);

  if (!csv.trim()) {
    return { csv: "", error: "シートにデータがありません。", rows: 0, cols: 0 };
  }

  const lines = csv.trim().split(/\r\n|\n|\r/);
  const cols = lines[0].split(",").length;

  return {
    csv,
    encoding,
    error: null,
    rows: lines.length - 1,
    cols,
  };
}

/**
 * CSV文字列を指定エンコーディングでダウンロードする
 * @param {string} csv
 * @param {"utf8bom" | "utf8"} encoding
 */
export function downloadCsv(csv, encoding = "utf8bom") {
  const bom = encoding === "utf8bom" ? "\uFEFF" : "";
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "output.csv";
  a.click();
  URL.revokeObjectURL(url);
}