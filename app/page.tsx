'use client'
import { useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useRouter } from 'next/navigation'
import { v4 as uuid } from 'uuid'
import TaskCard from '../components/TaskCard' 
// 🚀 不要になった ModeSelector と Mode のインポートを削除
import { Task, Layer } from './types/task'

export default function HomePage() {
  const router = useRouter()
  // 🚀 mode ステートを削除
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', [])
  
  // 🚀 ブラウザでの読み込み：mode に関する処理を削除
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [setTasks]); // setTasksを依存関係に追加

  // 🚀 保存：tasksの変更だけを監視
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // --- ハンドラ (Handlers) ---

  const createEmptyTask = (): Task => ({
    id: uuid(),
    title: '',
    description: '',
    intensity: 50, // 🚀 初期値を 0 ではなく 50 (真ん中) にしておくとユーザーが楽
    deadline: new Date().toISOString().split('T')[0],
    layer: 'investment' 
  })

  const addTask = () => {
    setTasks(prev => [...prev, createEmptyTask()])
  }

  // value の型に Layer を追加してエラーを防止
  const updateTask = (id: string, field: keyof Task, value: string | number | Layer) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, [field as string]: value } : task
    ))
  }

  const removeTask = (id: string) => {
    if (window.confirm('このタスクを完全に削除してもよろしいですか？')) {
      setTasks(prev => prev.filter(t => t.id !== id))
    }
  }

  const handleGoToResult = () => {
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
    <div style={{ maxWidth: 600, margin: 'auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 30, color: '#333' }}>Priority Score App</h1>

      {/* ランキング確認ボタン */}
      <button 
        onClick={handleGoToResult}
        style={{ 
          width: '100%', padding: '18px', backgroundColor: '#0070f3', 
          color: 'white', borderRadius: '12px', marginBottom: '30px', 
          fontWeight: 'bold', fontSize: '1.1rem', border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)'
        }}
      >
        ランキングを確認する →
      </button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>タスクリスト</h2>
        <button 
          type="button" 
          onClick={addTask} 
          style={{
            padding: '10px 20px', backgroundColor: '#52c41a', 
            color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ＋ タスク追加
        </button>
      </div>

      {tasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888', border: '2px dashed #ccc', borderRadius: '12px' }}>
          タスクがありません。「＋ タスク追加」から作成してください。
        </div>
      )}

      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          // 🚀 mode={mode} を削除
          onUpdate={updateTask} 
          onRemove={removeTask} 
        />
      ))}

      {/* 🚀 ModeSelector コンポーネントの呼び出しを削除 */}
    </div>
  );
}