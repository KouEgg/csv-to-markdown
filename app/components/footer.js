import Link from "next/link";
import { COLORS, FONTS } from "../lib/theme";

export default function Footer() {
  return (
    <footer style={{
      borderTop: `0.5px solid ${COLORS.border}`,
      padding: "18px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontFamily: FONTS.sans,
      background: COLORS.bgCard,
    }}>
      <span style={{ fontSize: "11px", color: COLORS.textMuted }}>
        © KouEgg — kouegg.com
      </span>
      <Link href="/privacy" style={{
        fontSize: "11px",
        color: COLORS.textMuted,
        textDecoration: "none",
      }}>
        プライバシーポリシー
      </Link>
    </footer>
  );
}