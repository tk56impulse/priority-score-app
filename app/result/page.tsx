"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

type Task = { name: string; score: number };

export default function ResultPage() {
  const searchParams = useSearchParams();
  const dataStr = searchParams.get("data") || "[]";
  const initialTasks: Task[] = JSON.parse(dataStr);

  const router = useRouter();

  // 初期値で tasks を state にセット → useEffect 不要
  const [tasks, setTasks] = useState<Task[]>(() =>
    [...initialTasks].sort((a, b) => b.score - a.score)
  );

  // 合計スコアも state で管理
  const [totalScore, setTotalScore] = useState<number>(
    tasks.reduce((sum, t) => sum + t.score, 0)
  );

  // タスク削除
  const removeTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
    setTotalScore(newTasks.reduce((sum, t) => sum + t.score, 0));
  };

  // 背景色をスコアに応じてグラデーション
  const getColor = (score: number): string => {
    if (tasks.length === 0) return "#fff";
    const max = Math.max(...tasks.map(t => t.score));
    const min = Math.min(...tasks.map(t => t.score));
    const ratio = max === min ? 0.5 : (score - min) / (max - min);
    const red = Math.floor(255 * ratio);
    const green = Math.floor(255 * (1 - ratio));
    return `rgb(${red},${green},0)`;
  };

  return (
    <main>
      <h1>計算結果（優先順位順）</h1>
      <p>合計スコア: {totalScore}</p>
      <ul>
        {tasks.map((task, idx) => (
          <li
            key={idx}
            style={{
              backgroundColor: getColor(task.score),
              padding: "0.5rem",
              marginBottom: "0.3rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{task.name} : {task.score}</span>
            <button
              style={{ cursor: "pointer" }}
              onClick={() => removeTask(idx)}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => router.push("/")}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}
      >
        タスク入力に戻る
      </button>
    </main>
  );
}
