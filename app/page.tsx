'use client'
import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useRouter } from 'next/navigation'
import { v4 as uuid } from 'uuid'
import styles from './page.module.css'
import TaskCard from '../components/TaskCard' 
import ModeSelector from '../components/ModeSelector'
import { calculateScore,Mode } from '../lib/taskLogic'

// 【POINT】本来は /types/task.ts からインポートするのが理想。
// 1箇所で定義することで、アプリ全体でデータのルールを統一できます。
export type Task = { 
  id: string
  title: string
  description?: string
  emotion: number
  reality: number
  deadline?: string // ← 追加：YYYY-MM-DD形式
}



export default function HomePage() {
  // 1. 最初は空で初期化（サーバーと合わせる）
  const router = useRouter()
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', [])
  const [mode, setMode] = useLocalStorage<Mode>('mode', 'balance')
  // 2. ブラウザに表示された後に一度だけlocalStorageから読み込む
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    const savedMode = localStorage.getItem('mode');
    if (savedMode) {
      setMode(savedMode as Mode);
    }
  }, []); // 空の配列[]により、最初の1回だけ実行される

  // 3. データの変更を監視してlocalStorageに保存する
  // ※初回読み込み時の「空データ」で上書きしないよう、tasksが空でない時だけ保存する工夫
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('mode', mode);
  }, [mode]);

  // --- ハンドラ (Handlers) ---

  const createEmptyTask = (): Task => ({
    id: uuid(),
    title: '',
    description: '',
    emotion: 0,
    reality: 0,
    deadline: new Date().toISOString().split('T')[0] // 初期値を今日にする
  })

  const addTask = () => {
    setTasks(prev => [...prev, createEmptyTask()])
  }

  // 【TIPS】keyof Task を使うことで、存在しない項目を更新しようとするミスをコンパイル時に防ぐ
  const updateTask = (id: string, field: keyof Task, value: string | number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ))
  }

  const removeTask = (id: string) => {
    if (window.confirm('このタスクを完全に削除してもよろしいですか？')) {
      setTasks(prev => prev.filter(t => t.id !== id))
    }
  }
  // app/page.tsx 内の遷移ボタンの処理
const handleGoToResult = () => {

  // タイトルが空、または空白のみのタスクを特定
  const emptyTasks = tasks.filter(t => !t.title.trim());

  if (emptyTasks.length > 0) {
    const confirmMove = window.confirm(
      `タイトル未入力のタスクが ${emptyTasks.length} 件あります。これらは解析から除外されますが、よろしいですか？`
    );
    if (!confirmMove) return;
  }
  
  if (tasks.length === 0 || (tasks.length === emptyTasks.length)) {
    alert("有効なタスクがありません。タスクを入力してください。");
    return;
  }

  router.push('/result');
};
  // --- 表示 (Render) ---
  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>タスク入力</h1>

  {/* 1. ランキング確認ボタン（handleGoToResultを呼ぶ） */}
    <button 
      onClick={handleGoToResult} // 先ほど作った未入力チェック付きの関数
      style={{ 
        width: '100%', padding: '15px', backgroundColor: '#0070f3', 
        color: 'white', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' 
      }}
    >ランキングを確認する →
    </button>
    
    {/* 2. タスク追加ボタン */}
    <button 
      type="button" //  これを明示することで、勝手な遷移を防ぎます
      onClick={addTask} 
      style={{
        marginBottom: 10, padding: '10px 20px', backgroundColor: '#52c41a', 
        color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' 
      }}
     >＋ タスク追加
     </button>

      {/* 空の状態を考慮したUI（Empty State）の実装 */}
      {tasks.length === 0 && <p>タスクがありません。追加してください。</p>}

      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          mode={mode} 
          onUpdate={updateTask} 
          onRemove={removeTask} 
        />
      ))}
      {/* モード切替コンポーネントへの受け渡し */}
      <ModeSelector mode={mode} setMode={setMode} />
    </div>
      );
}  