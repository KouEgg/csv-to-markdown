/**
 * JSON配列をCSV文字列に変換する
 * @param {string} jsonInput - JSON文字列
 * @returns {{ csv: string, error: string | null, rows: number, cols: number }}
 */
export function jsonToCsv(jsonInput) {
  if (!jsonInput.trim()) {
    return { csv: "", error: null, rows: 0, cols: 0 };
  }

  // パース
  let parsed;
  try {
    parsed = JSON.parse(jsonInput);
  } catch {
    return { csv: "", error: "JSONの形式が正しくありません。構文を確認してください。", rows: 0, cols: 0 };
  }

  // 配列チェック
  if (!Array.isArray(parsed)) {
    return { csv: "", error: "JSONは配列形式（[ { ... }, { ... } ]）で入力してください。", rows: 0, cols: 0 };
  }

  if (parsed.length === 0) {
    return { csv: "", error: "配列が空です。", rows: 0, cols: 0 };
  }

  // 全オブジェクトからキーを収集（順序保持）
  const headers = [];
  const headerSet = new Set();
  for (const row of parsed) {
    if (typeof row !== "object" || row === null || Array.isArray(row)) continue;
    for (const key of Object.keys(row)) {
      if (!headerSet.has(key)) {
        headers.push(key);
        headerSet.add(key);
      }
    }
  }

  if (headers.length === 0) {
    return { csv: "", error: "変換できるデータが見つかりませんでした。", rows: 0, cols: 0 };
  }

  // 各セルの値をCSV用にエスケープ
  const escapeCell = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    // カンマ・ダブルクォート・改行を含む場合はダブルクォートで囲む
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // ヘッダー行
  const headerRow = headers.map(escapeCell).join(",");

  // データ行
  const dataRows = parsed.map((row) => {
    if (typeof row !== "object" || row === null || Array.isArray(row)) {
      return headers.map(() => "").join(",");
    }
    return headers.map((h) => escapeCell(row[h])).join(",");
  });

  const csv = [headerRow, ...dataRows].join("\n");

  return { csv, error: null, rows: parsed.length, cols: headers.length };
}