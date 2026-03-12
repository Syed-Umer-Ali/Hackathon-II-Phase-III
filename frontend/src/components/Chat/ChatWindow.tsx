'use client'
import { useState, useEffect, useRef } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  created_at: string
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@400;600;700;800&display=swap');

  :root {
    --bg: #020408;
    --surface: rgba(255,255,255,0.03);
    --surface-hover: rgba(255,255,255,0.06);
    --border: rgba(0,255,150,0.12);
    --border-bright: rgba(0,255,150,0.35);
    --accent: #00ff96;
    --accent-dim: rgba(0,255,150,0.15);
    --accent3: #06b6d4;
    --text: #e8f4f0;
    --muted: #5a7a6e;
    --font-mono: 'JetBrains Mono', monospace;
    --font-display: 'Syne', sans-serif;
  }

  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes pulseGlow { 0%,100%{box-shadow:0 0 15px rgba(0,255,150,0.2)} 50%{box-shadow:0 0 35px rgba(0,255,150,0.5)} }
  @keyframes thinking { 0%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} 100%{opacity:0.3;transform:scale(0.8)} }
  @keyframes msgInRight { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
  @keyframes msgInLeft  { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }

  .chat-app { font-family:var(--font-display); background:var(--bg); height:100vh; width:100vw; display:flex; position:relative; overflow:hidden; color:var(--text); }
  .chat-app * { box-sizing:border-box; margin:0; padding:0; }

  .chat-app::before { content:''; position:fixed; inset:0; background-image:linear-gradient(rgba(0,255,150,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,150,0.02) 1px,transparent 1px); background-size:64px 64px; pointer-events:none; z-index:0; }

  .orb { position:fixed; border-radius:50%; filter:blur(100px); pointer-events:none; z-index:0; opacity:0.5; }

  /* SIDEBAR */
  .sidebar { width:320px; border-right:1px solid var(--border); background:rgba(2,6,10,0.6); backdrop-filter:blur(30px); display:flex; flex-direction:column; z-index:10; }
  .sidebar-header { padding:24px; border-bottom:1px solid var(--border); }
  .sidebar-title { font-size:18px; font-weight:800; letter-spacing:0.05em; display:flex; align-items:center; gap:10px; }
  .sidebar-title .logo { background:var(--accent); color:#000; width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:6px; font-size:14px; }
  
  .task-list { flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:12px; }
  .task-card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:14px; transition:all 0.2s; position:relative; }
  .task-card:hover { background:var(--surface-hover); border-color:var(--border-bright); transform:translateX(4px); }
  .task-card.completed { opacity:0.6; }
  .task-card.completed .task-title { text-decoration:line-through; color:var(--muted); }
  
  .task-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px; }
  .task-title { font-family:var(--font-mono); font-size:13px; font-weight:600; line-height:1.4; color:var(--text); }
  .task-date { font-family:var(--font-mono); font-size:9px; color:var(--muted); margin-top:4px; }
  
  .task-actions { display:flex; gap:8px; margin-top:10px; opacity:0; transition:opacity 0.2s; }
  .task-card:hover .task-actions { opacity:1; }
  .action-btn { font-family:var(--font-mono); font-size:9px; padding:4px 8px; border-radius:4px; cursor:pointer; background:transparent; border:1px solid var(--border); color:var(--muted); transition:all 0.2s; }
  .action-btn.complete:hover { background:var(--accent-dim); color:var(--accent); border-color:var(--accent); }
  .action-btn.delete:hover { background:rgba(239,68,68,0.1); color:#ef4444; border-color:#ef4444; }

  /* MAIN CHAT AREA */
  .main-content { flex:1; display:flex; flex-direction:column; position:relative; z-index:1; background:rgba(2,6,10,0.2); }
  
  .chat-header { padding:20px 30px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; background:rgba(0,255,150,0.01); backdrop-filter:blur(10px); }
  .status-dot { display:flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:11px; color:var(--accent); }
  .status-dot::before { content:''; width:8px; height:8px; border-radius:50%; background:var(--accent); box-shadow:0 0 10px var(--accent); animation:blink 2s infinite; }

  .messages-area { flex:1; overflow-y:auto; padding:30px; display:flex; flex-direction:column; gap:20px; }
  .msg-row { display:flex; gap:14px; max-width:85%; }
  .msg-row.user { align-self:flex-end; flex-direction:row-reverse; animation:msgInRight 0.3s ease both; }
  .msg-row.bot { align-self:flex-start; animation:msgInLeft 0.3s ease both; }
  
  .avatar { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-family:var(--font-mono); font-size:12px; font-weight:700; flex-shrink:0; }
  .avatar.bot-av { background:var(--accent-dim); border:1px solid var(--border); color:var(--accent); }
  .avatar.user-av { background:rgba(6,182,212,0.1); border:1px solid rgba(6,182,212,0.2); color:var(--accent3); }
  
  .bubble { padding:14px 18px; border-radius:18px; font-family:var(--font-mono); font-size:14px; line-height:1.6; word-wrap:break-word; }
  .bubble.bot { background:rgba(255,255,255,0.03); border:1px solid var(--border); border-bottom-left-radius:4px; }
  .bubble.user { background:linear-gradient(135deg, rgba(0,255,150,0.1), rgba(6,182,212,0.1)); border:1px solid var(--border-bright); border-bottom-right-radius:4px; }

  .input-section { padding:24px 30px; border-top:1px solid var(--border); background:rgba(2,6,10,0.4); backdrop-filter:blur(20px); }
  .input-container { max-width:800px; margin:0 auto; display:flex; gap:12px; align-items:flex-end; }
  .input-field { flex:1; background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:16px; padding:14px 18px; font-family:var(--font-mono); font-size:14px; color:var(--text); outline:none; resize:none; min-height:52px; transition:all 0.2s; }
  .input-field:focus { border-color:var(--accent); background:rgba(255,255,255,0.07); }
  
  .send-btn { width:52px; height:52px; border-radius:16px; background:var(--accent); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s; font-size:20px; color:#000; flex-shrink:0; }
  .send-btn:hover:not(:disabled) { transform:scale(1.05); box-shadow:0 0 20px rgba(0,255,150,0.4); }
  .send-btn:disabled { opacity:0.3; cursor:not-allowed; }

  .empty-state { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; color:var(--muted); opacity:0.6; }
  .suggestion-chips { display:flex; gap:10px; margin-top:20px; flex-wrap:wrap; justify-content:center; }
  .chip { font-family:var(--font-mono); font-size:11px; padding:8px 16px; border-radius:20px; background:rgba(0,255,150,0.05); border:1px solid var(--border); color:var(--accent); cursor:pointer; transition:all 0.2s; }
  .chip:hover { background:var(--accent-dim); border-color:var(--accent); }

  .thinking { display:flex; align-items:center; gap:4px; padding:10px 0; }
  .dot { width:5px; height:5px; border-radius:50%; background:var(--accent); animation:thinking 1s infinite; }
  .dot:nth-child(2) { animation-delay:0.2s; }
  .dot:nth-child(3) { animation-delay:0.4s; }

  /* Utilities */
  .badge { font-size:10px; font-family:var(--font-mono); padding:2px 6px; border-radius:4px; text-transform:uppercase; font-weight:bold; }
  .badge.completed { background:var(--accent-dim); color:var(--accent); }
  .badge.pending { background:rgba(245,158,11,0.1); color:#f59e0b; }
`

export default function ChatWindow({ userId = 'demo-user' }: { userId?: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [convId, setConvId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  const suggestions = [
    '🛒 Add task: Buy groceries',
    '📋 Show my tasks',
    '⏳ What\'s pending?',
    '✅ Complete task 1',
  ]

  const fetchTasks = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/${userId}/tasks`)
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    }
  }

  useEffect(() => {
    fetchTasks()
    const interval = setInterval(fetchTasks, 10000)
    return () => clearInterval(interval)
  }, [userId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const resize = () => {
    const t = taRef.current; if (!t) return
    t.style.height = 'auto'
    t.style.height = Math.min(t.scrollHeight, 150) + 'px'
  }

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setLoading(true)
    setMessages(p => [...p, { role: 'user', content: msg }])
    setInput('')
    if (taRef.current) taRef.current.style.height = '52px'

    try {
      const res = await fetch(`http://localhost:8000/api/${userId}/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: convId, message: msg }),
      })
      const data = await res.json()
      setMessages(p => [...p, { role: 'assistant', content: data.response }])
      setConvId(data.conversation_id)
      // Refresh tasks after agent interaction
      setTimeout(fetchTasks, 1000)
    } catch {
      setMessages(p => [...p, { role: 'assistant', content: '⚠️ Backend unreachable. Ensure FastAPI is running on :8000' }])
    } finally {
      setLoading(false)
    }
  }

  const completeTask = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/api/${userId}/tasks/${id}/complete`, { method: 'POST' })
      fetchTasks()
    } catch (err) { console.error(err) }
  }

  const deleteTask = async (id: number) => {
    if (!confirm('Delete this task?')) return
    try {
      await fetch(`http://localhost:8000/api/${userId}/tasks/${id}`, { method: 'DELETE' })
      fetchTasks()
    } catch (err) { console.error(err) }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="chat-app">
        <div className="orb" style={{ width: 600, height: 600, background: 'var(--accent)', top: '-20%', right: '5%' }} />
        <div className="orb" style={{ width: 500, height: 500, background: 'var(--accent3)', bottom: '-10%', left: '-5%', opacity: 0.3 }} />

        {/* SIDEBAR: TASKS */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">
              <span className="logo">T</span>
              <span>TASKS</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '8px', letterSpacing: '0.1em' }}>
              REAL-TIME SYNC ENABLED
            </div>
          </div>
          
          <div className="task-list">
            {tasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)', fontSize: '12px' }}>
                No tasks yet. Use the chat to add some!
              </div>
            ) : (
              tasks.map(t => (
                <div key={t.id} className={`task-card ${t.completed ? 'completed' : ''}`}>
                  <div className="task-header">
                    <span className={`badge ${t.completed ? 'completed' : 'pending'}`}>
                      {t.completed ? 'Done' : 'ToDo'}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--muted)' }}>#{t.id}</span>
                  </div>
                  <div className="task-title">{t.title}</div>
                  <div className="task-date">{new Date(t.created_at).toLocaleDateString()}</div>
                  <div className="task-actions">
                    {!t.completed && (
                      <button className="action-btn complete" onClick={() => completeTask(t.id)}>Complete</button>
                    )}
                    <button className="action-btn delete" onClick={() => deleteTask(t.id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* MAIN: CHAT */}
        <main className="main-content">
          <header className="chat-header">
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>todo.ai assistant</h2>
              <p style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>PHASE III · AGENTIC WORKFLOW</p>
            </div>
            <div className="status-dot">SYSTEM ACTIVE</div>
          </header>

          <div className="messages-area">
            {messages.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚡</div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>How can I help you today?</h3>
                <p style={{ marginTop: '8px', fontSize: '14px', textAlign: 'center', maxWidth: '400px', lineHeight: 1.6 }}>
                  I'm your agentic task handler. I can create, manage, and track your goals using natural language.
                </p>
                <div className="suggestion-chips">
                  {suggestions.map(s => <span key={s} className="chip" onClick={() => sendMessage(s)}>{s}</span>)}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`msg-row ${m.role === 'user' ? 'user' : 'bot'}`}>
                  <div className={`avatar ${m.role === 'user' ? 'user-av' : 'bot-av'}`}>
                    {m.role === 'user' ? 'U' : 'AI'}
                  </div>
                  <div className={`bubble ${m.role === 'user' ? 'user' : 'bot'}`}>{m.content}</div>
                </div>
              ))
            )}
            {loading && (
              <div className="msg-row bot">
                <div className="avatar bot-av">AI</div>
                <div className="bubble bot thinking">
                  <div className="dot" /><div className="dot" /><div className="dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="input-section">
            <div className="input-container">
              <textarea ref={taRef} className="input-field" value={input} rows={1}
                placeholder="Message todo.ai..."
                onChange={e => { setInput(e.target.value); resize() }}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              />
              <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>➤</button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}