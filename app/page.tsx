"use client";

import { useState, useEffect } from "react"; // useEffectを追加
import { Language } from "./types/task";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { useLocalStorage } from "../hooks/useLocalStorage";
import TaskCard from "../components/TaskCard";
import { Task, Layer, Category, AppraisalMode } from "./types/task";

export default function HomePage() {
  // 1. 言語設定を localStorage と同期するように修正
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("appLang") as Language) || "ja";
    }
    return "ja";
  });

  const router = useRouter();
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);

  // 🌓 UI状態管理
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [appraisalMode, setAppraisalMode] = useState<AppraisalMode>("normal");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- 多言語テキスト定義 ---
  const i18n = {
    title: "STRATEGIC LAYER",
    subtitle: lang === "ja" ? "優先順位を支配せよ" : "COMMAND YOUR PRIORITIES",
    newTask: lang === "ja" ? "＋ 新規タスク" : "＋ NEW TASK",
    noTask:
      lang === "ja"
        ? "タスクがありません。「＋ 新規タスク」から作成してください。"
        : "No tasks found. Click '+ NEW TASK' to start.",
    algoTitle:
      lang === "ja"
        ? "最適化アルゴリズムを選択"
        : "SELECT OPTIMIZATION ALGORITHM",
    analyzing: lang === "ja" ? "最適化中..." : "OPTIMIZING...",
    emptyAlert:
      lang === "ja"
        ? "有効なタスク（タイトル）がありません。"
        : "No valid tasks (title missing).",
    confirmDiscard:
      lang === "ja"
        ? "タイトル未入力のタスクは除外されますが、よろしいですか？"
        : "Tasks without titles will be excluded. Continue?",
  };

  const APPRAISAL_OPTIONS = [
    {
      id: "sweet",
      label: lang === "ja" ? "🍬 甘口" : "🍬 SWEET",
      color: "#ffb6c1",
    },
    {
      id: "normal",
      label: lang === "ja" ? "⚖️ 普通" : "⚖️ NORMAL",
      color: "#94a3b8",
    },
    {
      id: "spicy",
      label: lang === "ja" ? "🌶️ 激辛" : "🌶️ SPICY",
      color: "#f43f5e",
    },
  ] as const;

  const APPRAISAL_LABELS: Record<AppraisalMode, string> = {
    sweet: lang === "ja" ? "💖 気楽に並べ替え" : "💖 SORT GENTLY",
    normal: lang === "ja" ? "📊 標準モードで算出" : "📊 ANALYZE NORMALLY",
    spicy: lang === "ja" ? "🔥 激辛モードで厳選" : "🔥 ANALYZE STRICTLY",
  };

  // 言語切り替えハンドラ
  const toggleLang = () => {
    const newLang = lang === "ja" ? "en" : "ja";
    setLang(newLang);
    localStorage.setItem("appLang", newLang); // 👈 結果ページのために保存
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
      createdAt: Date.now(),
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

  const removeTask = (id: string) => {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    const isTitleEmpty = targetTask.title.trim() === "";
    if (isTitleEmpty) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } else {
      const msg =
        lang === "ja"
          ? `タスク「${targetTask.title}」を完全に削除してもよろしいですか？`
          : `Are you sure you want to delete "${targetTask.title}"?`;
      if (window.confirm(msg)) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
    }
  };

  const handleGoToResult = async () => {
    const validTasks = tasks.filter((t) => t.title.trim());

    if (validTasks.length === 0) {
      alert(i18n.emptyAlert);
      return;
    }

    if (validTasks.length < tasks.length) {
      if (!window.confirm(i18n.confirmDiscard)) return;
    }

    setIsAnalyzing(true);

    localStorage.setItem("tasks", JSON.stringify(validTasks));
    localStorage.setItem("appraisalMode", appraisalMode);
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
    localStorage.setItem("appLang", lang); // 👈 遷移直前にも念のため保存

    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push("/result");
  };

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
      {/* 言語切り替えスイッチ */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px 20px",
        }}
      >
        <button
          onClick={toggleLang}
          style={{
            backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "#f1f5f9",
            color: isDarkMode ? "#f8fafc" : "#0f172a",
            border: "none",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {lang === "ja" ? "English 🇺🇸" : "日本語 🇯🇵"}
        </button>
      </div>

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
          {/* 👇 ここが消えていた3本のバーです */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "10px",
                  height: "40px",
                  backgroundColor: theme.accent,
                  borderRadius: "5px",
                  animation: "wave 1s ease-in-out infinite", // 👈 waveアニメーションを適用
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
            {lang === "ja"
              ? "戦略レイヤーを最適化中..."
              : "Optimizing Strategic Layers..."}
          </h2>
          <p
            style={{
              color: theme.subText,
              fontSize: "0.7rem",
              marginTop: "10px",
            }}
          >
            {lang === "ja"
              ? "選択したモードに基づいて優先順位を再構成しています"
              : "REARRANGING PRIORITIES BASED ON YOUR MODE"}
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
              fontSize: "2.5rem",
              fontWeight: "900",
            }}
          >
            {i18n.title}
          </h1>
          <p
            style={{
              textAlign: "center",
              color: theme.subText,
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
            }}
          >
            {i18n.subtitle}
          </p>
        </header>

        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "12px",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "0.9rem", color: theme.subText }}>
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
                border: "none",
                cursor: "pointer",
              }}
            >
              {i18n.newTask}
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
              {i18n.noTask}
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {tasks.map((task) => (
                <li key={task.id} style={{ marginBottom: "20px" }}>
                  <TaskCard
                    task={task}
                    lang={lang}
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
            }}
          >
            <p
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: theme.subText,
                marginBottom: "20px",
              }}
            >
              {i18n.algoTitle}
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
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </nav>
            <button
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
              }}
            >
              {isAnalyzing ? i18n.analyzing : APPRAISAL_LABELS[appraisalMode]}
            </button>
          </footer>
        )}
      </div>
    </main>
  );
}
