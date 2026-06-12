import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { COLORS, FONTS } from "../../lib/theme";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { getAllPosts, getPostSource } from "../../lib/blog";

const BASE_URL = "https://www.kouegg.com";

// 記事末尾の導線に表示するツール情報
const TOOL_INFO = {
  "/csv-to-markdown": {
    title: "CSV → Markdown 変換",
    description: "CSVやExcelデータをMarkdownテーブルに即時変換。",
  },
  "/markdown-to-csv": {
    title: "Markdown → CSV 変換",
    description: "MarkdownテーブルをCSV形式に即時変換。",
  },
  "/csv-to-json": {
    title: "CSV → JSON 変換",
    description: "CSVやExcelデータをJSON形式に即時変換。",
  },
  "/csv-to-excel": {
    title: "CSV → Excel 変換",
    description: "CSVデータをExcelファイル（.xlsx）に即時変換。",
  },
  "/excel-to-csv": {
    title: "Excel → CSV 変換",
    description: "ExcelファイルをCSV形式に即時変換。文字化けしないUTF-8に対応。",
  },
  "/csv-to-html": {
    title: "CSV → HTML テーブル変換",
    description: "CSVやExcelデータをHTMLテーブルに即時変換。",
  },
  "/json-to-csv": {
    title: "JSON → CSV 変換",
    description: "JSONデータをCSV形式に即時変換。",
  },
  "/json-formatter": {
    title: "JSON整形・バリデーター",
    description: "JSONを貼り付けるだけで即時整形・バリデーション。",
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
  backLink: {
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: COLORS.textMuted,
    textDecoration: "none",
  },
  date: {
    fontFamily: FONTS.mono,
    fontSize: "11px",
    letterSpacing: "0.08em",
    color: COLORS.accent,
    margin: "40px 0 16px",
  },
  title: {
    fontFamily: "'Instrument Serif', Georgia, serif",
    fontSize: "40px",
    fontWeight: 400,
    lineHeight: 1.25,
    letterSpacing: "-0.02em",
    color: COLORS.textPrimary,
    margin: "0 0 20px",
  },
  description: {
    fontSize: "13px",
    lineHeight: 1.9,
    color: COLORS.textSecondary,
    margin: "0 0 40px",
    paddingBottom: "40px",
    borderBottom: `1px solid ${COLORS.textPrimary}`,
  },
  related: {
    marginTop: "72px",
    borderTop: `1px solid ${COLORS.textPrimary}`,
    paddingTop: "32px",
  },
  relatedEyebrow: {
    fontSize: "11px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: COLORS.accent,
    margin: "0 0 8px",
  },
  relatedLead: {
    fontSize: "13px",
    lineHeight: 1.8,
    color: COLORS.textSecondary,
    margin: "0 0 24px",
  },
  relatedItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: "16px",
    padding: "16px 0",
    borderBottom: `1px solid ${COLORS.borderLight}`,
    textDecoration: "none",
  },
};

