// types/task.ts

export type PriorityMode = 'balance' | 'emotional' | 'realistic';

export interface Task {
  id: string;
  title: string;
  category?: string; // ブラッシュアップ案の「カテゴリタグ」
  
  // スコア算出のための3つのパラメータ（0〜100）
  impact: number;    // 影響度・重要度
  urgency: number;   // 緊急度
  effort: number;    // コスト・労力（低いほどスコアが高くなる設計にすることが多い）

  totalScore: number; // 最終的な計算結果
  createdAt: number;
}