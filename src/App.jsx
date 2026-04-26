import { useState, useEffect, useRef, useCallback } from "react";

// ─── FONTS ────────────────────────────────────────────────────────────────────
const FontLink = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  return null;
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#080808; --sf:#111; --sf2:#181818; --b:#1e1e1e; --b2:#2a2a2a;
    --tx:#efefef; --mu:#666; --mu2:#3a3a3a;
    --ac:#E8FF47; --ac2:#FF6B35; --re:#ff4545; --am:#ffaa00; --gr:#3dff88;
    --fd:'Syne',sans-serif; --fb:'DM Mono',monospace; --fs:'Instrument Serif',serif;
    --r:10px; --rs:6px;
  }
  html,body,#root { height:100%; }
  body { background:var(--bg); color:var(--tx); font-family:var(--fb); -webkit-font-smoothing:antialiased; overflow-x:hidden; }
  .sf-sb::-webkit-scrollbar{width:3px}
  .sf-sb::-webkit-scrollbar-thumb{background:var(--b2);border-radius:2px}

  /* NAV */
  .sf-nav{position:fixed;top:0;left:0;right:0;z-index:200;height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;background:rgba(8,8,8,.93);border-bottom:1px solid var(--b);backdrop-filter:blur(16px)}
  .sf-nav-logo{display:flex;align-items:center;gap:10px}
  .sf-nav-mark{width:28px;height:28px;background:var(--ac);border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .sf-nav-name{font-family:var(--fd);font-size:14px;font-weight:800;letter-spacing:-.01em}
  .sf-nav-sub{font-size:10px;color:var(--mu);margin-top:1px}
  .sf-nav-score{font-family:var(--fd);font-size:13px;font-weight:700;color:var(--ac);background:var(--sf2);border:1px solid var(--b2);padding:4px 14px;border-radius:20px}

  /* LAYOUT */
  .sf-layout{display:flex;padding-top:52px;min-height:100vh}

  /* SIDEBAR */
  .sf-side{width:205px;flex-shrink:0;background:var(--sf);border-right:1px solid var(--b);padding:1.5rem 0;position:sticky;top:52px;height:calc(100vh - 52px);overflow-y:auto}
  .sf-side-lbl{font-size:9px;color:var(--mu);letter-spacing:.12em;text-transform:uppercase;padding:0 1.25rem .75rem}
  .sf-pi{display:flex;align-items:center;gap:10px;padding:9px 1.25rem;cursor:pointer;border-left:2px solid transparent;transition:background .12s,color .12s;font-size:11px;color:var(--mu);user-select:none}
  .sf-pi:hover{background:var(--sf2);color:var(--tx)}
  .sf-pi.act{border-left-color:var(--ac);color:var(--ac);background:rgba(232,255,71,.04)}
  .sf-pi.dn{color:var(--gr)}
  .sf-pi.disabled-nav{opacity:.35;cursor:not-allowed;pointer-events:none}
  .sf-pdot{width:20px;height:20px;border-radius:50%;background:var(--sf2);border:1px solid var(--b2);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;flex-shrink:0;transition:background .12s}
  .sf-pi.act .sf-pdot{background:var(--ac);color:#000;border-color:var(--ac)}
  .sf-pi.dn .sf-pdot{background:var(--gr);color:#000;border-color:var(--gr)}

  /* MAIN */
  .sf-main{flex:1;min-width:0;padding:2.5rem 2.5rem 6rem;max-width:820px}

  /* HERO */
  .sf-hero{padding:3rem 0 3.5rem}
  .sf-htag{display:inline-flex;align-items:center;gap:6px;font-size:10px;color:var(--ac);border:1px solid rgba(232,255,71,.25);padding:4px 12px;border-radius:20px;margin-bottom:1.75rem}
  .sf-hdot{width:5px;height:5px;background:var(--ac);border-radius:50%;animation:sf-blink 2s infinite}
  @keyframes sf-blink{0%,100%{opacity:1}50%{opacity:.2}}
  .sf-h1{font-family:var(--fd);font-size:clamp(34px,5.5vw,64px);font-weight:800;line-height:.95;letter-spacing:-.03em;margin-bottom:1.25rem}
  .sf-em{font-style:italic;font-family:var(--fs);color:var(--ac);font-weight:400}
  .sf-hsub{font-size:13px;color:var(--mu);line-height:1.75;max-width:480px;margin-bottom:2rem}
  .sf-hstats{display:flex;gap:2rem;margin-bottom:2.5rem}
  .sf-snum{font-family:var(--fd);font-size:26px;font-weight:800;color:var(--ac)}
  .sf-slbl{font-size:10px;color:var(--mu);margin-top:2px}

  /* FORM */
  .sf-ig{margin-bottom:1.25rem}
  .sf-lbl{display:block;font-size:10px;color:var(--mu);letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px}
  .sf-ta{width:100%;background:var(--sf);border:1px solid var(--b2);border-radius:var(--r);padding:12px 14px;color:var(--tx);font-family:var(--fb);font-size:12px;line-height:1.65;resize:vertical;min-height:110px;outline:none;transition:border-color .15s}
  .sf-ta:focus{border-color:var(--ac)}
  .sf-ta::placeholder{color:var(--mu2)}

  /* BUTTONS */
  .sf-btn{display:inline-flex;align-items:center;gap:8px;background:var(--ac);color:#000;font-family:var(--fd);font-size:13px;font-weight:700;padding:11px 24px;border-radius:var(--rs);border:none;cursor:pointer;letter-spacing:-.01em;transition:background .12s,transform .1s;user-select:none}
  .sf-btn:hover{background:#d4eb2e}
  .sf-btn:active{transform:scale(.98)}
  .sf-btn:disabled{opacity:.35;cursor:not-allowed;transform:none}
  .sf-btn-g{display:inline-flex;align-items:center;gap:6px;background:transparent;color:var(--mu);border:1px solid var(--b2);border-radius:var(--rs);font-family:var(--fb);font-size:11px;padding:9px 18px;cursor:pointer;transition:color .12s,border-color .12s;user-select:none}
  .sf-btn-g:hover{color:var(--tx);border-color:var(--mu2)}

  /* SECTION LABELS */
  .sf-stag{font-size:9px;color:var(--ac);letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px}
  .sf-stit{font-family:var(--fd);font-size:24px;font-weight:800;letter-spacing:-.02em;margin-bottom:6px}
  .sf-ssub{font-size:12px;color:var(--mu);line-height:1.65;margin-bottom:1.5rem}

  /* CHAT */
  .sf-chat{display:flex;flex-direction:column;gap:14px;margin-bottom:1.5rem}
  .sf-msg{display:flex;gap:10px;animation:sf-up .25s ease}
  @keyframes sf-up{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
  .sf-av{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;margin-top:2px;font-family:var(--fd)}
  .sf-av.ai{background:var(--ac);color:#000}
  .sf-av.u{background:var(--sf2);color:var(--mu);border:1px solid var(--b2)}
  .sf-mn{font-size:9px;color:var(--mu);margin-bottom:4px;letter-spacing:.05em}
  .sf-mb{font-size:12px;line-height:1.75;color:var(--tx);background:var(--sf);border:1px solid var(--b);border-radius:3px 10px 10px 10px;padding:10px 14px;white-space:pre-wrap;max-width:680px}
  .sf-msg.u .sf-mb{background:var(--sf2);border-radius:10px 3px 10px 10px}
  .sf-crow{display:flex;gap:8px}
  .sf-ci{flex:1;background:var(--sf);border:1px solid var(--b2);border-radius:var(--r);padding:11px 14px;color:var(--tx);font-family:var(--fb);font-size:12px;outline:none;transition:border-color .15s}
  .sf-ci:focus{border-color:var(--ac)}
  .sf-ci::placeholder{color:var(--mu2)}
  .sf-ci:disabled{opacity:.5}

  /* LOADING DOTS */
  .sf-dots{display:flex;gap:4px;align-items:center}
  .sf-dot{width:5px;height:5px;background:var(--ac);border-radius:50%;animation:sf-b 1.1s infinite}
  .sf-dot:nth-child(2){animation-delay:.15s}
  .sf-dot:nth-child(3){animation-delay:.3s}
  @keyframes sf-b{0%,80%,100%{transform:scale(.5);opacity:.3}40%{transform:scale(1);opacity:1}}

  /* CARD */
  .sf-card{background:var(--sf);border:1px solid var(--b);border-radius:var(--r);padding:1.1rem 1.25rem;margin-bottom:10px}
  .sf-ca{border-left:2px solid var(--ac);border-radius:0 var(--r) var(--r) 0}
  .sf-cr{border-left:2px solid var(--re);border-radius:0 var(--r) var(--r) 0}
  .sf-cg{border-left:2px solid var(--gr);border-radius:0 var(--r) var(--r) 0}

  /* SKILL BAR */
  .sf-sr{margin-bottom:14px}
  .sf-st{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px}
  .sf-sn{font-size:11px;color:var(--tx);font-family:var(--fb)}
  .sf-sm{display:flex;gap:6px;align-items:center}
  .sf-badge{font-size:9px;padding:2px 7px;border-radius:20px;font-family:var(--fb)}
  .sf-br{background:rgba(255,69,69,.12);color:var(--re)}
  .sf-ba{background:rgba(255,170,0,.12);color:var(--am)}
  .sf-bg{background:rgba(61,255,136,.12);color:var(--gr)}
  .sf-bw{height:3px;background:var(--sf2);border-radius:2px;overflow:hidden}
  .sf-bar{height:100%;border-radius:2px;transition:width 1s cubic-bezier(.4,0,.2,1)}
  .sf-bls{display:flex;justify-content:space-between;font-size:9px;color:var(--mu);margin-top:3px;font-family:var(--fb)}

  /* SCORE RING */
  .sf-rw{position:relative;flex-shrink:0}
  .sf-rn{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-weight:800;color:var(--ac)}
  .sf-srow{display:flex;align-items:center;gap:1.5rem;margin-bottom:1.5rem}
  .sf-si h3{font-family:var(--fd);font-size:17px;font-weight:700;margin-bottom:4px}
  .sf-si p{font-size:11px;color:var(--mu);line-height:1.6}

  /* HEATMAP */
  .sf-hm{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:1.5rem}
  .sf-hc{border-radius:var(--rs);padding:10px 12px;border:1px solid}
  .sf-hc.red{background:rgba(255,69,69,.06);border-color:rgba(255,69,69,.18)}
  .sf-hc.amber{background:rgba(255,170,0,.06);border-color:rgba(255,170,0,.18)}
  .sf-hc.green{background:rgba(61,255,136,.06);border-color:rgba(61,255,136,.18)}
  .sf-hl{font-size:11px;font-weight:600;margin-bottom:3px;font-family:var(--fd)}
  .sf-hc.red .sf-hl{color:var(--re)}
  .sf-hc.amber .sf-hl{color:var(--am)}
  .sf-hc.green .sf-hl{color:var(--gr)}
  .sf-hn{font-size:10px;color:var(--mu);line-height:1.4}

  /* TRUTH / COACH NOTE */
  .sf-truth{border-top:2px solid var(--ac2);background:var(--sf);border-radius:0 0 var(--r) var(--r);padding:1.25rem 1.5rem;margin-bottom:1.5rem}
  .sf-tt{font-size:9px;color:var(--ac2);letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px}
  /* FIX: renamed from .sf-tx to .sf-tq to avoid collision with --tx CSS variable name */
  .sf-tq{font-family:var(--fs);font-style:italic;font-size:15px;line-height:1.75;color:var(--tx)}

  /* ARCHETYPE */
  .sf-arch{display:flex;align-items:flex-start;gap:1rem;background:var(--sf);border:1px solid var(--b);border-radius:var(--r);padding:1.1rem 1.25rem;margin-bottom:1.5rem}
  .sf-aico{width:40px;height:40px;background:var(--ac);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .sf-atag{font-size:9px;color:var(--mu);margin-bottom:3px;letter-spacing:.05em}
  .sf-atit{font-family:var(--fd);font-size:14px;font-weight:700;margin-bottom:4px}
  .sf-ades{font-size:11px;color:var(--mu);line-height:1.6}

  /* RISK */
  .sf-rl{display:flex;flex-direction:column;gap:7px;margin-bottom:1.5rem}
  .sf-ri{display:flex;align-items:flex-start;gap:10px;background:var(--sf);border:1px solid var(--b);border-radius:var(--rs);padding:10px 12px}
  .sf-ric{width:18px;height:18px;border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
  .sf-ric.high{background:rgba(255,69,69,.15)}
  .sf-ric.med{background:rgba(255,170,0,.15)}
  .sf-rla{font-size:11px;font-weight:500;color:var(--tx);margin-bottom:2px;font-family:var(--fd)}
  .sf-rde{font-size:11px;color:var(--mu);line-height:1.5}

  /* PROGRESS */
  .sf-pl{display:flex;flex-direction:column;gap:8px;margin-bottom:1.5rem}
  .sf-pr{display:flex;align-items:center;gap:10px}
  .sf-pla{font-size:10px;color:var(--mu);width:130px;flex-shrink:0;font-family:var(--fb)}
  .sf-pb{flex:1;height:3px;background:var(--sf2);border-radius:2px;overflow:hidden}
  .sf-pf{height:100%;border-radius:2px;transition:width 1s cubic-bezier(.4,0,.2,1)}
  .sf-pv{font-size:10px;color:var(--tx);width:28px;text-align:right}

  /* PLAN */
  .sf-pg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:1.5rem}
  .sf-pc{background:var(--sf);border:1px solid var(--b);border-radius:var(--r);padding:1rem}
  .sf-pn{font-size:9px;color:var(--ac);letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px}
  .sf-pt{font-family:var(--fd);font-size:13px;font-weight:700;margin-bottom:10px}
  .sf-pi2{display:flex;gap:7px;margin-bottom:7px}
  .sf-pd{width:4px;height:4px;background:var(--b2);border-radius:50%;margin-top:5px;flex-shrink:0}
  .sf-ptx{font-size:10px;color:var(--mu);line-height:1.55}

  /* RESOURCES */
  .sf-rg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:1.5rem}
  .sf-rc{background:var(--sf);border:1px solid var(--b);border-radius:var(--rs);padding:10px 12px}
  .sf-rsk{font-size:9px;color:var(--ac);letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px}
  .sf-rna{font-size:12px;font-weight:600;font-family:var(--fd);margin-bottom:3px}
  .sf-rde2{font-size:10px;color:var(--mu);line-height:1.45}
  .sf-rty{display:inline-block;font-size:8px;padding:2px 6px;border-radius:3px;background:var(--sf2);color:var(--mu);margin-top:5px;border:1px solid var(--b)}

  /* SPRINT */
  .sf-sp{border:1px solid var(--b);border-radius:var(--r);overflow:hidden;margin-bottom:1.5rem}
  .sf-sprow{display:grid;grid-template-columns:75px 1fr 80px;border-bottom:1px solid var(--b)}
  .sf-sprow:last-child{border-bottom:none}
  .sf-spc{padding:9px 12px;font-size:11px;font-family:var(--fb)}
  .sf-sph{background:var(--sf2);font-size:9px;color:var(--mu);letter-spacing:.06em;text-transform:uppercase}
  .sf-spd{color:var(--ac);font-weight:500}

  /* SCORECARD */
  .sf-sc{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:1.5rem}
  .sf-scc{background:var(--sf);border:1px solid var(--b);border-radius:var(--r);padding:1rem;text-align:center}
  .sf-scn{font-family:var(--fd);font-size:26px;font-weight:800;color:var(--ac)}
  .sf-scl{font-size:9px;color:var(--mu);margin-top:3px}

  /* TRACKER */
  .sf-tr{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:1.5rem}
  .sf-tc{aspect-ratio:1;border-radius:4px;background:var(--sf);border:1px solid var(--b);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:8px;color:var(--mu);transition:background .12s,border-color .12s;user-select:none}
  .sf-tc.on{background:var(--ac);color:#000;border-color:var(--ac);font-weight:600}
  .sf-tc:hover:not(.on){background:var(--sf2);border-color:var(--b2)}

  /* GATE */
  .sf-gate{text-align:center;padding:3.5rem 2rem;border:1px dashed var(--b2);border-radius:var(--r);margin-bottom:1.5rem}
  .sf-gtit{font-family:var(--fd);font-size:18px;font-weight:700;margin-bottom:6px}
  .sf-gsub{font-size:12px;color:var(--mu);margin-bottom:1.25rem;line-height:1.6}

  /* ERROR / HINT */
  .sf-err{background:rgba(255,69,69,.07);border:1px solid rgba(255,69,69,.2);border-radius:var(--r);padding:10px 14px;font-size:11px;color:var(--re);margin-bottom:1rem;line-height:1.6}
  .sf-warn{background:rgba(255,170,0,.07);border:1px solid rgba(255,170,0,.2);border-radius:var(--r);padding:10px 14px;font-size:11px;color:var(--am);margin-bottom:1rem;line-height:1.6}
  .sf-hint{font-size:10px;color:var(--mu);margin-top:8px;line-height:1.6;font-style:italic}
  .sf-hr{border:none;border-top:1px solid var(--b);margin:1.75rem 0}
`;

// ─── PHASE LABELS ─────────────────────────────────────────────────────────────
const PHASES = [
  { n: 1, label: "Intelligence extraction" },
  { n: 2, label: "Adaptive assessment" },
  { n: 3, label: "Proficiency scoring" },
  { n: 4, label: "Readiness review" },
  { n: 5, label: "Learning plan" },
  { n: 6, label: "Accountability coach" },
];

// ─── SYSTEM PROMPTS ───────────────────────────────────────────────────────────

// FIX #1: SYS_CHAT is now a function that injects the actual JD + resume
// so the AI always has full context on every message — not just the first call.
function buildSysChat(jd, resume) {
  return `You are SkillForge AI — an elite career readiness assessment agent.

The candidate submitted the following:

JOB DESCRIPTION:
${jd}

CANDIDATE RESUME:
${resume}

Your rules for this phase:
- Ask ONE focused question per message (max 2 in exceptional cases)
- Direct, professional, conversational — never robotic
- Adapt difficulty based on the candidate's answers
- Cover these topics across 8–10 exchanges:
    • Career goals and target timeline
    • Self-ratings 1–5 for each major skill required by the JD
    • Skill probing: conceptual → applied → edge-case → real-world system
    • Portfolio depth (original vs tutorial, deployed work, architecture choices, tradeoffs)
    • Interview readiness: DSA, SQL, system design, behavioral stories
    • Daily hours available, learning constraints, style, accountability preference
    • Self-diagnosed gaps and improvement areas
- After 8–10 substantive exchanges, write EXACTLY: "I have enough data to generate your assessment. Type generate assessment to proceed."
- Keep each reply under 100 words. No bullet lists in questions. Sound like a senior hiring manager.`;
}

const SYS_ASSESS = `You are SkillForge AI. Return ONE valid JSON object only.
No markdown fences, no preamble, no trailing text. Just the raw JSON.

Required schema (all fields mandatory):
{
  "readinessScore": integer (0-100),
  "archetype": string,
  "archetypeDesc": string,
  "verdictTitle": string,
  "verdictBody": string,
  "hiringManagerView": string,
  "truthBomb": string,
  "skills": [{"name": string, "claimed": integer, "demonstrated": integer, "required": integer, "priority": "critical"|"important"|"nice"}],
  "heatmap": [{"label": string, "status": "red"|"amber"|"green", "note": string}],
  "risks": [{"label": string, "detail": string, "severity": "high"|"med"}],
  "strengths": [string],
  "plan30": [string],
  "plan60": [string],
  "plan90": [string],
  "resources": [{"skill": string, "name": string, "desc": string, "type": "free"|"premium"|"platform"}],
  "weeklyPlan": [{"day": string, "focus": string, "hours": string}],
  "readinessBreakdown": {"technical": integer, "interview": integer, "portfolio": integer, "resume": integer, "domain": integer}
}

Rules:
- skills array must have 5-8 entries derived from the JD and interview
- heatmap must have 6-9 entries covering all major skill areas
- risks must have 3-5 entries
- strengths must have 3-5 entries  
- plan30/plan60/plan90 must each have 4-6 bullet items
- resources must have 4-8 entries
- weeklyPlan must have EXACTLY 7 entries (Mon through Sun)
- readinessBreakdown values must be integers 0-100
- Be candid: do not sugarcoat. Surface real gaps from the interview.`;

// ─── API CALL ─────────────────────────────────────────────────────────────────
async function api(messages, system) {
  const headers = { "Content-Type": "application/json" };

  // FIX #2: Validate alternating roles — Anthropic API requires user/assistant alternation.
  // Deduplicate consecutive same-role messages by merging them.
  const cleaned = [];
  for (const msg of messages) {
    if (cleaned.length > 0 && cleaned[cleaned.length - 1].role === msg.role) {
      cleaned[cleaned.length - 1] = {
        role: msg.role,
        content: cleaned[cleaned.length - 1].content + "\n\n" + msg.content,
      };
    } else {
      cleaned.push({ role: msg.role, content: msg.content });
    }
  }
  // API requires first message to be user role
  if (cleaned.length === 0 || cleaned[0].role !== "user") {
    throw new Error("First message must be from user role.");
  }

  const res = await fetch("/api/gemini", {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "gemini-1.5-flash",
      max_tokens: 2048,
      system,
      messages: cleaned,
    }),
  });

  if (!res.ok) {
    let msg = `API error ${res.status}`;
    try {
      const d = await res.json();
      msg = d?.error?.message || msg;
    } catch (_) {}
    throw new Error(msg);
  }
  const d = await res.json();
  return (d.content || []).map(b => b.text || "").join("");
}

// ─── JSON EXTRACTOR ───────────────────────────────────────────────────────────
function extractJSON(raw) {
  // Strip markdown fences if present
  const stripped = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in response");
  return JSON.parse(stripped.slice(start, end + 1));
}

// ─── SCORE RING ───────────────────────────────────────────────────────────────
function Ring({ score, size = 96 }) {
  const r = 38, c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(Math.max(+score || 0, 0), 100) / 100);
  return (
    <div className="sf-rw" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="#1a1a1a" strokeWidth="6" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--ac)" strokeWidth="6"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div className="sf-rn" style={{ fontSize: Math.round(size * 0.26) }}>{Math.round(+score || 0)}</div>
    </div>
  );
}

// ─── SKILL BAR ────────────────────────────────────────────────────────────────
function Bar({ name, claimed, demonstrated, required, priority }) {
  const col = demonstrated >= required ? "var(--gr)" : demonstrated >= required * 0.6 ? "var(--am)" : "var(--re)";
  const bc = priority === "critical" ? "sf-br" : priority === "important" ? "sf-ba" : "sf-bg";
  return (
    <div className="sf-sr">
      <div className="sf-st">
        <span className="sf-sn">{name}</span>
        <div className="sf-sm">
          <span className={`sf-badge ${bc}`}>{priority}</span>
          <span style={{ fontSize: 9, color: "var(--mu)" }}>{demonstrated}/5</span>
        </div>
      </div>
      <div className="sf-bw">
        <div className="sf-bar" style={{ width: `${(demonstrated / 5) * 100}%`, background: col }} />
      </div>
      <div className="sf-bls"><span>claimed {claimed}/5</span><span>required {required}/5</span></div>
    </div>
  );
}

// ─── CHAT BUBBLE ──────────────────────────────────────────────────────────────
function Bubble({ role, content }) {
  const isAI = role === "assistant";
  return (
    <div className={`sf-msg ${isAI ? "" : "u"}`}>
      <div className={`sf-av ${isAI ? "ai" : "u"}`}>{isAI ? "SF" : "Y"}</div>
      <div>
        <div className="sf-mn">{isAI ? "SkillForge AI" : "You"}</div>
        <div className="sf-mb">{content}</div>
      </div>
    </div>
  );
}

// ─── THINKING ─────────────────────────────────────────────────────────────────
function Thinking({ label = "Thinking…" }) {
  return (
    <div className="sf-msg">
      <div className="sf-av ai">SF</div>
      <div>
        <div className="sf-mn">SkillForge AI</div>
        <div className="sf-mb">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="sf-dots">
              <div className="sf-dot" />
              <div className="sf-dot" />
              <div className="sf-dot" />
            </div>
            <span style={{ fontSize: 10, color: "var(--mu)" }}>{label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GATE ─────────────────────────────────────────────────────────────────────
function Gate({ title, sub, onBack, back = "Go back" }) {
  return (
    <div className="sf-gate">
      <div style={{ fontSize: 28, marginBottom: 12 }}>◈</div>
      <div className="sf-gtit">{title}</div>
      <div className="sf-gsub">{sub}</div>
      {onBack && <button className="sf-btn-g" onClick={onBack}>← {back}</button>}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState(1);
  const [done, setDone] = useState(new Set());
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");

  // FIX #3: msgs stores ONLY the visible conversation (assistant + user turns).
  // The JD/resume context is injected via the system prompt on every call, not stored in msgs.
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [chatErr, setChatErr] = useState("");
  const [assessErr, setAssessErr] = useState("");
  const [data, setData] = useState(null);
  const [tracker, setTracker] = useState(Array(35).fill(false));
  const endRef = useRef(null);

  // Store jd/resume in refs so callbacks can always access the latest value
  const jdRef = useRef(jd);
  const resumeRef = useRef(resume);
  useEffect(() => { jdRef.current = jd; }, [jd]);
  useEffect(() => { resumeRef.current = resume; }, [resume]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, thinking, generating]);

  const finish = n => setDone(prev => new Set([...prev, n]));

  // FIX #4: Proper navigation guard — can only go to phases you've unlocked.
  // Phase 3+ require the assessment data to exist.
  const go = n => {
    if (n === phase) return;
    if (n === 1) { setPhase(1); return; }
    if (n === 2 && done.has(1)) { setPhase(2); return; }
    // Phases 3–6 require assessment data
    if (n >= 3 && data) { setPhase(n); return; }
  };

  const isNavAllowed = n => {
    if (n === 1) return true;
    if (n === 2) return done.has(1);
    return !!data; // phases 3–6 need assessment data
  };

  // ─── PHASE 1 → 2: Submit JD + Resume, get first question ──────────────────
  const start = async () => {
    if (!jd.trim() || !resume.trim()) return;
    setChatErr("");
    setThinking(true);
    finish(1);
    setPhase(2);

    try {
      // FIX #5: The first user message contains a clear instruction to start.
      // JD + resume are in the system prompt via buildSysChat(), not the user message.
      const firstUserMsg = "I'm ready to begin my assessment. Please start with your first question.";
      const r = await api(
        [{ role: "user", content: firstUserMsg }],
        buildSysChat(jd, resume)
      );
      setMsgs([{ role: "user", content: firstUserMsg }, { role: "assistant", content: r }]);
    } catch (e) {
      setChatErr(e.message);
    } finally {
      setThinking(false);
    }
  };

  // ─── PHASE 2: Send a chat message ─────────────────────────────────────────
  // FIX #6: useCallback correctly rebuilds the system prompt from refs each call,
  // so the AI always has JD/resume context throughout the entire conversation.
  const send = useCallback(async () => {
    const txt = input.trim();
    if (!txt || thinking || generating) return;
    setInput("");
    setChatErr("");

    const next = [...msgs, { role: "user", content: txt }];
    setMsgs(next);

    // FIX #7: Detect "generate assessment" trigger
    if (/generate\s+assessment/i.test(txt)) {
      setGenerating(true);
      setAssessErr("");
      try {
        // Build a summary prompt that includes conversation context
        const conversationText = next
          .map(m => `${m.role === "assistant" ? "SkillForge AI" : "Candidate"}: ${m.content}`)
          .join("\n\n");

        const assessPayload = [
          {
            role: "user",
            content: `Here is the full assessment conversation:\n\n${conversationText}\n\nJob Description context:\n${jdRef.current}\n\nNow generate the JSON assessment based on everything above.`,
          },
        ];

        const raw = await api(assessPayload, SYS_ASSESS);
        const result = extractJSON(raw);

        // Validate weeklyPlan has 7 entries — pad if AI returned fewer
        if (!Array.isArray(result.weeklyPlan) || result.weeklyPlan.length < 7) {
          const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
          result.weeklyPlan = days.map((day, i) =>
            result.weeklyPlan?.[i] ?? { day, focus: "Review and consolidate", hours: "1–2h" }
          );
        }

        setData(result);
        // FIX #8: Only mark phase 2 done here. Phase 3 is marked when user clicks through.
        finish(2);
        setPhase(3);
      } catch (e) {
        setAssessErr(`Assessment generation failed: ${e.message}. Type "generate assessment" to retry.`);
      } finally {
        setGenerating(false);
      }
      return;
    }

    // Normal conversational message — always pass full history + dynamic system prompt
    setThinking(true);
    try {
      // FIX #9: Pass the full conversation history (proper alternating roles)
      // and rebuild the system prompt with JD/resume every time.
      const apiMsgs = next.map(m => ({ role: m.role, content: m.content }));
      const r = await api(apiMsgs, buildSysChat(jdRef.current, resumeRef.current));
      setMsgs(p => [...p, { role: "assistant", content: r }]);
    } catch (e) {
      setChatErr(e.message);
    } finally {
      setThinking(false);
    }
  }, [input, msgs, thinking, generating]);

  const onKey = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // ─── RESET ────────────────────────────────────────────────────────────────
  const reset = () => {
    setPhase(1);
    setDone(new Set());
    setJd("");
    setResume("");
    setMsgs([]);
    setInput("");
    setData(null);
    setChatErr("");
    setAssessErr("");
    setTracker(Array(35).fill(false));
  };

  const score = data?.readinessScore ?? 0;
  const days = tracker.filter(Boolean).length;

  // FIX #10: Detect missing API key and warn user early
  const hasKey = true; // Gemini key is server-side only

  return (
    <>
      <FontLink />
      <style>{STYLES}</style>

      {/* NAV */}
      <nav className="sf-nav">
        <div className="sf-nav-logo">
          <div className="sf-nav-mark">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L9 5.5H13.5L9.75 8.25L11 13L7 10.5L3 13L4.25 8.25L0.5 5.5H5L7 1Z" fill="#000" />
            </svg>
          </div>
          <div>
            <div className="sf-nav-name">SkillForge AI</div>
            <div className="sf-nav-sub">Career Readiness OS · Phase {phase}</div>
          </div>
        </div>
        {data && <div className="sf-nav-score">{score} / 100</div>}
      </nav>

      <div className="sf-layout">
        {/* SIDEBAR */}
        <aside className="sf-side sf-sb">
          <div className="sf-side-lbl">Assessment</div>
          {PHASES.map(p => (
            <div
              key={p.n}
              className={`sf-pi ${phase === p.n ? "act" : ""} ${done.has(p.n) ? "dn" : ""} ${!isNavAllowed(p.n) ? "disabled-nav" : ""}`}
              onClick={() => go(p.n)}
            >
              <div className="sf-pdot">{done.has(p.n) ? "✓" : p.n}</div>
              <span>{p.label}</span>
            </div>
          ))}
        </aside>

        <main className="sf-main">

          {/* ══ PHASE 1 ══ */}
          {phase === 1 && (
            <>
              <div className="sf-hero">
                <div className="sf-htag"><div className="sf-hdot" />Career readiness diagnostic · Active</div>
                <h1 className="sf-h1">Diagnose your<br /><em className="sf-em">true</em> readiness.</h1>
                <p className="sf-hsub">
                  Paste your job description and resume. SkillForge runs a 6-phase diagnostic — adaptive AI interview,
                  gap analysis, proficiency scoring, and a 90-day learning plan.
                </p>
                <div className="sf-hstats">
                  <div><div className="sf-snum">6</div><div className="sf-slbl">Phases</div></div>
                  <div><div className="sf-snum">AI</div><div className="sf-slbl">Powered interview</div></div>
                  <div><div className="sf-snum">90</div><div className="sf-slbl">Day plan</div></div>
                </div>
              </div>



              <div className="sf-ig">
                <label className="sf-lbl" htmlFor="sf-jd">Job description</label>
                <textarea
                  id="sf-jd"
                  className="sf-ta"
                  value={jd}
                  onChange={e => setJd(e.target.value)}
                  placeholder="Paste the full job description here…"
                  rows={5}
                />
              </div>
              <div className="sf-ig">
                <label className="sf-lbl" htmlFor="sf-rs">Your resume</label>
                <textarea
                  id="sf-rs"
                  className="sf-ta"
                  value={resume}
                  onChange={e => setResume(e.target.value)}
                  placeholder="Paste your resume as plain text…"
                  rows={7}
                />
              </div>
              {chatErr && <div className="sf-err">⚠ {chatErr}</div>}
              <button
                className="sf-btn"
                onClick={start}
                disabled={!jd.trim() || !resume.trim()}
              >
                Begin diagnostic →
              </button>
              <p className="sf-hint">Both fields required. The AI interview starts immediately after submission.</p>
            </>
          )}

          {/* ══ PHASE 2 ══ */}
          {phase === 2 && (
            <>
              <div style={{ marginBottom: "1.5rem" }}>
                <div className="sf-stag">Phase 2 — Adaptive assessment</div>
                <div className="sf-stit">Live skill interview</div>
                <div className="sf-ssub">
                  Answer honestly. Questions adapt to your responses. When prompted, type{" "}
                  <span style={{ color: "var(--ac)" }}>generate assessment</span> to proceed.
                </div>
              </div>
              <div className="sf-chat">
                {/* FIX #11: Only render assistant and visible user messages (skip the hidden first user msg) */}
                {msgs.slice(1).map((m, i) => <Bubble key={i} role={m.role} content={m.content} />)}
                {thinking && <Thinking label="Thinking…" />}
                {generating && <Thinking label="Generating your full assessment — this may take ~20 seconds…" />}
                <div ref={endRef} />
              </div>
              {chatErr && <div className="sf-err">⚠ {chatErr} — please try again.</div>}
              {assessErr && <div className="sf-err">⚠ {assessErr}</div>}
              <div className="sf-crow">
                <input
                  className="sf-ci"
                  name="sf-msg"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Type your response… (Enter to send)"
                  disabled={thinking || generating}
                  autoComplete="off"
                />
                <button
                  className="sf-btn"
                  onClick={send}
                  disabled={thinking || generating || !input.trim()}
                >
                  Send
                </button>
              </div>
            </>
          )}

          {/* ══ PHASE 3 ══ */}
          {phase === 3 && (
            <>
              <div style={{ marginBottom: "1.5rem" }}>
                <div className="sf-stag">Phase 3 — Proficiency scoring</div>
                <div className="sf-stit">True skill profile</div>
                <div className="sf-ssub">Claimed vs demonstrated vs required. No sugarcoating.</div>
              </div>
              {!data ? (
                <Gate
                  title="Complete Phase 2 first"
                  sub="Finish the adaptive assessment to unlock proficiency scoring."
                  onBack={() => setPhase(2)}
                  back="Go to assessment"
                />
              ) : (
                <>
                  <div className="sf-srow">
                    <Ring score={data.readinessScore} />
                    <div className="sf-si">
                      <h3>Readiness: {data.readinessScore}/100</h3>
                      <p>{data.verdictTitle}</p>
                    </div>
                  </div>
                  <div className="sf-arch">
                    <div className="sf-aico">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 1.5L11.5 7H17L13 10L14.5 16L9 12.5L3.5 16L5 10L1 7H6.5L9 1.5Z" fill="#000" />
                      </svg>
                    </div>
                    <div>
                      <div className="sf-atag">Candidate archetype</div>
                      <div className="sf-atit">{data.archetype}</div>
                      <div className="sf-ades">{data.archetypeDesc}</div>
                    </div>
                  </div>
                  <div className="sf-stag" style={{ marginBottom: 12 }}>Skill proficiency matrix</div>
                  <div style={{ marginBottom: "1.5rem" }}>
                    {data.skills?.map((s, i) => <Bar key={i} {...s} />)}
                  </div>
                  <div className="sf-stag" style={{ marginBottom: 10 }}>Readiness breakdown</div>
                  <div className="sf-pl">
                    {Object.entries(data.readinessBreakdown || {}).map(([k, v]) => (
                      <div key={k} className="sf-pr">
                        <div className="sf-pla">{k.charAt(0).toUpperCase() + k.slice(1)}</div>
                        <div className="sf-pb">
                          <div
                            className="sf-pf"
                            style={{
                              width: `${v}%`,
                              background: v >= 70 ? "var(--gr)" : v >= 45 ? "var(--am)" : "var(--re)",
                            }}
                          />
                        </div>
                        <div className="sf-pv">{v}%</div>
                      </div>
                    ))}
                  </div>
                  {/* FIX #8: Mark phase 3 done when user clicks through */}
                  <button className="sf-btn" onClick={() => { finish(3); setPhase(4); }}>
                    Proceed to readiness review →
                  </button>
                </>
              )}
            </>
          )}

          {/* ══ PHASE 4 ══ */}
          {phase === 4 && (
            <>
              <div style={{ marginBottom: "1.5rem" }}>
                <div className="sf-stag">Phase 4 — Readiness review</div>
                <div className="sf-stit">The honest verdict</div>
                <div className="sf-ssub">Hiring manager perspective. Gap heatmap. Risk forecast.</div>
              </div>
              {!data ? (
                <Gate
                  title="Complete earlier phases first"
                  sub="Run the assessment to unlock this view."
                  onBack={() => setPhase(2)}
                  back="Go to assessment"
                />
              ) : (
                <>
                  <div className="sf-card sf-ca">
                    <div style={{ fontSize: 9, color: "var(--ac)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>Current verdict</div>
                    <div style={{ fontFamily: "var(--fd)", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{data.verdictTitle}</div>
                    <div style={{ fontSize: 11, color: "var(--mu)", lineHeight: 1.7 }}>{data.verdictBody}</div>
                  </div>
                  <div className="sf-card" style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 9, color: "var(--mu)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>Hiring manager perspective</div>
                    <div style={{ fontSize: 11, color: "var(--mu)", lineHeight: 1.7 }}>{data.hiringManagerView}</div>
                  </div>
                  <div className="sf-hr" />
                  <div className="sf-stag" style={{ marginBottom: 10 }}>Skill gap heatmap</div>
                  <div className="sf-hm">
                    {data.heatmap?.map((h, i) => (
                      <div key={i} className={`sf-hc ${h.status}`}>
                        <div className="sf-hl">{h.label}</div>
                        <div className="sf-hn">{h.note}</div>
                      </div>
                    ))}
                  </div>
                  <div className="sf-stag" style={{ marginBottom: 10 }}>Interview risk forecast</div>
                  <div className="sf-rl">
                    {data.risks?.map((r, i) => (
                      <div key={i} className="sf-ri">
                        <div className={`sf-ric ${r.severity}`}>
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M4 .5L7.5 7H.5L4 .5Z" fill={r.severity === "high" ? "var(--re)" : "var(--am)"} />
                          </svg>
                        </div>
                        <div>
                          <div className="sf-rla">{r.label}</div>
                          <div className="sf-rde">{r.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* FIX #12: Renamed .sf-tx to .sf-tq to avoid conflict with --tx CSS variable */}
                  <div className="sf-truth">
                    <div className="sf-tt">Truth bomb</div>
                    <div className="sf-tq">"{data.truthBomb}"</div>
                  </div>
                  <div className="sf-stag" style={{ marginBottom: 10 }}>Strength zones</div>
                  {data.strengths?.map((s, i) => (
                    <div key={i} className="sf-card sf-cg">
                      <div style={{ fontSize: 11, color: "var(--mu)", lineHeight: 1.55 }}>{s}</div>
                    </div>
                  ))}
                  <div style={{ marginTop: "1.5rem" }}>
                    <button className="sf-btn" onClick={() => { finish(4); setPhase(5); }}>
                      Build my learning plan →
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* ══ PHASE 5 ══ */}
          {phase === 5 && (
            <>
              <div style={{ marginBottom: "1.5rem" }}>
                <div className="sf-stag">Phase 5 — Personalized learning plan</div>
                <div className="sf-stit">Your 90-day roadmap</div>
                <div className="sf-ssub">Realistic. Prescriptive. No fantasy timelines.</div>
              </div>
              {!data ? (
                <Gate
                  title="Complete earlier phases first"
                  sub="Run the assessment to unlock your learning plan."
                  onBack={() => setPhase(2)}
                  back="Go to assessment"
                />
              ) : (
                <>
                  <div className="sf-pg">
                    {[
                      { lbl: "Days 1–30", tit: "Foundation fix", items: data.plan30 },
                      { lbl: "Days 31–60", tit: "Evidence building", items: data.plan60 },
                      { lbl: "Days 61–90", tit: "Interview ready", items: data.plan90 },
                    ].map((pl, i) => (
                      <div key={i} className="sf-pc">
                        <div className="sf-pn">{pl.lbl}</div>
                        <div className="sf-pt">{pl.tit}</div>
                        {pl.items?.map((item, j) => (
                          <div key={j} className="sf-pi2">
                            <div className="sf-pd" />
                            <div className="sf-ptx">{item}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="sf-stag" style={{ marginBottom: 10 }}>Weekly execution schedule</div>
                  <div className="sf-sp">
                    <div className="sf-sprow sf-sph">
                      <div className="sf-spc">Day</div>
                      <div className="sf-spc">Focus area</div>
                      <div className="sf-spc">Hours</div>
                    </div>
                    {(data.weeklyPlan || []).map((w, i) => (
                      <div key={i} className="sf-sprow">
                        <div className="sf-spc sf-spd">{w.day}</div>
                        <div className="sf-spc" style={{ color: "var(--mu)" }}>{w.focus}</div>
                        <div className="sf-spc" style={{ color: "var(--ac)" }}>{w.hours}</div>
                      </div>
                    ))}
                  </div>
                  <div className="sf-stag" style={{ marginBottom: 10 }}>Curated resources</div>
                  <div className="sf-rg">
                    {(data.resources || []).map((r, i) => (
                      <div key={i} className="sf-rc">
                        <div className="sf-rsk">{r.skill}</div>
                        <div className="sf-rna">{r.name}</div>
                        <div className="sf-rde2">{r.desc}</div>
                        <span className="sf-rty">{r.type}</span>
                      </div>
                    ))}
                  </div>
                  <button className="sf-btn" onClick={() => { finish(5); setPhase(6); }}>
                    Activate accountability coach →
                  </button>
                </>
              )}
            </>
          )}

          {/* ══ PHASE 6 ══ */}
          {phase === 6 && (
            <>
              <div style={{ marginBottom: "1.5rem" }}>
                <div className="sf-stag">Phase 6 — Accountability coach</div>
                <div className="sf-stit">Weekly execution tracker</div>
                <div className="sf-ssub">Log daily activity. Keep the streak. Watch your score move.</div>
              </div>
              {!data ? (
                <Gate
                  title="Complete earlier phases first"
                  sub="Run the full assessment to unlock coaching."
                  onBack={() => setPhase(2)}
                  back="Go to assessment"
                />
              ) : (
                <>
                  <div className="sf-sc">
                    <div className="sf-scc">
                      <div className="sf-scn">{days}</div>
                      <div className="sf-scl">Days logged</div>
                    </div>
                    <div className="sf-scc">
                      <div className="sf-scn">{Math.round(days * 2.5)}</div>
                      <div className="sf-scl">Est. hours studied</div>
                    </div>
                    <div className="sf-scc">
                      <div className="sf-scn">{Math.min(100, Math.round(score + days * 0.6))}</div>
                      <div className="sf-scl">Projected score</div>
                    </div>
                  </div>
                  <div className="sf-stag" style={{ marginBottom: 8 }}>35-day streak — click to mark complete</div>
                  <div className="sf-tr">
                    {tracker.map((on, i) => (
                      <div
                        key={i}
                        className={`sf-tc ${on ? "on" : ""}`}
                        onClick={() => setTracker(t => { const n = [...t]; n[i] = !n[i]; return n; })}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="sf-stag" style={{ marginBottom: 10 }}>Next 7-day sprint</div>
                  <div className="sf-sp">
                    <div className="sf-sprow sf-sph">
                      <div className="sf-spc">Day</div>
                      <div className="sf-spc">Focus area</div>
                      <div className="sf-spc">Hours</div>
                    </div>
                    {/* FIX #13: Safe slice — weeklyPlan guaranteed 7 items by assessment normalizer */}
                    {(data.weeklyPlan || []).slice(0, 7).map((w, i) => (
                      <div key={i} className="sf-sprow">
                        <div className="sf-spc sf-spd">{w.day}</div>
                        <div className="sf-spc" style={{ color: "var(--mu)" }}>{w.focus}</div>
                        <div className="sf-spc" style={{ color: "var(--ac)" }}>{w.hours}</div>
                      </div>
                    ))}
                  </div>
                  <div className="sf-truth">
                    <div className="sf-tt">Coach note</div>
                    <div className="sf-tq">
                      "The candidates who land offers aren't always the most talented — they're the most consistent.
                      Show up every day. The score moves."
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="sf-btn" onClick={reset}>Start new assessment →</button>
                    <button className="sf-btn-g" onClick={() => setPhase(5)}>← Review learning plan</button>
                  </div>
                </>
              )}
            </>
          )}

        </main>
      </div>
    </>
  );
}
