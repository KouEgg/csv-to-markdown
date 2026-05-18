/**
 * CSV行をセルに分割する（ダブルクォート対応）
 * @param {string} row - CSV行文字列
 * @param {string} delimiter - 区切り文字
 * @returns {string[]} - セルの配列
 */
export function parseCSVRow(row, delimiter = ",") {
  const cells = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

const TABLE_STYLES = {
  none: "",
  simple: `<style>
table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 14px; }
th, td { border: 1px solid #e2e4e9; padding: 8px 12px; text-align: left; }
th { background: #f4f5f7; font-weight: bold; color: #1a1d23; }
tr:hover { background: #f9fafb; }
</style>
`,
  stripe: `<style>
table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 14px; }
th, td { border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; }
thead tr { background: #4f6ef7 !important; }
th { background: #4f6ef7 !important; color: #fff !important; font-weight: bold; }
tbody tr:nth-child(even) { background: #f4f5f7; }
tbody tr:hover { background: #eef0fd; }
</style>
`,
};

/**
 * CSV文字列をHTMLテーブルに変換する
 * @param {string} csvText - CSV文字列
 * @param {{ hasHeader: boolean, delimiter: string, tableStyle: string }} options
 * @returns {string} - HTML文字列
 */
export function csvToHtml(csvText, options = {}) {
  const { hasHeader = true, delimiter = ",", tableStyle = "none" } = options;
  if (!csvText || csvText.trim() === "") return "";

  const rows = csvText.trim().split(/\r\n|\n|\r/);
  if (rows.length === 0) return "";

  const table = rows.map((row) => parseCSVRow(row, delimiter));
  const colCount = Math.max(...table.map((row) => row.length));
  const normalized = table.map((row) => {
    while (row.length < colCount) row.push("");
    return row;
  });

  const header = hasHeader ? normalized[0] : null;
  const body = hasHeader ? normalized.slice(1) : normalized;

  const escape = (text) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const headerHtml = header
    ? `  <thead>\n    <tr>\n${header.map((c) => `      <th>${escape(c)}</th>`).join("\n")}\n    </tr>\n  </thead>`
    : "";

  const bodyHtml = `  <tbody>\n${body
    .map((row) => `    <tr>\n${row.map((c) => `      <td>${escape(c)}</td>`).join("\n")}\n    </tr>`)
    .join("\n")}\n  </tbody>`;

  const styleTag = TABLE_STYLES[tableStyle] || "";
  return `${styleTag}<table>\n${headerHtml}\n${bodyHtml}\n</table>`;
}