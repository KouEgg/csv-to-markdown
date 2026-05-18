export const metadata = {
  title: "プライバシーポリシー | CSV Tools",
  description: "CSV Toolsのプライバシーポリシーページです。",
};

export default function PrivacyPolicy() {
  const siteName = "CSV Tools";
  const siteUrl = "https://csv-to-markdown-six.vercel.app";
  const contactEmail = "（メールアドレスを後で記入）";
  const lastUpdated = "2026年5月";

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "system-ui, sans-serif" }}>

      {/* ナビゲーションバー */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e2e4e9", padding: "0 32px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", letterSpacing: "-0.02em", textDecoration: "none" }}>
          CSV Tools
        </a>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>無料・登録不要</span>
      </header>

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 24px 80px" }}>

        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1d23", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
          プライバシーポリシー
        </h1>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 40px" }}>最終更新：{lastUpdated}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>

          <section>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 10px" }}>基本方針</h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              {siteName}（以下「当サイト」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。
              当サイトが提供するツールはすべてブラウザ上で動作し、入力されたデータが外部サーバーに送信されることはありません。
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 10px" }}>入力データの取り扱い</h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              当サイトのCSV変換ツールに入力されたデータは、すべてお使いのブラウザ内のみで処理されます。
              入力内容が当サイトのサーバーや第三者に送信・保存・記録されることは一切ありません。
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 10px" }}>アクセス解析について</h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              当サイトではGoogle Search Consoleを使用してアクセス状況を分析しています。
              これにより収集されるデータは匿名であり、個人を特定するものではありません。
              詳しくは
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#4f6ef7" }}>
                Googleのプライバシーポリシー
              </a>
              をご覧ください。
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 10px" }}>広告について</h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              当サイトでは、Google AdSenseによる広告配信を行う予定です。
              Google AdSenseはCookieを使用して、ユーザーの興味に基づいた広告を表示します。
              Cookieを無効にする方法や、Google AdSenseに関する詳細は
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: "#4f6ef7" }}>
                こちら
              </a>
              をご覧ください。
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 10px" }}>Cookieについて</h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              当サイト自体はCookieを使用していません。ただし、将来的に設置するGoogle AdSenseにより、
              広告配信のためにCookieが使用される場合があります。
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 10px" }}>プライバシーポリシーの変更</h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              本ポリシーは必要に応じて更新することがあります。
              重要な変更がある場合は本ページにて告知します。
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 10px" }}>お問い合わせ</h2>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.8, margin: 0 }}>
              本ポリシーに関するお問い合わせは以下までご連絡ください。<br />
              メールアドレス：ktakajobs@gmail.com
            </p>
          </section>

        </div>
      </main>

      {/* フッター */}
      <footer style={{ borderTop: "0.5px solid #e2e4e9", padding: "18px 32px", textAlign: "center" }}>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>CSV Tools — 無料オンラインツール集</span>
      </footer>

    </div>
  );
}