"use client";
import { useSearchParams } from "next/navigation";

type Task = { name: string; score: number };

export default function ResultPage() {
  const searchParams = useSearchParams();
  const dataStr = searchParams.get("data") || "[]";
  const tasks: Task[] = JSON.parse(dataStr);

  return (
    <main>
      <h1>計算結果（優先順位順）</h1>
      <ul>
        {tasks.map((task: Task, idx: number) => (
          <li key={idx}>
            {task.name} : {task.score}
          </li>
        ))}
      </ul>
    </main>
  );
}