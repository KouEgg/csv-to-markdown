import Link from "next/link";
import { COLORS, FONTS } from "../lib/theme";
import Header from "../components/header";
import Footer from "../components/footer";

// ===================================================
// 定数定義
// ===================================================

const ABOUT_STYLES = {
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
    textDecoration: "none",
    letterSpacing: "0.02em",
  },
  navLogoAccent: {
    color: COLORS.accent,
  },
  navLink: {
    fontSize: "12px",
    color: COLORS.textPrimary,
    textDecoration: "none",
    letterSpacing: "0.04em",
    opacity: 0.5,
  },
  hero: {
    padding: "72px 40px 64px",
    borderBottom: `1px solid ${COLORS.textPrimary}`,
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
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
    fontSize: "72px",
    lineHeight: 1.0,
    color: COLORS.textPrimary,
    letterSpacing: "-0.03em",
  },
  heroTitleEm: {
    fontStyle: "italic",
    color: COLORS.accent,
  },
  heroDesc: {
    fontSize: "13px",
    lineHeight: 1.9,
    color: COLORS.textSecondary,
  },
  profileStrip: {
    background: COLORS.textPrimary,
    padding: "36px 40px",
    display: "grid",
    gridTemplateColumns: "80px 1fr 1fr",
    gap: "40px",
    alignItems: "start",
    borderBottom: `1px solid ${COLORS.textPrimary}`,
  },
  profileInitial: {
    fontFamily: "Instrument Serif, serif",
    fontSize: "80px",
    color: COLORS.accent,
    lineHeight: 0.9,
  },
  profileName: {
    fontFamily: "Instrument Serif, serif",
    fontSize: "32px",
    color: COLORS.bg,
    marginBottom: "4px",
  },
  profileRole: {
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: COLORS.accent,
    marginBottom: "14px",
  },
  profileDesc: {
    fontSize: "13px",
    lineHeight: 1.8,
    color: COLORS.textMuted,
  },
  profileLinksLabel: {
    fontSize: "10px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#5a4a40",
    marginBottom: "12px",
  },
  linkItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    fontSize: "13px",
    color: COLORS.accent,
    textDecoration: "none",
    borderBottom: `0.5px solid rgba(232,124,90,0.3)`,
    paddingBottom: "8px",
    marginBottom: "8px",
  },
  linkItemSub: {
    fontSize: "11px",
    color: "#5a4a40",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    borderBottom: `1px solid ${COLORS.textPrimary}`,
  },
  colBlock: (isLeft) => ({
    padding: "48px 40px",
    borderRight: isLeft ? `1px solid ${COLORS.textPrimary}` : "none",
  }),
  colEyebrow: {
    fontSize: "10px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: COLORS.accent,
    marginBottom: "14px",
  },
  colTitle: {
    fontFamily: "Instrument Serif, serif",
    fontSize: "26px",
    color: COLORS.textPrimary,
    marginBottom: "20px",
    lineHeight: 1.3,
  },
  colText: {
    fontSize: "13px",
    lineHeight: 1.9,
    color: COLORS.textSecondary,
    marginBottom: "12px",
  },
  interestSection: {
    padding: "48px 40px",
    borderBottom: `1px solid ${COLORS.textPrimary}`,
  },
  interestLabel: {
    fontSize: "10px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: COLORS.textPrimary,
    opacity: 0.35,
    marginBottom: "24px",
  },
  interestGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0",
  },
  interestItem: (isLast) => ({
    paddingRight: isLast ? "0" : "24px",
    paddingLeft: "0",
    borderRight: isLast ? "none" : `0.5px solid rgba(26,20,16,0.15)`,
  }),
  interestItemInner: (isFirst) => ({
    paddingLeft: isFirst ? "0" : "24px",
  }),
  interestNum: {
    fontFamily: "Instrument Serif, serif",
    fontSize: "36px",
    color: COLORS.border,
    lineHeight: 1,
    marginBottom: "8px",
  },
  interestTitle: {
    fontSize: "13px",
    fontWeight: 500,
    color: COLORS.textPrimary,
    marginBottom: "4px",
  },
  interestText: {
    fontSize: "12px",
    color: COLORS.textMuted,
    lineHeight: 1.6,
  },
  toolsTeaser: {
    background: COLORS.bg,
    borderTop: `1px solid ${COLORS.textPrimary}`,
    borderBottom: `1px solid ${COLORS.textPrimary}`,
    padding: "40px",
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: "40px",
  },
  toolsTeaserText: {
    fontFamily: "Instrument Serif, serif",
    fontSize: "24px",
    color: COLORS.textPrimary,
    lineHeight: 1.4,
    borderLeft: `3px solid ${COLORS.accent}`,
    paddingLeft: "20px",
  },
  toolsTeaserLink: {
    fontSize: "12px",
    letterSpacing: "0.08em",
    color: COLORS.textPrimary,
    textDecoration: "none",
    borderBottom: `1px solid ${COLORS.textPrimary}`,
    paddingBottom: "2px",
    whiteSpace: "nowrap",
    opacity: 0.7,
  },
  footerBar: {
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
};

