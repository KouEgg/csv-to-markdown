"use client";

import { useState, useEffect } from "react";
import { jsonToCsv } from "../lib/jsonToCsv";
import ToolLinks from "../components/toolLinks";
import { downloadFile } from "../lib/download";
import { useWindowWidth } from "../hooks/useWindowWidth";
import Header from "../components/header";
import Footer from "../components/footer";

const SAMPLE_JSON = `[
  { "name": "Alice", "age": 30, "city": "Tokyo" },
  { "name": "Bob", "age": 25, "city": "Osaka" },
  { "name": "山田 太郎", "age": 28, "city": "名古屋" }
]`;

export default function JsonToCsvPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const isMobile = useWindowWidth() < 768;

  const { csv: csvOutput, error, rows, cols } = jsonToCsv(jsonInput);

  const handleCopy = () => {
    if (!csvOutput) return;
    navigator.clipboard.writeText(csvOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!csvOutput) return;
    downloadFile(csvOutput, fileName, "csv", "text/csv;charset=utf-8;");
  };

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setJsonInput(e.target.result);
    reader.readAsText(file, "UTF-8");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "system-ui, sans-serif" }}>

      {/* ナビゲーションバー */}
      <Header />

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 24px 80px" }}>

        {/* ページタイトル */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1d23", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            JSON → CSV 変換
          </h1>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
            JSONデータを貼り付けるだけでCSVに即時変換。ネスト・階層構造のJSONも自動フラット化。
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "16px 0 0" }}>
            {[
              "⚡ リアルタイム変換",
              "📁 JSONファイル対応",
              "🔀 ネスト・階層構造対応",
              "🇯🇵 日本語・全角文字対応",
              "💾 CSVダウンロード",
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
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              JSON配列形式（[ &#123; ... &#125;, &#123; ... &#125; ]）を入力してください
            </span>
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
                  placeholder={"[\n  { \"name\": \"Alice\", \"age\": 30 },\n  { \"name\": \"Bob\", \"age\": 25 }\n]\n\nここにJSONを貼り付け\nまたはファイルをドロップ"}
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
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>CSV 出力</span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={handleDownload}
                    disabled={!csvOutput}
                    style={{
                      fontSize: "12px", padding: "4px 12px", borderRadius: "6px", border: "none",
                      cursor: csvOutput ? "pointer" : "not-allowed",
                      display: "flex", alignItems: "center", gap: "5px", fontWeight: 600,
                      background: csvOutput ? "#f0fdf4" : "#f3f4f6",
                      color: csvOutput ? "#16a34a" : "#9ca3af",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ダウンロード
                  </button>
                  <button
                    onClick={handleCopy}
                    disabled={!csvOutput}
                    style={{
                      fontSize: "12px", padding: "4px 12px", borderRadius: "6px", border: "none",
                      cursor: csvOutput ? "pointer" : "not-allowed",
                      display: "flex", alignItems: "center", gap: "5px", fontWeight: 600,
                      background: copied ? "#dcfce7" : csvOutput ? "#4f6ef7" : "#f3f4f6",
                      color: copied ? "#16a34a" : csvOutput ? "#fff" : "#9ca3af",
                    }}
                  >
                    {copied ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        コピーしました
                      </>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" strokeWidth="1.5"/></svg>
                        コピー
                      </>
                    )}
                  </button>
                </div>
              </div>
              <textarea
                style={{
                  width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px",
                  fontFamily: "ui-monospace, monospace", fontSize: "13px", lineHeight: "1.7",
                  color: "#1f2937", resize: "none", border: "none", outline: "none",
                  background: "#fafafa", boxSizing: "border-box"
                }}
                readOnly
                value={csvOutput}
                placeholder="変換結果がここに表示されます"
              />
            </div>
          </div>

          {/* ステータスバー */}
          <div style={{ padding: "9px 18px", borderTop: "0.5px solid #f0f1f4", background: "#fafafa", display: "flex", alignItems: "center", gap: "6px" }}>
            {error ? (
              <>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v4M8 11v.01" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span style={{ fontSize: "12px", color: "#ef4444" }}>{error}</span>
              </>
            ) : rows > 0 ? (
              <>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/></svg>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>{rows}行 × {cols}列 を変換しました</span>
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
              "左のエリアにJSONテキストを貼り付けるか、JSONファイルをドロップまたは「ファイルを開く」で選択してください",
              "JSON配列形式（[ { ... }, { ... } ]）で入力してください",
              "右側にCSVが即時表示されます",
              "「コピー」ボタンでクリップボードにコピーするか、「ダウンロード」ボタンでCSVファイルとして保存できます",
              "オブジェクトのキーが異なる場合も、すべてのキーを集めてヘッダー行を自動生成します",
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
                q: "どんな形式のJSONに対応していますか？",
                a: "オブジェクトの配列形式（[ { ... }, { ... } ]）に対応しています。各オブジェクトのキーがCSVのヘッダーになります。"
              },
              {
                q: "オブジェクトによってキーが違う場合はどうなりますか？",
                a: "すべてのオブジェクトのキーを収集してヘッダーを自動生成します。値がないセルは空白になります。"
              },
              {
                q: "日本語を含むJSONは変換できますか？",
                a: "はい。全角文字・日本語を含むJSONも正確に変換できます。"
              },
              {
                q: "機密情報を含むデータを変換しても大丈夫ですか？",
                a: "はい、安心してご利用いただけます。すべての変換処理はブラウザ上で完結しており、入力データが外部サーバーに送信されることは一切ありません。"
              },
              {
                q: "ネストしたJSONも変換できますか？",
                a: "はい。{ \"address\": { \"city\": \"Tokyo\" } } のようなネスト構造は「address.city」のようにドット記法でフラット化してCSVの列に変換します。また { \"users\": [ ... ] } のようにオブジェクトの中に配列がある形式も自動検出して変換できます。"
              },
              {
                q: "どんな用途に使えますか？",
                a: "APIのレスポンスをExcelで分析したいとき、JSONデータをデータベースにインポートしたいとき、JSONをGoogle Sheetsで開きたいときなどに活用できます。"
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
          <ToolLinks
            current="/json-to-csv"
            reverse="/csv-to-json"
            reverseLabel="CSV → JSON 変換"
          />
        </section>

        {/* このツールについて */}
        <section>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 12px", letterSpacing: "-0.01em" }}>このツールについて</h2>
          <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.8, margin: 0 }}>
            JSON→CSV変換ツールは、JSONデータをCSV形式に即時変換する無料のオンラインツールです。APIレスポンスやJSONファイルをExcelやGoogle Sheetsで開きたいときに便利です。登録不要・完全無料でご利用いただけます。
          </p>
        </section>

      </main>

      {/* フッター */}
      <Footer />

    </div>
  );
}