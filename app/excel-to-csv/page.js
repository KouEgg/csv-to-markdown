"use client";

import { useState } from "react";
import { excelToCsv } from "../lib/excelToCsv";
import ToolLinks from "../components/toolLinks";
import { downloadFile } from "../lib/download";
import ToolPageLayout from "../components/ToolPageLayout";
import ToolCard from "../components/ToolCard";
import ToolMeta from "../components/ToolMeta";
import ToolDivider from "../components/ToolDivider";
import StepList from "../components/StepList";
import FaqList from "../components/FaqList";
import ToolAbout from "../components/ToolAbout";
import ToolGuide from "../components/ToolGuide";
import { COLORS, FONTS } from "../lib/theme";

const ENCODING_OPTIONS = [
  { value: "utf8bom", label: "UTF-8（BOM付き）", description: "Excelで開いても文字化けしない" },
  { value: "utf8", label: "UTF-8（BOMなし）", description: "Web・プログラム用途向け" },
];

const STEPS = [
  "ExcelファイルをドロップするかExcelファイルを選択で読み込んでください（.xlsx / .xls対応）",
  "出力文字コードを選択してください。Excelで開く場合はUTF-8（BOM付き）、Web・プログラム用途はUTF-8（BOMなし）がおすすめです",
  "変換結果が表示されたら「ダウンロード」または「コピー」で取り出してください",
];

const FAQ = [
  {
    q: "UTF-8（BOM付き）とUTF-8（BOMなし）はどちらを選べばいいですか？",
    a: "ExcelでCSVを開く場合はUTF-8（BOM付き）を選んでください。日本語が文字化けせず正しく表示されます。プログラムやWebサービスに取り込む場合はUTF-8（BOMなし）が適しています。",
  },
  {
    q: "複数シートがある場合はどうなりますか？",
    a: "1シート目のデータのみ変換されます。2シート目以降は対象外です。",
  },
  {
    q: "機密情報を含むデータを変換しても大丈夫ですか？",
    a: "はい。すべての変換処理はブラウザ上で完結しており、アップロードしたファイルが外部サーバーに送信されることは一切ありません。",
  },
];

