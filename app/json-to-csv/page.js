"use client";

import { useState } from "react";
import { jsonToCsv } from "../lib/jsonToCsv";
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

const SAMPLE_JSON = `[
  { "name": "Alice", "age": 30, "city": "Tokyo" },
  { "name": "Bob", "age": 25, "city": "Osaka" },
  { "name": "山田 太郎", "age": 28, "city": "名古屋" }
]`;

const STEPS = [
  "左のエリアにJSON配列を貼り付けるか、JSONファイルをドロップまたは「ファイルを開く」で読み込んでください",
  "右側にCSVが即時表示されます",
  "「コピー」または「ダウンロード」で取り出してください",
];

const FAQ = [
  {
    q: "どんな形式のJSONに対応していますか？",
    a: "オブジェクトの配列形式（[ { ... }, { ... } ]）に対応しています。各オブジェクトのキーがCSVのヘッダーになります。",
  },
  {
    q: "ネストしたJSONも変換できますか？",
    a: "はい。{ \"address\": { \"city\": \"Tokyo\" } } のようなネスト構造は「address.city」のようにドット記法でフラット化してCSVの列に変換します。",
  },
  {
    q: "機密情報を含むデータを変換しても大丈夫ですか？",
    a: "はい。すべての変換処理はブラウザ上で完結しており、入力データが外部サーバーに送信されることは一切ありません。",
  },
];

const GUIDE = {
  title: "JSONとCSVの変換について",
  items: [
    {
      heading: "JSONをCSVに変換する用途",
      body: "APIのレスポンスをExcelで分析したいとき、JSONデータをデータベースやスプレッドシートにインポートしたいときに活用できます。JSON配列の各オブジェクトが1行のCSVレコードに対応します。",
    },
    {
      heading: "ネスト構造の自動フラット化",
      body: "{ \"user\": { \"name\": \"Alice\", \"age\": 30 } } のようなネストされたオブジェクトは「user.name」「user.age」のようにドット記法でフラット化されます。また { \"tags\": [\"a\", \"b\"] } のような配列値は文字列に変換されます。",
    },
    {
      heading: "キーが異なるオブジェクトが混在する場合",
      body: "配列内のオブジェクトでキーが異なる場合でも、すべてのキーを収集してヘッダーを自動生成します。値が存在しないセルは空白になります。",
    },
  ],
};

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
    <ToolPageLayout>
      <ToolMeta title="JSON → CSV 変換" description="JSONデータを貼り付けるだけでCSVに即時変換。ネスト・階層構造のJSONも自動フラット化。" />

      <ToolCard>
        {/* オプションバー */}
        <div style={{ padding: "11px 18px", borderBottom: `0.5px solid ${COLORS.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <span style={{ fontSize: "12px", color: COLORS.textSecondary }}>JSON配列形式（[ &#123; ... &#125;, &#123; ... &#125; ]）を入力してください</span>
          {!jsonInput && (
            <button onClick={() => setJsonInput(SAMPLE_JSON)} style={{ fontSize: "12px", color: COLORS.accent, background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 500 }}>
              サンプルを試す →
            </button>
          )}
        </div>

        {/* 入力・出力 2カラム */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>

          {/* 左：入力 */}
          <div style={{ borderRight: isMobile ? "none" : `0.5px solid ${COLORS.borderLight}`, borderBottom: isMobile ? `0.5px solid ${COLORS.borderLight}` : "none", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 16px", borderBottom: `0.5px solid ${COLORS.borderLight}`, background: COLORS.bgOption, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: COLORS.textPrimary }}>JSON 入力</span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {jsonInput && (
                  <button onClick={() => setJsonInput("")} style={{ fontSize: "12px", color: COLORS.textMuted, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", padding: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    クリア
                  </button>
                )}
                <label style={{ fontSize: "12px", color: COLORS.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ファイルを開く
                  <input type="file" accept=".json" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
                </label>
              </div>
            </div>
            <div style={{ position: "relative", flex: 1 }} onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)}>
              <textarea style={{ width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px", fontFamily: FONTS.mono, fontSize: "13px", lineHeight: "1.7", color: COLORS.textPrimary, resize: "none", border: "none", outline: "none", background: isDragging ? COLORS.accentBg : "transparent", boxSizing: "border-box" }} placeholder={"[\n  { \"name\": \"Alice\", \"age\": 30 },\n  { \"name\": \"Bob\", \"age\": 25 }\n]\n\nここにJSONを貼り付け\nまたはファイルをドロップ"} value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} />
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
            <textarea style={{ width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px", fontFamily: FONTS.mono, fontSize: "13px", lineHeight: "1.7", color: COLORS.textPrimary, resize: "none", border: "none", outline: "none", background: COLORS.bgOutput, boxSizing: "border-box" }} readOnly value={csvOutput} placeholder="変換結果がここに表示されます" />
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
        <ToolLinks current="/json-to-csv" reverse="/csv-to-json" reverseLabel="CSV → JSON 変換" />
      </section>
      <ToolAbout>
        JSONデータをCSV形式に変換するブラウザ完結ツールです。APIレスポンスやJSONファイルをExcelやGoogle Sheetsで開きたいときに便利です。ネスト構造のJSONも自動的にフラット化して変換します。
      </ToolAbout>
    </ToolPageLayout>
  );
}