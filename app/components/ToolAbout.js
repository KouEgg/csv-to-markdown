// app/components/ToolAbout.js
import { COLORS, FONTS } from "../lib/theme";

const SECTION_LABEL = {
  fontSize: "25px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: COLORS.textMuted,
  margin: "0 0 16px",
  fontFamily: FONTS.sans,
};

export default function ToolAbout({ children }) {
  return (
    <section>
      <p style={SECTION_LABEL}>このツールについて</p>
      <p style={{ fontSize: "13px", color: COLORS.textSecondary, lineHeight: 1.8, margin: 0 }}>
        {children}
      </p>
    </section>
  );
}