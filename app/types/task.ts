// types/task.ts

// 1. 基本となる型の定義（これは室谷さんのままでOK）
export type Layer = "deadline" | "investment" | "desire";
export type Category = "work" | "study" | "private" | "other";
export type AppraisalMode = "sweet" | "normal" | "spicy";

// 2. タスク本体の定義
export type Task = {
  id: string;
  title: string;
  description?: string;
  intensity: number;
  deadline?: string;
  layer: Layer;
  category: Category;
  createdAt: number; // 👈 作成日時があると、同じスコアでも「新しい順」に並べるなどの制御がしやすくなります
};

// 3. 【ここが肝】各型の「メタデータ（表示用データ）」の定義
// これを定義しておくことで、UI側で「これは日本語でなんて言うんだっけ？」と迷わなくなります。
export type Language = "ja" | "en";

export interface LayerInfo {
  label: Record<Language, string>;
  icon: string;
  color: string;
}

export const LAYER_MAP: Record<Layer, LayerInfo> = {
  deadline: {
    label: { ja: "外部締切 (MUST)", en: "Deadline (MUST)" },
    icon: "🚨",
    color: "#EF4444", // Tailwindを使っている場合はクラス名でもOK
  },
  investment: {
    label: { ja: "自己投資 (SHOULD)", en: "Investment (SHOULD)" },
    icon: "📈",
    color: "#3B82F6",
  },
  desire: {
    label: { ja: "本音・願望 (WANT)", en: "Desire (WANT)" },
    icon: "🌟",
    color: "#10B981",
  },
};

// カテゴリについても同様に作成（後ほど追加可能）