// ===================================================
// データ定義
// ===================================================

const INTERESTS = [
  {
    num: "01",
    title: "個人開発",
    text: "ツール作成では使いやすさを重視しています。",
  },
  {
    num: "02",
    title: "Web技術",
    text: "エンジニアとしてのスキルアップのため、幅広く勉強中です。",
  },
  {
    num: "03",
    title: "技術発信",
    text: "Zennで実装経験をもとに記事を書いています。",
  },
];

const LINKS = [
//   { label: "GitHub", sub: "@KouEgg →", href: "https://github.com/KouEgg" },
  { label: "Zenn", sub: "技術記事 →", href: "https://zenn.dev" },
  { label: "CSV Tools", sub: "ツール一覧 →", href: "/tools" },
];

// ===================================================
// コンポーネント
// ===================================================

export default function AboutPage() {
  return (
    <div style={ABOUT_STYLES.page}>

      {/* ナビゲーション */}
      <Header />

      {/* ヒーロー */}
      {/* <section style={ABOUT_STYLES.hero}>
        <div>
          <p style={ABOUT_STYLES.heroEyebrow}>About — KouEgg</p>
          <h1 style={ABOUT_STYLES.heroTitle}>
            不便を<br />
            感じたら、<br />
            <em style={ABOUT_STYLES.heroTitleEm}>作る。</em>
          </h1>
        </div>
        <div>
          <p style={ABOUT_STYLES.heroDesc}>
            業務系アプリ開発をしながら、個人でWebツールを作ったりしています。数年目のひよっこエンジニア。
          </p>
        </div>
      </section> */}

      {/* プロフィールストリップ */}
      <section style={ABOUT_STYLES.profileStrip}>
        <div style={ABOUT_STYLES.profileInitial}>K</div>
        <div>
          <p style={ABOUT_STYLES.profileName}>KouEgg</p>
          <p style={ABOUT_STYLES.profileRole}>Software Engineer</p>
          <p style={ABOUT_STYLES.profileDesc}>
            Windows業務アプリ開発（C# / Kotlin）を本業としながら、趣味でWebサイトを作成。ひよっこエンジニア。
          </p>
        </div>
        <div>
          <p style={ABOUT_STYLES.profileLinksLabel}>Links</p>
          {LINKS.map((link) => (
            <a key={link.label} href={link.href} style={ABOUT_STYLES.linkItem}>
              {link.label}
              <span style={ABOUT_STYLES.linkItemSub}>{link.sub}</span>
            </a>
          ))}
        </div>
      </section>

      {/* 2カラムテキスト */}
      <section style={ABOUT_STYLES.twoCol}>
        <div style={ABOUT_STYLES.colBlock(true)}>
          <p style={ABOUT_STYLES.colEyebrow}>本業</p>
          <h2 style={ABOUT_STYLES.colTitle}>業務系アプリの<br />開発をしています</h2>
          <p style={ABOUT_STYLES.colText}>
            C#やKotlinなどを使ったWindows・モバイルアプリの開発が主な仕事です。QAテストや仕様書作成なども担当しています。
          </p>
          <p style={ABOUT_STYLES.colText}>
            業務の中で「こういうツールがあれば便利なのに」と感じることが多く、それが個人開発のモチベーションになっています。
          </p>
        </div>
        <div style={ABOUT_STYLES.colBlock(false)}>
          <p style={ABOUT_STYLES.colEyebrow}>このサイトについて</p>
          <h2 style={ABOUT_STYLES.colTitle}>趣味で作った<br />ツール置き場です（将来拡張予定）</h2>
          <p style={ABOUT_STYLES.colText}>
            すべてブラウザ内で処理するので、機密データも安心して使えます。登録不要・完全無料で運営を続けていきます。
          </p>
          <p style={ABOUT_STYLES.colText}>
            ゆくゆくは各ツールの用語やアルゴリズムの解説サイト、個人的な趣味ブログなども展開していきたいと思っています。
          </p>
        </div>
      </section>

      {/* 興味・関心 */}
      <section style={ABOUT_STYLES.interestSection}>
        <p style={ABOUT_STYLES.interestLabel}>興味・関心</p>
        <div style={ABOUT_STYLES.interestGrid}>
          {INTERESTS.map((item, i) => (
            <div key={item.num} style={ABOUT_STYLES.interestItem(i === INTERESTS.length - 1)}>
              <div style={ABOUT_STYLES.interestItemInner(i === 0)}>
                <div style={ABOUT_STYLES.interestNum}>{item.num}</div>
                <div style={ABOUT_STYLES.interestTitle}>{item.title}</div>
                <div style={ABOUT_STYLES.interestText}>{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ツールへの誘導 */}
      <section style={ABOUT_STYLES.toolsTeaser}>
        <p style={ABOUT_STYLES.toolsTeaserText}>
          作ったツールは<br />こちらから使えます
        </p>
        <Link href="/tools" style={ABOUT_STYLES.toolsTeaserLink}>
          CSV Tools を見る →
        </Link>
      </section>

      {/* フッター */}
      <Footer />

    </div>
  );
}