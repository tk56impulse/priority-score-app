// components/TaskCard.tsx
import { Task, Layer } from '../app/types/task' 
import { calculateScore } from '../lib/taskLogic'

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, field: keyof Task, value: string | number | Layer) => void
  onRemove: (id: string) => void
}

export default function TaskCard({ task, onUpdate, onRemove }: TaskCardProps) {
  const totalScore = calculateScore(task)

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#ff4d4f'; 
    if (score >= 50) return '#faad14'; 
    return '#52c41a';                  
  };

  return (
    <div style={{ 
      marginBottom: 20, 
      border: '1px solid #eee', 
      padding: '20px', 
      borderRadius: '16px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)', 
      backgroundColor: '#fff'
    }}>
      {/* 上段：タイトルと削除ボタン */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 15, alignItems: 'center' }}>
        <input
          placeholder="何をしますか？"
          value={task.title}
          onChange={e => onUpdate(task.id, 'title', e.target.value)}
          style={{ flex: 1, padding: '10px', fontSize: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        
        <button 
          onClick={() => onRemove(task.id)} 
          style={{ 
            width: '32px', height: '32px', color: '#ccc', background: 'none', 
            border: 'none', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1
          }}
        >✕</button>
      </div>

      {/* 中段：レイヤー選択（ここが最重要） */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: '11px', color: '#aaa', marginBottom: 8, fontWeight: 'bold', letterSpacing: '0.05em' }}>STRATEGY LAYER</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { id: 'deadline', label: '🚨 絶対', color: '#ff4d4f' },
            { id: 'investment', label: '🌱 投資', color: '#1890ff' },
            { id: 'desire', label: '🎁 本音', color: '#52c41a' }
          ].map(l => (
            <button
              key={l.id}
              type="button"
              onClick={() => onUpdate(task.id, 'layer', l.id)}
              style={{
                flex: 1,
                fontSize: '12px',
                padding: '10px 5px',
                borderRadius: '10px',
                border: '2px solid ' + (task.layer === l.id ? l.color : '#f0f0f0'),
                backgroundColor: task.layer === l.id ? l.color : 'white',
                color: task.layer === l.id ? 'white' : '#666',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* 下段：スライダーとスコア表示 */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '12px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#444', display: 'block', marginBottom: '10px' }}>
            {task.layer === 'deadline' && "🚨 このタスクの緊急・重要度"}
            {task.layer === 'investment' && "🌱 将来へのリターン期待度"}
            {task.layer === 'desire' && "🎁 あなたの「やりたい！」熱量"}
          </label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={task.intensity}
            onChange={(e) => onUpdate(task.id, 'intensity', parseInt(e.target.value))}
            style={{ width: '100%', height: '6px', cursor: 'pointer', accentColor: getScoreColor(totalScore) }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#999', marginTop: '5px' }}>
            <span>Low</span>
            <span style={{ fontWeight: 'bold', color: '#333' }}>{task.intensity}%</span>
            <span>High</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', minWidth: '80px' }}>
          <div style={{ fontSize: '9px', color: '#aaa', fontWeight: 'bold' }}>PRIORITY</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: getScoreColor(totalScore), lineHeight: 1.1 }}>
            {totalScore}
          </div>
        </div>
      </div>

      {/* 補助入力：期日と説明 */}
      <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
        <div style={{ flex: 1 }}>
          <input
            type="date"
            value={task.deadline || ''}
            onChange={e => onUpdate(task.id, 'deadline', e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '0.8rem', border: '1px solid #eee', borderRadius: '6px' }}
          />
        </div>
        <div style={{ flex: 2 }}>
          <input
            placeholder="備考メモ"
            value={task.description || ''}
            onChange={e => onUpdate(task.id, 'description', e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '0.8rem', border: '1px solid #eee', borderRadius: '6px' }}
          />
        </div>
      </div>
    </div>
  )
}