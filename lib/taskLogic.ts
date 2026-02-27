import { Task, Layer, Category, AppraisalMode } from "../app/types/task";

/** * スコア計算に使用する定数定義
 * 将来的に調整が必要になった際、ここだけを見れば良い状態にする
 */
const SCORE_CONFIG = {
  CATEGORY_BONUS: {
    work: 20,
    study: 10,
    private: 0,
    other: 0, // category型にotherがある場合
  } as Record<Category, number>,

  LAYER_MULTIPLIERS: {
    sweet: { deadline: 1.1, investment: 1.2, desire: 1.6 },
    normal: { deadline: 1.5, investment: 1.2, desire: 1.0 },
    spicy: { deadline: 2.0, investment: 1.2, desire: 0.5 },
  } as Record<AppraisalMode, Record<Layer, number>>,

  PRIVATE_ADJUSTMENT: 0.85, // 現実主義補正（15%カット）
  DEADLINE_BONUS_NEAR: { normal: 20, spicy: 40 },
  DEADLINE_BONUS_OVER: 50,
} as const;

/**
 * 戦略的タスク優先順位スコア計算関数
 */
export const calculateScore = (
  task: Task,
  mode: AppraisalMode = "normal",
): number => {
  // 1. ベーススコアの算出（強度 + カテゴリボーナス）
  const categoryBonus = SCORE_CONFIG.CATEGORY_BONUS[task.category] ?? 0;
  let score = task.intensity + categoryBonus;

  // 2. モードに応じたレイヤー倍率の適用
  const multiplier = SCORE_CONFIG.LAYER_MULTIPLIERS[mode][task.layer];
  score *= multiplier;

  // 3. カテゴリ補正（現実主義補正）
  // Sweetモード以外でPrivateタスクの場合に適用
  if (mode !== "sweet" && task.category === "private") {
    score *= SCORE_CONFIG.PRIVATE_ADJUSTMENT;
  }

  // 4. 期日ボーナスの計算
  if (task.deadline) {
    score += calculateDeadlineBonus(task.deadline, mode);
  }

  return Math.round(score);
};

/**
 * 期日に基づく加算スコアを算出（ヘルパー関数として分離）
 */
const calculateDeadlineBonus = (
  deadline: string,
  mode: AppraisalMode,
): number => {
  const today = new Date();
  const limit = new Date(deadline);
  const diffDays = Math.ceil(
    (limit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) return SCORE_CONFIG.DEADLINE_BONUS_OVER;
  if (diffDays <= 3) {
    return mode === "spicy"
      ? SCORE_CONFIG.DEADLINE_BONUS_NEAR.spicy
      : SCORE_CONFIG.DEADLINE_BONUS_NEAR.normal;
  }
  return 0;
};