// 記事本文のMDX要素スタイル
const mdxComponents = {
  h2: (props) => (
    <h2
      style={{
        fontSize: "20px",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: COLORS.accentText,
        margin: "64px 0 20px",
        paddingTop: "28px",
        borderTop: `1px solid ${COLORS.border}`,
      }}
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      style={{
        fontSize: "15px",
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: COLORS.textSecondary,
        margin: "40px 0 14px",
      }}
      {...props}
    />
  ),
  p: (props) => (
    <p
      style={{
        fontSize: "15px",
        lineHeight: 1.9,
        color: COLORS.textPrimary,
        margin: "0 0 24px",
      }}
      {...props}
    />
  ),
  a: (props) => (
    <a
      style={{
        color: COLORS.accentText,
        textDecoration: "underline",
        textUnderlineOffset: "3px",
      }}
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      style={{
        margin: "0 0 24px",
        paddingLeft: "22px",
        listStyleType: "disc",
      }}
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      style={{
        margin: "0 0 24px",
        paddingLeft: "22px",
        listStyleType: "decimal",
      }}
      {...props}
    />
  ),
  li: (props) => (
    <li
      style={{
        fontSize: "15px",
        lineHeight: 1.9,
        color: COLORS.textPrimary,
        marginBottom: "8px",
      }}
      {...props}
    />
  ),
  strong: (props) => (
    <strong style={{ fontWeight: 600, color: COLORS.textPrimary }} {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      style={{
        margin: "0 0 24px",
        padding: "4px 0 4px 20px",
        borderLeft: `3px solid ${COLORS.accent}`,
        color: COLORS.textSecondary,
      }}
      {...props}
    />
  ),
  code: (props) => (
    <code
      style={{
        fontFamily: FONTS.mono,
        fontSize: "0.88em",
        background: COLORS.bgOption,
        border: `1px solid ${COLORS.borderLight}`,
        borderRadius: "4px",
        padding: "2px 6px",
      }}
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      style={{
        fontFamily: FONTS.mono,
        fontSize: "13px",
        lineHeight: 1.8,
        background: COLORS.bgOption,
        border: `1px solid ${COLORS.border}`,
        padding: "20px 24px",
        margin: "0 0 24px",
        overflowX: "auto",
      }}
      {...props}
    />
  ),
  table: (props) => (
    <div style={{ overflowX: "auto", margin: "0 0 24px" }}>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          fontSize: "13px",
          lineHeight: 1.7,
        }}
        {...props}
      />
    </div>
  ),
  th: (props) => (
    <th
      style={{
        background: COLORS.accentBg,
        color: COLORS.textPrimary,
        fontWeight: 500,
        padding: "8px 12px",
        border: `1px solid ${COLORS.border}`,
        textAlign: "left",
      }}
      {...props}
    />
  ),
  td: (props) => (
    <td
      style={{
        padding: "8px 12px",
        border: `1px solid ${COLORS.border}`,
        color: COLORS.textPrimary,
      }}
      {...props}
    />
  ),
  hr: () => (
    <hr
      style={{
        border: "none",
        borderTop: `1px solid ${COLORS.border}`,
        margin: "48px 0",
      }}
    />
  ),
};

async function compilePost(slug) {
  const source = getPostSource(slug);
  if (!source) return null;

  return compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
    components: mdxComponents,
  });
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getAllPosts().find((p) => p.slug === slug);
  if (!post) return {};

  const url = `${BASE_URL}/blog/${slug}`;
  return {
    title: `${post.title} | KouEgg Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const compiled = await compilePost(slug);
  if (!compiled) notFound();

  const { content, frontmatter } = compiled;
  const relatedTools = (frontmatter.relatedTools || []).filter(
    (href) => TOOL_INFO[href]
  );

  return (
    <div style={STYLES.page}>
      <Header />

      <main style={STYLES.main}>
        <Link href="/blog" style={STYLES.backLink}>
          ← Blog
        </Link>

        <p style={STYLES.date}>{(frontmatter.date || "").replaceAll("-", ".")}</p>
        <h1 style={{ ...STYLES.title, whiteSpace: "pre-line" }}>
          {frontmatter.displayTitle || frontmatter.title}
        </h1>
        <p style={STYLES.description}>{frontmatter.description}</p>

        <article>{content}</article>

        {relatedTools.length > 0 && (
          <section style={STYLES.related}>
            <p style={STYLES.relatedEyebrow}>Tools</p>
            <p style={STYLES.relatedLead}>
              この記事の内容は、ブラウザだけで使える無料ツールでそのまま試せます。
            </p>
            {relatedTools.map((href) => (
              <Link key={href} href={href} style={STYLES.relatedItem}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: COLORS.textPrimary,
                  }}
                >
                  {TOOL_INFO[href].title}
                </span>
                <span style={{ fontSize: "12px", color: COLORS.textSecondary }}>
                  {TOOL_INFO[href].description} →
                </span>
              </Link>
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
