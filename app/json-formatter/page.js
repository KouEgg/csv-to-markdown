"use client";

import { useState, useEffect } from "react";
import ToolLinks from "../components/toolLinks";

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

const SAMPLE_JSON = `{"name":"Alice","age":30,"address":{"city":"Tokyo","zip":"100-0001"},"hobbies":["reading","coding"]}`;

function formatJson(input, mode) {
  if (!input.trim()) return { output: "", error: null };
  try {
    const parsed = JSON.parse(input);
    if (mode === "compress") {
      return { output: JSON.stringify(parsed), error: null };
    }
    return { output: JSON.stringify(parsed, null, 2), error: null };
  } catch (e) {
    return { output: "", error: e.message };
  }
}

export default function JsonFormatterPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [mode, setMode] = useState("format");
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useWindowWidth() < 768;

  const { output, error } = formatJson(jsonInput, mode);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setJsonInput(e.target.result);
    reader.readAsText(file, "UTF-8");
  };

  const isValid = jsonInput.trim() && !error;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "system-ui, sans-serif" }}>

      {/* ナビゲーションバー */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e2e4e9", padding: "0 32px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", letterSpacing: "-0.02em", textDecoration: "none" }}>
          CSV Tools
        </a>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>無料・登録不要</span>
      </header>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 24px 80px" }}>

        {/* ページタイトル */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1d23", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            JSON整形・バリデーター
          </h1>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
            JSONを貼り付けるだけで即時整形・バリデーション。圧縮モードにも対応。
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "16px 0 0" }}>
            {[
              "⚡ リアルタイム整形",
              "✅ バリデーション",
              "🗜️ 圧縮モード",
              "📁 JSONファイル対応",
              "🔒 機密データも安心（サーバー送信なし）",
              "✅ 登録不要・完全無料",
            ].map((label) => (
              <span key={label} style={{ fontSize: "12px", padding: "5px 10px", borderRadius: "20px", background: "#eef0fd", color: "#4f6ef7", fontWeight: 500 }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ツールカード */}
        <div style={{ background: "#fff", border: "0.5px solid #e2e4e9", borderRadius: "12px", overflow: "hidden" }}>

          {/* オプションバー */}
          <div style={{ padding: "11px 18px", borderBottom: "0.5px solid #f0f1f4", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 10px", borderRadius: "6px", border: "0.5px solid #e2e4e9", background: "#f9fafb" }}>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>モード</span>
              <div style={{ display: "flex", background: "#f3f4f6", borderRadius: "4px", padding: "2px", gap: "1px" }}>
                {[
                  { value: "format", label: "整形" },
                  { value: "compress", label: "圧縮" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setMode(opt.value)}
                    style={{
                      fontSize: "11px", padding: "3px 10px", borderRadius: "3px", border: "none",
                      cursor: "pointer", fontWeight: 500, transition: "all 0.15s",
                      background: mode === opt.value ? "#fff" : "transparent",
                      color: mode === opt.value ? "#374151" : "#9ca3af",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {!jsonInput && (
              <button
                onClick={() => setJsonInput(SAMPLE_JSON)}
                style={{ fontSize: "12px", color: "#4f6ef7", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 500 }}
              >
                サンプルを試す →
              </button>
            )}
          </div>

          {/* 入力・出力 2カラム */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>

            {/* 左：入力 */}
            <div style={{ borderRight: isMobile ? "none" : "0.5px solid #f0f1f4", borderBottom: isMobile ? "0.5px solid #f0f1f4" : "none", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "10px 16px", borderBottom: "0.5px solid #f0f1f4", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>JSON 入力</span>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {jsonInput && (
                    <button
                      onClick={() => setJsonInput("")}
                      style={{ fontSize: "12px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", padding: 0 }}
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      クリア
                    </button>
                  )}
                  <label style={{ fontSize: "12px", color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ファイルを開く
                    <input type="file" accept=".json" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
                  </label>
                </div>
              </div>
              <div
                style={{ position: "relative", flex: 1 }}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
              >
                <textarea
                  style={{
                    width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px",
                    fontFamily: "ui-monospace, monospace", fontSize: "13px", lineHeight: "1.7",
                    color: "#1f2937", resize: "none", border: "none", outline: "none",
                    background: isDragging ? "#eef0fd" : "transparent", boxSizing: "border-box"
                  }}
                  placeholder={"{\n  \"name\": \"Alice\",\n  \"age\": 30\n}\n\nここにJSONを貼り付け\nまたはファイルをドロップ"}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
                {isDragging && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(238,240,253,0.92)", border: "2px dashed #4f6ef7", borderRadius: "4px", pointerEvents: "none" }}>
                    <span style={{ color: "#4f6ef7", fontWeight: 600, fontSize: "14px" }}>ここにドロップ</span>
                  </div>
                )}
              </div>
            </div>

            {/* 右：出力 */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "10px 16px", borderBottom: "0.5px solid #f0f1f4", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>
                    {mode === "format" ? "整形結果" : "圧縮結果"}
                  </span>
                  {jsonInput.trim() && (
                    <span style={{
                      fontSize: "11px", padding: "2px 8px", borderRadius: "20px", fontWeight: 600,
                      background: error ? "#fef2f2" : "#f0fdf4",
                      color: error ? "#ef4444" : "#16a34a",
                    }}>
                      {error ? "❌ エラー" : "✓ 有効なJSON"}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  style={{
                    fontSize: "12px", padding: "4px 12px", borderRadius: "6px", border: "none",
                    cursor: output ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", gap: "5px", fontWeight: 600,
                    background: copied ? "#dcfce7" : output ? "#4f6ef7" : "#f3f4f6",
                    color: copied ? "#16a34a" : output ? "#fff" : "#9ca3af",
                  }}
                >
                  {copied ? (
                    <><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>コピーしました</>
                  ) : (
                    <><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" strokeWidth="1.5"/></svg>コピー</>
                  )}
                </button>
              </div>
              <textarea
                style={{
                  width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px",
                  fontFamily: "ui-monospace, monospace", fontSize: "13px", lineHeight: "1.7",
                  color: error ? "#ef4444" : "#1f2937", resize: "none", border: "none", outline: "none",
                  background: "#fafafa", boxSizing: "border-box"
                }}
                readOnly
                value={error ? `エラー: ${error}` : output}
                placeholder="整形結果がここに表示されます"
              />
            </div>
          </div>

          {/* ステータスバー */}
          <div style={{ padding: "9px 18px", borderTop: "0.5px solid #f0f1f4", background: "#fafafa", display: "flex", alignItems: "center", gap: "6px" }}>
            {error ? (
              <>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v4M8 11v.01" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span style={{ fontSize: "12px", color: "#ef4444" }}>JSONの形式が正しくありません。入力内容を確認してください。</span>
              </>
            ) : isValid ? (
              <>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/></svg>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>有効なJSONです</span>
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v4M8 11v.01" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>入力データはサーバーに送信されません。機密情報も安心してご利用いただけます。</span>
              </>
            )}
          </div>
        </div>

        {/* 区切り */}
        <div style={{ margin: "52px 0 28px", borderTop: "0.5px solid #e2e4e9" }} />

        {/* 使い方 */}
        <section style={{ marginBottom: "36px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 16px", letterSpacing: "-0.01em" }}>使い方</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              "左のエリアにJSONを貼り付けるか、JSONファイルをドロップまたは「ファイルを開く」で選択してください",
              "「整形」モードでは見やすくインデントされたJSONが表示されます",
              "「圧縮」モードではスペース・改行を除去したコンパクトなJSONが出力されます",
              "JSONに誤りがある場合は右側にエラー内容が表示されます",
              "「コピー」ボタンで結果をクリップボードにコピーできます",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#eef0fd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#4f6ef7", flexShrink: 0, marginTop: "1px" }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7 }}>{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* よくある質問 */}
        <section style={{ marginBottom: "36px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 16px", letterSpacing: "-0.01em" }}>よくある質問</h2>
          <div style={{ border: "0.5px solid #e2e4e9", borderRadius: "10px", overflow: "hidden" }}>
            {[
              {
                q: "整形と圧縮の違いは何ですか？",
                a: "整形はインデントと改行を加えて人間が読みやすい形式に変換します。圧縮は逆にスペースや改行を除去してデータサイズを小さくします。APIに送信するときやファイルサイズを減らしたいときに圧縮が便利です。"
              },
              {
                q: "バリデーションとは何ですか？",
                a: "入力したJSONが正しい形式かどうかを自動でチェックする機能です。構文エラーがある場合はエラー内容が表示されます。"
              },
              {
                q: "機密情報を含むJSONを貼り付けても大丈夫ですか？",
                a: "はい、安心してご利用いただけます。すべての処理はブラウザ上で完結しており、入力データが外部サーバーに送信されることは一切ありません。"
              },
              {
                q: "どんな用途に使えますか？",
                a: "APIのレスポンスを見やすく整形したいとき、JSONの構文エラーを探したいとき、JSONをコンパクトにしてソースコードに埋め込みたいときなどに活用できます。"
              },
            ].map((item, i, arr) => (
              <div key={i} style={{ padding: "14px 18px", borderBottom: i < arr.length - 1 ? "0.5px solid #f0f1f4" : "none", background: "#fff" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1d23", margin: "0 0 5px" }}>{item.q}</p>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.7 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ツールリンク */}
        <section style={{ marginBottom: "36px" }}>
          <ToolLinks current="/json-formatter" />
        </section>

        {/* このツールについて */}
        <section>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 12px", letterSpacing: "-0.01em" }}>このツールについて</h2>
          <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.8, margin: 0 }}>
            JSON整形・バリデーターは、JSONデータを即時整形・検証できる無料のオンラインツールです。整形・圧縮・バリデーションをブラウザ上で完結して行えます。登録不要・完全無料でご利用いただけます。
          </p>
        </section>

      </main>

      {/* フッター */}
      <footer style={{ borderTop: "0.5px solid #e2e4e9", padding: "18px 32px", textAlign: "center", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <a href="/privacy" style={{ fontSize: "12px", color: "#6b7280", textDecoration: "none" }}>
            プライバシーポリシー
          </a>
        </div>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>CSV Tools — 無料オンラインツール集</span>
      </footer>

    </div>
  );
}