// app/components/ToolPageLayout.js
import Header from "./header";
import Footer from "./footer";
import { COLORS, FONTS } from "../lib/theme";

export default function ToolPageLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        fontFamily: FONTS.sans,
        color: COLORS.textPrimary,
      }}
    >
      <Header />
      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "36px 24px 80px",
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}