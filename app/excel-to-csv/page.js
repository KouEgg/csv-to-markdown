"use client";

import { useState } from "react";
import { excelToCsv } from "../lib/excelToCsv";
import ToolLinks from "../components/toolLinks";
import { downloadFile } from "../lib/download";
import Header from "../components/header";
import Footer from "../components/footer";

const ENCODING_OPTIONS = [
  { value: "utf8bom", label: "UTF-8（BOM付き）", description: "Excelで開いても文字化けしない" },
  { value: "utf8", label: "UTF-8（BOMなし）", description: "Web・プログラム用途向け" },
];

export default function ExcelToCsvPage() {
  const [csvOutput, setCsvOutput] = useState("");
  const [encoding, setEncoding] = useState("utf8bom");
  const [isDragging, setIsDragging] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleFile = (file) => {
    if (!file) return;
    const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
    if (!isExcel) {
      setError("Excelファイル（.xlsx / .xls）を選択してください。");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = excelToCsv(e.target.result, { encoding });
      if (result.error) {
        setError(result.error);
        setCsvOutput("");
        setStats(null);
      } else {
        setError(null);
        setCsvOutput(result.csv);
        setStats({ rows: result.rows, cols: result.cols });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownload = () => {
    if (!csvOutput) return;
    downloadFile(csvOutput, fileName, "csv", "text/csv;charset=utf-8;", encoding === "utf8bom" ? "\uFEFF" : "");
  };

  const handleCopy = () => {
    if (!csvOutput) return;
    navigator.clipboard.writeText(csvOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setCsvOutput("");
    setStats(null);
    setError(null);
    setFileName(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "system-ui, sans-serif" }}>

      {/* ナビゲーションバー */}
      <Header />

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 24px 80px" }}>

        {/* ページタイトル */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1d23", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            Excel → CSV 変換
          </h1>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
            ExcelファイルをCSV形式に即時変換。文字化けしないUTF-8に対応。
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "16px 0 0" }}>
            {[
              "⚡ ワンクリック変換",
              "🔤 UTF-8・BOM付き対応",
              "🇯🇵 文字化けしない",
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
              <span style={{ fontSize: "12px", color: "#6b7280" }}>出力文字コード</span>
              <select
                value={encoding}
                onChange={(e) => setEncoding(e.target.value)}
                style={{ fontSize: "12px", color: "#374151", border: "none", background: "transparent", cursor: "pointer", outline: "none" }}
              >
                {ENCODING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label} — {opt.description}</option>
                ))}
              </select>
            </div>
            {fileName && (
              <button
                onClick={handleClear}
                style={{ fontSize: "12px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", padding: 0 }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                クリア
              </button>
            )}
          </div>

          {/* ドロップエリア */}
          <div
            style={{ padding: "40px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: isDragging ? "#eef0fd" : "#fafafa", borderBottom: "0.5px solid #f0f1f4", cursor: "pointer", transition: "background 0.15s", minHeight: "180px", position: "relative" }}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
          >
            {fileName ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <svg width="32" height="32" viewBox="0 0 16 16" fill="none"><path d="M4 2h6l4 4v8a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="#22c55e" strokeWidth="1.2"/><path d="M9 2v4h4" stroke="#22c55e" strokeWidth="1.2"/></svg>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#1a1d23" }}>{fileName}</span>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>別のファイルをドロップして置き換えできます</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                <svg width="36" height="36" viewBox="0 0 16 16" fill="none"><path d="M8 2v9M4 7l4 4 4-4M2 13h12" stroke={isDragging ? "#4f6ef7" : "#9ca3af"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: isDragging ? "#4f6ef7" : "#374151", margin: "0 0 4px" }}>
                    {isDragging ? "ここにドロップ" : "Excelファイルをドロップ"}
                  </p>
                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>.xlsx / .xls に対応</p>
                </div>
                <label style={{ fontSize: "12px", padding: "6px 16px", borderRadius: "6px", border: "0.5px solid #e2e4e9", background: "#fff", color: "#374151", cursor: "pointer", fontWeight: 500 }}>
                  ファイルを選択
                  <input type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
                </label>
              </div>
            )}
            {isDragging && (
              <div style={{ position: "absolute", inset: 0, border: "2px dashed #4f6ef7", borderRadius: "4px", pointerEvents: "none" }} />
            )}
          </div>

          {/* 出力エリア */}
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
                    <><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>コピーしました</>
                  ) : (
                    <><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" strokeWidth="1.5"/></svg>コピー</>
                  )}
                </button>
              </div>
            </div>
            <textarea
              style={{
                width: "100%", height: "240px", padding: "14px 16px",
                fontFamily: "ui-monospace, monospace", fontSize: "13px", lineHeight: "1.7",
                color: "#1f2937", resize: "none", border: "none", outline: "none",
                background: "#fafafa", boxSizing: "border-box"
              }}
              readOnly
              value={csvOutput}
              placeholder="変換結果がここに表示されます"
            />
          </div>

          {/* ステータスバー */}
          <div style={{ padding: "9px 18px", borderTop: "0.5px solid #f0f1f4", background: "#fafafa", display: "flex", alignItems: "center", gap: "6px" }}>
            {error ? (
              <>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v4M8 11v.01" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span style={{ fontSize: "12px", color: "#ef4444" }}>{error}</span>
              </>
            ) : stats ? (
              <>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/></svg>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>{stats.rows}行 × {stats.cols}列 を変換しました</span>
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
              "ExcelファイルをドロップするかExcelファイルを選択で読み込んでください（.xlsx / .xls対応）",
              "出力文字コードを選択してください。Excelで開く場合はUTF-8（BOM付き）、Web・プログラム用途はUTF-8（BOMなし）がおすすめです",
              "右側にCSVが即時表示されます",
              "「ダウンロード」ボタンでCSVファイルとして保存するか、「コピー」ボタンでクリップボードにコピーできます",
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
                q: "UTF-8（BOM付き）とUTF-8（BOMなし）はどちらを選べばいいですか？",
                a: "ExcelでCSVを開く場合はUTF-8（BOM付き）を選んでください。日本語が文字化けせず正しく表示されます。プログラムやWebサービスに取り込む場合はUTF-8（BOMなし）が適しています。"
              },
              {
                q: "複数シートがある場合はどうなりますか？",
                a: "1シート目のデータのみ変換されます。2シート目以降は対象外です。"
              },
              {
                q: "機密情報を含むデータを変換しても大丈夫ですか？",
                a: "はい、安心してご利用いただけます。すべての変換処理はブラウザ上で完結しており、アップロードしたファイルが外部サーバーに送信されることは一切ありません。"
              },
              {
                q: "どんな用途に使えますか？",
                a: "ExcelデータをWebサービスやデータベースに取り込むとき、CSVとして保存し直したいとき、文字化けしないCSVを作成したいときなどに活用できます。"
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
            current="/excel-to-csv"
            reverse="/csv-to-excel"
            reverseLabel="CSV → Excel 変換"
          />
        </section>

        {/* このツールについて */}
        <section>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 12px", letterSpacing: "-0.01em" }}>このツールについて</h2>
          <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.8, margin: 0 }}>
            Excel→CSV変換ツールは、ExcelファイルをCSV形式に即時変換する無料のオンラインツールです。UTF-8（BOM付き）に対応しており、日本語の文字化けを防いでCSVを出力できます。登録不要・完全無料でご利用いただけます。
          </p>
        </section>

      </main>

      {/* フッター */}
      <Footer />

    </div>
  );
}