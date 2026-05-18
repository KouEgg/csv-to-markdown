"use client";

import { useState, useEffect } from "react";
import { csvToMarkdown } from "../lib/csvToMarkdown";
import { marked } from "marked";
import * as XLSX from "xlsx";
import ToolLinks from "../components/toolLinks";
import { downloadFile } from "../lib/download";
import { useWindowWidth } from "../hooks/useWindowWidth";
import Header from "../components/header";
import Footer from "../components/footer";

const SAMPLE_CSV = `name,age,city\nAlice,30,Tokyo\nBob,25,Osaka\n山田 太郎,28,名古屋`;

export default function Home() {
  const [csvInput, setCsvInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [hasHeader, setHasHeader] = useState(true);
  const [delimiter, setDelimiter] = useState(",");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [stats, setStats] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [alignment, setAlignment] = useState("none");
  const isMobile = useWindowWidth() < 768;

  const markdownOutput = csvToMarkdown(csvInput, { hasHeader, delimiter, alignment });

  useEffect(() => {
    if (!csvInput.trim()) { setStats(null); return; }
    const rows = csvInput.trim().split(/\r\n|\n|\r/);
    const cols = rows[0].split(delimiter).length;
    setStats({ rows: hasHeader ? rows.length - 1 : rows.length, cols });
  }, [csvInput, hasHeader, delimiter]);

  const handleCopy = () => {
    if (!markdownOutput) return;
    navigator.clipboard.writeText(markdownOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!markdownOutput) return;
    downloadFile(markdownOutput, fileName, "md", "text/markdown;charset=utf-8;");
  };

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const csv = XLSX.utils.sheet_to_csv(sheet);
        setCsvInput(csv);
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => setCsvInput(e.target.result);
      reader.readAsText(file, "UTF-8");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "system-ui, sans-serif" }}>

      {/* ナビゲーションバー */}
      <Header />

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 24px 80px" }}>

        {/* ページタイトル */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1d23", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            CSV → Markdown テーブル変換
          </h1>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
            CSVを貼り付けるだけでMarkdownテーブルに即時変換。
          </p>
          {/* 機能バッジ */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "16px 0 0" }}>
            {[
              "⚡ リアルタイム変換",
              "📊 Excel対応（.xlsx / .xls）",
              "👁 プレビュー表示",
              "🇯🇵 日本語・全角文字対応",
              "↔️ 整列オプション",
              "🔒 機密データも安心（サーバー送信なし）",
              "✅ 登録不要・完全無料",
            ].map((label) => (
              <span
                key={label}
                style={{
                  fontSize: "12px", padding: "5px 10px", borderRadius: "20px",
                  background: "#eef0fd", color: "#4f6ef7", fontWeight: 500,
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ツールカード */}
        <div style={{ background: "#fff", border: "0.5px solid #e2e4e9", borderRadius: "12px", overflow: "hidden" }}>

          {/* オプションバー */}
          <div style={{ padding: "11px 18px", borderBottom: "0.5px solid #f0f1f4", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>

              {/* ヘッダートグル */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 10px", borderRadius: "6px", border: "0.5px solid #e2e4e9", background: "#f9fafb" }}>
                <span style={{ fontSize: "12px", color: "#374151" }}>1行目をヘッダーとして扱う</span>
                <div
                  onClick={() => setHasHeader(!hasHeader)}
                  style={{ width: "32px", height: "18px", borderRadius: "9px", background: hasHeader ? "#4f6ef7" : "#d1d5db", display: "flex", alignItems: "center", padding: "2px", boxSizing: "border-box", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}
                >
                  <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#fff", marginLeft: hasHeader ? "auto" : "0", transition: "margin 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.15)" }} />
                </div>
              </div>

              {/* 区切り文字 */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 10px", borderRadius: "6px", border: "0.5px solid #e2e4e9", background: "#f9fafb" }}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 5h12M2 8h8M2 11h10" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>区切り文字</span>
                <select
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  style={{ fontSize: "12px", color: "#374151", border: "none", background: "transparent", cursor: "pointer", outline: "none" }}
                >
                  <option value=",">カンマ（,）</option>
                  <option value={"\t"}>タブ</option>
                  <option value=";">セミコロン（;）</option>
                </select>
              </div>
            </div>

            {/* 整列オプション */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 10px", borderRadius: "6px", border: "0.5px solid #e2e4e9", background: "#f9fafb" }}>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>整列</span>
              <div style={{ display: "flex", background: "#f3f4f6", borderRadius: "4px", padding: "2px", gap: "1px" }}>
                {[
                  { value: "none", label: "なし" },
                  { value: "left", label: "左" },
                  { value: "center", label: "中央" },
                  { value: "right", label: "右" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setAlignment(opt.value)}
                    style={{
                      fontSize: "11px", width: "36px", padding: "3px 0", borderRadius: "3px", border: "none",
                      cursor: "pointer", fontWeight: 500, transition: "all 0.15s", textAlign: "center",
                      background: alignment === opt.value ? "#fff" : "transparent",
                      color: alignment === opt.value ? "#374151" : "#9ca3af",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {!csvInput && (
              <button
                onClick={() => setCsvInput(SAMPLE_CSV)}
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
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151", letterSpacing: "0.01em" }}>
                  CSV 入力
                </span>
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
                    <input type="file" accept=".csv,.tsv,.txt,.xlsx,.xls" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
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

            {/* 右：出力 */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "10px 16px", borderBottom: "0.5px solid #f0f1f4", background: "#fafafa", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151", letterSpacing: "0.01em" }}>
                      Markdown 出力
                    </span>
                    <div style={{ display: "flex", background: "#f3f4f6", borderRadius: "6px", padding: "2px" }}>
                      <button
                        onClick={() => setShowPreview(false)}
                        style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "4px", border: "none", cursor: "pointer", fontWeight: 500, background: !showPreview ? "#fff" : "transparent", color: !showPreview ? "#374151" : "#9ca3af", transition: "all 0.15s" }}
                      >
                        テキスト
                      </button>
                      <button
                        onClick={() => setShowPreview(true)}
                        style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "4px", border: "none", cursor: "pointer", fontWeight: 500, background: showPreview ? "#fff" : "transparent", color: showPreview ? "#374151" : "#9ca3af", transition: "all 0.15s" }}
                      >
                        プレビュー
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      onClick={handleDownload}
                      disabled={!markdownOutput}
                      style={{
                        fontSize: "12px", padding: "4px 12px", borderRadius: "6px", border: "none",
                        cursor: markdownOutput ? "pointer" : "not-allowed",
                        display: "flex", alignItems: "center", gap: "5px", fontWeight: 600,
                        background: markdownOutput ? "#f0fdf4" : "#f3f4f6",
                        color: markdownOutput ? "#16a34a" : "#9ca3af",
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {!isMobile && "ダウンロード"}
                    </button>
                    <button
                      onClick={handleCopy}
                      disabled={!markdownOutput}
                      style={{
                        fontSize: "12px", padding: "4px 12px", borderRadius: "6px", border: "none",
                        cursor: markdownOutput ? "pointer" : "not-allowed",
                        display: "flex", alignItems: "center", gap: "5px", fontWeight: 600,
                        transition: "all 0.15s",
                        background: copied ? "#dcfce7" : markdownOutput ? "#4f6ef7" : "#f3f4f6",
                        color: copied ? "#16a34a" : markdownOutput ? "#fff" : "#9ca3af",
                      }}
                    >
                      {copied ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                          {!isMobile && "コピーしました"}
                        </>
                      ) : (
                        <>
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" strokeWidth="1.5"/></svg>
                          {!isMobile && "コピー"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {showPreview ? (
                <div
                  className="markdown-preview"
                  style={{
                    width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px",
                    fontSize: "13px", lineHeight: "1.7", color: "#1f2937",
                    background: "#fafafa", boxSizing: "border-box", overflowY: "auto"
                  }}
                  dangerouslySetInnerHTML={{
                    __html: markdownOutput
                      ? marked(markdownOutput)
                      : "<p style='color:#9ca3af'>変換結果がここに表示されます</p>"
                  }}
                />
              ) : (
                <textarea
                  style={{
                    width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px",
                    fontFamily: "ui-monospace, monospace", fontSize: "13px", lineHeight: "1.7",
                    color: "#1f2937", resize: "none", border: "none", outline: "none",
                    background: "#fafafa", boxSizing: "border-box"
                  }}
                  readOnly
                  value={markdownOutput}
                  placeholder="変換結果がここに表示されます"
                />
              )}
            </div>
          </div>

          {/* ステータスバー */}
          <div style={{ padding: "9px 18px", borderTop: "0.5px solid #f0f1f4", background: "#fafafa", display: "flex", alignItems: "center", gap: "6px" }}>
            {stats ? (
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
              "左のエリアにCSVテキストを貼り付けるか、CSVファイルをドロップまたは「ファイルを開く」で選択してください",
              "ExcelファイルはそのままドロップまたはExcelファイルを開くで選択できます（.xlsx / .xls対応）",
              "右側にMarkdownテーブルが即時表示されます",
             "「テキスト」タブで変換結果を確認し「コピー」ボタンでコピー、または「ダウンロード」ボタンで.mdファイルとして保存できます",
              "「プレビュー」タブで実際の表の見た目を確認できます",
              "1行目をヘッダーとして扱わない場合はトグルをオフにしてください",
              "Excelからセルをコピーして貼り付ける場合は区切り文字を「タブ」に切り替えてください",
              "列の整列（なし・左・中央・右）を切り替えるとMarkdownの整列指定が変わります",
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
                q: "ExcelファイルをそのままMarkdownに変換できますか？",
                a: "はい。.xlsxまたは.xlsファイルをドロップするか「ファイルを開く」で選択してください。1シート目の内容が自動的に読み込まれMarkdownテーブルに変換されます。"
              },
              {
                q: "Excelのセルをコピーして貼り付けることはできますか？",
                a: "はい。Excelでセルを選択してコピーし、左のエリアに貼り付けてください。区切り文字を「タブ」に切り替えると正しく変換されます。"
              },
              {
                q: "日本語を含むCSVは変換できますか？",
                a: "はい。全角文字・日本語を含むCSVも正確に変換できます。"
              },
              {
                q: "列の整列はどう使えばいいですか？",
                a: "「なし」はMarkdownの標準形式（---）、「左」は左寄せ（:---）、「中央」は中央寄せ（:---:）、「右」は右寄せ（---:）を出力します。GitHubやNotionなど整列指定に対応したレンダラーで有効です。"
              },
              {
                q: "機密情報を含むデータを変換しても大丈夫ですか？",
                a: "はい、安心してご利用いただけます。すべての変換処理はブラウザ上で完結しており、入力データおよびアップロードしたファイルが外部サーバーに送信されることは一切ありません。社内データや機密情報を含むCSVでも安全にご利用いただけます。"
              },
              {
                q: "どんな用途に使えますか？",
                a: "GitHubのREADME、Notionのドキュメント、Obsidianのノート、技術仕様書など、Markdownを使う場面全般で活用できます。"
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
            current="/csv-to-markdown"
            reverse="/markdown-to-csv"
            reverseLabel="Markdown → CSV 変換"
          />
        </section>

        {/* このツールについて */}
        <section>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 12px", letterSpacing: "-0.01em" }}>このツールについて</h2>
          <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.8, margin: 0 }}>
            CSV→Markdownテーブル変換ツールは、CSVやExcelデータをMarkdown形式のテーブルに即時変換する無料のオンラインツールです。
            登録不要・完全無料でご利用いただけます。
          </p>
        </section>

      </main>

      {/* フッター */}
      <Footer />

    </div>
  );
}