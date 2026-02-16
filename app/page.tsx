"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Task = { name: string; score: number };

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([{ name: "", score: 0 }]);
  const router = useRouter();

  // タスクの値を更新
  const handleChange = (index: number, field: keyof Task, value: string) => {
    setTasks(prevTasks =>
      prevTasks.map((task, i) => {
        if (i !== index) return task;
        return { ...task, [field]: field === "score" ? Number(value) : value };
      })
    );
  };

  // タスクを追加
  const addTask = () => setTasks([...tasks, { name: "", score: 0 }]);

  // タスクを削除
  const removeTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  // 合計スコアを計算
  const totalScore = tasks.reduce((sum, t) => sum + t.score, 0);

  // 送信して結果ページへ
  const submitTasks = async () => {
    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks }),
    });
    const data = await res.json();
    router.push(`/result?data=${encodeURIComponent(JSON.stringify(data.sorted))}`);
  };

  return (
    <main>
      <h1>優先順位スコアアプリ</h1>
      <p>合計スコア: {totalScore}</p>
      {tasks.map((task, idx) => (
        <div key={idx} style={{ marginBottom: "0.5rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input
            type="text"
            placeholder="タスク名"
            value={task.name}
            onChange={(e) => handleChange(idx, "name", e.target.value)}
          />
          <input
            type="number"
            placeholder="スコア"
            value={task.score}
            onChange={(e) => handleChange(idx, "score", e.target.value)}
          />
          <button
            style={{ cursor: "pointer" }}
            onClick={() => removeTask(idx)}
          >
            削除
          </button>
        </div>
      ))}
      <div style={{ marginTop: "1rem" }}>
        <button onClick={addTask} style={{ marginRight: "1rem", cursor: "pointer" }}>
          タスク追加
        </button>
        <button onClick={submitTasks} style={{ cursor: "pointer" }}>
          送信
        </button>
      </div>
    </main>
  );
}
