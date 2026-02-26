import { Task, Layer, Category, AppraisalMode } from "../app/types/task";

export const calculateScore = (
  task: Task,
  mode: AppraisalMode = "normal",
): number => {
  // 1. ジャンルによるベース加点
  const categoryBonus: Record<Category, number> = {
    work: 20,
    study: 10,
    private: 0,
  };

  // 🚀 エラー修正：再代入しないので const に変更
  const baseScore = task.intensity + categoryBonus[task.category];

  // 2. レイヤー倍率をモードごとに定義
  // 🚀 エラー修正：オブジェクトを直接定義することで const のまま扱います
  const multipliers: Record<Layer, number> =
    mode === "sweet"
      ? { deadline: 1.1, investment: 1.2, desire: 1.6 } // 🍬 甘口：本音ブースト
      : mode === "spicy"
        ? { deadline: 2.0, investment: 1.2, desire: 0.5 } // 🌶️ 激辛：現実ブースト
        : { deadline: 1.5, investment: 1.2, desire: 1.0 }; // ⚖️ 普通

  let score = baseScore * multipliers[task.layer];

  // 🚀 こっそり入れる「現実主義補正」
  // 普通モード以上（普通・激辛）の時、趣味(private)カテゴリはスコアを少し削る
  if (mode !== "sweet" && task.category === "private") {
    score *= 0.85; // 15%カットして、仕事や勉強を優先させる
  }

  // 3. 期日ボーナス
  if (task.deadline) {
    const today = new Date();
    const limit = new Date(task.deadline);
    const diffDays = Math.ceil(
      (limit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays <= 3 && diffDays >= 0) {
      // 激辛モードの時だけ期日ボーナスを倍にする
      score += mode === "spicy" ? 40 : 20;
    } else if (diffDays < 0) {
      score += 50;
    }
  }

  return Math.round(score);
};
