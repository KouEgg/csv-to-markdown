"use client";

import { useState, useEffect } from "react";
import { downloadAsExcel } from "../lib/csvToExcel";
import ToolLinks from "../components/toolLinks";
import { downloadFile } from "../lib/download";

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

function replaceExtension(fileName, newExtension) {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot === -1) return `${fileName}.${newExtension}`;
  return `${fileName.slice(0, lastDot)}.${newExtension}`;
}

const SAMPLE_CSV = `name,age,city\nAlice,30,Tokyo\nBob,25,Osaka\n山田 太郎,28,名古屋`;

export default function CsvToExcelPage() {
  const [csvInput, setCsvInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const isMobile = useWindowWidth() < 768;

  useEffect(() => {
    if (!csvInput.trim()) { setStats(null); setError(null); return; }
    const lines = csvInput.trim().split(/\r\n|\n|\r/);
    const cols = lines[0].split(",").length;
    setStats({ rows: lines.length - 1, cols });
    setError(null);
  }, [csvInput]);

  const handleDownload = () => {
    const result = downloadAsExcel(csvInput, fileName ? replaceExtension(fileName, "xlsx") : "output.xlsx");
    if (result.error) setError(result.error);
  };

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setCsvInput(e.target.result);
    reader.readAsText(file, "UTF-8");
  };

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
            CSV → Excel 変換
          </h1>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
            CSVデータを貼り付けるだけでExcelファイル（.xlsx）に即時変換。
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "16px 0 0" }}>
            {[
              "⚡ ワンクリック変換",
              "📊 .xlsx形式で出力",
              "🇯🇵 日本語・全角文字対応",
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
              CSVを貼り付けて「Excelダウンロード」ボタンを押してください
            </span>
            {!csvInput && (
              <button
                onClick={() => setCsvInput(SAMPLE_CSV)}
                style={{ fontSize: "12px", color: "#4f6ef7", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 500 }}
              >
                サンプルを試す →
              </button>
            )}
          </div>

          {/* 入力エリア */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 16px", borderBottom: "0.5px solid #f0f1f4", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>CSV 入力</span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {csvInput && (
                  <button
                    onClick={() => setCsvInput("")}
                    style={{ fontSize: "12px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", padding: 0 }}
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    クリア
                  </button>
                )}
                <label style={{ fontSize: "12px", color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ファイルを開く
                  <input type="file" accept=".csv,.tsv,.txt" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
                </label>
              </div>
            </div>
            <div
              style={{ position: "relative" }}
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
                placeholder={"name,age,city\nAlice,30,Tokyo\n\nここにCSVを貼り付け\nまたはファイルをドロップ"}
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
              />
              {isDragging && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(238,240,253,0.92)", border: "2px dashed #4f6ef7", borderRadius: "4px", pointerEvents: "none" }}>
                  <span style={{ color: "#4f6ef7", fontWeight: 600, fontSize: "14px" }}>ここにドロップ</span>
                </div>
              )}
            </div>
          </div>

          {/* ダウンロードバー */}
          <div style={{ padding: "12px 18px", borderTop: "0.5px solid #f0f1f4", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {error ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v4M8 11v.01" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <span style={{ fontSize: "12px", color: "#ef4444" }}>{error}</span>
                </>
              ) : stats ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/></svg>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>{stats.rows}行 × {stats.cols}列 を読み込みました</span>
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v4M8 11v.01" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>入力データはサーバーに送信されません。機密情報も安心してご利用いただけます。</span>
                </>
              )}
            </div>
            <button
              onClick={handleDownload}
              disabled={!csvInput}
              style={{
                fontSize: "13px", padding: "8px 20px", borderRadius: "8px", border: "none",
                cursor: csvInput ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", gap: "6px", fontWeight: 700,
                background: csvInput ? "#4f6ef7" : "#f3f4f6",
                color: csvInput ? "#fff" : "#9ca3af",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Excelダウンロード（.xlsx）
            </button>
          </div>
        </div>

        {/* 区切り */}
        <div style={{ margin: "52px 0 28px", borderTop: "0.5px solid #e2e4e9" }} />

        {/* 使い方 */}
        <section style={{ marginBottom: "36px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 16px", letterSpacing: "-0.01em" }}>使い方</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              "左のエリアにCSVテキストを貼り付けるか、CSVファイルをドロップまたは「ファイルを開く」で選択してください",
              "「Excelダウンロード（.xlsx）」ボタンを押すとExcelファイルがダウンロードされます",
              "ダウンロードしたファイルはそのままExcelで開けます",
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
                q: "変換したExcelファイルで日本語が文字化けしませんか？",
                a: "はい、文字化けしません。出力するExcelファイル（.xlsx）はUTF-8で処理されるため、日本語・全角文字も正しく表示されます。"
              },
              {
                q: "CSVファイルをそのままExcelで開くと文字化けするのはなぜですか？",
                a: "ExcelはCSVファイルをShift-JISとして開こうとするため、UTF-8で保存されたCSVは文字化けすることがあります。このツールを使うことでその問題を回避できます。"
              },
              {
                q: "機密情報を含むデータを変換しても大丈夫ですか？",
                a: "はい、安心してご利用いただけます。すべての変換処理はブラウザ上で完結しており、入力データが外部サーバーに送信されることは一切ありません。"
              },
              {
                q: "どんな用途に使えますか？",
                a: "CSVデータをExcelで開いて編集したいとき、取引先にExcel形式で納品したいとき、CSVの文字化けを回避したいときなどに活用できます。"
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
            current="/csv-to-excel"
            reverse="/excel-to-csv"
            reverseLabel="Excel → CSV 変換"
          />
        </section>

        {/* このツールについて */}
        <section>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 12px", letterSpacing: "-0.01em" }}>このツールについて</h2>
          <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.8, margin: 0 }}>
            CSV→Excel変換ツールは、CSVデータをExcelファイル（.xlsx）に即時変換する無料のオンラインツールです。文字化けの心配なくExcelで開けるファイルを生成します。登録不要・完全無料でご利用いただけます。
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