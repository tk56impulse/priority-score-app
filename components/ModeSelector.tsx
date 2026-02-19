type Mode = 'balance' | 'emotion' | 'reality'

type Props = {
  mode: Mode
  setMode: (mode: Mode) => void
}

export default function ModeSelector({ mode, setMode }: Props) {
  return (
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={() => setMode('balance')}
        style={{
          marginRight: 8,
          backgroundColor: mode === 'balance' ? '#0070f3' : '#eee',
          color: mode === 'balance' ? '#fff' : '#000'
        }}
      >
        バランス
      </button>

      <button
        onClick={() => setMode('emotion')}
        style={{
          marginRight: 8,
          backgroundColor: mode === 'emotion' ? '#0070f3' : '#eee',
          color: mode === 'emotion' ? '#fff' : '#000'
        }}
      >
        感情優先
      </button>

      <button
        onClick={() => setMode('reality')}
        style={{
          backgroundColor: mode === 'reality' ? '#0070f3' : '#eee',
          color: mode === 'reality' ? '#fff' : '#000'
        }}
      >
        現実優先
      </button>
    </div>
  )
}
