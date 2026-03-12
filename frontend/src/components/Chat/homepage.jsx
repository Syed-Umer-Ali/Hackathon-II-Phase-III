"use client";
import { useState, useEffect } from "react";
import { CheckCircle, Circle, Zap } from "lucide-react";
import Link from "next/link";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@400;600;700;800&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --bg:#020408; --surface:rgba(255,255,255,0.03); --surface-hover:rgba(255,255,255,0.06);
    --border:rgba(0,255,150,0.12); --border-bright:rgba(0,255,150,0.35);
    --accent:#00ff96; --accent3:#06b6d4; --text:#e8f4f0; --muted:#5a7a6e;
    --font-mono:'JetBrains Mono',monospace; --font-display:'Syne',sans-serif;
  }
  body { background:var(--bg); color:var(--text); font-family:var(--font-display); overflow-x:hidden; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes pulseGlow { 0%,100%{box-shadow:0 0 20px rgba(0,255,150,0.2)} 50%{box-shadow:0 0 50px rgba(0,255,150,0.5)} }
  @keyframes gradMove { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  .au{animation:fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) both}
  .d1{animation-delay:.1s}.d2{animation-delay:.25s}.d3{animation-delay:.4s}.d4{animation-delay:.55s}
  .glass{background:var(--surface);border:1px solid var(--border);backdrop-filter:blur(16px);transition:all 0.3s ease}
  .glass:hover{background:var(--surface-hover);border-color:var(--border-bright)}
  .btn-p{background:var(--accent);color:#000;border:none;padding:14px 32px;font-family:var(--font-mono);font-size:14px;font-weight:700;border-radius:8px;cursor:pointer;letter-spacing:.05em;transition:all 0.2s;animation:pulseGlow 3s ease-in-out infinite}
  .btn-p:hover{transform:translateY(-2px);box-shadow:0 0 40px rgba(0,255,150,0.5)}
  .btn-g{background:transparent;color:var(--text);border:1px solid var(--border-bright);padding:14px 32px;font-family:var(--font-mono);font-size:14px;font-weight:600;border-radius:8px;cursor:pointer;letter-spacing:.05em;transition:all 0.2s}
  .btn-g:hover{background:var(--surface-hover);border-color:var(--accent);color:var(--accent);transform:translateY(-2px)}
  .tag{font-family:var(--font-mono);font-size:11px;padding:4px 10px;border-radius:4px;font-weight:600;letter-spacing:.08em}
  .phase-card{border-radius:16px;padding:24px;position:relative;overflow:hidden;transition:all 0.3s ease}
  .phase-card:hover{transform:translateY(-4px)}
  .phase-card.active{box-shadow:0 0 30px rgba(0,255,150,0.12)}
  .progress-bar{height:3px;border-radius:2px;background:rgba(255,255,255,0.06);overflow:hidden;margin-top:12px}
  .progress-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--accent),var(--accent3));transition:width 1.8s cubic-bezier(0.4,0,0.2,1)}
  .cursor-blink{display:inline-block;width:2px;height:1em;background:var(--accent);margin-left:2px;vertical-align:text-bottom;animation:blink 1s step-end infinite}
  .tool-card{border-radius:14px;padding:22px;transition:all 0.3s;cursor:default}
  .tool-card:hover{transform:translateY(-4px)}
  .tech-pill{font-family:var(--font-mono);font-size:12px;padding:8px 16px;border-radius:20px;display:flex;align-items:center;gap:8px;transition:all 0.2s;cursor:default}
  .tech-pill:hover{border-color:rgba(0,255,150,0.3)!important;background:rgba(0,255,150,0.05)!important}
  .grid-bg{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,255,150,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,150,0.025) 1px,transparent 1px);background-size:64px 64px}
  .orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none}
  .arch-icon{width:52px;height:52px;border-radius:14px;margin:0 auto 8px;background:rgba(255,255,255,0.04);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:22px;transition:all 0.3s}
  .arch-icon:hover{border-color:var(--border-bright);background:rgba(0,255,150,0.05);transform:translateY(-3px)}
  nav a{font-family:var(--font-mono);font-size:12px;color:var(--muted);cursor:pointer;letter-spacing:.08em;transition:color 0.2s;text-decoration:none}
  nav a:hover{color:var(--accent)}
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-track{background:#000}
  ::-webkit-scrollbar-thumb{background:rgba(0,255,150,0.25);border-radius:3px}
`;

const phases = [
  { id: 1, name: "Console App", tech: "Python", points: 100, status: "done", desc: "In-memory CLI todo app" },
  { id: 2, name: "Full-Stack Web", tech: "Next.js + FastAPI", points: 150, status: "done", desc: "REST API + Neon DB + Auth" },
  { id: 3, name: "AI Chatbot", tech: "Agents SDK + MCP", points: 200, status: "active", desc: "Natural language todo mgmt" },
  { id: 4, name: "Kubernetes", tech: "Minikube + Helm", points: 250, status: "upcoming", desc: "Local K8s deployment" },
  { id: 5, name: "Cloud Deploy", tech: "DigitalOcean DOKS", points: 300, status: "upcoming", desc: "Kafka + Dapr distributed" },
];

const mcpTools = [
  { name: "add_task", desc: "Create new todos via natural language", color: "#00ff96" },
  { name: "list_tasks", desc: "Fetch & filter task lists", color: "#06b6d4" },
  { name: "complete_task", desc: "Mark tasks as done", color: "#a78bfa" },
  { name: "update_task", desc: "Modify existing tasks", color: "#fbbf24" },
  { name: "delete_task", desc: "Remove tasks permanently", color: "#f87171" },
];

const techStack = [
  { name: "Next.js", icon: "⚡" }, { name: "FastAPI", icon: "🚀" }, { name: "OpenAI Agents SDK", icon: "🧠" },
  { name: "Official MCP SDK", icon: "🔌" }, { name: "Neon PostgreSQL", icon: "🗄️" }, { name: "SQLModel", icon: "🏗️" },
  { name: "Better Auth", icon: "🔐" }, { name: "Docker", icon: "🐳" }, { name: "Kubernetes", icon: "☸️" },
  { name: "Claude Code", icon: "🤖" }, { name: "Spec-Kit Plus", icon: "📋" }, { name: "Kafka", icon: "📨" },
];

const archNodes = [
  { icon: "💬", label: "Chat UI", sub: "Next.js" },
  { icon: "⚡", label: "FastAPI", sub: "Backend" },
  { icon: "🧠", label: "AI Agent", sub: "OpenAI SDK" },
  { icon: "🔌", label: "MCP Server", sub: "5 Tools" },
  { icon: "🗄️", label: "Neon DB", sub: "PostgreSQL" },
];

export default function App() {
  const [progressVisible, setProgressVisible] = useState(false);
  const [typed, setTyped] = useState("");
  const full = "Manage todos with natural language AI";

  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        if (i < full.length) setTyped(full.slice(0, ++i));
        else clearInterval(iv);
      }, 42);
      return () => clearInterval(iv);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setProgressVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

        {/* NAV */}
        <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(2,4,8,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,255,150,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 7, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#000", fontSize: 15, fontFamily: "var(--font-mono)" }}>T</div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>todo.ai</span>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {["Phases", "Architecture", "Tech Stack", "MCP Tools"].map(n => <a key={n}>{n}</a>)}
          </div>
          <div className="tag" style={{ background: "rgba(0,255,150,0.1)", border: "1px solid rgba(0,255,150,0.25)", color: "var(--accent)" }}>⚡ PHASE III ACTIVE</div>
        </nav>

        {/* HERO */}
        <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 40px 80px", position: "relative", overflow: "hidden" }}>
          <div className="grid-bg" />
          <div className="orb" style={{ width: 700, height: 700, background: "rgba(0,255,150,0.05)", top: "-10%", left: "55%" }} />
          <div className="orb" style={{ width: 450, height: 450, background: "rgba(124,58,237,0.07)", bottom: "10%", left: "-5%" }} />
          <div className="orb" style={{ width: 300, height: 300, background: "rgba(6,182,212,0.06)", top: "20%", right: "5%" }} />

          <div style={{ maxWidth: 820, textAlign: "center", position: "relative", zIndex: 1 }}>
            <div className="au" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
              <span className="tag" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa" }}>Hackathon II — Panaversity</span>
              <span className="tag" style={{ background: "rgba(0,255,150,0.1)", border: "1px solid rgba(0,255,150,0.25)", color: "var(--accent)" }}>Spec-Driven Development</span>
            </div>

            <h1 className="au d1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(46px,8vw,92px)", fontWeight: 800, lineHeight: 1.03, letterSpacing: "-0.03em", marginBottom: 24 }}>
              <span>Evolution of </span>
              <span style={{ background: "linear-gradient(135deg,var(--accent),var(--accent3))", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto", animation: "gradMove 4s ease infinite" }}>Todo</span>
            </h1>

            <div className="au d2" style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(13px,2vw,17px)", color: "var(--muted)", marginBottom: 48, minHeight: 26 }}>
              <span style={{ color: "var(--accent)" }}>$ </span>{typed}<span className="cursor-blink" />
            </div>

            <div className="au d3" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/chat"><button className="btn-p">View Live Demo →</button></Link>
              <button className="btn-g">GitHub Repo</button>
            </div>

            <div className="au d4" style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
              {[["5", "Phases"], ["1000", "Total Pts"], ["5", "MCP Tools"], ["3", "AI Layers"]].map(([v, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 30, fontWeight: 700, color: "var(--accent)", lineHeight: 1 }}>{v}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", marginTop: 4, letterSpacing: ".12em" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PHASES */}
        <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 44, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", letterSpacing: ".15em", marginBottom: 8 }}>// HACKATHON PHASES</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,4vw,42px)", fontWeight: 800 }}>Project Progression</h2>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>
              <span style={{ color: "var(--accent)" }}>250</span> / 1000 pts earned
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 14 }}>
            {phases.map(p => (
              <div key={p.id} className={`glass phase-card${p.status === "active" ? " active" : ""}`}
                style={{ opacity: p.status === "upcoming" ? 0.55 : 1, border: `1px solid ${p.status === "active" ? "var(--accent)" : "var(--border)"}` }}>
                {p.status === "active" && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,var(--accent),var(--accent3))" }} />}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 4, color: "var(--muted)", letterSpacing: ".08em" }}>PHASE {p.id}</span>
                  {p.status === "done" && <CheckCircle size={14} color="var(--accent)" />}
                  {p.status === "active" && <Zap size={14} color="var(--accent)" />}
                  {p.status === "upcoming" && <Circle size={14} color="var(--muted)" />}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 5 }}>{p.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", lineHeight: 1.6, marginBottom: 12 }}>{p.desc}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted)" }}>{p.tech}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: p.status === "done" ? "var(--accent)" : p.status === "active" ? "var(--accent3)" : "var(--muted)" }}>+{p.points}pts</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: progressVisible ? (p.status === "done" ? "100%" : p.status === "active" ? "45%" : "0%") : "0%" }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MCP TOOLS */}
        <section style={{ padding: "60px 40px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", letterSpacing: ".15em", marginBottom: 8 }}>// MCP SERVER</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,4vw,42px)", fontWeight: 800 }}>AI Tool Layer</h2>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)", marginTop: 10 }}>5 tools exposed to OpenAI Agents SDK for natural language task management</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
            {mcpTools.map(t => (
              <div key={t.name} className="glass tool-card"
                style={{ border: `1px solid ${t.color}22` }}
                onMouseEnter={e => e.currentTarget.style.borderColor = t.color + "55"}
                onMouseLeave={e => e.currentTarget.style.borderColor = t.color + "22"}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: t.color, boxShadow: `0 0 8px ${t.color}` }} />
                  <code style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: t.color }}>{t.name}()</code>
                </div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", lineHeight: 1.6 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ARCHITECTURE */}
        <section style={{ padding: "60px 40px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", letterSpacing: ".15em", marginBottom: 8 }}>// SYSTEM DESIGN</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,4vw,42px)", fontWeight: 800 }}>Architecture</h2>
          </div>
          <div className="glass" style={{ borderRadius: 20, padding: "36px 28px", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              {archNodes.map((node, i) => (
                <div key={i} style={{ display: "contents" }}>
                  <div style={{ textAlign: "center", flex: 1, minWidth: 70 }}>
                    <div className="arch-icon">{node.icon}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 700 }}>{node.label}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted)", marginTop: 2 }}>{node.sub}</div>
                  </div>
                  {i < archNodes.length - 1 && <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "var(--accent)", opacity: 0.4, flexShrink: 0 }}>→</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TECH STACK */}
        <section style={{ padding: "60px 40px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", letterSpacing: ".15em", marginBottom: 8 }}>// BUILT WITH</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,4vw,42px)", fontWeight: 800 }}>Tech Stack</h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {techStack.map(t => (
              <div key={t.name} className="glass tech-pill" style={{ border: "1px solid rgba(255,255,255,0.07)", color: "var(--text)" }}>
                <span>{t.icon}</span><span>{t.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: "1px solid var(--border)", padding: "28px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, marginTop: 40 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)" }}>
            <span style={{ color: "var(--accent)" }}>©</span> 2025 Evolution of Todo — Hackathon II
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Panaversity", "PIAIC", "GIAIC"].map(n => (
              <span key={n} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", letterSpacing: ".1em" }}>{n}</span>
            ))}
          </div>
        </footer>

      </div>
    </>
  );
}
