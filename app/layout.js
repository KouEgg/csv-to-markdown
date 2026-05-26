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
  title: "CSV Tools | 無料オンライン変換ツール集",
  description:
    "CSV・Excel・Markdown・JSONの変換ツールを無料で提供しています。登録不要・ブラウザ内で完結。",
  keywords: [
    "CSV変換",
    "Excel CSV変換",
    "JSON CSV変換",
    "Markdown変換",
    "JSON整形",
    "オンライン変換ツール",
    "無料",
  ],
  openGraph: {
    title: "CSV Tools | 無料オンライン変換ツール集",
    description:
      "CSV・Excel・Markdown・JSONの変換ツールを無料で提供。登録不要・ブラウザ内で完結。機密情報も安心。",
    type: "website",
    url: "https://www.kouegg.com",
  },
  alternates: {
    canonical: "https://www.kouegg.com",
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