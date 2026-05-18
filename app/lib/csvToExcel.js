import * as XLSX from "xlsx";

/**
 * CSV文字列をExcelファイル（.xlsx）としてダウンロードする
 * @param {string} csvInput - CSV文字列
 * @param {string} filename - ダウンロードファイル名
 * @returns {{ error: string | null, rows: number, cols: number }}
 */
export function downloadAsExcel(csvInput, filename = "output.xlsx") {
  if (!csvInput.trim()) {
    return { error: "CSVデータを入力してください。", rows: 0, cols: 0 };
  }

  const lines = csvInput.trim().split(/\r\n|\n|\r/);
  const data = lines.map((line) => {
    const cells = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (inQuotes) {
        if (char === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ",") {
          cells.push(current);
          current = "";
        } else {
          current += char;
        }
      }
    }
    cells.push(current);
    return cells;
  });

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, filename);

  return { error: null, rows: data.length - 1, cols: data[0]?.length ?? 0 };
}