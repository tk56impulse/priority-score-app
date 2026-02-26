"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { useLocalStorage } from "../hooks/useLocalStorage";
import TaskCard from "../components/TaskCard";
import { Task, Layer, Category, AppraisalMode } from "./types/task";

export default function HomePage() {
  const router = useRouter();
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);

  // 🌓 UI状態管理
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [appraisalMode, setAppraisalMode] = useState<AppraisalMode>("normal");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 定数定義
  const APPRAISAL_OPTIONS = [
    { id: "sweet", label: "🍬 甘口", color: "#ffb6c1" },
    { id: "normal", label: "⚖️ 普通", color: "#94a3b8" },
    { id: "spicy", label: "🌶️ 激辛", color: "#f43f5e" },
  ] as const;

  const APPRAISAL_LABELS: Record<AppraisalMode, string> = {
    sweet: "💖 気楽に並べ替え",
    normal: "📊 標準モードで算出",
    spicy: "🔥 激辛モードで厳選",
  };

  // --- ハンドラ (Handlers) ---
  const addTask = () => {
    const newTask: Task = {
      id: uuid(),
      title: "",
      description: "",
      intensity: 50,
      deadline: new Date().toISOString().split("T")[0],
      layer: "investment",
      category: "work",
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (
    id: string,
    field: keyof Task,
    value: string | number | Layer | Category,
  ) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  // タスク削除ロジック
  const removeTask = (id: string) => {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    // タイトルが空（空白のみ含む）か判定
    const isTitleEmpty = targetTask.title.trim() === "";

    if (isTitleEmpty) {
      // 空なら即削除
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } else {
      // 入力済みなら確認を出す
      if (
        window.confirm(
          `タスク「${targetTask.title}」を完全に削除してもよろしいですか？`,
        )
      ) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
    }
  };

  // 結果画面への遷移ロジック
  const handleGoToResult = async () => {
    // タイトルがあるものだけを抽出
    const validTasks = tasks.filter((t) => t.title.trim());

    if (validTasks.length === 0) {
      alert("有効なタスク（タイトル）がありません。");
      return;
    }

    // 未入力タスクが混ざっている場合の確認
    if (validTasks.length < tasks.length) {
      const hasConfirmed = window.confirm(
        "タイトル未入力のタスクは除外されますが、よろしいですか？",
      );
      if (!hasConfirmed) return;
    }

    // --- ここから解析演出 ---
    setIsAnalyzing(true);

    // 有効なタスクのみを保存（未入力はここで切り捨てる）
    localStorage.setItem("tasks", JSON.stringify(validTasks));
    localStorage.setItem("appraisalMode", appraisalMode);
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));

    // 1.5秒の待機演出
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push("/result");
  };

  // 🎨 テーマ定義
  const theme = {
    bg: isDarkMode ? "#0f172a" : "#f8fafc",
    text: isDarkMode ? "#f8fafc" : "#0f172a",
    subText: isDarkMode ? "#94a3b8" : "#64748b",
    accent: "#38bdf8",
    cardSectionBg: isDarkMode ? "rgba(30, 41, 59, 0.7)" : "#ffffff",
    border: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#e2e8f0",
  };

  return (
    <main
      style={{
        backgroundColor: theme.bg,
        minHeight: "100vh",
        transition: "all 0.3s ease",
        color: theme.text,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* 🚀 最適化演出オーバーレイ */}
      {isAnalyzing && (
        <aside
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: isDarkMode
              ? "rgba(15, 23, 42, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ display: "flex", gap: "5px", marginBottom: "20px" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "10px",
                  height: "40px",
                  backgroundColor: theme.accent,
                  borderRadius: "5px",
                  animation: "wave 1s ease-in-out infinite",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          <h2
            style={{
              color: theme.accent,
              letterSpacing: "0.3em",
              fontSize: "0.9rem",
              fontWeight: "900",
              textTransform: "uppercase",
            }}
          >
            Optimizing Strategic Layers...
          </h2>
          <p
            style={{
              color: theme.subText,
              fontSize: "0.7rem",
              marginTop: "10px",
              letterSpacing: "0.1em",
            }}
          >
            REARRANGING PRIORITIES BASED ON YOUR MODE
          </p>
        </aside>
      )}

      <div style={{ maxWidth: 600, margin: "auto", padding: "40px 20px" }}>
        <header style={{ marginBottom: "40px" }}>
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                background: "none",
                border: `1px solid ${theme.border}`,
                borderRadius: "20px",
                color: theme.subText,
                padding: "6px 16px",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: "bold",
              }}
            >
              {isDarkMode ? "☀️ LIGHT MODE" : "🌙 DARK MODE"}
            </button>
          </div>
          <h1
            style={{
              textAlign: "center",
              marginBottom: 8,
              color: isDarkMode ? theme.accent : "#0f172a",
              letterSpacing: "0.1em",
              fontSize: "2.5rem",
              fontWeight: "900",
              textShadow: isDarkMode
                ? "0 0 20px rgba(56, 189, 248, 0.3)"
                : "none",
            }}
          >
            STRATEGIC LAYER
          </h1>
          <p
            style={{
              textAlign: "center",
              color: theme.subText,
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
            }}
          >
            COMMAND YOUR PRIORITIES
          </p>
        </header>

        <section aria-label="Task Deck">
          <div
            style={{
              maxWidth: "800px", // カードの最大幅と合わせる
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "12px", // カードとの隙間
              padding: "0 10px", // 画面端のゆとり
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "0.9rem",
                color: isDarkMode ? "#94a3b8" : "#64748b",
                letterSpacing: "0.1em",
              }}
            >
              TASK DECK
            </h2>
            <button
              className="btn-shine"
              onClick={addTask}
              style={{
                padding: "8px 20px",
                borderRadius: "10px",
                backgroundColor: "#38bdf8",
                color: "#0f172a",
                fontWeight: "bold",
                fontSize: "0.85rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(56, 189, 248, 0.2)",
              }}
            >
              ＋ NEW TASK
            </button>
          </div>

          {tasks.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: theme.subText,
                border: `2px dashed ${theme.border}`,
                borderRadius: "16px",
              }}
            >
              タスクがありません。「＋ NEW TASK」から作成してください。
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px 0" }}>
              {tasks.map((task) => (
                <li key={task.id} style={{ marginBottom: "20px" }}>
                  <TaskCard
                    task={task}
                    isDarkMode={isDarkMode}
                    onUpdate={updateTask}
                    onRemove={removeTask}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {tasks.length > 0 && (
          <footer
            style={{
              marginTop: "80px",
              padding: "30px",
              backgroundColor: theme.cardSectionBg,
              borderRadius: "24px",
              border: `1px solid ${theme.border}`,
              boxShadow: isDarkMode ? "none" : "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <p
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: theme.subText,
                marginBottom: "20px",
                fontSize: "0.9rem",
              }}
            >
              最適化アルゴリズムを選択
            </p>

            <nav style={{ display: "flex", gap: "8px", marginBottom: "25px" }}>
              {APPRAISAL_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setAppraisalMode(m.id as AppraisalMode)}
                  style={{
                    flex: 1,
                    padding: "15px 5px",
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor:
                      appraisalMode === m.id
                        ? m.color
                        : isDarkMode
                          ? "#1e293b"
                          : "#f1f5f9",
                    color: appraisalMode === m.id ? "white" : theme.subText,
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "0.2s",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </nav>

            <button
              className="btn-shine"
              onClick={handleGoToResult}
              disabled={isAnalyzing}
              style={{
                width: "100%",
                padding: "22px",
                background: isDarkMode ? "#f8fafc" : "#0f172a",
                color: isDarkMode ? "#0f172a" : "#ffffff",
                borderRadius: "20px",
                fontWeight: "900",
                fontSize: "1.2rem",
                border: "none",
                cursor: isAnalyzing ? "not-allowed" : "pointer",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                opacity: isAnalyzing ? 0.7 : 1,
              }}
            >
              {isAnalyzing ? "OPTIMIZING..." : APPRAISAL_LABELS[appraisalMode]}
            </button>
          </footer>
        )}
      </div>
    </main>
  );
}
