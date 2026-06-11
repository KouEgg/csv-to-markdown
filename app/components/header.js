import Link from "next/link";
import { COLORS, FONTS } from "../lib/theme";

export default function Header() {
  return (
    <header style={{
      background: COLORS.bg,
      borderBottom: `1px solid ${COLORS.textPrimary}`,
      padding: "0 40px",
      height: "52px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontFamily: FONTS.sans,
    }}>
      <Link href="/" style={{
        fontSize: "14px",
        fontWeight: 500,
        color: COLORS.textPrimary,
        textDecoration: "none",
        letterSpacing: "0.02em",
      }}>
        KouEgg<span style={{ color: COLORS.accent }}>.com</span>
      </Link>
      <nav style={{ display: "flex", gap: "28px", alignItems: "center" }}>
        <Link href="/tools" style={{
          fontSize: "12px",
          color: COLORS.textPrimary,
          textDecoration: "none",
          letterSpacing: "0.04em",
          opacity: 0.5,
        }}>
          Tools
        </Link>
        <Link href="/about" style={{
          fontSize: "12px",
          color: COLORS.textPrimary,
          textDecoration: "none",
          letterSpacing: "0.04em",
          opacity: 0.5,
        }}>
          About
        </Link>
        <Link href="/contact" style={{
          fontSize: "12px",
          color: COLORS.textPrimary,
          textDecoration: "none",
          letterSpacing: "0.04em",
          opacity: 0.5,
        }}>
          Contact
        </Link>
      </nav>
    </header>
  );
}