const GUIDE = {
  title: "文字コードとBOMについて",
  items: [
    {
      heading: "BOM（バイトオーダーマーク）とは",
      body: "BOMはファイルの先頭に付加される数バイトのデータで、そのファイルがUTF-8で書かれていることをExcelに伝える役割を持ちます。BOMなしのUTF-8ファイルをExcelで開くと日本語が文字化けしますが、BOM付きであれば正しく認識されます。",
    },
    {
      heading: "用途別の選び方",
      body: "変換したCSVをExcelで開いて編集する場合はUTF-8（BOM付き）を選んでください。PythonやNode.jsなどのプログラムで読み込む場合、またはWebサービスにインポートする場合はUTF-8（BOMなし）が適しています。BOMが原因で予期しない動作が起きることがあるためです。",
    },
    {
      heading: "Excelの文字コードの仕様",
      body: "WindowsのExcelはデフォルトでShift-JISを想定してCSVを開きます。このためUTF-8のCSVファイルをそのまま開くと「繧「繝ェ繧ケ」のように文字化けします。BOM付きUTF-8にすることでExcelがUTF-8と正しく判断し、日本語を正しく表示します。",
    },
  ],
};

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
    <ToolPageLayout>
      <ToolMeta title="Excel → CSV 変換" description="ExcelファイルをCSV形式に即時変換。UTF-8・BOM付き対応で日本語の文字化けなし。" />

      <ToolCard>
        {/* オプションバー */}
        <div style={{ padding: "11px 18px", borderBottom: `0.5px solid ${COLORS.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 10px", borderRadius: "6px", border: `0.5px solid ${COLORS.border}`, background: COLORS.bgOption }}>
            <span style={{ fontSize: "12px", color: COLORS.textSecondary }}>出力文字コード</span>
            <select value={encoding} onChange={(e) => setEncoding(e.target.value)} style={{ fontSize: "12px", color: COLORS.textPrimary, border: "none", background: "transparent", cursor: "pointer", outline: "none" }}>
              {ENCODING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label} — {opt.description}</option>
              ))}
            </select>
          </div>
          {fileName && (
            <button onClick={handleClear} style={{ fontSize: "12px", color: COLORS.textMuted, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", padding: 0 }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              クリア
            </button>
          )}
        </div>

        {/* ドロップエリア */}
        <div style={{ padding: "40px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: isDragging ? COLORS.accentBg : COLORS.bgOption, borderBottom: `0.5px solid ${COLORS.borderLight}`, cursor: "pointer", minHeight: "180px", position: "relative" }} onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)}>
          {fileName ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <svg width="32" height="32" viewBox="0 0 16 16" fill="none"><path d="M4 2h6l4 4v8a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke={COLORS.success} strokeWidth="1.2"/><path d="M9 2v4h4" stroke={COLORS.success} strokeWidth="1.2"/></svg>
              <span style={{ fontSize: "14px", fontWeight: 700, color: COLORS.textPrimary }}>{fileName}</span>
              <span style={{ fontSize: "12px", color: COLORS.textSecondary }}>別のファイルをドロップして置き換えできます</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <svg width="36" height="36" viewBox="0 0 16 16" fill="none"><path d="M8 2v9M4 7l4 4 4-4M2 13h12" stroke={isDragging ? COLORS.accent : COLORS.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: isDragging ? COLORS.accent : COLORS.textPrimary, margin: "0 0 4px" }}>
                  {isDragging ? "ここにドロップ" : "Excelファイルをドロップ"}
                </p>
                <p style={{ fontSize: "12px", color: COLORS.textMuted, margin: 0 }}>.xlsx / .xls に対応</p>
              </div>
              <label style={{ fontSize: "12px", padding: "6px 16px", borderRadius: "6px", border: `0.5px solid ${COLORS.border}`, background: COLORS.bgCard, color: COLORS.textPrimary, cursor: "pointer", fontWeight: 500 }}>
                ファイルを選択
                <input type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
              </label>
            </div>
          )}
          {isDragging && (
            <div style={{ position: "absolute", inset: 0, border: `2px dashed ${COLORS.accent}`, borderRadius: "4px", pointerEvents: "none" }} />
          )}
        </div>

        {/* 出力エリア */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "10px 16px", borderBottom: `0.5px solid ${COLORS.borderLight}`, background: COLORS.bgOption, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: COLORS.textPrimary }}>CSV 出力</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button onClick={handleDownload} disabled={!csvOutput} style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "6px", border: "none", cursor: csvOutput ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: "5px", fontWeight: 600, background: csvOutput ? COLORS.successBg : COLORS.bgOption, color: csvOutput ? COLORS.successText : COLORS.textMuted }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ダウンロード
              </button>
              <button onClick={handleCopy} disabled={!csvOutput} style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "6px", border: "none", cursor: csvOutput ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: "5px", fontWeight: 600, background: copied ? COLORS.successBg : csvOutput ? COLORS.accent : COLORS.bgOption, color: copied ? COLORS.successText : csvOutput ? COLORS.bgCard : COLORS.textMuted }}>
                {copied ? (
                  <><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>コピーしました</>
                ) : (
                  <><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" strokeWidth="1.5"/></svg>コピー</>
                )}
              </button>
            </div>
          </div>
          <textarea style={{ width: "100%", height: "240px", padding: "14px 16px", fontFamily: FONTS.mono, fontSize: "13px", lineHeight: "1.7", color: COLORS.textPrimary, resize: "none", border: "none", outline: "none", background: COLORS.bgOutput, boxSizing: "border-box" }} readOnly value={csvOutput} placeholder="変換結果がここに表示されます" />
        </div>

        {/* ステータスバー */}
        <div style={{ padding: "9px 18px", borderTop: `0.5px solid ${COLORS.borderLight}`, background: COLORS.bgOption, display: "flex", alignItems: "center", gap: "6px" }}>
          {error ? (
            <><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v4M8 11v.01" stroke={COLORS.error} strokeWidth="1.5" strokeLinecap="round"/></svg><span style={{ fontSize: "12px", color: COLORS.error }}>{error}</span></>
          ) : stats ? (
            <><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke={COLORS.success} strokeWidth="2" strokeLinecap="round"/></svg><span style={{ fontSize: "12px", color: COLORS.textSecondary }}>{stats.rows}行 × {stats.cols}列 を変換しました</span></>
          ) : (
            <><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v4M8 11v.01" stroke={COLORS.textMuted} strokeWidth="1.5" strokeLinecap="round"/></svg><span style={{ fontSize: "12px", color: COLORS.textMuted }}>入力データはサーバーに送信されません。機密情報も安心してご利用いただけます。</span></>
          )}
        </div>
      </ToolCard>

      <ToolDivider />
      <StepList steps={STEPS} />
      <FaqList items={FAQ} />
      <ToolGuide title={GUIDE.title} items={GUIDE.items} />
      <section style={{ marginBottom: "36px" }}>
        <ToolLinks current="/excel-to-csv" reverse="/csv-to-excel" reverseLabel="CSV → Excel 変換" />
      </section>
      <ToolAbout>
        ExcelファイルをCSV形式に変換するブラウザ完結ツールです。UTF-8（BOM付き）に対応しており、日本語の文字化けを防いでCSVを出力できます。WebサービスへのインポートやCSVとしての再保存にご活用ください。
      </ToolAbout>
    </ToolPageLayout>
  );
}