export const metadata = {
  title: "About | KouEgg",
  description:
    "KouEggについて。業務系アプリ開発をしながら、個人でWebツールを作っているエンジニアです。",
  openGraph: {
    title: "About | KouEgg",
    description:
      "KouEggについて。業務系アプリ開発をしながら、個人でWebツールを作っているエンジニアです。",
    url: "https://www.kouegg.com/about",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About | KouEgg",
    description:
      "KouEggについて。業務系アプリ開発をしながら、個人でWebツールを作っているエンジニアです。",
  },
  alternates: {
    canonical: "https://www.kouegg.com/about",
  },
};

export default function Layout({ children }) {
  return children;
}