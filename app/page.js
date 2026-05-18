"use client";

import { useState } from "react";
import { csvToMarkdown } from "./lib/csvToMarkdown";

export default function Home() {
  const [csvInput, setCsvInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [hasHeader, setHasHeader] = useState(true);
  const [delimiter, setDelimiter] = useState(",");

  const markdownOutput = csvToMarkdown(csvInput, { hasHeader, delimiter });

  const handleCopy = () => {
    if (!markdownOutput) return;
    navigator.clipboard.writeText(markdownOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setCsvInput(e.target.result);
    reader.readAsText(file, "UTF-8");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setCsvInput(e.target.result);
    reader.readAsText(file, "UTF-8");
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          CSV → Markdown テーブル変換
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          CSVを貼り付けるとリアルタイムでMarkdownテーブルに変換します
        </p>

        {/* オプション */}
        <div className="flex gap-6 mb-4 p-3 bg-white border border-gray-200 rounded-lg">
          {/* ヘッダー行 */}
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={hasHeader}
              onChange={(e) => setHasHeader(e.target.checked)}
              className="w-4 h-4 accent-blue-500"
            />
            1行目をヘッダーとして扱う
          </label>

          {/* 区切り文字 */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>区切り文字：</span>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="border border-gray-300 rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value=",">カンマ（,）</option>
              <option value={"\t"}>タブ</option>
              <option value=";">セミコロン（;）</option>
            </select>
          </div>
        </div>

        {/* メインエリア */}
        <div className="grid grid-cols-2 gap-4">
          {/* 左：入力 */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                CSV入力
              </label>
              <label className="text-sm px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer transition-colors">
                ファイルを選択
                <input
                  type="file"
                  accept=".csv,.tsv,.txt"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
            <textarea
              className="w-full h-96 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={"name,age,city\nAlice,30,Tokyo\nBob,25,Osaka"}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            />
            <p className="text-xs text-gray-400">
              CSVファイルをここにドロップすることもできます
            </p>
          </div>

          {/* 右：出力 */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                Markdown出力
              </label>
              <button
                onClick={handleCopy}
                disabled={!markdownOutput}
                className="text-sm px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {copied ? "コピーしました ✓" : "コピー"}
              </button>
            </div>
            <textarea
              className="w-full h-96 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none bg-white focus:outline-none"
              readOnly
              value={markdownOutput}
              placeholder="変換結果がここに表示されます"
            />
          </div>
        </div>
      </div>
    {/* 使い方・SEOテキスト */}
      <div className="max-w-6xl mx-auto mt-12 space-y-8 text-sm text-gray-600">
        {/* 使い方 */}
        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">使い方</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>左のエリアにCSVテキストを貼り付けるか、CSVファイルをドロップしてください</li>
            <li>右側にMarkdownテーブルが即時表示されます</li>
            <li>「コピー」ボタンでクリップボードにコピーできます</li>
            <li>1行目をヘッダーとして扱わない場合はチェックボックスを外してください</li>
            <li>Excelからコピーした場合は区切り文字を「タブ」に切り替えてください</li>
          </ol>
        </section>

        {/* よくある質問 */}
        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">よくある質問</h2>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-700">Excelの表をMarkdownに変換できますか？</p>
              <p className="mt-1">はい。Excelでセルを選択してコピーし、左のエリアに貼り付けてください。区切り文字を「タブ」に切り替えると正しく変換されます。</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">日本語を含むCSVは変換できますか？</p>
              <p className="mt-1">はい。全角文字・日本語を含むCSVも正確に変換できます。</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">入力したデータはサーバーに送信されますか？</p>
              <p className="mt-1">いいえ。すべての変換処理はブラウザ上で完結しています。入力データがサーバーに送信されることはありません。</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">どんな用途に使えますか？</p>
              <p className="mt-1">GitHubのREADME、Notionのドキュメント、Obsidianのノート、技術仕様書など、Markdownを使う場面全般で活用できます。</p>
            </div>
          </div>
        </section>

        {/* このツールについて */}
        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">このツールについて</h2>
          <p className="leading-relaxed">
            CSV→Markdownテーブル変換ツールは、CSVデータをMarkdown形式のテーブルに即時変換する無料のオンラインツールです。
            貼り付けるだけでリアルタイムに変換され、ワンクリックでコピーできます。
            ヘッダー行の有無や区切り文字（カンマ・タブ・セミコロン）の切り替えにも対応しています。
            登録不要・完全無料でご利用いただけます。
          </p>
        </section>
      </div>
    </main>
  );
}