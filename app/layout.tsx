import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "優先順位スコアアプリ",
  description: "タスクの優先順位を計算して表示するアプリ",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}