"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Task = { name: string; score: number };

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([{ name: "", score: 0 }]);
  const router = useRouter();

  // 型安全版 handleChange
  const handleChange = (index: number, field: keyof Task, value: string) => {
    setTasks(prevTasks =>
      prevTasks.map((task, i) => {
        if (i !== index) return task;
        return {
          ...task,
          [field]: field === "score" ? Number(value) : value
        };
      })
    );
  };

  const addTask = () => setTasks([...tasks, { name: "", score: 0 }]);

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

      {tasks.map((task, idx) => (
        <div key={idx} style={{ marginBottom: "0.5rem" }}>
          <input
            type="text"
            placeholder="タスク名"
            value={task.name}
            onChange={(e) => handleChange(idx, "name", e.target.value)}
            style={{ marginRight: "1rem" }}
          />
          <input
            type="number"
            placeholder="スコア"
            value={task.score}
            onChange={(e) => handleChange(idx, "score", e.target.value)}
          />
        </div>
      ))}

      <button onClick={addTask} style={{ marginRight: "1rem" }}>タスク追加</button>
      <button onClick={submitTasks}>送信</button>
    </main>
  );
}