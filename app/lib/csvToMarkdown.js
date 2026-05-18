export function csvToMarkdown(csvText, options = {}) {
  const { hasHeader = true, delimiter = "," } = options;

  if (!csvText || csvText.trim() === "") {
    return "";
  }

  const rows = csvText.trim().split(/\r\n|\n|\r/);
  if (rows.length === 0) return "";

  const table = rows.map((row) => parseCSVRow(row, delimiter));

  const colCount = Math.max(...table.map((row) => row.length));
  const normalized = table.map((row) => {
    while (row.length < colCount) row.push("");
    return row;
  });

  // ヘッダーなしの場合はColumn1, Column2...を自動生成
  const header = hasHeader
    ? normalized[0]
    : Array.from({ length: colCount }, (_, i) => `Column${i + 1}`);

  const body = hasHeader ? normalized.slice(1) : normalized;
  const separator = header.map(() => "---");
  const toRow = (cells) => `| ${cells.join(" | ")} |`;

  return [toRow(header), toRow(separator), ...body.map(toRow)].join("\n");
}

function parseCSVRow(row, delimiter = ",") {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
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