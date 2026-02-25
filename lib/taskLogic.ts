import { Layer, Task } from '../app/types/task'; // 🚀 正しいパスからインポート

export const calculateScore = (task: Task): number => { // mode 引数を削除
// 1. 基本スコア計算（5:5で固定）
　let score = task.intensity;

// 2. レイヤーによる倍率補正

　const layerMultipliers: Record<Layer, number> = {
    deadline: 1.5,   // 「絶対」は熱量がそのまま「緊急性」として重くなる
    investment: 1.2, // 「投資」は未来への価値として少し底上げ
    desire: 0.9      // 「本音」は純粋な熱量そのまま
  };
  score *= layerMultipliers[task.layer];

  // 3. 期日直前ボーナス（残り3日以内なら+20点）
 if (task.deadline) {
    const today = new Date();
    const limit = new Date(task.deadline);
    const diffDays = Math.ceil((limit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 3 && diffDays >= 0) {
      score += 20; // 3日以内なら一律20点加点
    }
  }

  return Math.round(score);
};