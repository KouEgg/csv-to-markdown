import Link from "next/link";
import { COLORS, FONTS } from "../lib/theme";
import Header from "../components/header";
import Footer from "../components/footer";
import { getAllPosts } from "../lib/blog";

export const metadata = {
  title: "Blog | KouEgg",
  description:
    "CSV・Excel・Markdownなど、データ形式の基礎知識や変換のコツを解説する技術ブログ。",
  openGraph: {
    title: "Blog | KouEgg",
    description:
      "CSV・Excel・Markdownなど、データ形式の基礎知識や変換のコツを解説する技術ブログ。",
    url: "https://www.kouegg.com/blog",
    type: "website",
  },
  alternates: {
    canonical: "https://www.kouegg.com/blog",
  },
};

const STYLES = {
  page: {
    minHeight: "100vh",
    background: COLORS.bg,
    fontFamily: FONTS.sans,
    color: COLORS.textPrimary,
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
    width: "100%",
    maxWidth: "680px",
    margin: "0 auto",
    padding: "72px 24px 96px",
    boxSizing: "border-box",
  },
  eyebrow: {
    fontSize: "11px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: COLORS.accent,
    margin: "0 0 16px",
  },
  title: {
    fontFamily: "'Instrument Serif', Georgia, serif",
    fontSize: "48px",
    fontWeight: 400,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
    color: COLORS.textPrimary,
    margin: "0 0 16px",
  },
  lead: {
    fontSize: "13px",
    lineHeight: 1.9,
    color: COLORS.textSecondary,
    margin: "0 0 56px",
  },
  list: {
    borderTop: `1px solid ${COLORS.textPrimary}`,
  },
  item: {
    display: "block",
    padding: "28px 0",
    borderBottom: `1px solid ${COLORS.borderLight}`,
    textDecoration: "none",
  },
  itemDate: {
    fontFamily: FONTS.mono,
    fontSize: "11px",
    letterSpacing: "0.08em",
    color: COLORS.textMuted,
    margin: "0 0 8px",
  },
  itemTitle: {
    fontSize: "17px",
    fontWeight: 500,
    lineHeight: 1.5,
    color: COLORS.textPrimary,
    margin: "0 0 8px",
  },
  itemDesc: {
    fontSize: "13px",
    lineHeight: 1.8,
    color: COLORS.textSecondary,
    margin: 0,
  },
};

function formatDate(date) {
  return (date || "").replaceAll("-", ".");
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div style={STYLES.page}>
      <Header />

      <main style={STYLES.main}>
        <p style={STYLES.eyebrow}>Blog — KouEgg</p>
        <h1 style={STYLES.title}>
          Notes on <em style={{ fontStyle: "italic", color: COLORS.accent }}>data</em>
        </h1>
        <p style={STYLES.lead}>
          CSV・Excel・Markdownなど、データ形式の基礎知識や変換のコツについて書いています。
        </p>

        <div style={STYLES.list}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={STYLES.item}>
              <p style={STYLES.itemDate}>{formatDate(post.date)}</p>
              <p style={STYLES.itemTitle}>{post.title}</p>
              <p style={STYLES.itemDesc}>{post.description}</p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
