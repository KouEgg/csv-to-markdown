import { COLORS, FONTS } from "../lib/theme";
import Header from "../components/header";
import Footer from "../components/footer";

export const metadata = {
  title: "Contact | KouEgg",
  description: "KouEgg へのお問い合わせはこちらからどうぞ。",
  alternates: {
    canonical: "https://www.kouegg.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: FONTS.sans, color: COLORS.textPrimary }}>
      <Header />
      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "80px 24px 120px" }}>

        <div style={{ marginBottom: "56px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.textMuted, marginBottom: "16px" }}>
            Contact
          </p>
          <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: "400", lineHeight: "1.15", margin: "0 0 24px", color: COLORS.textPrimary }}>
            お問い合わせ
          </h1>
          <div style={{ width: "40px", height: "1px", background: COLORS.textPrimary, marginBottom: "32px" }} />
          <p style={{ fontSize: "1rem", lineHeight: "1.8", color: COLORS.textSecondary, margin: 0 }}>
            ツールの不具合報告・機能リクエスト・その他お気軽にどうぞ。
            <br />
            通常2〜3営業日以内にご返信します。
          </p>
        </div>

        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: "40px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.textMuted, marginBottom: "12px" }}>
            Email
          </p>
          <a href="mailto:ktakajobs@gmail.com" style={{ fontSize: "1.1rem", color: COLORS.accent, textDecoration: "none", borderBottom: `1px solid ${COLORS.accent}`, paddingBottom: "2px" }}>
            ktakajobs@gmail.com
          </a>
          <p style={{ marginTop: "32px", fontSize: "0.875rem", color: COLORS.textMuted, lineHeight: "1.7" }}>
            ※ スパム防止のため、件名に「KouEgg」と入れていただけると助かります。
          </p>
        </div>

      </main>
      <Footer />
    </div>
  );
}