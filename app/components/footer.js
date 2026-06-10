import { COLORS, FONTS } from "../lib/theme";

export default function Footer() {
  return (
    <footer style={{
      borderTop: `0.5px solid ${COLORS.border}`,
      padding: "18px 32px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      alignItems: "center",
      fontFamily: FONTS.sans,
      background: COLORS.bgCard,
    }}>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <a href="/privacy" style={{ fontSize: "12px", color: COLORS.textSecondary, textDecoration: "none" }}>
          プライバシーポリシー
        </a>
      </div>
      <span style={{ fontSize: "12px", color: COLORS.textMuted }}>CSV Tools — 無料オンラインツール集</span>
    </footer>
  );
}