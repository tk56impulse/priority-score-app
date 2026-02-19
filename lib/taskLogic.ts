// lib/taskLogic.ts

// 型（Mode）を定義しておきます
export type Mode = 'balance' | 'emotion' | 'reality';

export const calculateScore = (
  emotion: number,
  reality: number,
  mode: Mode
): number => {
  // モードごとの倍率を決める
  let eWeight = 0.5; // 感情の重み
  let rWeight = 0.5; // 現実の重み

  if (mode === 'emotion') {
    eWeight = 0.8;
    rWeight = 0.2;
  } else if (mode === 'reality') {
    eWeight = 0.2;
    rWeight = 0.8;
  }

  // 計算して四捨五入
  return Math.round(emotion * eWeight + reality * rWeight);
};

export const getDeadlineStatus = (deadline?: string) => {
  if (!deadline) return { label: '', color: '#888', isUrgent: false };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(deadline);
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: '期限切れ', color: '#ff4d4f', isUrgent: true };
  if (diffDays === 0) return { label: '今日まで', color: '#ff4d4f', isUrgent: true };
  if (diffDays <= 3) return { label: `あと${diffDays}日`, color: '#faad14', isUrgent: true };
  return { label: `あと${diffDays}日`, color: '#52c41a', isUrgent: false };
};