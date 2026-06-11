import { COLORS, FONTS } from "../lib/theme";

export default function ToolGuide({ title, items }) {
  return (
    <section style={{ marginBottom: "36px" }}>
      <p style={{ fontSize: "25px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.textMuted, margin: "0 0 20px", fontFamily: FONTS.sans }}>
        {title}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {items.map((item, i) => (
          <div key={i} style={{ padding: "20px 0" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 700, color: COLORS.textPrimary, margin: "0 0 8px", fontFamily: FONTS.sans }}>
              {item.heading}
            </h3>
            <p style={{ fontSize: "13px", color: COLORS.textSecondary, lineHeight: 1.8, margin: 0 }}>
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}