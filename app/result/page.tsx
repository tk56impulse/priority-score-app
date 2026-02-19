'use client'
// グループ1: ライブラリ系（React, Next.js, 外部パッケージ）
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

// グループ2: 自作の共通部品・ロジック（Hooks, Lib, Utils）
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { calculateScore, Mode } from '../../lib/taskLogic'

// グループ3: 型定義（Types）
import { Task } from '../types/task'


export default function ResultPage() {
  const router = useRouter()
  
  const [tasks] = useLocalStorage<Task[]>('tasks', [])
  const [mode] = useLocalStorage<Mode>('mode', 'balance')
  const [sortType, setSortType] = useState<'score' | 'deadlineNear' | 'deadlineFar'>('score');

  const validTasks = useMemo(() => {
    return tasks.filter(t => t.title && t.title.trim() !== "");
  }, [tasks]);

  const sortedTasks = useMemo(() => {
    const list = [...validTasks];
    if (sortType === 'score') {
      list.sort((a, b) => calculateScore(b.emotion, b.reality, mode) - calculateScore(a.emotion, a.reality, mode));
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
  }, [validTasks, mode, sortType]);

  const averageScore = useMemo(() => {
    if (validTasks.length === 0) return 0;
    const total = validTasks.reduce((sum, t) => sum + calculateScore(t.emotion, t.reality, mode), 0);
    return Math.round(total / validTasks.length);
  }, [validTasks, mode]);

  const getAIEvaluation = (score: number) => {
    if (score > 70) return { label: '至急実行', color: '#ff4d4f', desc: 'このリストは非常に価値が高いです。すぐ着手しましょう。' }
    if (score > 40) return { label: '順次実行', color: '#faad14', desc: 'バランスの取れた計画です。上から順に片付けましょう。' }
    return { label: '計画見直し', color: '#52c41a', desc: '少し現実味やワクワクが足りないかもしれません。再考の余地あり。' }
  }

  const evaluation = getAIEvaluation(averageScore);

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      {/* 戻るボタン */}
      <button 
        onClick={() => router.push('/')} 
        style={{ marginBottom: 20, cursor: 'pointer', border: 'none', background: 'none', color: '#0070f3', display: 'flex', alignItems: 'center', gap: 5 }}
      >
        ← 入力画面に戻って編集する
      </button>

      {/* 並び替えボタンエリア */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 30, justifyContent: 'center' }}>
        <button 
          onClick={() => setSortType('score')}
          style={{ 
            padding: '8px 16px', borderRadius: '20px', border: '1px solid #ccc', 
            backgroundColor: sortType === 'score' ? '#0070f3' : '#fff', 
            color: sortType === 'score' ? '#fff' : '#333',
            cursor: 'pointer'
          }}
        >
          スコア順
        </button>

        <button 
          onClick={() => setSortType(sortType === 'deadlineNear' ? 'deadlineFar' : 'deadlineNear')}
          style={{ 
            padding: '8px 16px', borderRadius: '20px', border: '1px solid #ccc', 
            backgroundColor: sortType !== 'score' ? '#0070f3' : '#fff', 
            color: sortType !== 'score' ? '#fff' : '#333',
            cursor: 'pointer'
          }}
        >
          期日順 {sortType === 'deadlineNear' ? '▲(近い)' : sortType === 'deadlineFar' ? '▼(遠い)' : ''}
        </button>
      </div>

      {/* --- ヘッダー・サマリー --- */}
      <div style={{ textAlign: 'center', marginBottom: 40, padding: 25, backgroundColor: '#f8f9fa', borderRadius: 16 }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#666' }}>優先順位解析結果</h1>
        <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: evaluation.color, lineHeight: 1 }}>{averageScore}</div>
        <div style={{ fontWeight: 'bold', fontSize: '1.4rem', color: evaluation.color, marginTop: 10 }}>{evaluation.label}</div>
        <p style={{ color: '#666', fontSize: '0.9rem', marginTop: 10 }}>{evaluation.desc}</p>
        <div style={{ display: 'inline-block', padding: '6px 16px', backgroundColor: '#eef', borderRadius: 20, fontSize: '0.8rem', marginTop: 15 }}>
          モード: <strong>{mode === 'emotion' ? '感情優先' : mode === 'reality' ? '現実優先' : 'バランス'}</strong>
        </div>
      </div>

      {/* --- ランキングリスト --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sortedTasks.map((task, index) => {
          const score = calculateScore(task.emotion, task.reality, mode);
          const isFirst = index === 0;

          return (
            <div 
              key={task.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 15, 
                padding: '20px 15px', 
                borderRadius: 12,
                border: isFirst ? '2px solid #ffd700' : '1px solid #eee', 
                boxShadow: isFirst ? '0 4px 20px rgba(255, 215, 0, 0.2)' : 'none',
                backgroundColor: isFirst ? '#fffdf0' : '#fff',
                position: 'relative',
                transition: 'transform 0.2s ease',
                transform: isFirst ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {isFirst && (
                <div style={{ position: 'absolute', top: -15, left: -10, fontSize: '1.8rem', zIndex: 1 }}>
                  👑
                </div>
              )}

              <div style={{ 
                width: 35, height: 35, 
                backgroundColor: isFirst ? '#ffd700' : '#f0f0f0', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: isFirst ? '1.2rem' : '1rem', flexShrink: 0
              }}>
                {index + 1}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: isFirst ? '1.1rem' : '1rem' }}>
                  {task.title}
                </div>
                {task.description && (
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: 4 }}>
                    {task.description}
                  </div>
                )}
                {task.deadline && (
                   <div style={{ fontSize: '0.75rem', color: '#999', marginTop: 4 }}>
                    📅 {task.deadline}
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'right', minWidth: '70px', flexShrink: 0 }}>
                <div style={{ 
                  fontSize: isFirst ? '1.5rem' : '1.2rem', 
                  fontWeight: 'bold', 
                  color: isFirst ? '#d4af37' : evaluation.color 
                }}>
                  {score}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#999', fontWeight: 'bold' }}>SCORE</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}