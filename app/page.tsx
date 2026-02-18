import styles from './page.module.css'
import TaskCard from '../components/TaskCard'




'use client'
import { useState, useEffect, } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuid } from 'uuid'


type Task = { 
  id: string
  title: string
  description?: string
  emotion: number
  reality: number
}

type Mode = 'balance' | 'emotion' | 'reality'

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>(() => {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem('tasks')
  return saved ? JSON.parse(saved) : []
  })

  const [mode, setMode] = useState<Mode>(() => {
  if (typeof window === 'undefined') return 'balance'
  const saved = localStorage.getItem('mode')
  return saved ? (saved as Mode) : 'balance'
  })

  const router = useRouter()

 useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks))
 }, [tasks])

 useEffect(() => {
  localStorage.setItem('mode', mode)
 }, [mode])

 const createEmptyTask = (): Task => ({
  id: uuid(),
  title: '',
  description: '',
  emotion: 0,
  reality: 0
 })

 const addTask = () => {
  setTasks(prev => [...prev, createEmptyTask()])
 }



  const updateTask = (id: string, field: keyof Task, value: string | number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ))
  }

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>タスク入力</h1>
      <button onClick={addTask} style={{ marginBottom: 10 }}>＋ タスク追加</button>
      
      {tasks.length === 0 && <p>タスクがありません。追加してください。</p>}

      {tasks.map((task) => (
        <div key={task.id} style={{ marginBottom: 15, border: '1px solid #ccc', padding: 15, borderRadius: 8 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <input
              placeholder="タスク名"
              value={task.title}
              onChange={e => updateTask(task.id, 'title', e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              placeholder="感情"
              type="number"
              value={task.emotion}
              onChange={e => updateTask(task.id, 'emotion', Number(e.target.value))}
              style={{ width: 60 }}
            />
            
            <input
              type="number"
              placeholder="現実"
              value={task.reality}
              onChange={e => updateTask(task.id, 'reality', Number(e.target.value))}
              style={{ width: 60 }}
            />
            <button onClick={() => removeTask(task.id)} style={{ color: 'red' }}>削除</button>
          </div>
          <input
            placeholder="簡単な説明（任意）"
            value={task.description || ''}
            onChange={e => updateTask(task.id, 'description', e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      ))}

      <div style={{ marginTop: 20, padding: '10px 0', borderTop: '1px solid #eee' }}>
        <p>現在のモード: <strong>{mode}</strong></p>
        <div style={{ display: 'flex', gap: 5 }}>
          {(['balance', 'emotion', 'reality'] as const).map(m => (
            <button 
              key={m} 
              onClick={() => setMode(m)} 
              style={{ 
                padding: '5px 10px', 
                backgroundColor: mode === m ? '#0070f3' : '#eee',
                color: mode === m ? 'white' : 'black',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={() => router.push('/result')} 
        disabled={tasks.length === 0}
        style={{ 
          marginTop: 30, 
          width: '100%', 
          padding: 15, 
          fontSize: '1.1rem',
          cursor: tasks.length === 0 ? 'not-allowed' : 'pointer'
        }}
      >
        結果をシミュレーションする
      </button>
    </div>
  )
}