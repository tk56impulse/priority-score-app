'use client'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { calculateScore } from '../../lib/taskLogic'
import { Task } from '../types/task'

export default function ResultPage() {
  const router = useRouter()
  
  // 🚀 mode は使わないので tasks だけ取得
  const [tasks] = useLocalStorage<Task[]>('tasks', [])
  const [sortType, setSortType] = useState<'score' | 'deadlineNear' | 'deadlineFar'>('score');

  const validTasks = useMemo(() => {
    return tasks.filter(t => t.title && t.title.trim() !== "");
  }, [tasks]);

  const sortedTasks = useMemo(() => {
    const list = [...validTasks];
    if (sortType === 'score') {
      // 🚀 mode 引数を削除
      list.sort((a, b) => calculateScore(b) - calculateScore(a));
    } else if (sortType === 'deadlineNear') {
      list.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    } else if (sortType === 'deadlineFar') {
      list.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      });
    }
    return list;
  }, [validTasks, sortType]);

  const averageScore = useMemo(() => {
    if (validTasks.length === 0) return 0;
    // 🚀 mode 引数を削除
    const total = validTasks.reduce((sum, t) => sum + calculateScore(t), 0);
    return Math.round(total / validTasks.length);
  }, [validTasks]);

  const getAIEvaluation = (score: number) => {
    if (score > 70) return { label: '至急実行', color: '#ff4d4f', desc: 'このリストは非常に優先度が高いです。すぐ着手しましょう。' }
    if (score > 40) return { label: '順次実行', color: '#faad14', desc: 'バランスの良い計画です。上から順に片付けましょう。' }
    return { label: '計画見直し', color: '#52c41a', desc: '少し目標が低いか、ワクワクが足りないかもしれません。' }
  }

  const evaluation = getAIEvaluation(averageScore);

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '40px 20px', fontFamily: 'sans-serif', color: '#333' }}>
      <button 
        onClick={() => router.push('/')} 
        style={{ marginBottom: 20, cursor: 'pointer', border: 'none', background: 'none', color: '#0070f3', display: 'flex', alignItems: 'center', gap: 5, fontSize: '1rem' }}
      >
        ← 入力画面に戻る
      </button>

      <div style={{ display: 'flex', gap: 10, marginBottom: 30, justifyContent: 'center' }}>
        <button 
          onClick={() => setSortType('score')}
          style={{ 
            padding: '10px 20px', borderRadius: '25px', border: '1px solid #ccc', 
            backgroundColor: sortType === 'score' ? '#0070f3' : '#fff', 
            color: sortType === 'score' ? '#fff' : '#333',
            cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          スコア順
        </button>
        <button 
          onClick={() => setSortType(sortType === 'deadlineNear' ? 'deadlineFar' : 'deadlineNear')}
          style={{ 
            padding: '10px 20px', borderRadius: '25px', border: '1px solid #ccc', 
            backgroundColor: sortType !== 'score' ? '#0070f3' : '#fff', 
            color: sortType !== 'score' ? '#fff' : '#333',
            cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          期日順 {sortType === 'deadlineNear' ? '▲' : '▼'}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 40, padding: 30, backgroundColor: '#f8f9fa', borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#666', letterSpacing: '0.1em' }}>AVERAGE SCORE</h1>
        <div style={{ fontSize: '4rem', fontWeight: 'bold', color: evaluation.color, lineHeight: 1 }}>{averageScore}</div>
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: evaluation.color, marginTop: 10 }}>{evaluation.label}</div>
        <p style={{ color: '#777', fontSize: '0.95rem', marginTop: 12 }}>{evaluation.desc}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {sortedTasks.map((task, index) => {
          // 🚀 mode 引数を削除
          const score = calculateScore(task);
          const isFirst = index === 0;

          return (
            <div 
              key={task.id} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: 15, padding: '20px', 
                borderRadius: 16, border: isFirst ? '2px solid #ffd700' : '1px solid #eee', 
                backgroundColor: '#fff', position: 'relative',
                boxShadow: isFirst ? '0 8px 24px rgba(255, 215, 0, 0.15)' : '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ 
                width: 32, height: 32, backgroundColor: isFirst ? '#ffd700' : '#f0f0f0', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', flexShrink: 0
              }}>
                {index + 1}
              </div>

              <div style={{ flex: 1 }}>
                {/* 🚀 追加：レイヤーバッジ */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                  {task.layer === 'deadline' && <span style={{fontSize:'10px', background:'#ff4d4f', color:'white', padding:'2px 6px', borderRadius:'4px', fontWeight:'bold'}}>🚨絶対</span>}
                  {task.layer === 'investment' && <span style={{fontSize:'10px', background:'#1890ff', color:'white', padding:'2px 6px', borderRadius:'4px', fontWeight:'bold'}}>🌱投資</span>}
                  {task.layer === 'desire' && <span style={{fontSize:'10px', background:'#52c41a', color:'white', padding:'2px 6px', borderRadius:'4px', fontWeight:'bold'}}>🎁本音</span>}
                </div>

                <div style={{ fontWeight: 'bold', fontSize: isFirst ? '1.1rem' : '1rem' }}>{task.title}</div>
                {task.deadline && (
                  <div style={{ fontSize: '0.8rem', color: '#999', marginTop: 4 }}>📅 {task.deadline}</div>
                )}
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: isFirst ? '#d4af37' : '#333' }}>{score}</div>
                <div style={{ fontSize: '0.65rem', color: '#aaa', fontWeight: 'bold' }}>POINTS</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}