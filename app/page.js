import Link from "next/link";
import { COLORS, FONTS } from "./lib/theme";

// ===================================================
// メタデータ
// ===================================================

export const metadata = {
  title: "KouEgg.com",
  description:
    "ひよっこエンジニアKouEggの個人サイト。CSV・Excel・Markdown・JSONの変換ツール集を公開中。今後もツールや記事など作ったものを置いていく予定です。",
  openGraph: {
    title: "KouEgg.com",
    description:
      "ひよっこエンジニアKouEggの個人サイト。CSV変換ツール集を公開中。",
    url: "https://www.kouegg.com",
    type: "website",
  },
  alternates: {
    canonical: "https://www.kouegg.com",
  },
};

// ===================================================
// 定数定義
// ===================================================

const S = {
  page: {
    minHeight: "100vh",
    background: COLORS.bg,
    fontFamily: FONTS.sans,
    color: COLORS.textPrimary,
  },
  nav: {
    background: COLORS.bg,
    borderBottom: `1px solid ${COLORS.textPrimary}`,
    padding: "0 40px",
    height: "52px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navLogo: {
    fontSize: "14px",
    fontWeight: 500,
    color: COLORS.textPrimary,
    letterSpacing: "0.02em",
    textDecoration: "none",
  },
  navLogoEm: {
    color: COLORS.accent,
    fontStyle: "normal",
  },
  navLink: {
    fontSize: "12px",
    color: COLORS.textPrimary,
    opacity: 0.5,
    textDecoration: "none",
    letterSpacing: "0.04em",
  },
  hero: {
    padding: "72px 40px 64px",
    borderBottom: `1px solid ${COLORS.textPrimary}`,
    display: "grid",
    gridTemplateColumns: "3fr 2fr",
    gap: "60px",
    alignItems: "end",
  },
  heroEyebrow: {
    fontSize: "11px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: COLORS.accent,
    marginBottom: "18px",
  },
  heroTitle: {
    fontFamily: "Instrument Serif, serif",
    fontSize: "64px",
    lineHeight: 1.0,
    color: COLORS.textPrimary,
    letterSpacing: "-0.03em",
  },
  heroTitleEm: {
    fontStyle: "italic",
    color: "#d4724f",
  },
  heroDesc: {
    fontSize: "13px",
    lineHeight: 1.9,
    color: COLORS.textSecondary,
    marginBottom: "20px",
  },
  heroMeta: {
    fontSize: "11px",
    color: COLORS.textMuted,
    letterSpacing: "0.04em",
    borderLeft: `2px solid ${COLORS.accent}`,
    paddingLeft: "10px",
    lineHeight: 1.7,
  },
  contentsHeader: {
    padding: "24px 40px",
    borderBottom: `0.5px solid rgba(26,20,16,0.2)`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  contentsLabel: {
    fontSize: "10px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: COLORS.textPrimary,
    opacity: 0.35,
  },
  contentsDesc: {
    fontSize: "12px",
    color: COLORS.textMuted,
  },
  contentRow: {
    display: "grid",
    gridTemplateColumns: "200px 1fr",
    borderBottom: `1px solid ${COLORS.textPrimary}`,
  },
  contentCategory: {
    padding: "32px 40px",
    borderRight: `1px solid ${COLORS.textPrimary}`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  contentCategoryNum: {
    fontFamily: "Instrument Serif, serif",
    fontSize: "48px",
    color: COLORS.border,
    lineHeight: 1,
  },
  contentCategoryLabel: {
    fontSize: "10px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: COLORS.accent,
  },
  contentBody: {
    padding: "32px 40px",
  },
  contentTitle: {
    fontFamily: "Instrument Serif, serif",
    fontSize: "28px",
    color: COLORS.textPrimary,
    marginBottom: "10px",
    lineHeight: 1.2,
  },
  contentText: {
    fontSize: "12px",
    color: COLORS.textMuted,
    lineHeight: 1.8,
    marginBottom: "16px",
    maxWidth: "480px",
  },
  contentLink: {
    fontSize: "11px",
    color: COLORS.textPrimary,
    textDecoration: "none",
    letterSpacing: "0.06em",
    borderBottom: `1px solid rgba(26,20,16,0.3)`,
    paddingBottom: "1px",
    opacity: 0.7,
  },
  contentTags: {
    display: "flex",
    gap: "6px",
    marginTop: "12px",
    flexWrap: "wrap",
  },
  contentTag: {
    fontSize: "10px",
    padding: "2px 8px",
    border: `0.5px solid rgba(232,124,90,0.4)`,
    color: COLORS.accentText,
    letterSpacing: "0.02em",
  },
  aboutStrip: {
    background: COLORS.textPrimary,
    padding: "32px 40px",
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: "40px",
  },
  aboutStripText: {
    fontFamily: "Instrument Serif, serif",
    fontSize: "20px",
    color: COLORS.bg,
    lineHeight: 1.4,
  },
  aboutStripTextEm: {
    fontStyle: "italic",
    color: COLORS.accent,
  },
  aboutStripLink: {
    fontSize: "11px",
    color: COLORS.accent,
    letterSpacing: "0.06em",
    borderBottom: `0.5px solid ${COLORS.accent}`,
    paddingBottom: "1px",
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  footer: {
    padding: "18px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: COLORS.bgCard,
    borderTop: `0.5px solid ${COLORS.border}`,
  },
  footerText: {
    fontSize: "11px",
    color: COLORS.textMuted,
  },
  footerLink: {
    fontSize: "11px",
    color: COLORS.textMuted,
    textDecoration: "none",
  },
};

// ===================================================
// データ定義
// ===================================================

const CONTENTS = [
  {
    num: "01",
    label: "Tools",
    title: "CSV Tools",
    text: "CSV・Excel・Markdown・JSONの変換ツール集。ブラウザだけで完結、登録不要・無料で使えます。現在8種類のツールを公開中。",
    link: { label: "ツール一覧を見る →", href: "/csv-to-markdown" },
    tags: ["CSV変換", "Excel", "JSON", "Markdown"],
  },
  {
    num: "02",
    label: "Coming Soon",
    title: "More to come",
    text: "開発者向けの小さなツールをもっと追加していく予定です。Base64変換・URLエンコード・タイムスタンプ変換など。",
    link: null,
    tags: [],
  },
];

// ===================================================
// コンポーネント
// ===================================================

export default function TopPage() {
  return (
    <div style={S.page}>

      {/* ナビゲーション */}
      <nav style={S.nav}>
        <Link href="/" style={S.navLogo}>
          KouEgg<span style={S.navLogoEm}>.com</span>
        </Link>
        <div style={{ display: "flex", gap: "28px" }}>
          <Link href="/" style={S.navLink}>Tools</Link>
          <Link href="/about" style={S.navLink}>About</Link>
        </div>
      </nav>

      {/* ヒーロー */}
      <section style={S.hero}>
        <div>
          <p style={S.heroEyebrow}>KouEgg.com</p>
          <h1 style={S.heroTitle}>
            <em style={S.heroTitleEm}>ひよっこ</em><br />
            エンジニアの<br />
            <em style={S.heroTitleEm}>個人</em>サイト。
          </h1>
        </div>
        <div>
          <p style={S.heroDesc}>
            現在はCSV・Excel・Markdown・JSONの変換ツール集「CSV Tools」を公開中。今後はツールや記事など、作ったものをここに置いていく予定です。
          </p>
          <p style={S.heroMeta}>
            C# / Kotlin / Next.js<br />
            Software Engineer — KouEgg
          </p>
        </div>
      </section>

      {/* コンテンツ一覧 */}
      <div style={S.contentsHeader}>
        <span style={S.contentsLabel}>Contents</span>
        <span style={S.contentsDesc}>このサイトにあるもの</span>
      </div>

      {CONTENTS.map((item) => (
        <div key={item.num} style={S.contentRow}>
          <div style={S.contentCategory}>
            <div style={S.contentCategoryNum}>{item.num}</div>
            <div style={S.contentCategoryLabel}>{item.label}</div>
          </div>
          <div style={S.contentBody}>
            <h2 style={S.contentTitle}>{item.title}</h2>
            <p style={S.contentText}>{item.text}</p>
            {item.link && (
              <Link href={item.link.href} style={S.contentLink}>
                {item.link.label}
              </Link>
            )}
            {item.tags.length > 0 && (
              <div style={S.contentTags}>
                {item.tags.map((tag) => (
                  <span key={tag} style={S.contentTag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Aboutへの誘導 */}
      <section style={S.aboutStrip}>
        <p style={S.aboutStripText}>
          このサイトを作った<br />
          <em style={S.aboutStripTextEm}>KouEgg</em> について
        </p>
        <Link href="/about" style={S.aboutStripLink}>
          About を見る →
        </Link>
      </section>

      {/* フッター */}
      <footer style={S.footer}>
        <span style={S.footerText}>© KouEgg — kouegg.com</span>
        <Link href="/privacy" style={S.footerLink}>
          プライバシーポリシー
        </Link>
      </footer>

    </div>
  );
}