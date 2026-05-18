"use client";

import { useState, useEffect } from "react";
import ToolLinks from "../components/toolLinks";
import { downloadFile } from "../lib/download";
import { useWindowWidth } from "../hooks/useWindowWidth";

function markdownToCsv(mdText) {
  if (!mdText || mdText.trim() === "") return "";

  const lines = mdText.trim().split(/\r\n|\n|\r/);
  const result = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) continue;

    // セパレーター行を除外（:---:, ---, :--- 等を含む行）
    if (/^\|[\s|:-]+\|$/.test(trimmed)) continue;

    // 前後の|を除去してセルに分割
    const cells = trimmed
      .slice(1, -1)
      .split("|")
      .map((cell) => {
        const v = cell.trim();
        // カンマ・ダブルクォート・改行を含む場合はクォートで囲む
        if (v.includes(",") || v.includes('"') || v.includes("\n")) {
          return `"${v.replace(/"/g, '""')}"`;
        }
        return v;
      });

    result.push(cells.join(","));
  }

  return result.join("\n");
}

const SAMPLE_MD = `| name | age | city |
| --- | --- | --- |
| Alice | 30 | Tokyo |
| Bob | 25 | Osaka |
| 山田 太郎 | 28 | 名古屋 |`;

export default function MarkdownToCsv() {
  const [mdInput, setMdInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [stats, setStats] = useState(null);
  const [fileName, setFileName] = useState(null);

  const csvOutput = markdownToCsv(mdInput);

  useEffect(() => {
    if (!csvOutput.trim()) { setStats(null); return; }
    const rows = csvOutput.trim().split(/\r\n|\n|\r/);
    const cols = rows[0].split(",").length;
    setStats({ rows: rows.length - 1, cols });
  }, [csvOutput]);

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
    reader.onload = (e) => setMdInput(e.target.result);
    reader.readAsText(file, "UTF-8");
  };

  const isMobile = useWindowWidth() < 768;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "system-ui, sans-serif" }}>

      <header style={{ background: "#fff", borderBottom: "1px solid #e2e4e9", padding: "0 32px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", letterSpacing: "-0.02em", textDecoration: "none" }}>
          CSV Tools
        </a>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>無料・登録不要</span>
      </header>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 24px 80px" }}>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1d23", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            Markdown → CSV 変換
          </h1>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 14px", lineHeight: 1.6 }}>
            MarkdownテーブルをCSV形式に即時変換。
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {["⚡ リアルタイム変換", "🇯🇵 日本語・全角文字対応", "🔒 機密データも安心（サーバー送信なし）", "✅ 登録不要・完全無料"].map((label) => (
              <span key={label} style={{ fontSize: "12px", padding: "5px 10px", borderRadius: "20px", background: "#eef0fd", color: "#4f6ef7", fontWeight: 500 }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", border: "0.5px solid #e2e4e9", borderRadius: "12px", overflow: "hidden" }}>

          <div style={{ padding: "11px 18px", borderBottom: "0.5px solid #f0f1f4", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>Markdownテーブルを貼り付けてください</span>
            {!mdInput && (
              <button onClick={() => setMdInput(SAMPLE_MD)} style={{ fontSize: "12px", color: "#4f6ef7", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 500 }}>
                サンプルを試す →
              </button>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>

            {/* 左：入力 */}
            <div style={{ borderRight: isMobile ? "none" : "0.5px solid #f0f1f4", borderBottom: isMobile ? "0.5px solid #f0f1f4" : "none", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "10px 16px", borderBottom: "0.5px solid #f0f1f4", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>Markdown 入力</span>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {mdInput && (
                    <button onClick={() => setMdInput("")} style={{ fontSize: "12px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", padding: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      クリア
                    </button>
                  )}
                  <label style={{ fontSize: "12px", color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ファイルを開く
                    <input type="file" accept=".md,.txt" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
                  </label>
                </div>
              </div>
              <div style={{ position: "relative", flex: 1 }} onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)}>
                <textarea
                  style={{ width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px", fontFamily: "ui-monospace, monospace", fontSize: "13px", lineHeight: "1.7", color: "#1f2937", resize: "none", border: "none", outline: "none", background: isDragging ? "#eef0fd" : "transparent", boxSizing: "border-box" }}
                  placeholder={"| name | age | city |\n| --- | --- | --- |\n| Alice | 30 | Tokyo |"}
                  value={mdInput}
                  onChange={(e) => setMdInput(e.target.value)}
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
                      transition: "all 0.15s",
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
                style={{ width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px", fontFamily: "ui-monospace, monospace", fontSize: "13px", lineHeight: "1.7", color: "#1f2937", resize: "none", border: "none", outline: "none", background: "#fafafa", boxSizing: "border-box" }}
                readOnly
                value={csvOutput}
                placeholder="変換結果がここに表示されます"
              />
            </div>
          </div>

          <div style={{ padding: "9px 18px", borderTop: "0.5px solid #f0f1f4", background: "#fafafa", display: "flex", alignItems: "center", gap: "6px" }}>
            {stats ? (
              <><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/></svg><span style={{ fontSize: "12px", color: "#6b7280" }}>{stats.rows}行 × {stats.cols}列 を変換しました</span></>
            ) : (
              <><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v4M8 11v.01" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/></svg><span style={{ fontSize: "12px", color: "#9ca3af" }}>入力データはサーバーに送信されません。機密情報も安心してご利用いただけます。</span></>
            )}
          </div>
        </div>

        <div style={{ margin: "52px 0 28px", borderTop: "0.5px solid #e2e4e9" }} />

        <section style={{ marginBottom: "36px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 16px" }}>使い方</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              "左のエリアにMarkdownテーブルを貼り付けるか、mdファイルをドロップまたは「ファイルを開く」で選択してください",
              "右側にCSVが即時表示されます",
              "「コピー」ボタンでクリップボードにコピーするか、「ダウンロード」ボタンでCSVファイルとして保存できます",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#eef0fd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#4f6ef7", flexShrink: 0, marginTop: "1px" }}>{i + 1}</div>
                <span style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7 }}>{text}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "36px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 16px" }}>よくある質問</h2>
          <div style={{ border: "0.5px solid #e2e4e9", borderRadius: "10px", overflow: "hidden" }}>
            {[
              { q: "どんなMarkdownテーブル形式に対応していますか？", a: "標準的なMarkdownテーブル形式（|で区切られた形式）に対応しています。整列指定（:---:等）のセパレーター行は自動的に除外されます。" },
              { q: "日本語を含むMarkdownテーブルは変換できますか？", a: "はい。全角文字・日本語を含むMarkdownテーブルも正確に変換できます。" },
              { q: "機密情報を含むデータを変換しても大丈夫ですか？", a: "はい、安心してご利用いただけます。すべての変換処理はブラウザ上で完結しており、入力データおよびアップロードしたファイルが外部サーバーに送信されることは一切ありません。社内データや機密情報を含むMarkdownテーブルでも安全にご利用いただけます。" },
              { q: "どんな用途に使えますか？", a: "GitHubのREADMEやNotionからデータをCSVに戻したいとき、MarkdownテーブルをExcelやスプレッドシートで編集したいときなどに活用できます。" },
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
            current="/markdown-to-csv"
            reverse="/csv-to-markdown"
            reverseLabel="CSV → Markdown 変換"
          />
        </section>

        <section>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 12px" }}>このツールについて</h2>
          <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.8, margin: 0 }}>
            Markdown→CSV変換ツールは、MarkdownテーブルをCSV形式に即時変換する無料のオンラインツールです。登録不要・完全無料でご利用いただけます。
          </p>
        </section>

      </main>

      <footer style={{ borderTop: "0.5px solid #e2e4e9", padding: "18px 32px", textAlign: "center", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <a href="/privacy" style={{ fontSize: "12px", color: "#6b7280", textDecoration: "none" }}>プライバシーポリシー</a>
        </div>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>CSV Tools — 無料オンラインツール集</span>
      </footer>

    </div>
  );
}