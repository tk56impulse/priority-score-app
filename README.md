This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



# 優先順位スコアアプリ

## 1. アプリ概要
- **目的**：タスクの優先順位をスコア化して視覚的に確認できるようにする
- **想定ユーザー**：自分／チームでタスク管理したい人
- **画面構成**：
  - タスク入力ページ（タスク名・スコア入力、追加・削除ボタン、合計スコア表示）
  - 結果ページ（スコア順に色分け表示、削除可能、合計スコア表示、入力ページに戻るボタン）

## 2. 機能一覧

| 機能 | 内容 | UI要素 | 備考 |
|------|------|-------|------|
| タスク追加 | 新しいタスクを追加 | 「タスク追加」ボタン | 入力フォーム横に追加 |
| タスク削除 | 任意のタスクを削除 | 「削除」ボタン | 入力・結果ページともに可 |
| スコア入力 | タスクごとにスコアを入力 | 数値入力フォーム | 合計スコアに反映 |
| 合計スコア表示 | 現在のタスク合計スコア | ページ上部に表示 | リアルタイム更新 |
| 色分け表示 | スコア順に背景色をグラデーション表示 | タスク行背景 | 高スコア→赤、低スコア→緑 |
| 結果画面遷移 | 入力データをAPI経由で結果ページに送信 | 「送信」ボタン | URL パラメータでタスクデータ渡す |
| ページ遷移 | 入力画面と結果画面を行き来 | 「タスク入力に戻る」ボタン | React Router / Next.js router使用 |

## 3. 技術スタック
- **フロントエンド**：Next.js 16 + TypeScript  
- **状態管理**：React `useState`  
- **ルーティング**：Next.js App Router (`app/page.tsx`, `app/result/page.tsx`)  
- **API**：Next.js API Route (`app/api/score/route.ts`)  
- **バージョン管理**：Git / GitHub  
- **スタイル**：CSSインライン（簡易）＋レスポンシブ対応  
- **動作環境**：ブラウザ（ローカルサーバー localhost:3000）  

## 4. 開発上の工夫・ポイント
- **型安全**：TypeScriptの `Task` 型を使用し、`useState` の型を明示
- **警告回避**：React18 の `useEffect` で同期 `setState` を避け、初期値で state を設定
- **UI改善**：
  - スコアに応じた色分けで視覚化
  - 合計スコアのリアルタイム表示
  - 削除・追加機能で柔軟に編集可能
- **レスポンシブ対応**：
  - 最大幅 600px に制限して中央配置
  - モバイルでも横幅に合わせて表示

## 5. Git運用メモ
- **初回作成**：
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin <リポジトリURL>
git push -u origin main

- **更新時**：
git add .
git commit -m "update tasks or UI"
git push

- **別PCで作業再開**：
git clone <リポジトリURL>
cd priority-score-app
npm install
npm run dev