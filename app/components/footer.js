export default function Footer() {
  return (
    <footer style={{ borderTop: "0.5px solid #e2e4e9", padding: "18px 32px", textAlign: "center", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <a href="/privacy" style={{ fontSize: "12px", color: "#6b7280", textDecoration: "none" }}>
          プライバシーポリシー
        </a>
      </div>
      <span style={{ fontSize: "12px", color: "#9ca3af" }}>CSV Tools — 無料オンラインツール集</span>
    </footer>
  );
}