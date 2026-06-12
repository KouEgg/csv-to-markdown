"use client";

import { useState } from "react";
import { csvToJson } from "../lib/csvToJson";
import * as XLSX from "xlsx";
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

const SAMPLE_CSV = `name,age,city\nAlice,30,Tokyo\nBob,25,Osaka\n山田 太郎,28,名古屋`;

const STEPS = [
  "左のエリアにCSVを貼り付けるか、ファイルをドロップして読み込んでください。ExcelファイルはそのままドロップするかExcelファイルを開くで選択できます（.xlsx / .xls対応）",
  "Excelのセルをコピーして貼り付ける場合は区切り文字を「タブ」に切り替えてください",
  "右側にJSONが即時表示されます。「コピー」または「ダウンロード」で取り出してください",
];

const FAQ = [
  {
    q: "ヘッダーなしのCSVはどうなりますか？",
    a: "「1行目をヘッダーとして扱う」をオフにすると、column1, column2...と自動的に列名が付きます。",
  },
  {
    q: "ExcelファイルをそのままJSONに変換できますか？",
    a: "はい。.xlsxまたは.xlsファイルをドロップするか「ファイルを開く」で選択してください。1シート目の内容が自動的に読み込まれJSONに変換されます。",
  },
  {
    q: "機密情報を含むデータを変換しても大丈夫ですか？",
    a: "はい。すべての変換処理はブラウザ上で完結しており、入力データが外部サーバーに送信されることは一切ありません。",
  },
];

const GUIDE = {
  title: "CSVとJSONの変換について",
  items: [
    {
      heading: "CSVをJSONに変換する用途",
      body: "ExcelやCSVのデータをWebアプリやAPIに渡したいとき、データベースへのインポート用にJSON形式に変換したいときに活用できます。1行目のヘッダーがJSONのキーになり、各データ行がオブジェクトとして出力されます。",
    },
    {
      heading: "数値・真偽値の型変換",
      body: "CSVはすべての値を文字列として扱いますが、このツールでは数値として解釈できる値は自動的に数値型に変換します。たとえば「30」は文字列の \"30\" ではなく数値の 30 としてJSONに出力されます。",
    },
    {
      heading: "Excelからコピペするときの注意点",
      body: "Excelでセルをコピーして貼り付けると区切り文字は「タブ」になります。貼り付け後に変換結果がおかしい場合は、オプションバーの区切り文字を「タブ」に切り替えてください。Excelファイルをそのままドロップする場合はこの操作は不要です。",
    },
  ],
};

