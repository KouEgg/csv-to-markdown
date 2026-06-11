// app/components/ToolMeta.js
import { COLORS, FONTS } from "../lib/theme";

export default function ToolMeta({ title, description }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: COLORS.textPrimary, margin: "0 0 8px", letterSpacing: "-0.02em", fontFamily: FONTS.sans }}>
        {title}
      </h1>
      <p style={{ fontSize: "13px", color: COLORS.textSecondary, margin: 0, lineHeight: 1.7 }}>
        {description}
      </p>
    </div>
  );
}