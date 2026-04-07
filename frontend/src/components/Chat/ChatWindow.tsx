'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

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

  /* AUTH UI */
  .auth-container { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; width: 100%; position:relative; z-index:1; }
  .auth-card { background:rgba(2,6,10,0.6); border:1px solid var(--border); border-radius:24px; padding:40px; width:100%; max-width:400px; backdrop-filter:blur(30px); animation:fadeUp 0.5s ease; box-shadow:0 0 50px rgba(0,255,150,0.05); }
  .auth-title { font-family:var(--font-display); font-size:28px; font-weight:800; margin-bottom:10px; text-align:center; }
  .auth-subtitle { font-family:var(--font-mono); font-size:10px; color:var(--muted); text-align:center; margin-bottom:30px; letter-spacing:0.15em; }
  .auth-input-group { margin-bottom:20px; }
  .auth-input { width:100%; background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:12px; padding:12px 16px; font-family:var(--font-mono); font-size:14px; color:var(--text); outline:none; transition:all 0.2s; }
  .auth-input:focus { border-color:var(--accent); background:rgba(255,255,255,0.07); }
  .auth-btn { width:100%; background:var(--accent); color:#000; border:none; border-radius:12px; padding:14px; font-family:var(--font-mono); font-size:14px; font-weight:700; cursor:pointer; transition:all 0.2s; margin-top:10px; }
  .auth-btn:hover { transform:translateY(-2px); box-shadow:0 0 20px rgba(0,255,150,0.3); }
  .auth-toggle { font-family:var(--font-mono); font-size:12px; color:var(--muted); text-align:center; margin-top:20px; cursor:pointer; }
  .auth-toggle span { color:var(--accent); text-decoration:underline; }
  .auth-error { color:#ef4444; font-family:var(--font-mono); font-size:12px; margin-top:10px; text-align:center; }
`

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [convId, setConvId] = useState<string | null>(null)
  
  // Auth state
  const [token, setToken] = useState<string | null>(null)
  const [isLoginView, setIsLoginView] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [activeUser, setActiveUser] = useState<string>('')
  const [showProfile, setShowProfile] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

  const router = useRouter()
  const bottomRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('todo_token')
    if (savedToken) {
      setToken(savedToken)
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]))
        if (payload.sub) setActiveUser(payload.sub)
      } catch (e) {}
    }
  }, [])

  const suggestions = [
    '🛒 Add task: Buy groceries',
    '📋 Show my tasks',
    '⏳ What\'s pending?',
    '✅ Complete task 1',
  ]

  const fetchTasks = async () => {
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      } else if (res.status === 401) {
        handleLogout()
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    }
  }

  useEffect(() => {
    if (token) {
      fetchTasks()
      const interval = setInterval(fetchTasks, 10000)
      return () => clearInterval(interval)
    }
  }, [token])

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
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
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
      await fetch(`${API_URL}/api/tasks/${id}/complete`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchTasks()
    } catch (err) { console.error(err) }
  }

  const deleteTask = async (id: number) => {
    if (!confirm('Delete this task?')) return
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchTasks()
    } catch (err) { console.error(err) }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    
    try {
      let res;
      if (isLoginView) {
        // Login uses OAuth2PasswordRequestForm (form-urlencoded)
        const formData = new URLSearchParams()
        formData.append('username', username)
        formData.append('password', password)
        res = await fetch(`${API_URL}/api/auth/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData
        })
      } else {
        // Register uses our new UserRegister schema (JSON)
        res = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        })
      }

      const data = await res.json()
      if (res.ok) {
        setToken(data.access_token)
        localStorage.setItem('todo_token', data.access_token)
        try {
          const payload = JSON.parse(atob(data.access_token.split('.')[1]))
          if (payload.sub) setActiveUser(payload.sub)
        } catch (e) {}
        // Reset fields
        setUsername('')
        setEmail('')
        setPassword('')
      } else {
        setAuthError(data.detail || 'Authentication failed')
      }
    } catch (err) {
      setAuthError('Network error')
    }
  }

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('todo_token')
    setActiveUser('')
    setTasks([])
    setMessages([])
    setConvId(null)
    setShowProfile(false)
    router.push('/')
  }

  return (
    <>
      <style>{styles}</style>
      <div className="chat-app">
        <div className="orb" style={{ width: 600, height: 600, background: 'var(--accent)', top: '-20%', right: '5%' }} />
        <div className="orb" style={{ width: 500, height: 500, background: 'var(--accent3)', bottom: '-10%', left: '-5%', opacity: 0.3 }} />

        {!token ? (
          <div className="auth-container">
            <div className="auth-card">
              <div className="auth-title">todo.ai</div>
              <div className="auth-subtitle">SECURE AGENTIC WORKSPACE</div>
              <form onSubmit={handleAuth}>
                <div className="auth-input-group">
                  <input className="auth-input" type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                {!isLoginView && (
                  <div className="auth-input-group">
                    <input className="auth-input" type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                )}
                <div className="auth-input-group">
                  <input className="auth-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                {authError && <div className="auth-error">{authError}</div>}
                <button className="auth-btn" type="submit">
                  {isLoginView ? 'INITIALIZE LINK' : 'CREATE PROTOCOL'}
                </button>
              </form>
              <div className="auth-toggle" onClick={() => setIsLoginView(!isLoginView)}>
                {isLoginView ? "Don't have an account? " : "Already have an account? "}
                <span>{isLoginView ? 'Sign Up' : 'Log In'}</span>
              </div>
            </div>
          </div>
        ) : showProfile ? (
          <div className="auth-container">
            <div className="auth-card" style={{ textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 800, margin: '0 auto 20px' }}>
                {activeUser ? activeUser[0].toUpperCase() : 'U'}
              </div>
              <div className="auth-title">{activeUser}</div>
              <div className="auth-subtitle">AGENTIC PROTOCOL USER</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-around', margin: '30px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '15px 0' }}>
                 <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)' }}>{tasks.length}</div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>TOTAL TASKS</div>
                 </div>
                 <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent3)' }}>{tasks.filter(t => t.completed).length}</div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>COMPLETED</div>
                 </div>
              </div>

              <button className="auth-btn" onClick={() => setShowProfile(false)}>
                RETURN TO WORKSPACE
              </button>
              <button onClick={handleLogout} style={{ width: '100%', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '12px', padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginTop: '10px', transition: 'all 0.2s' }}>
                LOGOUT SYSTEM
              </button>
            </div>
          </div>
        ) : (
          <>
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
            <div className="status-dot">
              SYSTEM ACTIVE
              <div onClick={() => setShowProfile(true)} style={{ cursor: 'pointer', marginLeft: 20, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '5px 12px', borderRadius: 20, border: '1px solid var(--border)', gap: 10, transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>
                  {activeUser ? activeUser[0].toUpperCase() : 'U'}
                </div>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{activeUser}</span>
              </div>
            </div>
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
        </>
        )}
      </div>
    </>
  )
}