import Link from "next/link";
import { COLORS, FONTS, RADIUS } from "./lib/theme";

export const metadata = {
  title: "CSV Tools | 無料オンライン変換ツール集",
  description:
    "CSV・Excel・Markdown・JSONの変換ツールを無料で提供しています。登録不要・ブラウザ内で完結。",
  keywords: [
    "CSV変換",
    "Excel CSV変換",
    "JSON CSV変換",
    "Markdown変換",
    "JSON整形",
    "オンライン変換ツール",
    "無料",
  ],
};

const sections = [
  {
    label: "CSV ↔ Markdown",
    tools: [
      {
        href: "/csv-to-markdown",
        title: "CSV → Markdown 変換",
        description: "CSVやExcelデータをMarkdownテーブルに即時変換。GitHubのREADMEやNotionのドキュメント作成に便利。",
        badges: ["Excel対応", "プレビュー表示", "整列オプション"],
      },
      {
        href: "/markdown-to-csv",
        title: "Markdown → CSV 変換",
        description: "MarkdownテーブルをCSV形式に即時変換。GitHubやNotionからデータを取り出すのに便利。",
        badges: ["ダウンロード対応", "日本語対応"],
      },
    ],
  },
  {
    label: "CSV ↔ JSON",
    tools: [
      {
        href: "/csv-to-json",
        title: "CSV → JSON 変換",
        description: "CSVやExcelデータをJSON形式に即時変換。WebアプリやAPIへのデータ連携に便利。",
        badges: ["Excel対応", "ダウンロード対応", "日本語対応"],
      },
      {
        href: "/json-to-csv",
        title: "JSON → CSV 変換",
        description: "JSONデータをCSV形式に即時変換。ネスト・階層構造も自動フラット化。APIレスポンスをExcelで開きたいときに便利。",
        badges: ["ネスト対応", "ダウンロード対応"],
      },
    ],
  },
  {
    label: "CSV ↔ Excel",
    tools: [
      {
        href: "/csv-to-excel",
        title: "CSV → Excel 変換",
        description: "CSVデータをExcelファイル（.xlsx）に即時変換。文字化けの心配なく開ける。",
        badges: ["ダウンロード対応", "日本語対応"],
      },
      {
        href: "/excel-to-csv",
        title: "Excel → CSV 変換",
        description: "ExcelファイルをCSV形式に即時変換。UTF-8・BOM付きで文字化けしないCSVを出力。",
        badges: ["UTF-8対応", "ダウンロード対応"],
      },
    ],
  },
  {
    label: "その他",
    tools: [
      {
        href: "/csv-to-html",
        title: "CSV → HTML テーブル変換",
        description: "CSVやExcelデータをHTMLテーブルに即時変換。Webページへの埋め込みに便利。",
        badges: ["Excel対応", "プレビュー表示"],
      },
      {
        href: "/json-formatter",
        title: "JSON整形・バリデーター",
        description: "JSONを貼り付けるだけで即時整形・バリデーション。APIレスポンスの確認に便利。",
        badges: ["圧縮モード対応", "バリデーション"],
      },
    ],
  },
];

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: FONTS.sans }}>

      <header style={{
        background: COLORS.bgCard,
        borderBottom: `2px solid ${COLORS.accent}`,
        padding: "0 32px",
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{ fontSize: "16px", fontWeight: 500, color: COLORS.textPrimary, letterSpacing: "-0.01em" }}>
          CSV <span style={{ color: COLORS.accent }}>Tools</span>
        </span>
        <span style={{ fontSize: "12px", color: COLORS.textMuted }}>無料・登録不要</span>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 500, color: COLORS.textPrimary, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            CSV Tools
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.textSecondary, margin: 0, lineHeight: 1.7 }}>
            CSV・Excel・Markdown・JSONの変換ツールを無料で提供しています。登録不要・ブラウザ内で完結。
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {sections.map((section) => (
            <div key={section.label}>
              <p style={{
                fontSize: "11px", fontWeight: 500, color: COLORS.textMuted,
                letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px",
              }}>
                {section.label}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                {section.tools.map((tool) => (
                  <Link key={tool.href} href={tool.href} style={{ textDecoration: "none" }}>
                    <div className="tool-card" style={{
                      background: COLORS.bgCard,
                      border: `0.5px solid ${COLORS.border}`,
                      borderRadius: RADIUS.lg,
                      padding: "20px",
                      cursor: "pointer",
                      transition: "border-color 0.15s",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      height: "100%",
                      boxSizing: "border-box",
                    }}>
                      <h2 style={{ fontSize: "15px", fontWeight: 500, color: COLORS.textPrimary, margin: 0 }}>
                        {tool.title}
                      </h2>
                      <p style={{ fontSize: "13px", color: COLORS.textSecondary, margin: 0, lineHeight: 1.6, flex: 1 }}>
                        {tool.description}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {tool.badges.map((badge) => (
                          <span key={badge} style={{
                            fontSize: "11px", padding: "3px 8px", borderRadius: RADIUS.full,
                            background: COLORS.accentBg, color: COLORS.accentText, fontWeight: 500,
                          }}>
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

      </main>

      <footer style={{
        borderTop: `0.5px solid ${COLORS.border}`,
        padding: "18px 32px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: "center",
        background: COLORS.bgCard,
      }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <a href="/privacy" style={{ fontSize: "12px", color: COLORS.textSecondary, textDecoration: "none" }}>
            プライバシーポリシー
          </a>
        </div>
        <span style={{ fontSize: "12px", color: COLORS.textMuted }}>CSV Tools — 無料オンラインツール集</span>
      </footer>

    </div>
  );
}