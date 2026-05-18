"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
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

function csvToHtml(csvText, options = {}) {
  const { hasHeader = true, delimiter = "," } = options;
  if (!csvText || csvText.trim() === "") return "";

  const rows = csvText.trim().split(/\r\n|\n|\r/);
  if (rows.length === 0) return "";

  const table = rows.map((row) => parseCSVRow(row, delimiter));
  const colCount = Math.max(...table.map((row) => row.length));
  const normalized = table.map((row) => {
    while (row.length < colCount) row.push("");
    return row;
  });

  const header = hasHeader ? normalized[0] : null;
  const body = hasHeader ? normalized.slice(1) : normalized;

  const escape = (text) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const headerHtml = header
    ? `  <thead>\n    <tr>\n${header.map((c) => `      <th>${escape(c)}</th>`).join("\n")}\n    </tr>\n  </thead>`
    : "";

  const bodyHtml = `  <tbody>\n${body
    .map((row) => `    <tr>\n${row.map((c) => `      <td>${escape(c)}</td>`).join("\n")}\n    </tr>`)
    .join("\n")}\n  </tbody>`;

  return `<table>\n${headerHtml}\n${bodyHtml}\n</table>`;
}

function parseCSVRow(row, delimiter = ",") {
  const cells = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

export default function CsvToHtml() {
  const [csvInput, setCsvInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [hasHeader, setHasHeader] = useState(true);
  const [delimiter, setDelimiter] = useState(",");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [stats, setStats] = useState(null);

  const htmlOutput = csvToHtml(csvInput, { hasHeader, delimiter });

  useEffect(() => {
    if (!csvInput.trim()) { setStats(null); return; }
    const rows = csvInput.trim().split(/\r\n|\n|\r/);
    const cols = rows[0].split(delimiter).length;
    setStats({ rows: hasHeader ? rows.length - 1 : rows.length, cols });
  }, [csvInput, hasHeader, delimiter]);

  const handleCopy = () => {
    if (!htmlOutput) return;
    navigator.clipboard.writeText(htmlOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!htmlOutput) return;
    downloadFile(htmlOutput, fileName, "html", "text/html;charset=utf-8;");
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
        setCsvInput(XLSX.utils.sheet_to_csv(sheet));
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => setCsvInput(e.target.result);
      reader.readAsText(file, "UTF-8");
    }
  };

  const isMobile = useWindowWidth() < 768;
  const SAMPLE_CSV = `name,age,city\nAlice,30,Tokyo\nBob,25,Osaka\n山田 太郎,28,名古屋`;

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
            CSV → HTML テーブル変換
          </h1>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 14px", lineHeight: 1.6 }}>
            CSVやExcelデータをHTMLテーブルに即時変換。
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {["⚡ リアルタイム変換", "📊 Excel対応（.xlsx / .xls）", "👁 プレビュー表示", "🇯🇵 日本語・全角文字対応", "🔒 機密データも安心（サーバー送信なし）", "✅ 登録不要・完全無料"].map((label) => (
              <span key={label} style={{ fontSize: "12px", padding: "5px 10px", borderRadius: "20px", background: "#eef0fd", color: "#4f6ef7", fontWeight: 500 }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", border: "0.5px solid #e2e4e9", borderRadius: "12px", overflow: "hidden" }}>

          <div style={{ padding: "11px 18px", borderBottom: "0.5px solid #f0f1f4", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 10px", borderRadius: "6px", border: "0.5px solid #e2e4e9", background: "#f9fafb" }}>
                <span style={{ fontSize: "12px", color: "#374151" }}>1行目をヘッダーとして扱う</span>
                <div onClick={() => setHasHeader(!hasHeader)} style={{ width: "32px", height: "18px", borderRadius: "9px", background: hasHeader ? "#4f6ef7" : "#d1d5db", display: "flex", alignItems: "center", padding: "2px", boxSizing: "border-box", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
                  <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#fff", marginLeft: hasHeader ? "auto" : "0", transition: "margin 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.15)" }} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 10px", borderRadius: "6px", border: "0.5px solid #e2e4e9", background: "#f9fafb" }}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 5h12M2 8h8M2 11h10" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>区切り文字</span>
                <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} style={{ fontSize: "12px", color: "#374151", border: "none", background: "transparent", cursor: "pointer", outline: "none" }}>
                  <option value=",">カンマ（,）</option>
                  <option value={"\t"}>タブ</option>
                  <option value=";">セミコロン（;）</option>
                </select>
              </div>
            </div>
            {!csvInput && (
              <button onClick={() => setCsvInput(SAMPLE_CSV)} style={{ fontSize: "12px", color: "#4f6ef7", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 500 }}>
                サンプルを試す →
              </button>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>

            <div style={{ borderRight: isMobile ? "none" : "0.5px solid #f0f1f4", borderBottom: isMobile ? "0.5px solid #f0f1f4" : "none", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "10px 16px", borderBottom: "0.5px solid #f0f1f4", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>CSV 入力</span>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {csvInput && (
                    <button onClick={() => setCsvInput("")} style={{ fontSize: "12px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", padding: 0 }}>
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
              <div style={{ position: "relative", flex: 1 }} onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)}>
                <textarea
                  style={{ width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px", fontFamily: "ui-monospace, monospace", fontSize: "13px", lineHeight: "1.7", color: "#1f2937", resize: "none", border: "none", outline: "none", background: isDragging ? "#eef0fd" : "transparent", boxSizing: "border-box" }}
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

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "10px 16px", borderBottom: "0.5px solid #f0f1f4", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>HTML 出力</span>
                  <div style={{ display: "flex", background: "#f3f4f6", borderRadius: "6px", padding: "2px" }}>
                    <button onClick={() => setShowPreview(false)} style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "4px", border: "none", cursor: "pointer", fontWeight: 500, background: !showPreview ? "#fff" : "transparent", color: !showPreview ? "#374151" : "#9ca3af", transition: "all 0.15s" }}>テキスト</button>
                    <button onClick={() => setShowPreview(true)} style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "4px", border: "none", cursor: "pointer", fontWeight: 500, background: showPreview ? "#fff" : "transparent", color: showPreview ? "#374151" : "#9ca3af", transition: "all 0.15s" }}>プレビュー</button>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={handleDownload}
                    disabled={!htmlOutput}
                    style={{
                      fontSize: "12px", padding: "4px 12px", borderRadius: "6px", border: "none",
                      cursor: htmlOutput ? "pointer" : "not-allowed",
                      display: "flex", alignItems: "center", gap: "5px", fontWeight: 600,
                      background: htmlOutput ? "#f0fdf4" : "#f3f4f6",
                      color: htmlOutput ? "#16a34a" : "#9ca3af",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ダウンロード
                  </button>
                  <button
                    onClick={handleCopy}
                    disabled={!htmlOutput}
                    style={{
                      fontSize: "12px", padding: "4px 12px", borderRadius: "6px", border: "none",
                      cursor: htmlOutput ? "pointer" : "not-allowed",
                      display: "flex", alignItems: "center", gap: "5px", fontWeight: 600,
                      transition: "all 0.15s",
                      background: copied ? "#dcfce7" : htmlOutput ? "#4f6ef7" : "#f3f4f6",
                      color: copied ? "#16a34a" : htmlOutput ? "#fff" : "#9ca3af",
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
              {showPreview ? (
                <div
                  className="markdown-preview"
                  style={{ width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px", fontSize: "13px", lineHeight: "1.7", color: "#1f2937", background: "#fafafa", boxSizing: "border-box", overflowY: "auto" }}
                  dangerouslySetInnerHTML={{ __html: htmlOutput || "<p style='color:#9ca3af'>変換結果がここに表示されます</p>" }}
                />
              ) : (
                <textarea
                  style={{ width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px", fontFamily: "ui-monospace, monospace", fontSize: "13px", lineHeight: "1.7", color: "#1f2937", resize: "none", border: "none", outline: "none", background: "#fafafa", boxSizing: "border-box" }}
                  readOnly
                  value={htmlOutput}
                  placeholder="変換結果がここに表示されます"
                />
              )}
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
              "左のエリアにCSVテキストを貼り付けるか、CSVファイルをドロップまたは「ファイルを開く」で選択してください",
              "ExcelファイルはそのままドロップまたはExcelファイルを開くで選択できます（.xlsx / .xls対応）",
              "右側にHTMLテーブルが即時表示されます",
              "「コピー」ボタンでHTMLをコピーしてWebページに貼り付けられます",
              "「プレビュー」タブで実際の表の見た目を確認できます",
              "1行目をヘッダーとして扱わない場合はトグルをオフにしてください",
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
              { q: "ExcelファイルをそのままHTMLに変換できますか？", a: "はい。.xlsxまたは.xlsファイルをドロップするか「ファイルを開く」で選択してください。1シート目の内容が自動的に読み込まれHTMLテーブルに変換されます。" },
              { q: "日本語を含むCSVは変換できますか？", a: "はい。全角文字・日本語を含むCSVも正確に変換できます。" },
              { q: "機密情報を含むデータを変換しても大丈夫ですか？", a: "はい、安心してご利用いただけます。すべての変換処理はブラウザ上で完結しており、入力データおよびアップロードしたファイルが外部サーバーに送信されることは一切ありません。社内データや機密情報を含むCSVでも安全にご利用いただけます。" },
              { q: "どんな用途に使えますか？", a: "WordPressやはてなブログなどのHTML編集モード、WebサイトのHTMLファイルへの貼り付けなど、HTMLテーブルを使う場面全般で活用できます。" },
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
          <ToolLinks current="/csv-to-html" />
        </section>

        <section>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1d23", margin: "0 0 12px" }}>このツールについて</h2>
          <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.8, margin: 0 }}>
            CSV→HTMLテーブル変換ツールは、CSVやExcelデータをHTMLテーブルに即時変換する無料のオンラインツールです。登録不要・完全無料でご利用いただけます。
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