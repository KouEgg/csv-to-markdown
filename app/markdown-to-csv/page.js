"use client";

import { useState, useEffect } from "react";
import { markdownToCsv } from "../lib/markdownToCsv";
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

const SAMPLE_MD = `| name | age | city |
| --- | --- | --- |
| Alice | 30 | Tokyo |
| Bob | 25 | Osaka |
| 山田 太郎 | 28 | 名古屋 |`;

const STEPS = [
  "左のエリアにMarkdownテーブルを貼り付けるか、.mdファイルをドロップまたは「ファイルを開く」で読み込んでください",
  "右側にCSVが即時表示されます",
  "「コピー」または「ダウンロード」で取り出してください",
];

const FAQ = [
  {
    q: "どんなMarkdownテーブル形式に対応していますか？",
    a: "標準的なMarkdownテーブル形式（| で区切られた形式）に対応しています。整列指定（:---:等）のセパレーター行は自動的に除外されます。",
  },
  {
    q: "日本語を含むMarkdownテーブルは変換できますか？",
    a: "はい。全角文字・日本語を含むMarkdownテーブルも正確に変換できます。",
  },
  {
    q: "機密情報を含むデータを変換しても大丈夫ですか？",
    a: "はい。すべての変換処理はブラウザ上で完結しており、入力データが外部サーバーに送信されることは一切ありません。",
  },
];

const GUIDE = {
  title: "Markdownテーブルについて",
  items: [
    {
      heading: "Markdownテーブルの構造",
      body: "Markdownテーブルはパイプ（|）で列を区切り、2行目にハイフン（---）のセパレーター行を置く形式です。GitHubのREADMEやNotionのドキュメントなど、Markdownを採用したプラットフォームで広く使われています。このツールはセパレーター行を自動検出して除外し、データ行だけをCSVに変換します。",
    },
    {
      heading: "CSVに戻す用途",
      body: "GitHubやNotionからデータをExcelやスプレッドシートに戻したいとき、Markdownで管理していたテーブルをデータベースにインポートしたいときなどに活用できます。逆方向の変換（CSV → Markdown）は「CSV → Markdown 変換」ツールをご利用ください。",
    },
  ],
};

export default function MarkdownToCsvPage() {
  const [mdInput, setMdInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [stats, setStats] = useState(null);
  const [fileName, setFileName] = useState(null);
  const isMobile = useWindowWidth() < 768;

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

  return (
    <ToolPageLayout>
      <ToolMeta title="Markdown → CSV 変換" description="MarkdownテーブルをCSV形式に即時変換。GitHubやNotionのテーブルをそのまま貼り付けて使えます。" />

      <ToolCard>
        <div style={{ padding: "11px 18px", borderBottom: `0.5px solid ${COLORS.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <span style={{ fontSize: "12px", color: COLORS.textSecondary }}>Markdownテーブルを貼り付けてください</span>
          {!mdInput && (
            <button onClick={() => setMdInput(SAMPLE_MD)} style={{ fontSize: "12px", color: COLORS.accent, background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 500 }}>
              サンプルを試す →
            </button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
          <div style={{ borderRight: isMobile ? "none" : `0.5px solid ${COLORS.borderLight}`, borderBottom: isMobile ? `0.5px solid ${COLORS.borderLight}` : "none", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 16px", borderBottom: `0.5px solid ${COLORS.borderLight}`, background: COLORS.bgOption, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: COLORS.textPrimary }}>Markdown 入力</span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {mdInput && (
                  <button onClick={() => setMdInput("")} style={{ fontSize: "12px", color: COLORS.textMuted, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", padding: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    クリア
                  </button>
                )}
                <label style={{ fontSize: "12px", color: COLORS.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ファイルを開く
                  <input type="file" accept=".md,.txt" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
                </label>
              </div>
            </div>
            <div style={{ position: "relative", flex: 1 }} onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)}>
              <textarea style={{ width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px", fontFamily: FONTS.mono, fontSize: "13px", lineHeight: "1.7", color: COLORS.textPrimary, resize: "none", border: "none", outline: "none", background: isDragging ? COLORS.accentBg : "transparent", boxSizing: "border-box" }} placeholder={"| name | age | city |\n| --- | --- | --- |\n| Alice | 30 | Tokyo |"} value={mdInput} onChange={(e) => setMdInput(e.target.value)} />
              {isDragging && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `${COLORS.accentBg}ee`, border: `2px dashed ${COLORS.accent}`, borderRadius: "4px", pointerEvents: "none" }}>
                  <span style={{ color: COLORS.accent, fontWeight: 600, fontSize: "14px" }}>ここにドロップ</span>
                </div>
              )}
            </div>
          </div>

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

        <div style={{ padding: "9px 18px", borderTop: `0.5px solid ${COLORS.borderLight}`, background: COLORS.bgOption, display: "flex", alignItems: "center", gap: "6px" }}>
          {stats ? (
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
        <ToolLinks current="/markdown-to-csv" reverse="/csv-to-markdown" reverseLabel="CSV → Markdown 変換" />
      </section>
      <ToolAbout>
        MarkdownテーブルをCSV形式に変換するブラウザ完結ツールです。GitHubのREADMEやNotionからデータをExcelやスプレッドシートに戻したいときに活用できます。
      </ToolAbout>
    </ToolPageLayout>
  );
}