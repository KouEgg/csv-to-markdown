/**
 * CSV文字列をJSON配列に変換する
 * @param {string} csvInput - CSV文字列
 * @param {{ hasHeader: boolean, delimiter: string }} options
 * @returns {{ json: string, error: string | null, rows: number, cols: number }}
 */
export function csvToJson(csvInput, { hasHeader = true, delimiter = "," } = {}) {
  if (!csvInput.trim()) {
    return { json: "", error: null, rows: 0, cols: 0 };
  }

  // 行に分割
  const lines = csvInput.trim().split(/\r\n|\n|\r/);
  if (lines.length === 0) {
    return { json: "", error: "データが空です。", rows: 0, cols: 0 };
  }

  // CSVの1行をセルに分割（ダブルクォート対応）
  const parseLine = (line) => {
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
        } else if (char === delimiter) {
          cells.push(current);
          current = "";
        } else {
          current += char;
        }
      }
    }
    cells.push(current);
    return cells;
  };

  // ヘッダー行の処理
  let headers;
  let dataLines;

  if (hasHeader) {
    if (lines.length < 2) {
      return { json: "", error: "ヘッダー行しかありません。データ行を追加してください。", rows: 0, cols: 0 };
    }
    headers = parseLine(lines[0]);
    dataLines = lines.slice(1);
  } else {
    // ヘッダーなしの場合はcolumn1, column2...と自動命名
    const firstRow = parseLine(lines[0]);
    headers = firstRow.map((_, i) => `column${i + 1}`);
    dataLines = lines;
  }

  if (headers.length === 0) {
    return { json: "", error: "ヘッダーが読み取れませんでした。", rows: 0, cols: 0 };
  }

  // データ行をオブジェクトに変換
  const result = dataLines.map((line) => {
    const cells = parseLine(line);
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = cells[i] !== undefined ? cells[i] : "";
    });
    return obj;
  });

  const json = JSON.stringify(result, null, 2);

  return { json, error: null, rows: result.length, cols: headers.length };
}