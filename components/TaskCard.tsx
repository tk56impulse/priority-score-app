import React from 'react'

type Task = {
  id: string
  title: string
  description?: string
  emotion: number
  reality: number
}

type Props = {
  task: Task
  updateTask: (id: string, field: keyof Task, value: string | number) => void
  removeTask: (id: string) => void
}

export default function TaskCard({ task, updateTask, removeTask }: Props) {
  return (
    <div style={{ marginBottom: 15, border: '1px solid #ccc', padding: 15, borderRadius: 8 }}>
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

        <button
          onClick={() => removeTask(task.id)}
          style={{ color: 'red' }}
        >
          削除
        </button>
      </div>

      <input
        placeholder="簡単な説明（任意）"
        value={task.description || ''}
        onChange={e => updateTask(task.id, 'description', e.target.value)}
        style={{ width: '100%' }}
      />
    </div>
  )
}