export default function CsvToJsonPage() {
  const [csvInput, setCsvInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [hasHeader, setHasHeader] = useState(true);
  const [delimiter, setDelimiter] = useState(",");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const isMobile = useWindowWidth() < 768;

  const { json: jsonOutput, error, rows, cols } = csvToJson(csvInput, { hasHeader, delimiter });

  const handleCopy = () => {
    if (!jsonOutput) return;
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!jsonOutput) return;
    downloadFile(jsonOutput, fileName, "json", "application/json;charset=utf-8;");
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

  return (
    <ToolPageLayout>
      <ToolMeta title="CSV → JSON 変換" description="CSVを貼り付けるだけでJSONに即時変換。Excel対応・ヘッダーオプション付き。" />

      <ToolCard>
        {/* オプションバー */}
        <div style={{ padding: "11px 18px", borderBottom: `0.5px solid ${COLORS.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>

            {/* ヘッダートグル */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 10px", borderRadius: "6px", border: `0.5px solid ${COLORS.border}`, background: COLORS.bgOption }}>
              <span style={{ fontSize: "12px", color: COLORS.textPrimary }}>1行目をヘッダーとして扱う</span>
              <div onClick={() => setHasHeader(!hasHeader)} style={{ width: "32px", height: "18px", borderRadius: "9px", background: hasHeader ? COLORS.accent : COLORS.borderLight, display: "flex", alignItems: "center", padding: "2px", boxSizing: "border-box", cursor: "pointer", flexShrink: 0 }}>
                <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: COLORS.bgCard, marginLeft: hasHeader ? "auto" : "0", boxShadow: "0 1px 2px rgba(0,0,0,0.15)" }} />
              </div>
            </div>

            {/* 区切り文字 */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 10px", borderRadius: "6px", border: `0.5px solid ${COLORS.border}`, background: COLORS.bgOption }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 5h12M2 8h8M2 11h10" stroke={COLORS.textSecondary} strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span style={{ fontSize: "12px", color: COLORS.textSecondary }}>区切り文字</span>
              <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} style={{ fontSize: "12px", color: COLORS.textPrimary, border: "none", background: "transparent", cursor: "pointer", outline: "none" }}>
                <option value=",">カンマ（,）</option>
                <option value={"\t"}>タブ</option>
                <option value=";">セミコロン（;）</option>
              </select>
            </div>
          </div>

          {!csvInput && (
            <button onClick={() => setCsvInput(SAMPLE_CSV)} style={{ fontSize: "12px", color: COLORS.accent, background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 500 }}>
              サンプルを試す →
            </button>
          )}
        </div>

        {/* 入力・出力 2カラム */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>

          {/* 左：入力 */}
          <div style={{ borderRight: isMobile ? "none" : `0.5px solid ${COLORS.borderLight}`, borderBottom: isMobile ? `0.5px solid ${COLORS.borderLight}` : "none", display: "flex", flexDirection: "column" }}>
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
                  <input type="file" accept=".csv,.tsv,.txt,.xlsx,.xls" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
                </label>
              </div>
            </div>
            <div style={{ position: "relative", flex: 1 }} onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)}>
              <textarea style={{ width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px", fontFamily: FONTS.mono, fontSize: "13px", lineHeight: "1.7", color: COLORS.textPrimary, resize: "none", border: "none", outline: "none", background: isDragging ? COLORS.accentBg : "transparent", boxSizing: "border-box" }} placeholder={"name,age,city\nAlice,30,Tokyo\n\nここにCSVを貼り付け\nまたはファイルをドロップ"} value={csvInput} onChange={(e) => setCsvInput(e.target.value)} />
              {isDragging && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `${COLORS.accentBg}ee`, border: `2px dashed ${COLORS.accent}`, borderRadius: "4px", pointerEvents: "none" }}>
                  <span style={{ color: COLORS.accent, fontWeight: 600, fontSize: "14px" }}>ここにドロップ</span>
                </div>
              )}
            </div>
          </div>

          {/* 右：出力 */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 16px", borderBottom: `0.5px solid ${COLORS.borderLight}`, background: COLORS.bgOption, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: COLORS.textPrimary }}>JSON 出力</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button onClick={handleDownload} disabled={!jsonOutput} style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "6px", border: "none", cursor: jsonOutput ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: "5px", fontWeight: 600, background: jsonOutput ? COLORS.successBg : COLORS.bgOption, color: jsonOutput ? COLORS.successText : COLORS.textMuted }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ダウンロード
                </button>
                <button onClick={handleCopy} disabled={!jsonOutput} style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "6px", border: "none", cursor: jsonOutput ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: "5px", fontWeight: 600, background: copied ? COLORS.successBg : jsonOutput ? COLORS.accent : COLORS.bgOption, color: copied ? COLORS.successText : jsonOutput ? COLORS.bgCard : COLORS.textMuted }}>
                  {copied ? (
                    <><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>コピーしました</>
                  ) : (
                    <><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" strokeWidth="1.5"/></svg>コピー</>
                  )}
                </button>
              </div>
            </div>
            <textarea style={{ width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px", fontFamily: FONTS.mono, fontSize: "13px", lineHeight: "1.7", color: COLORS.textPrimary, resize: "none", border: "none", outline: "none", background: COLORS.bgOutput, boxSizing: "border-box" }} readOnly value={jsonOutput} placeholder="変換結果がここに表示されます" />
          </div>
        </div>

        {/* ステータスバー */}
        <div style={{ padding: "9px 18px", borderTop: `0.5px solid ${COLORS.borderLight}`, background: COLORS.bgOption, display: "flex", alignItems: "center", gap: "6px" }}>
          {error ? (
            <><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v4M8 11v.01" stroke={COLORS.error} strokeWidth="1.5" strokeLinecap="round"/></svg><span style={{ fontSize: "12px", color: COLORS.error }}>{error}</span></>
          ) : rows > 0 ? (
            <><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke={COLORS.success} strokeWidth="2" strokeLinecap="round"/></svg><span style={{ fontSize: "12px", color: COLORS.textSecondary }}>{rows}行 × {cols}列 を変換しました</span></>
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
        <ToolLinks current="/csv-to-json" reverse="/json-to-csv" reverseLabel="JSON → CSV 変換" />
      </section>
      <ToolAbout>
        CSVやExcelのデータをJSON形式に変換するブラウザ完結ツールです。WebアプリやAPIへのデータ連携、データベースへのインポートなど幅広い用途に活用できます。
      </ToolAbout>
    </ToolPageLayout>
  );
}