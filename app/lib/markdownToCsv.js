/**
 * MarkdownテーブルをCSV文字列に変換する
 * @param {string} mdText - Markdown文字列
 * @returns {string} - CSV文字列
 */
export function markdownToCsv(mdText) {
  if (!mdText || mdText.trim() === "") return "";

  const lines = mdText.trim().split(/\r\n|\n|\r/);
  const result = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) continue;

    // セパレーター行を除外（:---:, ---, :--- 等を含む行）
    if (/^\|[\s|:-]+\|$/.test(trimmed)) continue;

    // 前後の|を除去してセルに分割
    const cells = trimmed
      .slice(1, -1)
      .split("|")
      .map((cell) => {
        const v = cell.trim();
        if (v.includes(",") || v.includes('"') || v.includes("\n")) {
          return `"${v.replace(/"/g, '""')}"`;
        }
        return v;
      });

    result.push(cells.join(","));
  }

  return result.join("\n");
}