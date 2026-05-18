import Link from "next/link";

export const metadata = {
  title: "CSV Tools | 無料オンライン変換ツール集",
  description:
    "CSV・Excel・Markdownの変換ツールを無料で提供しています。登録不要・ブラウザ内で完結。",
};

const tools = [
  {
    href: "/csv-to-markdown",
    title: "CSV → Markdown 変換",
    description: "CSVやExcelデータをMarkdownテーブルに即時変換。",
    badges: ["Excel対応", "プレビュー表示", "整列オプション"],
  },
];

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "system-ui, sans-serif" }}>

      {/* ナビゲーションバー */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e2e4e9", padding: "0 32px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", letterSpacing: "-0.02em" }}>
          CSV Tools
        </span>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>無料・登録不要</span>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* タイトル */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#1a1d23", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            CSV Tools
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
            CSV・Excel・Markdownの変換ツールを無料で提供しています。登録不要・ブラウザ内で完結。
          </p>
        </div>

        {/* ツール一覧 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              style={{ textDecoration: "none" }}
            >
                <div className="tool-card" style={{
                    background: "#fff", border: "0.5px solid #e2e4e9", borderRadius: "12px",
                    padding: "20px", cursor: "pointer", transition: "border-color 0.15s",
                }}>
                <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 8px" }}>
                  {tool.title}
                </h2>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 14px", lineHeight: 1.6 }}>
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

      </main>

      {/* フッター */}
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