// app/components/ToolCard.js
// 白枠カード＋オプションバー＋ステータスバーの外枠
import { COLORS } from "../lib/theme";

export default function ToolCard({ children }) {
  return (
    <div style={{ background: COLORS.bgCard, border: `0.5px solid ${COLORS.border}`, borderRadius: "12px", overflow: "hidden" }}>
      {children}
    </div>
  );
}