import { useState, useEffect, useRef, useCallback } from "react";

const ACCENT = "#E8FF47";
const ACCENT2 = "#FF6B35";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0a;
    --surface: #111111;
    --surface2: #181818;
    --border: #222222;
    --border2: #2e2e2e;
    --text: #f0f0f0;
    --muted: #666666;
    --muted2: #444444;
    --accent: ${ACCENT};
    --accent2: ${ACCENT2};
    --red: #ff4444;
    --amber: #ffaa00;
    --green: #44ff88;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Mono', monospace;
    --font-serif: 'Instrument Serif', serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); overflow-x: hidden; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .sf-app { min-height: 100vh; }

  /* NAV */
  .sf-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 56px;
    background: rgba(10,10,10,0.92);
    border-bottom: 0.5px solid var(--border);
    backdrop-filter: blur(12px);
  }
  .sf-nav-logo { display: flex; align-items: center; gap: 10px; }
  .sf-nav-mark {
    width: 28px; height: 28px; background: var(--accent);
    border-radius: 6px; display: flex; align-items: center; justify-content: center;
  }
  .sf-nav-mark svg { width: 16px; height: 16px; }
  .sf-nav-name { font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; }
  .sf-nav-phase { font-size: 11px; color: var(--muted); font-family: var(--font-body); }
  .sf-nav-score {
    font-family: var(--font-display); font-size: 13px; font-weight: 700;
    background: var(--surface2); border: 0.5px solid var(--border2);
    padding: 4px 12px; border-radius: 20px; color: var(--accent);
  }

  /* PHASES SIDEBAR */
  .sf-layout { display: flex; padding-top: 56px; min-height: 100vh; }
  .sf-sidebar {
    width: 220px; flex-shrink: 0; background: var(--surface);
    border-right: 0.5px solid var(--border);
    padding: 2rem 0; position: sticky; top: 56px; height: calc(100vh - 56px);
    overflow-y: auto;
  }
  .sf-sidebar-label { font-size: 10px; color: var(--muted); letter-spacing: 0.12em; padding: 0 1.5rem 0.75rem; text-transform: uppercase; }
  .sf-phase-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 1.5rem; cursor: pointer;
    transition: background 0.15s;
    border-left: 2px solid transparent;
    font-size: 12px; color: var(--muted);
    font-family: var(--font-body);
  }
  .sf-phase-item:hover { background: var(--surface2); color: var(--text); }
  .sf-phase-item.active { border-left-color: var(--accent); color: var(--accent); background: rgba(232,255,71,0.05); }
  .sf-phase-item.done { color: var(--green); }
  .sf-phase-dot {
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--surface2); border: 0.5px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 500; flex-shrink: 0;
  }
  .sf-phase-item.active .sf-phase-dot { background: var(--accent); color: #000; border-color: var(--accent); }
  .sf-phase-item.done .sf-phase-dot { background: var(--green); color: #000; border-color: var(--green); }
  .sf-phase-name { font-size: 11px; line-height: 1.3; }

  /* MAIN */
  .sf-main { flex: 1; min-width: 0; padding: 3rem 3rem 6rem; max-width: 860px; }

  /* HERO */
  .sf-hero { padding: 4rem 0 5rem; }
  .sf-hero-tag {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; color: var(--accent); border: 0.5px solid rgba(232,255,71,0.3);
    padding: 4px 12px; border-radius: 20px; margin-bottom: 2rem;
    font-family: var(--font-body);
  }
  .sf-hero-tag-dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
  .sf-hero h1 {
    font-family: var(--font-display); font-size: clamp(40px, 6vw, 72px);
    font-weight: 800; line-height: 0.95; letter-spacing: -0.03em;
    color: var(--text); margin-bottom: 1.5rem;
  }
  .sf-hero h1 em { font-style: italic; font-family: var(--font-serif); color: var(--accent); font-weight: 400; }
  .sf-hero-sub { font-size: 14px; color: var(--muted); line-height: 1.7; max-width: 520px; margin-bottom: 2.5rem; }
  .sf-hero-stats { display: flex; gap: 2rem; margin-bottom: 3rem; }
  .sf-stat { }
  .sf-stat-num { font-family: var(--font-display); font-size: 28px; font-weight: 800; color: var(--accent); }
  .sf-stat-label { font-size: 11px; color: var(--muted); margin-top: 2px; }

  /* INPUTS */
  .sf-input-section { margin-bottom: 2rem; }
  .sf-input-label { font-size: 11px; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px; display: block; }
  .sf-textarea {
    width: 100%; background: var(--surface); border: 0.5px solid var(--border2);
    border-radius: 8px; padding: 14px 16px; color: var(--text);
    font-family: var(--font-body); font-size: 12px; line-height: 1.6;
    resize: vertical; min-height: 120px; transition: border-color 0.15s;
    outline: none;
  }
  .sf-textarea:focus { border-color: var(--accent); }
  .sf-textarea::placeholder { color: var(--muted2); }

  /* BUTTONS */
  .sf-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--accent); color: #000; border: none;
    font-family: var(--font-display); font-size: 14px; font-weight: 700;
    padding: 12px 28px; border-radius: 6px; cursor: pointer;
    transition: transform 0.1s, background 0.15s;
    letter-spacing: -0.01em;
  }
  .sf-btn-primary:hover { background: #d4eb30; transform: translateY(-1px); }
  .sf-btn-primary:active { transform: scale(0.98); }
  .sf-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .sf-btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: var(--muted); border: 0.5px solid var(--border2);
    font-family: var(--font-body); font-size: 12px;
    padding: 10px 20px; border-radius: 6px; cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }
  .sf-btn-ghost:hover { color: var(--text); border-color: var(--border2); }

  /* SECTION HEADINGS */
  .sf-section-head { margin-bottom: 2rem; }
  .sf-section-tag { font-size: 10px; color: var(--accent); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; font-family: var(--font-body); }
  .sf-section-title { font-family: var(--font-display); font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); line-height: 1.1; }
  .sf-section-sub { font-size: 13px; color: var(--muted); margin-top: 8px; line-height: 1.6; }

  /* CARDS */
  .sf-card {
    background: var(--surface); border: 0.5px solid var(--border);
    border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 12px;
  }
  .sf-card-accent { border-left: 3px solid var(--accent); border-radius: 0 8px 8px 0; }
  .sf-card-danger { border-left: 3px solid var(--red); border-radius: 0 8px 8px 0; }
  .sf-card-warn { border-left: 3px solid var(--amber); border-radius: 0 8px 8px 0; }
  .sf-card-ok { border-left: 3px solid var(--green); border-radius: 0 8px 8px 0; }

  /* PHASE 2 CHAT */
  .sf-chat { display: flex; flex-direction: column; gap: 16px; margin-bottom: 2rem; }
  .sf-msg { display: flex; gap: 12px; animation: fadeUp 0.3s ease; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  .sf-msg-avatar {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;
  }
  .sf-msg-avatar.ai { background: var(--accent); color: #000; font-family: var(--font-display); }
  .sf-msg-avatar.user { background: var(--surface2); color: var(--muted); border: 0.5px solid var(--border2); font-family: var(--font-display); }
  .sf-msg-bubble { flex: 1; }
  .sf-msg-name { font-size: 10px; color: var(--muted); margin-bottom: 4px; letter-spacing: 0.05em; }
  .sf-msg-content {
    font-size: 13px; line-height: 1.7; color: var(--text);
    background: var(--surface); border: 0.5px solid var(--border);
    border-radius: 4px 12px 12px 12px; padding: 12px 16px;
  }
  .sf-msg.user .sf-msg-content { background: var(--surface2); border-radius: 12px 4px 12px 12px; }
  .sf-chat-input-row { display: flex; gap: 8px; }
  .sf-chat-input {
    flex: 1; background: var(--surface); border: 0.5px solid var(--border2);
    border-radius: 8px; padding: 12px 16px; color: var(--text);
    font-family: var(--font-body); font-size: 13px; outline: none;
    transition: border-color 0.15s;
  }
  .sf-chat-input:focus { border-color: var(--accent); }
  .sf-chat-input::placeholder { color: var(--muted2); }

  /* SKILL BARS */
  .sf-skill-grid { display: flex; flex-direction: column; gap: 12px; }
  .sf-skill-row { }
  .sf-skill-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
  .sf-skill-name { font-size: 12px; color: var(--text); font-family: var(--font-body); }
  .sf-skill-badges { display: flex; gap: 6px; align-items: center; }
  .sf-badge { font-size: 10px; padding: 2px 8px; border-radius: 20px; font-family: var(--font-body); }
  .sf-badge-red { background: rgba(255,68,68,0.15); color: var(--red); }
  .sf-badge-amber { background: rgba(255,170,0,0.15); color: var(--amber); }
  .sf-badge-green { background: rgba(68,255,136,0.15); color: var(--green); }
  .sf-badge-accent { background: rgba(232,255,71,0.15); color: var(--accent); }
  .sf-bar-wrap { height: 4px; background: var(--surface2); border-radius: 2px; overflow: hidden; position: relative; }
  .sf-bar { height: 100%; border-radius: 2px; transition: width 1s cubic-bezier(0.4,0,0.2,1); }
  .sf-bar-label { font-size: 10px; color: var(--muted); margin-top: 4px; display: flex; justify-content: space-between; }

  /* HEATMAP */
  .sf-heatmap { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 1.5rem; }
  .sf-hm-cell { border-radius: 8px; padding: 12px; border: 0.5px solid; }
  .sf-hm-cell.red { background: rgba(255,68,68,0.07); border-color: rgba(255,68,68,0.2); }
  .sf-hm-cell.amber { background: rgba(255,170,0,0.07); border-color: rgba(255,170,0,0.2); }
  .sf-hm-cell.green { background: rgba(68,255,136,0.07); border-color: rgba(68,255,136,0.2); }
  .sf-hm-label { font-size: 11px; font-weight: 500; margin-bottom: 3px; font-family: var(--font-display); }
  .sf-hm-cell.red .sf-hm-label { color: var(--red); }
  .sf-hm-cell.amber .sf-hm-label { color: var(--amber); }
  .sf-hm-cell.green .sf-hm-label { color: var(--green); }
  .sf-hm-sub { font-size: 10px; color: var(--muted); line-height: 1.4; }

  /* TRUTH BOMB */
  .sf-truth {
    background: var(--surface); border: 0.5px solid var(--border2);
    border-top: 3px solid var(--accent2); border-radius: 0 0 12px 12px;
    padding: 1.5rem; margin-bottom: 2rem;
  }
  .sf-truth-tag { font-size: 10px; color: var(--accent2); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
  .sf-truth-text { font-family: var(--font-serif); font-style: italic; font-size: 16px; line-height: 1.7; color: var(--text); }

  /* SCORE RING */
  .sf-score-display { display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem; }
  .sf-score-ring { position: relative; width: 100px; height: 100px; flex-shrink: 0; }
  .sf-score-ring svg { transform: rotate(-90deg); }
  .sf-score-num { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 26px; font-weight: 800; color: var(--accent); }
  .sf-score-info h3 { font-family: var(--font-display); font-size: 18px; font-weight: 700; margin-bottom: 4px; }
  .sf-score-info p { font-size: 12px; color: var(--muted); line-height: 1.6; }

  /* PLAN PHASES */
  .sf-plan-phases { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 2rem; }
  .sf-plan-phase { background: var(--surface); border: 0.5px solid var(--border); border-radius: 12px; padding: 1.25rem; }
  .sf-plan-phase-num { font-size: 10px; color: var(--accent); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
  .sf-plan-phase-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; margin-bottom: 12px; }
  .sf-plan-item { display: flex; gap: 8px; margin-bottom: 8px; }
  .sf-plan-dot { width: 5px; height: 5px; background: var(--border2); border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
  .sf-plan-text { font-size: 11px; color: var(--muted); line-height: 1.5; }

  /* RESOURCES */
  .sf-resource-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 2rem; }
  .sf-resource-card { background: var(--surface); border: 0.5px solid var(--border); border-radius: 10px; padding: 1rem; }
  .sf-resource-skill { font-size: 10px; color: var(--accent); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; }
  .sf-resource-name { font-size: 13px; font-weight: 500; font-family: var(--font-display); margin-bottom: 4px; }
  .sf-resource-desc { font-size: 11px; color: var(--muted); line-height: 1.4; }
  .sf-resource-tag { display: inline-block; font-size: 9px; padding: 2px 6px; border-radius: 4px; background: var(--surface2); color: var(--muted); margin-top: 6px; border: 0.5px solid var(--border); }

  /* SCORECARD */
  .sf-scorecard { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 2rem; }
  .sf-sc-card { background: var(--surface); border: 0.5px solid var(--border); border-radius: 10px; padding: 1rem; text-align: center; }
  .sf-sc-num { font-family: var(--font-display); font-size: 28px; font-weight: 800; color: var(--accent); }
  .sf-sc-label { font-size: 10px; color: var(--muted); margin-top: 4px; }

  /* LOADING */
  .sf-loading { display: flex; align-items: center; gap: 8px; padding: 12px 16px; }
  .sf-dots { display: flex; gap: 4px; }
  .sf-dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: dot-bounce 1.2s infinite; }
  .sf-dot:nth-child(2) { animation-delay: 0.2s; }
  .sf-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dot-bounce { 0%,80%,100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }

  /* SPRINT TABLE */
  .sf-sprint { border: 0.5px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 2rem; }
  .sf-sprint-row { display: grid; grid-template-columns: 80px 1fr 1fr; border-bottom: 0.5px solid var(--border); }
  .sf-sprint-row:last-child { border-bottom: none; }
  .sf-sprint-cell { padding: 10px 14px; font-size: 12px; }
  .sf-sprint-head { background: var(--surface2); font-size: 10px; color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; }
  .sf-sprint-day { color: var(--accent); font-weight: 500; }

  /* DIVIDER */
  .sf-divider { border: none; border-top: 0.5px solid var(--border); margin: 2rem 0; }

  /* ARCHETYPE */
  .sf-archetype {
    display: flex; align-items: flex-start; gap: 1rem;
    background: var(--surface); border: 0.5px solid var(--border);
    border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 2rem;
  }
  .sf-arch-icon {
    width: 44px; height: 44px; background: var(--accent); border-radius: 10px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .sf-arch-tag { font-size: 10px; color: var(--muted); margin-bottom: 4px; }
  .sf-arch-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .sf-arch-desc { font-size: 12px; color: var(--muted); line-height: 1.6; }

  /* PHASE GATE */
  .sf-gate {
    text-align: center; padding: 4rem 2rem;
    border: 0.5px dashed var(--border2); border-radius: 12px; margin-bottom: 2rem;
  }
  .sf-gate-icon { font-size: 32px; margin-bottom: 1rem; }
  .sf-gate-title { font-family: var(--font-display); font-size: 20px; font-weight: 700; margin-bottom: 8px; }
  .sf-gate-sub { font-size: 13px; color: var(--muted); margin-bottom: 1.5rem; }

  /* RISK */
  .sf-risk-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 2rem; }
  .sf-risk-item { display: flex; align-items: flex-start; gap: 10px; background: var(--surface); border: 0.5px solid var(--border); border-radius: 8px; padding: 12px 14px; }
  .sf-risk-icon { width: 20px; height: 20px; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .sf-risk-icon.high { background: rgba(255,68,68,0.15); }
  .sf-risk-icon.med { background: rgba(255,170,0,0.15); }
  .sf-risk-text { font-size: 12px; color: var(--muted); line-height: 1.5; }
  .sf-risk-label { font-size: 12px; font-weight: 500; color: var(--text); margin-bottom: 2px; }

  /* WEEKLY TRACKER */
  .sf-tracker { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 2rem; }
  .sf-tracker-cell { aspect-ratio: 1; border-radius: 4px; background: var(--surface); border: 0.5px solid var(--border); cursor: pointer; transition: background 0.15s; display: flex; align-items: center; justify-content: center; font-size: 9px; color: var(--muted); }
  .sf-tracker-cell.filled { background: var(--accent); color: #000; border-color: var(--accent); }
  .sf-tracker-cell:hover { border-color: var(--border2); }

  .sf-progress-multi { display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.5rem; }
  .sf-pm-row { display: flex; align-items: center; gap: 10px; }
  .sf-pm-label { font-size: 11px; color: var(--muted); width: 140px; flex-shrink: 0; }
  .sf-pm-bar { flex: 1; height: 4px; background: var(--surface2); border-radius: 2px; overflow: hidden; }
  .sf-pm-fill { height: 100%; border-radius: 2px; }
  .sf-pm-val { font-size: 11px; color: var(--text); width: 30px; text-align: right; }
`;

const PHASES = [
  { num: 1, name: "Intelligence extraction", short: "Phase 1" },
  { num: 2, name: "Adaptive assessment", short: "Phase 2" },
  { num: 3, name: "Proficiency scoring", short: "Phase 3" },
  { num: 4, name: "Readiness review", short: "Phase 4" },
  { num: 5, name: "Learning plan", short: "Phase 5" },
  { num: 6, name: "Accountability coach", short: "Phase 6" },
];

function ScoreRing({ score, size = 100 }) {
  const r = 38; const circ = 2 * Math.PI * r;
  const pct = Math.round(score) / 100;
  return (
    <div className="sf-score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#1a1a1a" strokeWidth="6" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={ACCENT} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div className="sf-score-num">{Math.round(score)}</div>
    </div>
  );
}

function SkillBar({ name, claimed, demonstrated, required, priority }) {
  const colors = { critical: "#ff4444", important: "#ffaa00", nice: "#44ff88" };
  const badgeClass = { critical: "sf-badge-red", important: "sf-badge-amber", nice: "sf-badge-green" };
  const barColor = demonstrated >= required ? "#44ff88" : demonstrated >= required * 0.6 ? "#ffaa00" : "#ff4444";
  return (
    <div className="sf-skill-row">
      <div className="sf-skill-top">
        <span className="sf-skill-name">{name}</span>
        <div className="sf-skill-badges">
          <span className={`sf-badge ${badgeClass[priority]}`}>{priority}</span>
          <span style={{ fontSize: 10, color: "var(--muted)" }}>{demonstrated}/5</span>
        </div>
      </div>
      <div className="sf-bar-wrap">
        <div className="sf-bar" style={{ width: `${(demonstrated / 5) * 100}%`, background: barColor }} />
      </div>
      <div className="sf-bar-label">
        <span>claimed: {claimed}/5</span>
        <span>required: {required}/5</span>
      </div>
    </div>
  );
}

const SYSTEM_PROMPT = `You are SkillForge AI, an elite career readiness assessment agent. You are conducting a structured adaptive interview for a candidate applying to a Data Analyst role at Xapads Media (an ad-tech company).

Candidate: Sara Sharma — Final-year CS (AI & ML) student. Has internship experience in data pipelines, Power BI dashboards, ML modeling. Strong Python/ML skills. Weak on: Excel, ad-tech domain, campaign analytics, business KPIs.

JD Key Requirements: Large-scale data analysis, KPI design, campaign lifecycle analytics, statistical packages (Excel, R), communication skills, ad platform knowledge.

Your job: Ask smart, progressive discovery questions across these categories (rotate naturally):
- Career goals, timeline, target companies, motivations
- Skill self-ratings (fundamentals, practical, problem-solving, interview confidence) for key skills: Excel, SQL, Python, Statistics, Data Visualization, Business Analytics
- Probing questions: Start conceptual, escalate to applied/scenario/edge-case
- Portfolio depth: original vs tutorial projects, deployment, architecture decisions
- Interview readiness: DSA, SQL, system design, behavioral
- Daily routine and study constraints
- Self-diagnosed gaps

Rules:
- Ask ONE focused question at a time. Never ask more than 2 questions per message.
- Be direct, professional, intellectually engaged. Not robotic.
- Adapt difficulty based on responses.
- After 8-10 exchanges, say "I have enough to generate your full assessment. Type 'generate assessment' to proceed."
- Keep responses under 120 words.`;

async function callClaude(messages) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("") || "Sorry, something went wrong.";
}

const ASSESSMENT_SYSTEM = `You are SkillForge AI. Generate a complete career readiness assessment in structured JSON for Sara Sharma based on the conversation. Return ONLY valid JSON, no markdown fences.

Schema:
{
  "readinessScore": number (0-100),
  "archetype": string,
  "archetypeDesc": string,
  "verdictTitle": string,
  "verdictBody": string,
  "hiringManagerView": string,
  "truthBomb": string,
  "skills": [{"name": string, "claimed": number, "demonstrated": number, "required": number, "priority": "critical"|"important"|"nice"}],
  "heatmap": [{"label": string, "status": "red"|"amber"|"green", "note": string}],
  "risks": [{"label": string, "detail": string, "severity": "high"|"med"}],
  "strengths": [string],
  "plan30": [string],
  "plan60": [string],
  "plan90": [string],
  "resources": [{"skill": string, "name": string, "desc": string, "type": "free"|"premium"|"platform"}],
  "weeklyPlan": [{"day": string, "focus": string, "hours": string}],
  "readinessBreakdown": {"technical": number, "interview": number, "portfolio": number, "resume": number, "domain": number}
}`;

async function generateAssessment(conversation) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: ASSESSMENT_SYSTEM,
      messages: [{ role: "user", content: `Conversation history:\n${conversation.map(m => `${m.role}: ${m.content}`).join("\n")}\n\nGenerate the assessment JSON now.` }],
    }),
  });
  const data = await res.json();
  const raw = data.content?.map(b => b.text || "").join("") || "{}";
  try { return JSON.parse(raw.replace(/```json|```/g, "").trim()); }
  catch { return null; }
}

export default function SkillForgeApp() {
  const [phase, setPhase] = useState(1);
  const [completedPhases, setCompletedPhases] = useState([]);
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState(null);
  const [generatingAssessment, setGeneratingAssessment] = useState(false);
  const [trackerDays, setTrackerDays] = useState(Array(35).fill(false));
  const chatEndRef = useRef(null);
  const overallScore = assessment?.readinessScore || 61;

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, loading]);

  const goPhase = (n) => {
    if (n <= phase || completedPhases.includes(n - 1) || n === 1) setPhase(n);
  };

  const startAssessment = async () => {
    if (!jd.trim() && !resume.trim()) return;
    setCompletedPhases(p => [...p, 1]);
    setPhase(2);
    setLoading(true);
    const opening = await callClaude([{ role: "user", content: `Job Description:\n${jd}\n\nResume:\n${resume}\n\nPlease begin the adaptive assessment. Start with the most important discovery question.` }]);
    setChatMessages([{ role: "assistant", content: opening }]);
    setLoading(false);
  };

  const sendMessage = useCallback(async () => {
    if (!chatInput.trim() || loading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    const newMessages = [...chatMessages, { role: "user", content: userMsg }];
    setChatMessages(newMessages);

    if (userMsg.toLowerCase().includes("generate assessment")) {
      setGeneratingAssessment(true);
      const result = await generateAssessment(newMessages);
      setGeneratingAssessment(false);
      if (result) {
        setAssessment(result);
        setCompletedPhases(p => [...new Set([...p, 2, 3])]);
        setPhase(3);
      }
      return;
    }

    setLoading(true);
    const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
    const reply = await callClaude(apiMessages);
    setChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);
  }, [chatInput, chatMessages, loading]);

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const unlockPhase = (n) => {
    setCompletedPhases(p => [...new Set([...p, n])]);
    setPhase(n + 1);
  };

  const toggleTracker = (i) => setTrackerDays(d => { const n = [...d]; n[i] = !n[i]; return n; });

  return (
    <>
      <style>{css}</style>
      <div className="sf-app">
        <nav className="sf-nav">
          <div className="sf-nav-logo">
            <div className="sf-nav-mark">
              <svg viewBox="0 0 16 16" fill="none"><path d="M8 1L10 6H15L11 9L12.5 14L8 11L3.5 14L5 9L1 6H6L8 1Z" fill="#000"/></svg>
            </div>
            <div>
              <div className="sf-nav-name">SkillForge AI</div>
              <div className="sf-nav-phase">Career Readiness OS · {PHASES[phase - 1]?.short}</div>
            </div>
          </div>
          <div className="sf-nav-score">{Math.round(overallScore)} / 100</div>
        </nav>

        <div className="sf-layout">
          <aside className="sf-sidebar">
            <div className="sf-sidebar-label">Assessment phases</div>
            {PHASES.map(p => (
              <div key={p.num}
                className={`sf-phase-item ${phase === p.num ? "active" : ""} ${completedPhases.includes(p.num) ? "done" : ""}`}
                onClick={() => goPhase(p.num)}>
                <div className="sf-phase-dot">{completedPhases.includes(p.num) ? "✓" : p.num}</div>
                <div className="sf-phase-name">{p.name}</div>
              </div>
            ))}
          </aside>

          <main className="sf-main">

            {/* PHASE 1 */}
            {phase === 1 && (
              <>
                <div className="sf-hero">
                  <div className="sf-hero-tag"><div className="sf-hero-tag-dot" />Career readiness diagnostic · Active</div>
                  <h1>Diagnose your<br /><em>true</em> readiness.</h1>
                  <p className="sf-hero-sub">Paste your job description and resume. SkillForge will run a 6-phase diagnostic — adaptive interview, skill gap analysis, proficiency scoring, and a prescriptive learning plan.</p>
                  <div className="sf-hero-stats">
                    <div className="sf-stat"><div className="sf-stat-num">6</div><div className="sf-stat-label">Assessment phases</div></div>
                    <div className="sf-stat"><div className="sf-stat-num">AI</div><div className="sf-stat-label">Powered interview</div></div>
                    <div className="sf-stat"><div className="sf-stat-num">90</div><div className="sf-stat-label">Day learning plan</div></div>
                  </div>
                </div>
                <div className="sf-input-section">
                  <label className="sf-input-label">Job description</label>
                  <textarea className="sf-textarea" value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste the full job description here..." rows={6} />
                </div>
                <div className="sf-input-section">
                  <label className="sf-input-label">Your resume (plain text)</label>
                  <textarea className="sf-textarea" value={resume} onChange={e => setResume(e.target.value)} placeholder="Paste your resume here..." rows={8} />
                </div>
                <button className="sf-btn-primary" onClick={startAssessment} disabled={!jd.trim() && !resume.trim()}>
                  Begin diagnostic →
                </button>
              </>
            )}

            {/* PHASE 2 */}
            {phase === 2 && (
              <>
                <div className="sf-section-head">
                  <div className="sf-section-tag">Phase 2 — Adaptive assessment</div>
                  <div className="sf-section-title">Live skill interview</div>
                  <div className="sf-section-sub">Answer honestly. SkillForge adapts each question to your responses. When you see the signal, type "generate assessment" to proceed.</div>
                </div>

                <div className="sf-chat">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`sf-msg ${m.role === "user" ? "user" : ""}`}>
                      <div className={`sf-msg-avatar ${m.role === "assistant" ? "ai" : "user"}`}>
                        {m.role === "assistant" ? "SF" : "Y"}
                      </div>
                      <div className="sf-msg-bubble">
                        <div className="sf-msg-name">{m.role === "assistant" ? "SkillForge AI" : "You"}</div>
                        <div className="sf-msg-content" style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
                      </div>
                    </div>
                  ))}
                  {(loading || generatingAssessment) && (
                    <div className="sf-msg">
                      <div className="sf-msg-avatar ai">SF</div>
                      <div className="sf-msg-bubble">
                        <div className="sf-msg-name">SkillForge AI</div>
                        <div className="sf-msg-content">
                          <div className="sf-loading">
                            <div className="sf-dots">
                              <div className="sf-dot" /><div className="sf-dot" /><div className="sf-dot" />
                            </div>
                            <span style={{ fontSize: 11, color: "var(--muted)" }}>{generatingAssessment ? "Generating full assessment..." : "Thinking..."}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="sf-chat-input-row">
                  <input className="sf-chat-input" value={chatInput} onChange={e => setChatInput(e.target.value)}
                    onKeyDown={handleKeyDown} placeholder="Type your response..." disabled={loading || generatingAssessment} />
                  <button className="sf-btn-primary" onClick={sendMessage} disabled={loading || generatingAssessment || !chatInput.trim()}>
                    Send
                  </button>
                </div>
              </>
            )}

            {/* PHASE 3 */}
            {phase === 3 && (
              <>
                <div className="sf-section-head">
                  <div className="sf-section-tag">Phase 3 — Proficiency scoring</div>
                  <div className="sf-section-title">True skill profile</div>
                  <div className="sf-section-sub">Claimed vs demonstrated vs required. No sugarcoating.</div>
                </div>

                {!assessment ? (
                  <div className="sf-gate">
                    <div className="sf-gate-icon">◈</div>
                    <div className="sf-gate-title">Complete Phase 2 first</div>
                    <div className="sf-gate-sub">Finish the adaptive assessment to unlock your proficiency scoring.</div>
                    <button className="sf-btn-ghost" onClick={() => setPhase(2)}>← Go to assessment</button>
                  </div>
                ) : (
                  <>
                    <div className="sf-score-display">
                      <ScoreRing score={assessment.readinessScore} />
                      <div className="sf-score-info">
                        <h3>Overall readiness: {assessment.readinessScore}/100</h3>
                        <p>{assessment.verdictTitle}</p>
                      </div>
                    </div>

                    <div className="sf-archetype">
                      <div className="sf-arch-icon">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2L13.5 8H20L15 12L17 19L11 15L5 19L7 12L2 8H8.5L11 2Z" fill="#000"/></svg>
                      </div>
                      <div>
                        <div className="sf-arch-tag">Candidate archetype</div>
                        <div className="sf-arch-title">{assessment.archetype}</div>
                        <div className="sf-arch-desc">{assessment.archetypeDesc}</div>
                      </div>
                    </div>

                    <div className="sf-section-tag" style={{ marginBottom: 12 }}>Skill proficiency matrix</div>
                    <div className="sf-skill-grid" style={{ marginBottom: "2rem" }}>
                      {assessment.skills?.map((s, i) => <SkillBar key={i} {...s} />)}
                    </div>

                    <div className="sf-section-tag" style={{ marginBottom: 12 }}>Readiness breakdown</div>
                    <div className="sf-progress-multi">
                      {Object.entries(assessment.readinessBreakdown || {}).map(([k, v]) => (
                        <div key={k} className="sf-pm-row">
                          <div className="sf-pm-label">{k.charAt(0).toUpperCase() + k.slice(1)} readiness</div>
                          <div className="sf-pm-bar"><div className="sf-pm-fill" style={{ width: `${v}%`, background: v >= 70 ? "#44ff88" : v >= 45 ? "#ffaa00" : "#ff4444" }} /></div>
                          <div className="sf-pm-val">{v}%</div>
                        </div>
                      ))}
                    </div>

                    <button className="sf-btn-primary" onClick={() => unlockPhase(3)}>Proceed to readiness review →</button>
                  </>
                )}
              </>
            )}

            {/* PHASE 4 */}
            {phase === 4 && (
              <>
                <div className="sf-section-head">
                  <div className="sf-section-tag">Phase 4 — Readiness review</div>
                  <div className="sf-section-title">The honest verdict</div>
                  <div className="sf-section-sub">What a hiring manager would actually think. Where you stand. What it means.</div>
                </div>

                {!assessment ? (
                  <div className="sf-gate">
                    <div className="sf-gate-title">Complete Phase 2 & 3 first</div>
                    <button className="sf-btn-ghost" onClick={() => setPhase(2)}>← Go to assessment</button>
                  </div>
                ) : (
                  <>
                    <div className="sf-card sf-card-accent" style={{ marginBottom: "1rem" }}>
                      <div style={{ fontSize: 10, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Current verdict</div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{assessment.verdictTitle}</div>
                      <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>{assessment.verdictBody}</div>
                    </div>

                    <div className="sf-card" style={{ marginBottom: "1rem" }}>
                      <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Hiring manager perspective</div>
                      <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>{assessment.hiringManagerView}</div>
                    </div>

                    <div className="sf-section-tag" style={{ marginBottom: 12 }}>Skill gap heatmap</div>
                    <div className="sf-heatmap">
                      {assessment.heatmap?.map((h, i) => (
                        <div key={i} className={`sf-hm-cell ${h.status}`}>
                          <div className="sf-hm-label">{h.label}</div>
                          <div className="sf-hm-sub">{h.note}</div>
                        </div>
                      ))}
                    </div>

                    <div className="sf-section-tag" style={{ marginBottom: 12 }}>Interview risk forecast</div>
                    <div className="sf-risk-list">
                      {assessment.risks?.map((r, i) => (
                        <div key={i} className="sf-risk-item">
                          <div className={`sf-risk-icon ${r.severity}`}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M5 1L9 9H1L5 1Z" fill={r.severity === "high" ? "#ff4444" : "#ffaa00"} />
                            </svg>
                          </div>
                          <div>
                            <div className="sf-risk-label">{r.label}</div>
                            <div className="sf-risk-text">{r.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="sf-truth">
                      <div className="sf-truth-tag">Truth bomb</div>
                      <div className="sf-truth-text">"{assessment.truthBomb}"</div>
                    </div>

                    <div className="sf-section-tag" style={{ marginBottom: 12 }}>Strength zones</div>
                    {assessment.strengths?.map((s, i) => (
                      <div key={i} className="sf-card sf-card-ok" style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{s}</div>
                      </div>
                    ))}

                    <div style={{ marginTop: "2rem" }}>
                      <button className="sf-btn-primary" onClick={() => unlockPhase(4)}>Build learning plan →</button>
                    </div>
                  </>
                )}
              </>
            )}

            {/* PHASE 5 */}
            {phase === 5 && (
              <>
                <div className="sf-section-head">
                  <div className="sf-section-tag">Phase 5 — Personalized learning plan</div>
                  <div className="sf-section-title">Your 90-day roadmap</div>
                  <div className="sf-section-sub">Realistic. Prescriptive. No fantasy timelines.</div>
                </div>

                {!assessment ? (
                  <div className="sf-gate">
                    <div className="sf-gate-title">Complete earlier phases first</div>
                    <button className="sf-btn-ghost" onClick={() => setPhase(2)}>← Go to assessment</button>
                  </div>
                ) : (
                  <>
                    <div className="sf-plan-phases">
                      {[{ label: "Days 1–30", title: "Foundation fix", items: assessment.plan30 }, { label: "Days 31–60", title: "Evidence building", items: assessment.plan60 }, { label: "Days 61–90", title: "Interview ready", items: assessment.plan90 }].map((phase, i) => (
                        <div key={i} className="sf-plan-phase">
                          <div className="sf-plan-phase-num">{phase.label}</div>
                          <div className="sf-plan-phase-title">{phase.title}</div>
                          {phase.items?.map((item, j) => (
                            <div key={j} className="sf-plan-item">
                              <div className="sf-plan-dot" />
                              <div className="sf-plan-text">{item}</div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    <div className="sf-section-tag" style={{ marginBottom: 12 }}>Weekly execution schedule</div>
                    <div className="sf-sprint">
                      <div className="sf-sprint-row sf-sprint-head">
                        <div className="sf-sprint-cell">Day</div>
                        <div className="sf-sprint-cell">Focus area</div>
                        <div className="sf-sprint-cell">Target hours</div>
                      </div>
                      {assessment.weeklyPlan?.map((w, i) => (
                        <div key={i} className="sf-sprint-row">
                          <div className="sf-sprint-cell sf-sprint-day">{w.day}</div>
                          <div className="sf-sprint-cell" style={{ fontSize: 12, color: "var(--muted)" }}>{w.focus}</div>
                          <div className="sf-sprint-cell" style={{ fontSize: 12, color: "var(--accent)" }}>{w.hours}</div>
                        </div>
                      ))}
                    </div>

                    <div className="sf-section-tag" style={{ marginBottom: 12 }}>Curated resources</div>
                    <div className="sf-resource-grid">
                      {assessment.resources?.map((r, i) => (
                        <div key={i} className="sf-resource-card">
                          <div className="sf-resource-skill">{r.skill}</div>
                          <div className="sf-resource-name">{r.name}</div>
                          <div className="sf-resource-desc">{r.desc}</div>
                          <span className="sf-resource-tag">{r.type}</span>
                        </div>
                      ))}
                    </div>

                    <button className="sf-btn-primary" onClick={() => unlockPhase(5)}>Activate accountability coach →</button>
                  </>
                )}
              </>
            )}

            {/* PHASE 6 */}
            {phase === 6 && (
              <>
                <div className="sf-section-head">
                  <div className="sf-section-tag">Phase 6 — Accountability coach</div>
                  <div className="sf-section-title">Weekly execution tracker</div>
                  <div className="sf-section-sub">Track your progress. Mark days complete. Keep the streak.</div>
                </div>

                {!assessment ? (
                  <div className="sf-gate">
                    <div className="sf-gate-title">Complete earlier phases first</div>
                  </div>
                ) : (
                  <>
                    <div className="sf-scorecard">
                      <div className="sf-sc-card">
                        <div className="sf-sc-num">{trackerDays.filter(Boolean).length}</div>
                        <div className="sf-sc-label">Days logged</div>
                      </div>
                      <div className="sf-sc-card">
                        <div className="sf-sc-num">{Math.round(trackerDays.filter(Boolean).length * 2.5)}</div>
                        <div className="sf-sc-label">Est. hours studied</div>
                      </div>
                      <div className="sf-sc-card">
                        <div className="sf-sc-num">{Math.round(assessment.readinessScore + trackerDays.filter(Boolean).length * 0.5)}</div>
                        <div className="sf-sc-label">Projected score</div>
                      </div>
                    </div>

                    <div className="sf-section-tag" style={{ marginBottom: 10 }}>35-day streak tracker — click to mark complete</div>
                    <div className="sf-tracker" style={{ marginBottom: "2rem" }}>
                      {trackerDays.map((filled, i) => (
                        <div key={i} className={`sf-tracker-cell ${filled ? "filled" : ""}`} onClick={() => toggleTracker(i)}>
                          {i + 1}
                        </div>
                      ))}
                    </div>

                    <div className="sf-section-tag" style={{ marginBottom: 12 }}>Next 7-day sprint</div>
                    <div className="sf-sprint" style={{ marginBottom: "2rem" }}>
                      <div className="sf-sprint-row sf-sprint-head">
                        <div className="sf-sprint-cell">Day</div>
                        <div className="sf-sprint-cell">Focus area</div>
                        <div className="sf-sprint-cell">Target hours</div>
                      </div>
                      {assessment.weeklyPlan?.slice(0, 7).map((w, i) => (
                        <div key={i} className="sf-sprint-row">
                          <div className="sf-sprint-cell sf-sprint-day">{w.day}</div>
                          <div className="sf-sprint-cell" style={{ fontSize: 12, color: "var(--muted)" }}>{w.focus}</div>
                          <div className="sf-sprint-cell" style={{ fontSize: 12, color: "var(--accent)" }}>{w.hours}</div>
                        </div>
                      ))}
                    </div>

                    <div className="sf-truth">
                      <div className="sf-truth-tag">Coach note</div>
                      <div className="sf-truth-text">"Momentum compounds. The candidates who land offers aren't necessarily the most talented — they're the most consistent. Show up every day. The score moves."</div>
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                      <button className="sf-btn-primary" onClick={() => setPhase(1)}>Start new assessment →</button>
                      <button className="sf-btn-ghost" onClick={() => setPhase(5)}>← Review learning plan</button>
                    </div>
                  </>
                )}
              </>
            )}

          </main>
        </div>
      </div>
    </>
  );
}
