// types/task.ts
export type Layer = "deadline" | "investment" | "desire"; // 外部締切 | 投資 | 本音
export type Category = "work" | "study" | "private"; // 💼仕事、📚自己研鑽、🎨趣味・私生活
export type AppraisalMode = "sweet" | "normal" | "spicy"; // 🚀 追加

export type Task = {
  id: string;
  title: string;
  description?: string;
  intensity: number; // 0〜100の一本化された熱量
  deadline?: string;
  layer: Layer;
  category: Category;
};
