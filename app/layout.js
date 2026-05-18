import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "CSV → Markdownテーブル変換 | 無料オンラインツール",
  description:
    "CSVをMarkdownテーブルに即時変換。貼り付けるだけでリアルタイム変換、ワンクリックコピー対応。全角文字・日本語も正確に処理。GitHubのREADMEやNotionのドキュメント作成に。",
  keywords: [
    "CSV Markdown 変換",
    "CSVをMarkdownに変換",
    "マークダウン テーブル 作成",
    "csv markdownテーブル 変換 オンライン",
    "github readme 表 作り方",
  ],
  openGraph: {
    title: "CSV Tools | 無料オンライン変換ツール集",
    description:
      "CSV・Excel・Markdownの変換ツールを無料で提供。登録不要・ブラウザ内で完結。機密情報も安心。",
    type: "website",
    url: "https://www.kouegg.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3139567627259082"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}