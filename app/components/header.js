import { COLORS, FONTS } from "../lib/theme";

export default function Header() {
  return (
    <header style={{
      background: COLORS.bgCard,
      borderBottom: `2px solid ${COLORS.accent}`,
      padding: "0 32px",
      height: "52px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontFamily: FONTS.sans,
    }}>
      <a href="/" style={{
        fontSize: "16px",
        fontWeight: 500,
        color: COLORS.textPrimary,
        textDecoration: "none",
        letterSpacing: "-0.01em",
      }}>
        CSV <span style={{ color: COLORS.accent }}>Tools</span>
      </a>
      <span style={{ fontSize: "12px", color: COLORS.textMuted }}>無料・登録不要</span>
    </header>
  );
}