export default function Header() {
  return (
    <header style={{ background: "#fff", borderBottom: "1px solid #e2e4e9", padding: "0 32px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <a href="/" style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", letterSpacing: "-0.02em", textDecoration: "none" }}>
        CSV Tools
      </a>
      <span style={{ fontSize: "12px", color: "#9ca3af" }}>無料・登録不要</span>
    </header>
  );
}