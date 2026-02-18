'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

type Task = {
  id: string
  title: string
  description?: string
  score: number
}

type Mode = 'balance' | 'emotion' | 'reality'

const modeWeights: Record<Mode, number> = {
  balance: 1,
  emotion: 1.2,
  reality: 0.8
}

export default function ResultPage() {
  const [tasks, setTasks] = useState<Task[]>(() => {
   if (typeof window === 'undefined') return []

  const saved = localStorage.getItem('tasks')
   if (!saved) return []

  const parsed: Task[] = JSON.parse(saved)
   return [...parsed].sort((a, b) => b.score - a.score)
  })
 const [mode, setMode] = useState<Mode>(() => {
  if (typeof window === 'undefined') return 'balance'

 const saved = localStorage.getItem('mode')
  return saved ? (saved as Mode) : 'balance'
 })
  
 const router = useRouter()




  // 重み付きスコア計算
  const weightedTotal = useMemo(() => {
    const baseTotal = tasks.reduce((sum, t) => sum + t.score, 0)
    return Math.round(baseTotal * modeWeights[mode])
  }, [tasks, mode])

  const getMessage = () => {
    if (weightedTotal > 80) return '🚀 強く推奨'
    if (weightedTotal > 50) return '👍 実行可能'
    if (weightedTotal > 30) return '🤔 再検討'
    return '🛑 見直し推奨'
  }

  const removeTask = (id: string) => {
    const newTasks = tasks.filter(t => t.id !== id)
    setTasks(newTasks)
    localStorage.setItem('tasks', JSON.stringify(newTasks))
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>結果</h1>

      <p>モード: <strong>{mode}</strong></p>
      <p>重み係数: {modeWeights[mode]}</p>
      <p>最終スコア: <strong>{weightedTotal}</strong></p>

      <h2>{getMessage()}</h2>

      {tasks.map(task => (
        <div
          key={task.id}
          style={{
            margin: 10,
            padding: 10,
            backgroundColor: `rgba(255,0,0,${task.score / 10})`,
            color: '#fff'
          }}
        >
          <strong>{task.title}</strong> ({task.score})
          {task.description && <div>{task.description}</div>}
          <button onClick={() => removeTask(task.id)}>削除</button>
        </div>
      ))}

      <button onClick={() => router.push('/')}>
        入力画面に戻る
      </button>
    </div>
  )
}
