/**
 * ファイルをダウンロードする共通関数
 * @param {string} content - ダウンロードするテキスト内容
 * @param {string | null} originalFileName - 元のファイル名（例: "data.xlsx"）。なければnull
 * @param {string} outputExtension - 出力拡張子（例: "csv", "json", "html"）
 * @param {string} mimeType - MIMEタイプ（例: "text/csv;charset=utf-8;"）
 * @param {string} [bom=""] - BOM文字（UTF-8 BOM付きの場合は "\uFEFF"）
 */
export function downloadFile(content, originalFileName, outputExtension, mimeType, bom = "") {
  // ファイル名を決定
  const fileName = originalFileName
    ? replaceExtension(originalFileName, outputExtension)
    : `output.${outputExtension}`;

  const blob = new Blob([bom + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * ファイル名の拡張子を置き換える
 * @param {string} fileName - 元のファイル名（例: "data.xlsx"）
 * @param {string} newExtension - 新しい拡張子（例: "csv"）
 * @returns {string} - 新しいファイル名（例: "data.csv"）
 */
function replaceExtension(fileName, newExtension) {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot === -1) return `${fileName}.${newExtension}`;
  return `${fileName.slice(0, lastDot)}.${newExtension}`;
}