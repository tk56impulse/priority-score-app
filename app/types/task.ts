// types/task.ts
export type Mode = 'balance' | 'emotion' | 'reality';

export type Task = {
  id: string;
  title: string;
  description?: string;
  emotion: number;
  reality: number;
  deadline?: string;
};