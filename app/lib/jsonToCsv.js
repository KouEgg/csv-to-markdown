/**
 * ネストしたオブジェクトをドット記法でフラット化する
 * { address: { city: "Tokyo" } } → { "address.city": "Tokyo" }
 */
function flattenObject(obj, prefix = "") {
  const result = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, fullKey));
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

/**
 * パース済みJSONから配列を取り出す
 * パターン①: 配列そのまま → そのまま返す
 * パターン②: オブジェクトの中に配列 → 最初の配列を返す
 */
function extractArray(parsed) {
  if (Array.isArray(parsed)) {
    return { array: parsed, error: null };
  }

  if (typeof parsed === "object" && parsed !== null) {
    for (const key of Object.keys(parsed)) {
      if (Array.isArray(parsed[key])) {
        return { array: parsed[key], error: null };
      }
    }
  }

  return {
    array: null,
    error: "変換できる配列が見つかりませんでした。配列形式（[ { ... } ]）またはオブジェクト内に配列を含む形式で入力してください。",
  };
}

/**
 * 各セルの値をCSV用にエスケープ
 */
function escapeCell(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * JSON文字列をCSV文字列に変換する
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

  // 配列を取り出す（パターン①②対応）
  const { array, error: extractError } = extractArray(parsed);
  if (extractError) {
    return { csv: "", error: extractError, rows: 0, cols: 0 };
  }

  if (array.length === 0) {
    return { csv: "", error: "配列が空です。", rows: 0, cols: 0 };
  }

  // 各行をフラット化（パターン③対応）
  const flatRows = array.map((row) => {
    if (typeof row !== "object" || row === null || Array.isArray(row)) {
      return {};
    }
    return flattenObject(row);
  });

  // 全行からヘッダーを収集（順序保持）
  const headers = [];
  const headerSet = new Set();
  for (const row of flatRows) {
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

  // ヘッダー行
  const headerRow = headers.map(escapeCell).join(",");

  // データ行
  const dataRows = flatRows.map((row) =>
    headers.map((h) => escapeCell(row[h])).join(",")
  );

  const csv = [headerRow, ...dataRows].join("\n");

  return { csv, error: null, rows: flatRows.length, cols: headers.length };
}