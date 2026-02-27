"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Task, AppraisalMode, LAYER_MAP, Language } from "../types/task";
import { calculateScore } from "../../lib/taskLogic";

export default function ResultPage() {
  const router = useRouter();

  // 1. useStateの初期化関数の中で localStorage を読み込む
  // これなら「後出しの setState」にならないので、React Compiler も文句を言いません
  const [data, setData] = useState<{
    tasks: Task[];
    mode: AppraisalMode;
    isDark: boolean;
    lang: Language;
  } | null>(() => {
    // サーバーサイドレンダリング時は null を返す
    if (typeof window === "undefined") return null;

    const savedTasks = localStorage.getItem("tasks");
    const mode =
      (localStorage.getItem("appraisalMode") as AppraisalMode) || "normal";
    const isDark = localStorage.getItem("isDarkMode") === "true";
    const lang = (localStorage.getItem("appLang") as Language) || "ja";

    if (!savedTasks) return { tasks: [], mode, isDark, lang };

    const scoredTasks = (JSON.parse(savedTasks) as Task[])
      .filter((t) => t.title.trim() !== "")
      .sort((a, b) => calculateScore(b, mode) - calculateScore(a, mode));

    return { tasks: scoredTasks, mode, isDark, lang };
  });

  // 2. dataがセットされた後の「背景色」の同期だけ useEffect で行う
  // （これは外部システム＝DOM への同期なので、正しい Effect の使い方です）
  useEffect(() => {
    if (!data) return;
    document.body.style.backgroundColor = data.isDark ? "#0f172a" : "#f8fafc";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [data?.isDark]);

  // 3. 早期リターン
  if (!data) return null;

  // 5. ここから下は data があることが確定している
  const { tasks, mode, isDark, lang } = data;
  const hasExtremeTask = tasks.some((t) => calculateScore(t, mode) >= 200);

  // デザイン用定数
  const theme = {
    bg: isDark ? "#0f172a" : "#f8fafc",
    text: isDark ? "#f8fafc" : "#0f172a",
    subText: isDark ? "#94a3b8" : "#64748b",
    cardBg: isDark ? "rgba(30, 41, 59, 0.7)" : "#ffffff",
    border: isDark ? "rgba(255, 255, 255, 0.1)" : "#e2e8f0",
  };
  // --- 表示用テキストの多言語化定数 ---
  const i18n = {
    title: lang === "ja" ? "優先順位ランキング" : "PRIORITY RANKING",
    back: lang === "ja" ? "← デッキに戻る" : "← BACK TO DECK",
    score: lang === "ja" ? "スコア" : "SCORE",
    urgent: lang === "ja" ? "⚠️ 直近の締切" : "⚠️ SHORT-TERM",
    noDeadline: lang === "ja" ? "期日未設定" : "NO DEADLINE SET",
    spicyMsg:
      lang === "ja"
        ? "「しんどいか。大丈夫。諦めるな。乗り越えられる。」"
        : "“Hard times? It's okay. Don't give up. You can overcome this.”",
  };

  const getModeStyles = () => {
    switch (mode) {
      case "sweet":
        return {
          color: "#ff4d79",
          label: lang === "ja" ? "💖 褒めちぎりモード" : "💖 SWEET MODE",
        };
      case "spicy":
        return {
          color: "#ff4500",
          label: lang === "ja" ? "🔥 激辛モード" : "🔥 SPICY MODE",
        };
      default:
        return {
          color: "#38bdf8",
          label: lang === "ja" ? "📊 標準モード" : "📊 NORMAL MODE",
        };
    }
  };
  const styles = getModeStyles();

  // --- 3. サブコンポーネント的なロジック ---
  const getDeadlineInfo = (deadline: string | undefined) => {
    if (!deadline) return { text: i18n.noDeadline, isUrgent: false };
    const diff = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return { text: `📅 ${deadline}`, isUrgent: diff >= 0 && diff <= 3 };
  };

  return (
    <main
      style={{
        maxWidth: 600,
        margin: "auto",
        padding: "40px 20px",
        minHeight: "100vh",
        color: theme.text,
        transition: "all 0.3s ease",
      }}
    >
      <header>
        <button
          onClick={() => router.push("/")}
          style={{
            marginBottom: "20px",
            border: "none",
            background: "none",
            cursor: "pointer",
            color: styles.color,
            fontWeight: "bold",
            padding: 0,
          }}
        >
          {i18n.back}
        </button>

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: "bold",
              color: styles.color,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {styles.label} OPTIMIZED
          </span>
          <h1 style={{ margin: "10px 0", fontSize: "2rem", fontWeight: "900" }}>
            {i18n.title}
          </h1>

          {mode === "spicy" && hasExtremeTask && (
            <aside
              style={{
                marginTop: "20px",
                padding: "15px",
                borderRadius: "12px",
                backgroundColor: isDark ? "rgba(244, 63, 94, 0.1)" : "#fff1f2",
                border: `1px solid ${isDark ? "rgba(244, 63, 94, 0.2)" : "#fecdd3"}`,
                color: isDark ? "#fda4af" : "#e11d48",
                fontSize: "0.85rem",
                lineHeight: "1.6",
                fontStyle: "italic",
              }}
            >
              {i18n.spicyMsg}
            </aside>
          )}
        </div>
      </header>

      <section>
        <ol
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: 0,
            listStyle: "none",
          }}
        >
          {tasks.map((task, index) => {
            const score = calculateScore(task, mode);
            const isFirst = index === 0;
            const deadlineInfo = getDeadlineInfo(task.deadline);

            return (
              <li
                key={task.id}
                className="fade-in-up"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <article
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: theme.cardBg,
                    padding: "24px",
                    borderRadius: "16px",
                    border: `1px solid ${isFirst ? styles.color : theme.border}`,
                    boxShadow: isDark ? "none" : "0 4px 12px rgba(0,0,0,0.05)",
                    transform: isFirst ? "scale(1.02)" : "scale(1)",
                    transition: "transform 0.2s",
                  }}
                >
                  {/* 順位 */}
                  <div
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: "900",
                      marginRight: "20px",
                      color: isFirst
                        ? styles.color
                        : isDark
                          ? "#334155"
                          : "#e2e8f0",
                      minWidth: "45px",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* 詳細 */}
                  <div style={{ flex: 1 }}>
                    <h2
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {task.title}
                    </h2>
                    <p
                      style={{
                        fontSize: "0.7rem",
                        color: theme.subText,
                        textTransform: "uppercase",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {task.category}
                      {"//"} {LAYER_MAP[task.layer].label[lang]}
                    </p>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: deadlineInfo.isUrgent
                          ? "#ef4444"
                          : theme.subText,
                        fontWeight: deadlineInfo.isUrgent ? "bold" : "normal",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {deadlineInfo.text}
                      {deadlineInfo.isUrgent && <span>{i18n.urgent}</span>}
                    </div>
                  </div>

                  {/* スコア */}
                  <aside style={{ textAlign: "center", marginLeft: "15px" }}>
                    <div
                      style={{
                        fontSize: "0.6rem",
                        color: styles.color,
                        fontWeight: "bold",
                      }}
                    >
                      SCORE
                    </div>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "900",
                        color: isFirst ? styles.color : theme.text,
                      }}
                    >
                      {score}
                    </div>
                  </aside>
                </article>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
