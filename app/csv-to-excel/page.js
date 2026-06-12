"use client";

import { useState, useEffect } from "react";
import { downloadAsExcel } from "../lib/csvToExcel";
import ToolLinks from "../components/toolLinks";
import { downloadFile } from "../lib/download";
import { useWindowWidth } from "../hooks/useWindowWidth";
import ToolPageLayout from "../components/ToolPageLayout";
import ToolCard from "../components/ToolCard";
import ToolMeta from "../components/ToolMeta";
import ToolDivider from "../components/ToolDivider";
import StepList from "../components/StepList";
import FaqList from "../components/FaqList";
import ToolAbout from "../components/ToolAbout";
import ToolGuide from "../components/ToolGuide";
import { COLORS, FONTS } from "../lib/theme";

function replaceExtension(fileName, newExtension) {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot === -1) return `${fileName}.${newExtension}`;
  return `${fileName.slice(0, lastDot)}.${newExtension}`;
}

const SAMPLE_CSV = `name,age,city\nAlice,30,Tokyo\nBob,25,Osaka\n山田 太郎,28,名古屋`;

const STEPS = [
  "左のエリアにCSVを貼り付けるか、ファイルをドロップまたは「ファイルを開く」で読み込んでください",
  "「Excelダウンロード（.xlsx）」ボタンを押すとExcelファイルがダウンロードされます",
  "ダウンロードしたファイルはそのままExcelで開けます。日本語も文字化けしません",
];

const FAQ = [
  {
    q: "CSVをそのままExcelで開くと文字化けするのはなぜですか？",
    a: "ExcelはCSVファイルをShift-JISとして開こうとするため、UTF-8で保存されたCSVは文字化けすることがあります。このツールを使うことでその問題を回避できます。",
  },
  {
    q: "変換したExcelファイルで日本語が文字化けしませんか？",
    a: "はい、文字化けしません。出力するExcelファイル（.xlsx）はUnicode（UTF-8）で処理されるため、日本語・全角文字も正しく表示されます。",
  },
  {
    q: "機密情報を含むデータを変換しても大丈夫ですか？",
    a: "はい。すべての変換処理はブラウザ上で完結しており、入力データが外部サーバーに送信されることは一切ありません。",
  },
];

const GUIDE = {
  title: "CSVとExcelの文字コードについて",
  items: [
    {
      heading: "CSVをそのままExcelで開くと文字化けする理由",
      body: "ExcelはCSVファイルを開く際にShift-JIS（Windows標準の文字コード）として解釈しようとします。一方、多くのツールやWebサービスが出力するCSVはUTF-8形式です。この不一致が文字化けの原因です。このツールはCSVをExcelネイティブの.xlsx形式に変換するため、文字コードの問題が発生しません。",
    },
    {
      heading: ".xlsxと.csvの違い",
      body: ".csvはテキストデータのみを保持するシンプルなフォーマットです。一方、.xlsxはMicrosoft Officeのネイティブ形式で、書式・複数シート・数式などを扱えます。このツールはCSVのデータを.xlsx形式に変換して出力します。",
    },
  ],
};

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
    <ToolPageLayout>
      <ToolMeta title="CSV → Excel 変換" description="CSVを貼り付けるだけでExcelファイル（.xlsx）に即時変換。日本語の文字化けなし。" />

      <ToolCard>
        {/* オプションバー */}
        <div style={{ padding: "11px 18px", borderBottom: `0.5px solid ${COLORS.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <span style={{ fontSize: "12px", color: COLORS.textSecondary }}>CSVを貼り付けて「Excelダウンロード」ボタンを押してください</span>
          {!csvInput && (
            <button onClick={() => setCsvInput(SAMPLE_CSV)} style={{ fontSize: "12px", color: COLORS.accent, background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 500 }}>
              サンプルを試す →
            </button>
          )}
        </div>

        {/* 入力エリア */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "10px 16px", borderBottom: `0.5px solid ${COLORS.borderLight}`, background: COLORS.bgOption, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: COLORS.textPrimary }}>CSV 入力</span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {csvInput && (
                <button onClick={() => setCsvInput("")} style={{ fontSize: "12px", color: COLORS.textMuted, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", padding: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  クリア
                </button>
              )}
              <label style={{ fontSize: "12px", color: COLORS.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ファイルを開く
                <input type="file" accept=".csv,.tsv,.txt" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
              </label>
            </div>
          </div>
          <div style={{ position: "relative" }} onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)}>
            <textarea style={{ width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px", fontFamily: FONTS.mono, fontSize: "13px", lineHeight: "1.7", color: COLORS.textPrimary, resize: "none", border: "none", outline: "none", background: isDragging ? COLORS.accentBg : "transparent", boxSizing: "border-box" }} placeholder={"name,age,city\nAlice,30,Tokyo\n\nここにCSVを貼り付け\nまたはファイルをドロップ"} value={csvInput} onChange={(e) => setCsvInput(e.target.value)} />
            {isDragging && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `${COLORS.accentBg}ee`, border: `2px dashed ${COLORS.accent}`, borderRadius: "4px", pointerEvents: "none" }}>
                <span style={{ color: COLORS.accent, fontWeight: 600, fontSize: "14px" }}>ここにドロップ</span>
              </div>
            )}
          </div>
        </div>

        {/* ダウンロードバー */}
        <div style={{ padding: "12px 18px", borderTop: `0.5px solid ${COLORS.borderLight}`, background: COLORS.bgOption, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {error ? (
              <><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v4M8 11v.01" stroke={COLORS.error} strokeWidth="1.5" strokeLinecap="round"/></svg><span style={{ fontSize: "12px", color: COLORS.error }}>{error}</span></>
            ) : stats ? (
              <><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke={COLORS.success} strokeWidth="2" strokeLinecap="round"/></svg><span style={{ fontSize: "12px", color: COLORS.textSecondary }}>{stats.rows}行 × {stats.cols}列 を読み込みました</span></>
            ) : (
              <><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v4M8 11v.01" stroke={COLORS.textMuted} strokeWidth="1.5" strokeLinecap="round"/></svg><span style={{ fontSize: "12px", color: COLORS.textMuted }}>入力データはサーバーに送信されません。機密情報も安心してご利用いただけます。</span></>
            )}
          </div>
          <button onClick={handleDownload} disabled={!csvInput} style={{ fontSize: "13px", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: csvInput ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, background: csvInput ? COLORS.accent : COLORS.bgOption, color: csvInput ? COLORS.bgCard : COLORS.textMuted }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Excelダウンロード（.xlsx）
          </button>
        </div>
      </ToolCard>

      <ToolDivider />
      <StepList steps={STEPS} />
      <FaqList items={FAQ} />
      <ToolGuide title={GUIDE.title} items={GUIDE.items} />
      <section style={{ marginBottom: "36px" }}>
        <ToolLinks current="/csv-to-excel" reverse="/excel-to-csv" reverseLabel="Excel → CSV 変換" />
      </section>
      <ToolAbout>
        CSVデータをExcelファイル（.xlsx）に変換するブラウザ完結ツールです。日本語の文字化けを防いでExcelで開けるファイルを生成します。取引先へのExcel形式での納品や、CSVデータの編集にご活用ください。
      </ToolAbout>
    </ToolPageLayout>
  );
}