import Link from "next/link";
import { COLORS, FONTS, RADIUS } from "../lib/theme";

const ALL_TOOLS = [
  {
    href: "/csv-to-markdown",
    title: "CSV → Markdown 変換",
    description: "CSVやExcelデータをMarkdownテーブルに即時変換。",
  },
  {
    href: "/markdown-to-csv",
    title: "Markdown → CSV 変換",
    description: "MarkdownテーブルをCSV形式に即時変換。",
  },
  {
    href: "/csv-to-json",
    title: "CSV → JSON 変換",
    description: "CSVやExcelデータをJSON形式に即時変換。",
  },
  {
    href: "/json-to-csv",
    title: "JSON → CSV 変換",
    description: "JSONデータをCSV形式に即時変換。ネスト・階層構造も自動フラット化。",
  },
  {
    href: "/csv-to-excel",
    title: "CSV → Excel 変換",
    description: "CSVデータをExcelファイル（.xlsx）に即時変換。",
  },
  {
    href: "/excel-to-csv",
    title: "Excel → CSV 変換",
    description: "ExcelファイルをCSV形式に即時変換。文字化けしないUTF-8に対応。",
  },
  {
    href: "/csv-to-html",
    title: "CSV → HTML テーブル変換",
    description: "CSVやExcelデータをHTMLテーブルに即時変換。",
  },
  {
    href: "/json-formatter",
    title: "JSON整形・バリデーター",
    description: "JSONを貼り付けるだけで即時整形・バリデーション。圧縮モード対応。",
  },
];

const CARD_STYLE = {
  background: COLORS.bgCard,
  border: `1.5px solid ${COLORS.border}`,
  borderRadius: RADIUS.lg,
  padding: "20px",
  cursor: "pointer",
  boxSizing: "border-box",
  width: "100%",
  fontFamily: FONTS.sans,
};

export default function ToolLinks({ current, reverse, reverseLabel }) {
  const otherTools = ALL_TOOLS.filter(
    (tool) => tool.href !== current && tool.href !== reverse
  );

  return (
    <div style={{ fontFamily: FONTS.sans }}>
      {reverse && (
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", fontWeight: 500, color: COLORS.textPrimary, margin: "0 0 10px" }}>
            逆変換ツール
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px" }}>
            <Link href={reverse} style={{ textDecoration: "none", display: "flex" }}>
              <div style={CARD_STYLE}>
                <p style={{ fontSize: "15px", fontWeight: 500, color: COLORS.textPrimary, margin: "0 0 6px" }}>
                  {reverseLabel}
                </p>
                <p style={{ fontSize: "13px", color: COLORS.textSecondary, margin: 0, lineHeight: 1.6 }}>
                  {ALL_TOOLS.find((t) => t.href === reverse)?.description}
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}

      <p style={{ fontSize: "13px", fontWeight: 500, color: COLORS.textPrimary, margin: "0 0 10px" }}>
        他のツール
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "12px",
        gridAutoRows: "1fr",
      }}>
        {otherTools.map((tool) => (
          <Link key={tool.href} href={tool.href} style={{ textDecoration: "none", display: "flex" }}>
            <div style={CARD_STYLE}>
              <p style={{ fontSize: "15px", fontWeight: 500, color: COLORS.textPrimary, margin: "0 0 6px" }}>
                {tool.title}
              </p>
              <p style={{ fontSize: "13px", color: COLORS.textSecondary, margin: 0, lineHeight: 1.6 }}>
                {tool.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}