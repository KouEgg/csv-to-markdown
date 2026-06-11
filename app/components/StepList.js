// app/components/StepList.js
import { COLORS, FONTS } from "../lib/theme";

const SECTION_LABEL = {
  fontSize: "25px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: COLORS.textMuted,
  margin: "0 0 20px",
  fontFamily: FONTS.sans,
};

export default function StepList({ steps }) {
  return (
    <section style={{ marginBottom: "36px" }}>
      <p style={SECTION_LABEL}>使い方</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {steps.map((text, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: COLORS.accentBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: COLORS.accentText, flexShrink: 0, marginTop: "2px" }}>
              {i + 1}
            </div>
            <span style={{ fontSize: "13px", color: COLORS.textPrimary, lineHeight: 1.8 }}>{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}