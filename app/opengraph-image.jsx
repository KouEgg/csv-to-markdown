import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CSV Tools | 無料オンライン変換ツール集";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#f4f5f7",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 100px",
        }}
      >
        {/* アクセントライン */}
        <div style={{
          width: "64px",
          height: "6px",
          background: "#4f6ef7",
          borderRadius: "3px",
          marginBottom: "40px",
        }} />

        {/* サイト名 */}
        <div style={{
          fontSize: "72px",
          fontWeight: 700,
          color: "#1a1d23",
          letterSpacing: "-0.02em",
          marginBottom: "24px",
          display: "flex",
        }}>
          CSV Tools
        </div>

        {/* 説明文 */}
        <div style={{
          fontSize: "36px",
          color: "#6b7280",
          lineHeight: 1.5,
          marginBottom: "60px",
          display: "flex",
        }}>
          CSV・Excel・Markdown・JSONの変換ツールを無料で提供
        </div>

        {/* バッジ一覧 */}
        <div style={{
          display: "flex",
          gap: "16px",
        }}>
          {["登録不要", "ブラウザ内で完結", "機密データも安心"].map((label) => (
            <div
              key={label}
              style={{
                fontSize: "24px",
                padding: "10px 24px",
                borderRadius: "40px",
                background: "#eef0fd",
                color: "#4f6ef7",
                fontWeight: 600,
                display: "flex",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* ドメイン */}
        <div style={{
          position: "absolute",
          bottom: "60px",
          right: "100px",
          fontSize: "28px",
          color: "#9ca3af",
          display: "flex",
        }}>
          kouegg.com
        </div>
      </div>
    ),
    { ...size }
  );
}