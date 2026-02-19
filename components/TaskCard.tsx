// components/TaskCard.tsx
import { Task } from '../app/page'
import { calculateScore, Mode } from '../lib/taskLogic'
import { getDeadlineStatus } from '../lib/taskLogic';

interface TaskCardProps {
  task: Task
  mode: Mode
  onUpdate: (id: string, field: keyof Task, value: string | number) => void
  onRemove: (id: string) => void
}

export default function TaskCard({ task, mode, onUpdate, onRemove }: TaskCardProps) {
  const totalScore = calculateScore(task.emotion, task.reality, mode)

  // スコアに応じて色を変える関数（UX: 直感的な状況把握のため）
  const getScoreColor = (score: number) => {
    if (score >= 70) return '#ff4d4f'; // 赤：高優先
    if (score >= 40) return '#faad14'; // 黄：中優先
    return '#52c41a';                  // 緑：低優先
  };

  return (
    <div style={{ 
      marginBottom: 15, 
      border: '1px solid #ddd', 
      padding: 15, 
      borderRadius: 12, // 少し丸みを強調してモダンに
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)', // 軽い影で浮き出し
      backgroundColor: '#fff'
    }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
        <input
          placeholder="タスク名"
          value={task.title}
          onChange={e => onUpdate(task.id, 'title', e.target.value)}
          style={{ flex: 2, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        
        {/* --- スコア & グラフ表示セクション --- */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px' }}>
          <span style={{ fontSize: '9px', color: '#888', fontWeight: 'bold' }}>PRIORITY</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: getScoreColor(totalScore) }}>
            {totalScore}
          </span>
        </div>

        {/* 棒グラフ（UXポイント：数値だけでなく視覚的に訴えかける） */}
        <div style={{ flex: 1, height: '12px', backgroundColor: '#eee', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${totalScore}%`, 
            height: '100%', 
            backgroundColor: getScoreColor(totalScore),
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' // 滑らかな動き
          }} />
        </div>
        {/* ---------------------------------- */}

  <button 
        onClick={() => onRemove(task.id)} 
        style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          color: '#999',         // 最初は控えめな色
          background: '#f5f5f5', // 軽いグレーの背景
          border: 'none', 
          borderRadius: '50%',   // 丸いボタン
          cursor: 'pointer',
          fontSize: '1.2rem',
          transition: 'all 0.2s ease', // 変化を滑らかに
          marginLeft: '5px'
        }}
        // マウスを乗せた時の演出
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.backgroundColor = '#ff4d4f'; // ホバーで赤く
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#999';
          e.currentTarget.style.backgroundColor = '#f5f5f5';
        }}
        title="タスクを削除"
          >×</button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
          <label style={{ fontSize: '12px', color: '#666' }}>感情</label>
          <input
            type="number"
            value={task.emotion}
            onChange={e => onUpdate(task.id, 'emotion', Number(e.target.value))}
            style={{ width: '100%', padding: '4px' }}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
          <label style={{ fontSize: '12px', color: '#666' }}>現実</label>
          <input
            type="number"
            value={task.reality}
            onChange={e => onUpdate(task.id, 'reality', Number(e.target.value))}
            style={{ width: '100%', padding: '4px' }}
          />
        </div>

        

      </div>

      <input
        placeholder="簡単な説明（任意）"
        value={task.description || ''}
        onChange={e => onUpdate(task.id, 'description', e.target.value)}
        style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #eee', borderRadius: '4px' }}
      />
    </div>
  )
}