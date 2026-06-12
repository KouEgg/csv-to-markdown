"use client";

import { useState } from "react";
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

const SAMPLE_JSON = `{"name":"Alice","age":30,"address":{"city":"Tokyo","zip":"100-0001"},"hobbies":["reading","coding"]}`;

function formatJson(input, mode) {
  if (!input.trim()) return { output: "", error: null };
  try {
    const parsed = JSON.parse(input);
    if (mode === "compress") return { output: JSON.stringify(parsed), error: null };
    return { output: JSON.stringify(parsed, null, 2), error: null };
  } catch (e) {
    return { output: "", error: e.message };
  }
}

const STEPS = [
  "左のエリアにJSONを貼り付けるか、JSONファイルをドロップまたは「ファイルを開く」で読み込んでください",
  "「整形」モードでは見やすくインデントされたJSON、「圧縮」モードではスペース・改行を除去したコンパクトなJSONが出力されます",
  "「コピー」または「ダウンロード」で取り出してください。JSONに誤りがある場合はエラー内容が表示されます",
];

const FAQ = [
  {
    q: "整形と圧縮の違いは何ですか？",
    a: "整形はインデントと改行を加えて人間が読みやすい形式に変換します。圧縮は逆にスペースや改行を除去してデータサイズを小さくします。APIに送信するときやファイルサイズを減らしたいときに圧縮が便利です。",
  },
  {
    q: "バリデーションとは何ですか？",
    a: "入力したJSONが正しい形式かどうかを自動でチェックする機能です。構文エラーがある場合はエラー内容が表示されます。",
  },
  {
    q: "機密情報を含むJSONを貼り付けても大丈夫ですか？",
    a: "はい。すべての処理はブラウザ上で完結しており、入力データが外部サーバーに送信されることは一切ありません。",
  },
];

const GUIDE = {
  title: "JSONの整形・圧縮について",
  items: [
    {
      heading: "JSONを整形する用途",
      body: "APIのレスポンスや設定ファイルのJSONは、1行に詰め込まれていることが多くそのままでは読みにくいです。整形モードでインデントを加えることで、データの構造を視覚的に把握しやすくなります。デバッグ時やログの確認時に特に便利です。",
    },
    {
      heading: "JSONを圧縮する用途",
      body: "整形されたJSONをソースコードに埋め込んだり、APIのリクエストボディとして送信したりする際は、改行やスペースを除去した圧縮形式が適しています。ファイルサイズの削減にも効果があります。",
    },
    {
      heading: "よくあるJSONの構文エラー",
      body: "JSONでよくある間違いは、末尾のカンマ（trailing comma）、シングルクォートの使用、キーをクォートで囲み忘れることです。JavaScriptのオブジェクト記法とは異なり、JSONではキーも必ずダブルクォートで囲む必要があります。エラーが出た場合はエラーメッセージの行番号を確認してください。",
    },
  ],
};

export default function JsonFormatterPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [mode, setMode] = useState("format");
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useWindowWidth() < 768;

  const { output, error } = formatJson(jsonInput, mode);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    downloadFile(output, null, "json", "application/json;charset=utf-8;");
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setJsonInput(e.target.result);
    reader.readAsText(file, "UTF-8");
  };

  const isValid = jsonInput.trim() && !error;

  return (
    <ToolPageLayout>
      <ToolMeta title="JSON整形・バリデーター" description="JSONを貼り付けるだけで即時整形・バリデーション。圧縮モード対応。" />

      <ToolCard>
        {/* オプションバー */}
        <div style={{ padding: "11px 18px", borderBottom: `0.5px solid ${COLORS.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 10px", borderRadius: "6px", border: `0.5px solid ${COLORS.border}`, background: COLORS.bgOption }}>
            <span style={{ fontSize: "12px", color: COLORS.textSecondary }}>モード</span>
            <div style={{ display: "flex", background: COLORS.bg, borderRadius: "4px", padding: "2px", gap: "1px" }}>
              {[{ value: "format", label: "整形" }, { value: "compress", label: "圧縮" }].map((opt) => (
                <button key={opt.value} onClick={() => setMode(opt.value)} style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "3px", border: "none", cursor: "pointer", fontWeight: 500, background: mode === opt.value ? COLORS.bgCard : "transparent", color: mode === opt.value ? COLORS.textPrimary : COLORS.textMuted }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
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
              <textarea style={{ width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px", fontFamily: FONTS.mono, fontSize: "13px", lineHeight: "1.7", color: COLORS.textPrimary, resize: "none", border: "none", outline: "none", background: isDragging ? COLORS.accentBg : "transparent", boxSizing: "border-box" }} placeholder={"{\n  \"name\": \"Alice\",\n  \"age\": 30\n}\n\nここにJSONを貼り付け\nまたはファイルをドロップ"} value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} />
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
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: COLORS.textPrimary }}>
                  {mode === "format" ? "整形結果" : "圧縮結果"}
                </span>
                {jsonInput.trim() && (
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", fontWeight: 600, background: error ? "#fef2f2" : COLORS.successBg, color: error ? COLORS.error : COLORS.successText }}>
                    {error ? "❌ エラー" : "✓ 有効なJSON"}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button onClick={handleDownload} disabled={!output} style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "6px", border: "none", cursor: output ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: "5px", fontWeight: 600, background: output ? COLORS.successBg : COLORS.bgOption, color: output ? COLORS.successText : COLORS.textMuted }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {!isMobile && "ダウンロード"}
                </button>
                <button onClick={handleCopy} disabled={!output} style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "6px", border: "none", cursor: output ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: "5px", fontWeight: 600, background: copied ? COLORS.successBg : output ? COLORS.accent : COLORS.bgOption, color: copied ? COLORS.successText : output ? COLORS.bgCard : COLORS.textMuted }}>
                  {copied ? (
                    <><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>{!isMobile && "コピーしました"}</>
                  ) : (
                    <><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" strokeWidth="1.5"/></svg>{!isMobile && "コピー"}</>
                  )}
                </button>
              </div>
            </div>
            <textarea style={{ width: "100%", height: isMobile ? "240px" : "320px", padding: "14px 16px", fontFamily: FONTS.mono, fontSize: "13px", lineHeight: "1.7", color: error ? COLORS.error : COLORS.textPrimary, resize: "none", border: "none", outline: "none", background: COLORS.bgOutput, boxSizing: "border-box" }} readOnly value={error ? `エラー: ${error}` : output} placeholder="整形結果がここに表示されます" />
          </div>
        </div>

        {/* ステータスバー */}
        <div style={{ padding: "9px 18px", borderTop: `0.5px solid ${COLORS.borderLight}`, background: COLORS.bgOption, display: "flex", alignItems: "center", gap: "6px" }}>
          {error ? (
            <><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v4M8 11v.01" stroke={COLORS.error} strokeWidth="1.5" strokeLinecap="round"/></svg><span style={{ fontSize: "12px", color: COLORS.error }}>JSONの形式が正しくありません。入力内容を確認してください。</span></>
          ) : isValid ? (
            <><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke={COLORS.success} strokeWidth="2" strokeLinecap="round"/></svg><span style={{ fontSize: "12px", color: COLORS.textSecondary }}>有効なJSONです</span></>
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
        <ToolLinks current="/json-formatter" />
      </section>
      <ToolAbout>
        JSONデータを即時整形・検証できるブラウザ完結ツールです。APIレスポンスの確認、設定ファイルの編集、JSONの構文エラー調査など幅広い用途に活用できます。
      </ToolAbout>
    </ToolPageLayout>
  );
}