// types/task.ts
export type Layer = 'deadline' | 'investment' | 'desire'; // 外部締切 | 投資 | 本音

export type Task = {
  id: string;
  title: string;
  description?: string;
  intensity: number; // 0〜100の一本化された熱量
  deadline?: string;
  layer: Layer; // 🚀 追加
};