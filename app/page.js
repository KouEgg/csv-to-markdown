import Link from "next/link";

export const metadata = {
  title: "CSV Tools | 無料オンライン変換ツール集",
  description:
    "CSV・Excel・Markdown・JSONの変換ツールを無料で提供しています。登録不要・ブラウザ内で完結。",
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
        description: "JSONデータをCSV形式に即時変換。APIレスポンスをExcelやGoogle Sheetsで開きたいときに便利。",
        badges: ["ダウンロード対応", "日本語対応"],
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
        href: "/json-formatter",
        title: "JSON整形・バリデーター",
        description: "JSONを貼り付けるだけで即時整形・バリデーション。APIレスポンスの確認に便利。",
        badges: ["圧縮モード対応", "バリデーション"],
      },
      {
        href: "/csv-to-html",
        title: "CSV → HTML テーブル変換",
        description: "CSVやExcelデータをHTMLテーブルに即時変換。Webページへの埋め込みに便利。",
        badges: ["Excel対応", "プレビュー表示"],
      },
    ],
  },
];

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "system-ui, sans-serif" }}>

      <header style={{ background: "#fff", borderBottom: "1px solid #e2e4e9", padding: "0 32px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", letterSpacing: "-0.02em" }}>
          CSV Tools
        </span>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>無料・登録不要</span>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#1a1d23", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            CSV Tools
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
            CSV・Excel・Markdown・JSONの変換ツールを無料で提供しています。登録不要・ブラウザ内で完結。
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {sections.map((section) => (
            <div key={section.label}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 10px" }}>
                {section.label}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                {section.tools.map((tool) => (
                  <Link key={tool.href} href={tool.href} style={{ textDecoration: "none" }}>
                    <div className="tool-card" style={{
                      background: "#fff", border: "0.5px solid #e2e4e9", borderRadius: "12px",
                      padding: "20px", cursor: "pointer", transition: "border-color 0.15s",
                      display: "flex", flexDirection: "column", gap: "8px", height: "100%", boxSizing: "border-box",
                    }}>
                      <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: 0 }}>
                        {tool.title}
                      </h2>
                      <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.6, flex: 1 }}>
                        {tool.description}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {tool.badges.map((badge) => (
                          <span key={badge} style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "20px", background: "#eef0fd", color: "#4f6ef7", fontWeight: 500 }}>
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

      <footer style={{ borderTop: "0.5px solid #e2e4e9", padding: "18px 32px", textAlign: "center", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <a href="/privacy" style={{ fontSize: "12px", color: "#6b7280", textDecoration: "none" }}>
            プライバシーポリシー
          </a>
        </div>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>CSV Tools — 無料オンラインツール集</span>
      </footer>

    </div>
  );
}