// app/components/FaqList.js
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

export default function FaqList({ items }) {
  return (
    <section style={{ marginBottom: "36px" }}>
      <p style={SECTION_LABEL}>よくある質問</p>
      <div style={{ border: `0.5px solid ${COLORS.border}`, borderRadius: "10px", overflow: "hidden" }}>
        {items.map((item, i) => (
          <div key={i} style={{ padding: "14px 18px", borderBottom: i < items.length - 1 ? `0.5px solid ${COLORS.borderLight}` : "none", background: COLORS.bgCard }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: COLORS.textPrimary, margin: "0 0 5px" }}>{item.q}</p>
            <p style={{ fontSize: "13px", color: COLORS.textSecondary, margin: 0, lineHeight: 1.8 }}>{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}