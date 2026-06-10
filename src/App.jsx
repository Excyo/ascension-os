import { useState, useEffect, useRef, useCallback } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────
// stat keys: STR, DIS, WIS, WLT, CON, AGI
const TASKS = [
  { id:"e1", label:"20-20-20 Rule",     cat:"eye",     emoji:"👁",  xp:10, stat:"AGI" },
  { id:"e2", label:"30min Outdoors",    cat:"eye",     emoji:"🌿",  xp:10, stat:"AGI" },
  { id:"e3", label:"Dark Mode On",      cat:"eye",     emoji:"🌙",  xp:10, stat:"AGI" },
  { id:"e4", label:"Eye Exercises",     cat:"eye",     emoji:"🔄",  xp:10, stat:"AGI" },
  { id:"e5", label:"Eye Nutrition",     cat:"eye",     emoji:"🥗",  xp:10, stat:"AGI" },
  { id:"t1", label:"Tone Practice",     cat:"thai",    emoji:"🎵",  xp:15, stat:"WIS" },
  { id:"t2", label:"Duolingo",          cat:"thai",    emoji:"🦉",  xp:10, stat:"WIS" },
  { id:"t3", label:"Forvo Pronunc.",    cat:"thai",    emoji:"🎙",  xp:10, stat:"WIS" },
  { id:"t4", label:"Study Session",     cat:"thai",    emoji:"📚",  xp:15, stat:"WIS" },
  { id:"b1", label:"Workout",           cat:"body",    emoji:"⚡",  xp:20, stat:"STR" },
  { id:"b2", label:"Course Exercises",  cat:"body",    emoji:"💪",  xp:15, stat:"STR" },
  { id:"b3", label:"Contrast Shower",   cat:"body",    emoji:"🚿",  xp:10, stat:"STR" },
  { id:"b4", label:"2L+ Water",         cat:"body",    emoji:"💧",  xp:10, stat:"STR" },
  { id:"m1", label:"Ascension Work",    cat:"mind",    emoji:"🏰",  xp:25, stat:"WLT" },
  { id:"m2", label:"Journal Entry",     cat:"mind",    emoji:"✍️",  xp:10, stat:"DIS" },
  { id:"m3", label:"Meditation",        cat:"mind",    emoji:"🧘",  xp:10, stat:"DIS" },
  { id:"m4", label:"Content Created",   cat:"mind",    emoji:"📱",  xp:20, stat:"WLT" },
  { id:"m5", label:"Read / Learn",      cat:"mind",    emoji:"📖",  xp:15, stat:"WIS" },
  { id:"r1", label:"Early Wake",        cat:"morning", emoji:"🌅",  xp:10, stat:"DIS" },
  { id:"r2", label:"Morning Routine",   cat:"morning", emoji:"☀️",  xp:10, stat:"DIS" },
  { id:"r3", label:"Set Daily Goals",   cat:"morning", emoji:"🎯",  xp:10, stat:"CON" },
  { id:"v1", label:"Screens Off 1hr",   cat:"evening", emoji:"📵",  xp:10, stat:"DIS" },
  { id:"v2", label:"Evening Review",    cat:"evening", emoji:"🌙",  xp:10, stat:"CON" },
];

const CATS = {
  eye:     { label:"👁  Eye Care",    color:"#22c55e" },
  thai:    { label:"🇹🇭  Thai",        color:"#22d3ee" },
  body:    { label:"💪  Body",        color:"#ec4899" },
  mind:    { label:"🧠  Mind",        color:"#a78bfa" },
  morning: { label:"🌅  Morning",     color:"#f59e0b" },
  evening: { label:"🌙  Evening",     color:"#3b82f6" },
};

const STATS_DEF = [
  { id:"STR", label:"STRENGTH",    sub:"Physical power & body",         color:"#ec4899" },
  { id:"DIS", label:"DISCIPLINE",  sub:"Habits, consistency & control",  color:"#f59e0b" },
  { id:"WIS", label:"WISDOM",      sub:"Learning, Thai & knowledge",     color:"#22d3ee" },
  { id:"WLT", label:"WEALTH",      sub:"Business, income & building",    color:"#22c55e" },
  { id:"CON", label:"CONFIDENCE",  sub:"Charisma, presence & authority", color:"#a78bfa" },
  { id:"AGI", label:"AGILITY",     sub:"Eye health & movement quality",  color:"#38bdf8" },
];

const SKILLS_DEF = [
  { id:"s1", name:"Thai Language",       cat:"Language",   color:"#22d3ee", desc:"Stage 1: Tones → Alphabet → Fluency" },
  { id:"s2", name:"Eye Care Protocol",   cat:"Health",     color:"#22c55e", desc:"Daily vision health & healing" },
  { id:"s3", name:"Ascension Protocol",  cat:"Business",   color:"#f59e0b", desc:"12-wk Sovereign Builder program" },
  { id:"s4", name:"Performance Mastery", cat:"Body",       color:"#ec4899", desc:"12-wk no-equipment course" },
  { id:"s5", name:"Digital Sovereignty", cat:"Mindset",    color:"#a78bfa", desc:"Own your stack, own your identity" },
  { id:"s6", name:"Shadow Integration",  cat:"Inner Work", color:"#7c3aed", desc:"Reckoning → Voice → Direction" },
  { id:"s7", name:"Content Creation",    cat:"Business",   color:"#f59e0b", desc:"Building in public daily" },
  { id:"s8", name:"Brotherhood Builder", cat:"Community",  color:"#3b82f6", desc:"Group model for Ascension clients" },
];

const QUESTS_DEF = [
  { id:"q1", name:"Complete Stage 1 – Thai Tones",    type:"main",  xp:5000,  deadline:"Week 4"  },
  { id:"q2", name:"Launch Ascension Protocol Beta",   type:"main",  xp:10000, deadline:"TBD"     },
  { id:"q3", name:"Finish 12-Wk Performance Course",  type:"main",  xp:8000,  deadline:"Week 12" },
  { id:"q4", name:"Build First Online Business",      type:"main",  xp:8000,  deadline:"TBD"     },
  { id:"q5", name:"Reach 15% Body Fat",               type:"main",  xp:5000,  deadline:"TBD"     },
  { id:"q6", name:"30-Day Eye Care Streak",           type:"side",  xp:3000,  deadline:"Ongoing" },
  { id:"q7", name:"Create 30 Pieces of Content",      type:"side",  xp:3000,  deadline:"Month 2" },
  { id:"q8", name:"21-Day Meditation Streak",         type:"side",  xp:2000,  deadline:"Ongoing" },
  { id:"q9", name:"Get New Glasses",                  type:"side",  xp:1000,  deadline:"ASAP"    },
  { id:"q10",name:"First Paying Client",              type:"bonus", xp:15000, deadline:"TBD"     },
  { id:"q11",name:"Teach Someone Thai",               type:"bonus", xp:2000,  deadline:"Month 6" },
];

const FUTURE_SYSTEMS = [
  { icon:"🌲", name:"Skill Trees" },
  { icon:"⚔️", name:"Boss Battles" },
  { icon:"🤝", name:"Brotherhood Guilds" },
  { icon:"🤖", name:"AI Mentor" },
  { icon:"🏆", name:"Achievements" },
  { icon:"🧬", name:"Character Avatar" },
  { icon:"✖️", name:"Discipline Multipliers" },
  { icon:"👑", name:"Prestige System" },
];

const XP_LVL  = 500;
const getLevel  = xp  => Math.floor(xp / XP_LVL) + 1;
const getLvlPct = xp  => ((xp % XP_LVL) / XP_LVL) * 100;
const getRank   = lvl => {
  if (lvl>=96) return { rank:"SSS", color:"#f59e0b" };
  if (lvl>=81) return { rank:"SS",  color:"#e879f9" };
  if (lvl>=66) return { rank:"S",   color:"#ec4899" };
  if (lvl>=51) return { rank:"A",   color:"#22c55e" };
  if (lvl>=36) return { rank:"B",   color:"#3b82f6" };
  if (lvl>=21) return { rank:"C",   color:"#22d3ee" };
  if (lvl>=11) return { rank:"D",   color:"#a78bfa" };
  return              { rank:"E",   color:"#64748b" };
};

const todayStr = () => new Date().toISOString().split("T")[0];

const DEFAULT = {
  playerName:    "Sovereign Builder",
  totalXP:       0,
  shadow:        10,
  stats:         { STR:1, DIS:1, WIS:1, WLT:1, CON:1, AGI:1 },
  dailyTasks:    {},
  lastDate:      "",
  streak:        0,
  weeklyLog:     [],
  skills:        SKILLS_DEF.map(s => ({ id:s.id, level:1 })),
  questDefs:     QUESTS_DEF.map(q => ({ ...q })),
  questProgress: Object.fromEntries(QUESTS_DEF.map(q => [q.id, 0])),
  questBin:      [],
};

async function loadSave() {
  try {
    const raw = localStorage.getItem("ascension_os_v1");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
async function doSave(s) {
  try { localStorage.setItem("ascension_os_v1", JSON.stringify(s)); } catch {}
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#070710}
.app{font-family:'Rajdhani',sans-serif;background:#070710;color:#dde0f5;min-height:100vh;max-width:430px;margin:0 auto;position:relative;overflow-x:hidden}
.fx-bg{position:fixed;inset:0;background:radial-gradient(ellipse 60% 40% at 20% 10%,rgba(124,58,237,.13) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 80% 90%,rgba(34,211,238,.07) 0%,transparent 60%),#070710;pointer-events:none;z-index:0}
.wrap{position:relative;z-index:1;padding-bottom:72px}

.hdr{position:sticky;top:0;z-index:100;padding:12px 16px;display:flex;align-items:center;background:rgba(7,7,16,.92);border-bottom:1px solid rgba(124,58,237,.25);backdrop-filter:blur(12px)}
.hdr-title{flex:1;font-size:11px;font-weight:700;letter-spacing:3px;color:#f59e0b;text-transform:uppercase}
.hdr-xp{font-family:'Share Tech Mono',monospace;font-size:11px;color:#22c55e}

.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;display:flex;background:rgba(7,7,16,.95);border-top:1px solid rgba(124,58,237,.25);backdrop-filter:blur(16px);z-index:100}
.nb{flex:1;padding:9px 4px 13px;background:none;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;color:#475569;font-family:'Rajdhani',sans-serif;transition:color .2s}
.nb.on{color:#7c3aed}.nb.on .ni{filter:drop-shadow(0 0 8px #7c3aed)}
.ni{font-size:17px;line-height:1}.nl{font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase}

.card{background:rgba(12,12,28,.8);border:1px solid rgba(124,58,237,.2);border-radius:10px;padding:16px;margin:10px 14px;backdrop-filter:blur(4px)}
.card-glow{box-shadow:0 0 28px rgba(124,58,237,.1),inset 0 0 28px rgba(124,58,237,.03)}
.sec-lbl{font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#475569;padding:14px 14px 5px}

.rank-big{font-size:68px;font-weight:700;line-height:1;text-align:center;font-family:'Share Tech Mono',monospace;text-shadow:0 0 40px currentColor}
.lvl-num{font-size:42px;font-weight:700;color:#f59e0b;font-family:'Share Tech Mono',monospace;text-shadow:0 0 20px rgba(245,158,11,.45)}
.xp-track{height:7px;background:rgba(255,255,255,.07);border-radius:4px;overflow:hidden;margin:10px 0 4px}
.xp-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#7c3aed,#22d3ee);box-shadow:0 0 10px rgba(124,58,237,.5);transition:width .9s cubic-bezier(.34,1.56,.64,1)}

.shadow-track{height:7px;background:rgba(255,255,255,.07);border-radius:4px;overflow:hidden;margin:6px 0 2px}
.shadow-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#dc2626,#991b1b);box-shadow:0 0 10px rgba(220,38,38,.4);transition:width .6s ease}

.sr{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)}
.sl{font-size:10px;font-weight:700;letter-spacing:2px;width:32px;font-family:'Share Tech Mono',monospace}
.sb{flex:1;height:5px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden}
.sbf{height:100%;border-radius:3px;transition:width .6s ease}
.sv{font-size:11px;font-weight:700;width:22px;text-align:right;font-family:'Share Tech Mono',monospace}

.day-banner{background:linear-gradient(135deg,rgba(124,58,237,.12),rgba(34,211,238,.06));border:1px solid rgba(124,58,237,.25);border-radius:10px;padding:13px 16px;margin:12px 14px;display:flex;align-items:center;justify-content:space-between}
.cat-hdr{display:flex;align-items:center;gap:8px;padding:12px 14px 5px;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase}
.cat-line{flex:1;height:1px;background:currentColor;opacity:.15}
.task-row{display:flex;align-items:center;gap:11px;padding:10px 14px;cursor:pointer;transition:background .15s;border-bottom:1px solid rgba(255,255,255,.03)}
.task-row:hover{background:rgba(124,58,237,.07)}
.task-row.done{background:rgba(34,197,94,.04)}
.task-row.done .t-lbl{color:#475569;text-decoration:line-through}
.t-box{width:22px;height:22px;border-radius:5px;border:2px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;transition:all .18s}
.task-row.done .t-box{background:#22c55e;border-color:#22c55e;color:#000}
.t-lbl{flex:1;font-size:13px;font-weight:500}
.t-xp{font-size:9px;font-weight:700;color:#f59e0b;font-family:'Share Tech Mono',monospace;text-align:right}
.t-stat{font-size:8px;color:#475569;text-align:right}

.sk-card{background:rgba(12,12,28,.8);border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:13px;margin:7px 14px;transition:border-color .2s}
.sk-card:hover{border-color:rgba(124,58,237,.3)}
.prog-bg{height:4px;background:rgba(255,255,255,.07);border-radius:2px;overflow:hidden;margin-top:8px}
.prog-fill{height:100%;border-radius:2px;transition:width .5s ease}

.q-card{border-radius:8px;padding:13px 14px;margin:7px 14px;border-left:3px solid;background:rgba(12,12,28,.8);border-right:1px solid rgba(255,255,255,.04);border-top:1px solid rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.04)}
.qf-bar{display:flex;gap:7px;padding:6px 14px 0;flex-wrap:wrap;align-items:center}
.qfb{border-radius:20px;padding:5px 11px;cursor:pointer;font-size:10px;font-weight:700;font-family:'Rajdhani',sans-serif;letter-spacing:1px;text-transform:uppercase;border:1px solid;transition:all .2s}

.log-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:6px;margin-bottom:4px;background:rgba(255,255,255,.03)}
.sl-input{background:rgba(255,255,255,.06);border:1px solid rgba(124,58,237,.3);border-radius:6px;color:#dde0f5;font-family:'Rajdhani',sans-serif;font-size:13px;padding:9px 12px;width:100%;outline:none;transition:border-color .2s}
.sl-input:focus{border-color:#7c3aed}
.btn{background:linear-gradient(135deg,#7c3aed,#5b21b6);color:#fff;border:none;border-radius:6px;padding:10px 20px;font-family:'Rajdhani',sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;cursor:pointer;text-transform:uppercase;transition:all .2s;width:100%}
.btn:hover{box-shadow:0 0 20px rgba(124,58,237,.4)}
.btn-sm{padding:5px 11px;font-size:10px;width:auto}
.btn-red{background:linear-gradient(135deg,#dc2626,#991b1b)}
.btn-red:hover{box-shadow:0 0 20px rgba(220,38,38,.35)}
.btn-ghost{background:rgba(255,255,255,.06);color:#94a3b8;border:1px solid rgba(255,255,255,.1)}
.btn-ghost:hover{background:rgba(255,255,255,.1);box-shadow:none}
.mini-stat{background:rgba(12,12,28,.8);border:1px solid rgba(255,255,255,.07);border-radius:6px;padding:11px;text-align:center;flex:1}

.notif{position:fixed;top:66px;left:50%;transform:translateX(-50%);z-index:999;background:rgba(10,10,24,.97);border:1px solid #f59e0b;border-radius:8px;padding:11px 20px;font-size:13px;font-weight:700;color:#f59e0b;text-align:center;box-shadow:0 0 30px rgba(245,158,11,.25);backdrop-filter:blur(10px);animation:na .3s ease;white-space:nowrap}
@keyframes na{from{opacity:0;transform:translateX(-50%) translateY(-8px) scale(.92)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
.xp-pop{position:fixed;pointer-events:none;z-index:998;font-size:14px;font-weight:700;font-family:'Share Tech Mono',monospace;text-shadow:0 0 10px currentColor;animation:fu 1.2s ease forwards}
@keyframes fu{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-60px)}}
.lvlup-flash{position:fixed;inset:0;background:rgba(124,58,237,.14);z-index:997;pointer-events:none;animation:flash .7s ease forwards}
.shadow-flash{position:fixed;inset:0;background:rgba(220,38,38,.12);z-index:997;pointer-events:none;animation:flash .6s ease forwards}
@keyframes flash{0%{opacity:1}100%{opacity:0}}
.fs-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.fs-item{background:rgba(124,58,237,.08);border:1px solid rgba(124,58,237,.15);border-radius:7px;padding:11px 10px;text-align:center;font-size:11px;font-weight:600;color:#64748b;display:flex;flex-direction:column;align-items:center;gap:5px}
.fs-item span:first-child{font-size:18px}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(124,58,237,.3);border-radius:2px}
`;

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]       = useState("status");
  const [gs, setGs]         = useState(null);
  const [ready, setReady]   = useState(false);
  const [notif, setNotif]   = useState(null);
  const [pops, setPops]     = useState([]);
  const [flash, setFlash]   = useState(null); // "lvl" | "shadow" | null
  const notifRef            = useRef(null);

  useEffect(() => {
    loadSave().then(saved => {
      let s = saved ? { ...DEFAULT, ...saved } : { ...DEFAULT };
      // migrate old saves
      if (!s.shadow) s.shadow = 10;
      if (!s.questDefs) {
        const oldCustom = s.customQuests || [];
        s.questDefs = [...QUESTS_DEF.map(q=>({...q})), ...oldCustom];
        // build progress map from old quests array
        const oldQ = s.quests || [];
        s.questProgress = {};
        s.questDefs.forEach(q => {
          const match = oldQ.find(o => o.id === q.id);
          s.questProgress[q.id] = match ? (match.progress||0) : 0;
        });
        delete s.quests;
        delete s.customQuests;
      }
      if (!s.questProgress) s.questProgress = Object.fromEntries(s.questDefs.map(q=>[q.id,0]));
      if (!s.questBin) s.questBin = [];
      const today = todayStr();
      if (s.lastDate !== today) {
        const yest = new Date(); yest.setDate(yest.getDate()-1);
        const prevDone = Object.values(s.dailyTasks||{}).some(Boolean);
        if (s.lastDate === yest.toISOString().split("T")[0] && prevDone) s.streak = (s.streak||0)+1;
        else if (s.lastDate && s.lastDate !== today) s.streak = 0;
        s.dailyTasks = {};
        s.lastDate = today;
      }
      setGs(s); setReady(true);
    });
  }, []);

  useEffect(() => { if (gs) doSave(gs); }, [gs]);

  const showNotif = useCallback(msg => {
    setNotif(msg);
    if (notifRef.current) clearTimeout(notifRef.current);
    notifRef.current = setTimeout(() => setNotif(null), 2800);
  }, []);

  const addPop = useCallback((label, color="#22c55e") => {
    const id = Date.now() + Math.random();
    const x  = 160 + Math.random()*100;
    const y  = 200 + Math.random()*80;
    setPops(p => [...p, { id, x, y, label, color }]);
    setTimeout(() => setPops(p => p.filter(i => i.id !== id)), 1300);
  }, []);

  const toggleTask = useCallback((taskId) => {
    setGs(prev => {
      const done    = !!prev.dailyTasks[taskId];
      const task    = TASKS.find(t => t.id === taskId);
      const newXP   = Math.max(0, prev.totalXP + (done ? -task.xp : task.xp));
      const prevLvl = getLevel(prev.totalXP);
      const newLvl  = getLevel(newXP);
      // stat boost / unboost
      const statKey = task.stat;
      const statDelta = done ? -1 : 1;
      const newStats = { ...prev.stats, [statKey]: Math.max(1, (prev.stats[statKey]||1) + statDelta) };
      if (!done) {
        addPop(`+${task.xp} XP`, "#22c55e");
        setTimeout(() => addPop(`+1 ${statKey}`, STATS_DEF.find(s=>s.id===statKey)?.color||"#a78bfa"), 200);
        if (newLvl > prevLvl) {
          setFlash("lvl"); setTimeout(() => setFlash(null), 800);
          setTimeout(() => showNotif(`⚡ LEVEL UP! Now Level ${newLvl}!`), 350);
        }
      }
      return { ...prev, totalXP: newXP, stats: newStats, dailyTasks: { ...prev.dailyTasks, [taskId]: !done } };
    });
  }, [addPop, showNotif]);

  const resetDailies = useCallback(() => {
    setGs(p => {
      // reverse stat gains from today's completed tasks
      const newStats = { ...p.stats };
      TASKS.forEach(t => { if (p.dailyTasks[t.id]) newStats[t.stat] = Math.max(1, (newStats[t.stat]||1)-1); });
      const removedXP = TASKS.filter(t => p.dailyTasks[t.id]).reduce((s,t)=>s+t.xp,0);
      return { ...p, dailyTasks:{}, stats: newStats, totalXP: Math.max(0, p.totalXP - removedXP) };
    });
    showNotif("🔄 Daily quests reset");
  }, [showNotif]);

  const triggerShadow = useCallback(() => {
    setGs(p => ({ ...p, shadow: Math.min(100, (p.shadow||0)+5) }));
    setFlash("shadow"); setTimeout(() => setFlash(null), 700);
    addPop("+5 SHADOW", "#ef4444");
    showNotif("💀 Shadow grows... face it or feed it.");
  }, [addPop, showNotif]);

  const reduceShadow = useCallback(() => {
    setGs(p => ({ ...p, shadow: Math.max(0, (p.shadow||0)-5) }));
    addPop("-5 SHADOW", "#a78bfa");
    showNotif("✨ Shadow reduced — integration in progress.");
  }, [addPop, showNotif]);

  const updStat = useCallback((id, d) => {
    setGs(p => ({ ...p, stats: { ...p.stats, [id]: Math.max(1, Math.min(999, (p.stats[id]||1)+d)) } }));
  }, []);

  const updSkill = useCallback((id, d) => {
    setGs(p => ({ ...p, skills: p.skills.map(s => s.id===id ? {...s, level:Math.max(1,s.level+d)} : s) }));
  }, []);

  const updQuest = useCallback((id, delta) => {
    setGs(prev => {
      const oldProg = prev.questProgress?.[id] || 0;
      const newProg = Math.max(0, Math.min(100, oldProg + delta));
      const newProgress = { ...prev.questProgress, [id]: newProg };
      const qDef = prev.questDefs?.find(q => q.id === id);
      if (newProg >= 100 && oldProg < 100) {
        setTimeout(() => showNotif(`🏆 QUEST COMPLETE! +${(qDef?.xp||0).toLocaleString()} XP!`), 100);
        return { ...prev, questProgress: newProgress, totalXP: prev.totalXP + (qDef?.xp||0) };
      }
      return { ...prev, questProgress: newProgress };
    });
  }, [showNotif]);

  const addQuest = useCallback((quest) => {
    setGs(p => ({
      ...p,
      questDefs: [...(p.questDefs||[]), quest],
      questProgress: { ...(p.questProgress||{}), [quest.id]: 0 },
    }));
    showNotif(`📜 Quest added: ${quest.name}`);
  }, [showNotif]);

  const editQuest = useCallback((id, updates) => {
    setGs(p => ({
      ...p,
      questDefs: (p.questDefs||[]).map(q => q.id === id ? { ...q, ...updates } : q),
    }));
    showNotif("✏️ Quest updated");
  }, [showNotif]);

  const deleteQuest = useCallback((id) => {
    setGs(p => {
      const quest = (p.questDefs||[]).find(q => q.id === id);
      if (!quest) return p;
      const newProgress = { ...p.questProgress };
      const savedProgress = newProgress[id] || 0;
      delete newProgress[id];
      return {
        ...p,
        questDefs:    (p.questDefs||[]).filter(q => q.id !== id),
        questProgress: newProgress,
        questBin:     [...(p.questBin||[]), { ...quest, savedProgress, deletedAt: new Date().toLocaleDateString() }],
      };
    });
    showNotif("🗑 Moved to bin — recoverable");
  }, [showNotif]);

  const restoreQuest = useCallback((id) => {
    setGs(p => {
      const quest = (p.questBin||[]).find(q => q.id === id);
      if (!quest) return p;
      const { savedProgress, deletedAt, ...questDef } = quest;
      return {
        ...p,
        questBin:     (p.questBin||[]).filter(q => q.id !== id),
        questDefs:    [...(p.questDefs||[]), questDef],
        questProgress: { ...(p.questProgress||{}), [id]: savedProgress || 0 },
      };
    });
    showNotif("♻️ Quest restored!");
  }, [showNotif]);

  const permanentDelete = useCallback((id) => {
    setGs(p => ({ ...p, questBin: (p.questBin||[]).filter(q => q.id !== id) }));
    showNotif("💀 Permanently deleted");
  }, [showNotif]);

  const toggleComplete = useCallback((id) => {
    setGs(prev => {
      const prog      = prev.questProgress?.[id] || 0;
      const wasComplete = prog >= 100;
      const qDef      = prev.questDefs?.find(q => q.id === id);
      const newProg   = wasComplete ? 0 : 100;
      const xpDelta   = wasComplete ? -(qDef?.xp||0) : (qDef?.xp||0);
      const newXP     = Math.max(0, prev.totalXP + xpDelta);
      if (!wasComplete) setTimeout(() => showNotif(`🏆 QUEST COMPLETE! +${(qDef?.xp||0).toLocaleString()} XP!`), 100);
      else setTimeout(() => showNotif("↩️ Quest marked incomplete"), 100);
      return { ...prev, questProgress: { ...prev.questProgress, [id]: newProg }, totalXP: newXP };
    });
  }, [showNotif]);

  const addLog = useCallback((xp, notes) => {
    setGs(p => ({ ...p, weeklyLog: [...p.weeklyLog, { week:p.weeklyLog.length+1, date:todayStr(), xp:parseInt(xp)||0, notes }] }));
  }, []);

  if (!ready) return (
    <div style={{background:"#070710",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{color:"#7c3aed",fontFamily:"'Share Tech Mono',monospace",fontSize:13,letterSpacing:4}}>LOADING SYSTEM...</div>
    </div>
  );

  const level  = getLevel(gs.totalXP);
  const { rank, color:rankCol } = getRank(level);
  const xpPct  = getLvlPct(gs.totalXP);
  const dayXP  = TASKS.filter(t => gs.dailyTasks[t.id]).reduce((s,t)=>s+t.xp,0);
  const maxXP  = TASKS.length * 10;

  return (
    <>
      <style>{CSS}</style>
      <div className="fx-bg"/>
      {flash==="lvl"    && <div className="lvlup-flash"/>}
      {flash==="shadow" && <div className="shadow-flash"/>}
      {pops.map(p=>(
        <div key={p.id} className="xp-pop" style={{left:p.x, top:p.y, color:p.color}}>{p.label}</div>
      ))}
      {notif && <div className="notif">{notif}</div>}

      <div className="app">
        <div className="hdr">
          <div className="hdr-title">⚔ ASCENSION OS</div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{textAlign:"right"}}>
              <div className="hdr-xp">{gs.totalXP.toLocaleString()} XP</div>
              <div style={{fontSize:9,color:"#475569",fontFamily:"'Share Tech Mono',monospace"}}>LV {level}</div>
            </div>
            <div style={{fontSize:14,fontWeight:700,color:rankCol,fontFamily:"'Share Tech Mono',monospace"}}>{rank}</div>
            {gs.shadow > 0 && (
              <div style={{fontSize:11,color:"#ef4444",fontFamily:"'Share Tech Mono',monospace",opacity:.8}}>
                💀{gs.shadow}
              </div>
            )}
          </div>
        </div>

        <div className="wrap">
          {tab==="status"  && <StatusTab  gs={gs} setGs={setGs} level={level} rank={rank} rankCol={rankCol} xpPct={xpPct} updStat={updStat} triggerShadow={triggerShadow} reduceShadow={reduceShadow}/>}
          {tab==="daily"   && <DailyTab   gs={gs} toggleTask={toggleTask} dayXP={dayXP} maxXP={maxXP} resetDailies={resetDailies}/>}
          {tab==="skills"  && <SkillsTab  gs={gs} updSkill={updSkill}/>}
          {tab==="quests"  && <QuestsTab  gs={gs} updQuest={updQuest} addQuest={addQuest} editQuest={editQuest} deleteQuest={deleteQuest} restoreQuest={restoreQuest} permanentDelete={permanentDelete} toggleComplete={toggleComplete}/>}
          {tab==="log"     && <LogTab     gs={gs} addLog={addLog}/>}
        </div>

        <div className="nav">
          {[
            {id:"status",icon:"🧬",lbl:"Status"},
            {id:"daily", icon:"📋",lbl:"Daily"},
            {id:"skills",icon:"🔮",lbl:"Skills"},
            {id:"quests",icon:"📜",lbl:"Quests"},
            {id:"log",   icon:"📊",lbl:"Log"},
          ].map(n=>(
            <button key={n.id} className={`nb ${tab===n.id?"on":""}`} onClick={()=>setTab(n.id)}>
              <span className="ni">{n.icon}</span>
              <span className="nl">{n.lbl}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── STATUS ────────────────────────────────────────────────────────────────────
function StatusTab({ gs, setGs, level, rank, rankCol, xpPct, updStat, triggerShadow, reduceShadow }) {
  const [editing, setEditing] = useState(false);
  const [nm, setNm]           = useState(gs.playerName);
  const xpInLvl = gs.totalXP % XP_LVL;
  const shadow  = gs.shadow || 0;

  return (
    <div>
      {/* Player Card */}
      <div className="card card-glow" style={{textAlign:"center",marginTop:14}}>
        {editing ? (
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <input className="sl-input" value={nm} onChange={e=>setNm(e.target.value)}/>
            <button className="btn btn-sm" onClick={()=>{setGs(p=>({...p,playerName:nm}));setEditing(false)}}>✓</button>
          </div>
        ) : (
          <div onClick={()=>setEditing(true)} style={{fontSize:12,fontWeight:700,letterSpacing:3,color:"#7c3aed",cursor:"pointer",textTransform:"uppercase",marginBottom:4}}>
            {gs.playerName} ✎
          </div>
        )}
        <div style={{fontSize:9,letterSpacing:2,color:"#475569",marginBottom:8}}>SOVEREIGN ARCHITECT · THAILAND 🇹🇭</div>

        <div className="rank-big" style={{color:rankCol}}>{rank}</div>
        <div style={{fontSize:9,letterSpacing:3,color:"#475569",marginBottom:8}}>RANK</div>

        <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:8,marginBottom:4}}>
          <span style={{fontSize:12,color:"#475569",letterSpacing:1}}>LEVEL</span>
          <span className="lvl-num">{level}</span>
        </div>

        <div className="xp-track"><div className="xp-fill" style={{width:`${xpPct}%`}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#475569",fontFamily:"'Share Tech Mono',monospace",marginBottom:14}}>
          <span>{xpInLvl} / {XP_LVL} XP</span>
          <span>LV {level+1} in {XP_LVL - xpInLvl} XP</span>
        </div>

        <div style={{display:"flex",justifyContent:"center",gap:20}}>
          {[
            {lbl:"STREAK 🔥", val:gs.streak,                   col:"#22d3ee"},
            {lbl:"TOTAL XP",   val:gs.totalXP.toLocaleString(), col:"#22c55e"},
          ].map(({lbl,val,col})=>(
            <div key={lbl} style={{textAlign:"center"}}>
              <div style={{fontSize:18,fontWeight:700,color:col,fontFamily:"'Share Tech Mono',monospace"}}>{val}</div>
              <div style={{fontSize:8,color:"#475569",letterSpacing:1,marginTop:2}}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Shadow System */}
      <div className="sec-lbl">▸ SHADOW METER</div>
      <div className="card" style={{borderColor:shadow>60?"rgba(220,38,38,.3)":"rgba(124,58,237,.2)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:shadow>60?"#ef4444":shadow>30?"#f59e0b":"#475569"}}>
              💀 Shadow Level: {shadow}
            </div>
            <div style={{fontSize:9,color:"#475569",marginTop:2}}>
              {shadow===0?"Fully integrated — you are sovereign":shadow<30?"Under control — keep integrating":shadow<60?"Shadow rising — face your demons":shadow<90?"Danger zone — urgent integration needed":"⚠️ SHADOW DOMINANCE — confront this now"}
            </div>
          </div>
          <div style={{fontSize:22,opacity:.8}}>{shadow>60?"😈":shadow>30?"😤":"🧘"}</div>
        </div>
        <div className="shadow-track">
          <div className="shadow-fill" style={{width:`${shadow}%`}}/>
        </div>
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <button className="btn btn-red btn-sm" style={{flex:1}} onClick={triggerShadow}>
            💀 Shadow Penalty +5
          </button>
          <button className="btn btn-sm" style={{flex:1,background:"rgba(167,139,250,.15)",border:"1px solid rgba(167,139,250,.3)",color:"#a78bfa"}} onClick={reduceShadow}>
            ✨ Integrate −5
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="sec-lbl">▸ CHARACTER STATS  <span style={{fontSize:8,color:"#7c3aed",fontWeight:400}}>(auto-boost from daily tasks)</span></div>
      <div className="card">
        {STATS_DEF.map(st=>{
          const v = gs.stats[st.id]||1;
          return (
            <div key={st.id} className="sr">
              <span className="sl" style={{color:st.color}}>{st.id}</span>
              <div style={{flex:1}}>
                <div className="sb"><div className="sbf" style={{width:`${Math.min((v/50)*100,100)}%`,background:st.color,opacity:.75}}/></div>
                <div style={{fontSize:7,color:"#475569",marginTop:2}}>{st.label}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <button onClick={()=>updStat(st.id,-1)} style={{background:"rgba(255,255,255,.07)",border:"none",color:"#dde0f5",width:18,height:18,borderRadius:3,cursor:"pointer",fontSize:12,lineHeight:"18px",textAlign:"center"}}>−</button>
                <span className="sv" style={{color:st.color}}>{v}</span>
                <button onClick={()=>updStat(st.id,1)} style={{background:`${st.color}20`,border:`1px solid ${st.color}40`,color:st.color,width:18,height:18,borderRadius:3,cursor:"pointer",fontSize:12,lineHeight:"18px",textAlign:"center"}}>+</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rank ref */}
      <div className="sec-lbl">▸ RANK REFERENCE</div>
      <div className="card">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px 12px"}}>
          {[
            {r:"E",  l:"1–10",  c:"#64748b"},{r:"D",  l:"11–20", c:"#3b82f6"},
            {r:"C",  l:"21–35", c:"#22d3ee"},{r:"B",  l:"36–50", c:"#22c55e"},
            {r:"A",  l:"51–65", c:"#f59e0b"},{r:"S",  l:"66–80", c:"#ec4899"},
            {r:"SS", l:"81–95", c:"#e879f9"},{r:"SSS",l:"96+",   c:"#f59e0b"},
          ].map(({r,l,c})=>{
            const active = getRank(level).rank===r;
            return (
              <div key={r} style={{display:"flex",alignItems:"center",gap:7,padding:"4px 0"}}>
                <span style={{fontSize:11,fontWeight:700,color:c,width:28,fontFamily:"'Share Tech Mono',monospace"}}>{r}</span>
                <span style={{fontSize:9,color:"#475569",flex:1}}>Lv {l}</span>
                {active && <span style={{fontSize:8,color:c,letterSpacing:1}}>◀ YOU</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Future Systems */}
      <div className="sec-lbl">▸ COMING SOON</div>
      <div style={{padding:"0 14px 10px"}}>
        <div className="fs-grid">
          {FUTURE_SYSTEMS.map(f=>(
            <div key={f.name} className="fs-item">
              <span>{f.icon}</span>
              <span>{f.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── DAILY ─────────────────────────────────────────────────────────────────────
function DailyTab({ gs, toggleTask, dayXP, maxXP, resetDailies }) {
  const today   = new Date();
  const dayName = today.toLocaleDateString("en",{weekday:"long"});
  const dateLbl = today.toLocaleDateString("en",{month:"short",day:"numeric"});
  const done    = Object.values(gs.dailyTasks).filter(Boolean).length;

  return (
    <div>
      <div className="day-banner">
        <div>
          <div style={{fontSize:20,fontWeight:700}}>{dayName}</div>
          <div style={{fontSize:10,color:"#475569"}}>{dateLbl}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:18,fontWeight:700,color:"#f59e0b",fontFamily:"'Share Tech Mono',monospace"}}>
            {dayXP} <span style={{fontSize:10,color:"#475569"}}>/ {maxXP} XP</span>
          </div>
          <div style={{fontSize:9,color:"#475569"}}>{done}/{TASKS.length} complete</div>
        </div>
      </div>

      <div style={{padding:"0 14px 8px"}}>
        <div className="xp-track" style={{margin:"0 0 6px"}}>
          <div className="xp-fill" style={{width:`${(dayXP/maxXP)*100}%`}}/>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={resetDailies} style={{fontSize:9,padding:"4px 10px"}}>
          🔄 Reset Today
        </button>
      </div>

      {Object.keys(CATS).map(cat=>{
        const catTasks = TASKS.filter(t=>t.cat===cat);
        const catDef   = CATS[cat];
        const catDone  = catTasks.filter(t=>gs.dailyTasks[t.id]).length;
        return (
          <div key={cat}>
            <div className="cat-hdr" style={{color:catDef.color}}>
              {catDef.label}
              <div className="cat-line"/>
              <span style={{fontSize:9,opacity:.7,flexShrink:0}}>{catDone}/{catTasks.length}</span>
            </div>
            {catTasks.map(t=>{
              const isDone = !!gs.dailyTasks[t.id];
              const statDef = STATS_DEF.find(s=>s.id===t.stat);
              return (
                <div key={t.id} className={`task-row ${isDone?"done":""}`} onClick={()=>toggleTask(t.id)}>
                  <div className="t-box">{isDone?"✓":""}</div>
                  <span style={{fontSize:15}}>{t.emoji}</span>
                  <span className="t-lbl">{t.label}</span>
                  <div style={{textAlign:"right"}}>
                    <div className="t-xp">+{t.xp} XP</div>
                    <div className="t-stat" style={{color:statDef?.color}}>+1 {t.stat}</div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      <div style={{height:16}}/>
    </div>
  );
}

// ── SKILLS ────────────────────────────────────────────────────────────────────
function SkillsTab({ gs, updSkill }) {
  return (
    <div style={{paddingTop:8}}>
      <div className="sec-lbl">▸ ACTIVE SKILLS</div>
      {SKILLS_DEF.map(def=>{
        const s   = gs.skills.find(s=>s.id===def.id)||{level:1};
        const pct = Math.min(100,(s.level/100)*100);
        return (
          <div key={def.id} className="sk-card" style={{borderColor:`${def.color}22`}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:def.color}}>{def.name}</div>
                <div style={{fontSize:9,color:"#475569",marginTop:2}}>{def.cat} · {def.desc}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <button onClick={()=>updSkill(def.id,-1)} style={{background:"rgba(255,255,255,.07)",border:"none",color:"#dde0f5",width:24,height:24,borderRadius:4,cursor:"pointer",fontSize:14}}>−</button>
                <div style={{textAlign:"center",minWidth:34}}>
                  <div style={{fontSize:19,fontWeight:700,color:def.color,fontFamily:"'Share Tech Mono',monospace",lineHeight:1}}>{s.level}</div>
                  <div style={{fontSize:7,color:"#475569",letterSpacing:1}}>LV</div>
                </div>
                <button onClick={()=>updSkill(def.id,1)} style={{background:`${def.color}18`,border:`1px solid ${def.color}40`,color:def.color,width:24,height:24,borderRadius:4,cursor:"pointer",fontSize:14}}>+</button>
              </div>
            </div>
            <div className="prog-bg"><div className="prog-fill" style={{width:`${pct}%`,background:def.color,opacity:.7}}/></div>
          </div>
        );
      })}
    </div>
  );
}

// ── QUESTS ────────────────────────────────────────────────────────────────────
function QuestsTab({ gs, updQuest, addQuest, editQuest, deleteQuest, restoreQuest, permanentDelete, toggleComplete }) {
  const [filter,   setFilter]   = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState(null);
  const BLANK = { name:"", type:"side", deadline:"", xp:"500" };
  const [form, setForm] = useState(BLANK);

  const typeCols  = { main:"#f59e0b", side:"#22d3ee", bonus:"#ec4899" };
  const typeIcons = { main:"🗡", side:"⚔", bonus:"✨" };

  const quests   = gs.questDefs     || [];
  const progress = gs.questProgress || {};
  const bin      = gs.questBin      || [];

  const activeFiltered = filter === "bin"
    ? []
    : filter === "all" ? quests : quests.filter(q => q.type === filter);

  const openAdd  = () => { setEditId(null); setForm(BLANK); setShowForm(true); };
  const openEdit = (q) => {
    setEditId(q.id);
    setForm({ name:q.name, type:q.type, deadline:q.deadline||"", xp:String(q.xp||500) });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(BLANK); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editId) {
      editQuest(editId, { name:form.name.trim(), type:form.type, deadline:form.deadline||"TBD", xp:parseInt(form.xp)||500 });
    } else {
      addQuest({ id:"cq_"+Date.now(), name:form.name.trim(), type:form.type, deadline:form.deadline||"TBD", xp:parseInt(form.xp)||500 });
    }
    closeForm();
  };

  const Form = (
    <div className="card" style={{borderColor:"rgba(124,58,237,.35)"}}>
      <div style={{fontSize:9,fontWeight:700,letterSpacing:3,color:"#7c3aed",marginBottom:12}}>
        {editId ? "✏️ EDIT QUEST" : "📜 NEW QUEST"}
      </div>
      <input className="sl-input" placeholder="Quest name..." value={form.name}
        onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={{marginBottom:8}}/>
      <div style={{display:"flex",gap:7,marginBottom:8}}>
        {["main","side","bonus"].map(t=>{
          const c=typeCols[t]; const on=form.type===t;
          return (
            <button key={t} onClick={()=>setForm(p=>({...p,type:t}))}
              style={{flex:1,padding:"7px 4px",borderRadius:6,cursor:"pointer",
                      background:on?`${c}20`:"transparent",border:`1px solid ${on?c:"rgba(255,255,255,.1)"}`,
                      color:on?c:"#475569",fontSize:10,fontWeight:700,
                      fontFamily:"'Rajdhani',sans-serif",letterSpacing:1,textTransform:"uppercase"}}>
              {typeIcons[t]} {t}
            </button>
          );
        })}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <input className="sl-input" placeholder="Deadline (e.g. Week 4)"
          value={form.deadline} onChange={e=>setForm(p=>({...p,deadline:e.target.value}))} style={{flex:2}}/>
        <div style={{flex:1,position:"relative"}}>
          <input className="sl-input" type="number" placeholder="XP"
            value={form.xp} onChange={e=>setForm(p=>({...p,xp:e.target.value}))}/>
          <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
                        fontSize:9,color:"#f59e0b",fontFamily:"'Share Tech Mono',monospace",pointerEvents:"none"}}>XP</span>
        </div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button className="btn" onClick={handleSave} style={{flex:1}}>
          {editId ? "✏️ SAVE CHANGES" : "⚔ ADD QUEST"}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={closeForm} style={{flexShrink:0}}>Cancel</button>
      </div>
    </div>
  );

  return (
    <div style={{paddingTop:8}}>
      {/* Filter bar */}
      <div className="qf-bar">
        <div style={{display:"flex",gap:6,flex:1,flexWrap:"wrap"}}>
          {["all","main","side","bonus"].map(f=>{
            const c  = f==="all" ? "#7c3aed" : typeCols[f];
            const on = filter===f;
            return (
              <button key={f} className="qfb" onClick={()=>{setFilter(f);closeForm();}}
                style={{background:on?`${c}20`:"transparent",borderColor:on?c:"rgba(255,255,255,.1)",color:on?c:"#475569"}}>
                {f}
              </button>
            );
          })}
          {/* Bin tab */}
          <button className="qfb" onClick={()=>{setFilter("bin");closeForm();}}
            style={{background:filter==="bin"?"rgba(220,38,38,.15)":"transparent",
                    borderColor:filter==="bin"?"#dc2626":"rgba(255,255,255,.1)",
                    color:filter==="bin"?"#dc2626":"#475569",position:"relative"}}>
            🗑 Bin
            {bin.length > 0 && (
              <span style={{position:"absolute",top:-4,right:-4,background:"#dc2626",color:"#fff",
                            borderRadius:"50%",width:14,height:14,fontSize:8,fontWeight:700,
                            display:"flex",alignItems:"center",justifyContent:"center"}}>
                {bin.length}
              </span>
            )}
          </button>
        </div>
        {filter !== "bin" && (
          <button onClick={showForm ? closeForm : openAdd}
            style={{background:showForm?"rgba(124,58,237,.2)":"rgba(124,58,237,.1)",
                    border:"1px solid rgba(124,58,237,.35)",color:"#a78bfa",borderRadius:20,
                    padding:"5px 12px",cursor:"pointer",fontSize:10,fontWeight:700,
                    fontFamily:"'Rajdhani',sans-serif",letterSpacing:1,flexShrink:0}}>
            {showForm ? "✕" : "+ NEW"}
          </button>
        )}
      </div>

      {showForm && filter !== "bin" && Form}

      {/* ── BIN VIEW ── */}
      {filter === "bin" && (
        <div>
          {bin.length === 0 ? (
            <div style={{textAlign:"center",color:"#475569",fontSize:12,padding:"40px 0"}}>
              Bin is empty — deleted quests will appear here.
            </div>
          ) : (
            <>
              <div style={{padding:"8px 14px 4px",fontSize:9,color:"#475569",letterSpacing:1}}>
                DELETED QUESTS — restore to recover, or permanently delete
              </div>
              {bin.map(q => {
                const col = typeCols[q.type] || "#7c3aed";
                return (
                  <div key={q.id} className="q-card"
                    style={{borderLeftColor:"#475569",opacity:.7}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
                      <span style={{fontSize:15,flexShrink:0,marginTop:1}}>{typeIcons[q.type]||"⚔"}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#64748b"}}>{q.name}</div>
                        <div style={{display:"flex",gap:10,marginTop:3,flexWrap:"wrap"}}>
                          <span style={{fontSize:8,color:col,textTransform:"uppercase",letterSpacing:1}}>{q.type}</span>
                          <span style={{fontSize:8,color:"#475569"}}>⏱ {q.deadline||"TBD"}</span>
                          <span style={{fontSize:8,color:"#f59e0b",fontFamily:"'Share Tech Mono',monospace"}}>+{(q.xp||0).toLocaleString()} XP</span>
                          <span style={{fontSize:8,color:"#475569"}}>🗑 {q.deletedAt}</span>
                        </div>
                        <div style={{fontSize:8,color:"#475569",marginTop:2}}>
                          Progress saved: {q.savedProgress||0}%
                        </div>
                      </div>
                    </div>
                    <div className="prog-bg">
                      <div className="prog-fill" style={{width:`${q.savedProgress||0}%`,background:"#475569"}}/>
                    </div>
                    <div style={{display:"flex",gap:8,marginTop:10}}>
                      <button onClick={()=>restoreQuest(q.id)}
                        style={{flex:1,padding:"6px",borderRadius:5,cursor:"pointer",background:"rgba(34,197,94,.12)",
                                border:"1px solid rgba(34,197,94,.3)",color:"#22c55e",fontSize:10,fontWeight:700,
                                fontFamily:"'Rajdhani',sans-serif",letterSpacing:1}}>
                        ♻️ RESTORE
                      </button>
                      <button onClick={()=>permanentDelete(q.id)}
                        style={{flex:1,padding:"6px",borderRadius:5,cursor:"pointer",background:"rgba(220,38,38,.1)",
                                border:"1px solid rgba(220,38,38,.25)",color:"#dc2626",fontSize:10,fontWeight:700,
                                fontFamily:"'Rajdhani',sans-serif",letterSpacing:1}}>
                        💀 DELETE FOREVER
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* ── ACTIVE QUESTS ── */}
      {filter !== "bin" && activeFiltered.length === 0 && (
        <div style={{textAlign:"center",color:"#475569",fontSize:12,padding:"32px 0"}}>
          No quests here. Tap + NEW to add one.
        </div>
      )}

      {filter !== "bin" && activeFiltered.map(q => {
        const prog = progress[q.id] || 0;
        const col  = typeCols[q.type] || "#7c3aed";
        const done = prog >= 100;
        const isEditing = editId === q.id && showForm;

        return (
          <div key={q.id} className="q-card"
            style={{borderLeftColor: isEditing ? "#7c3aed" : done ? "#22c55e" : col,
                    outline: isEditing ? "1px solid rgba(124,58,237,.4)" : "none"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
              <span style={{fontSize:15,flexShrink:0,marginTop:1}}>{typeIcons[q.type]||"⚔"}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:done?"#22c55e":"#dde0f5",
                             textDecoration:done?"none":"none"}}>{q.name}</div>
                <div style={{display:"flex",gap:10,marginTop:3,flexWrap:"wrap"}}>
                  <span style={{fontSize:8,color:col,textTransform:"uppercase",letterSpacing:1}}>{q.type}</span>
                  <span style={{fontSize:8,color:"#475569"}}>⏱ {q.deadline||"TBD"}</span>
                  <span style={{fontSize:8,color:"#f59e0b",fontFamily:"'Share Tech Mono',monospace"}}>+{(q.xp||0).toLocaleString()} XP</span>
                </div>
              </div>
              <div style={{display:"flex",gap:5,flexShrink:0}}>
                <button onClick={()=>isEditing ? closeForm() : openEdit(q)}
                  title="Edit"
                  style={{background:isEditing?"rgba(124,58,237,.2)":"rgba(255,255,255,.06)",
                          border:"none",color:isEditing?"#a78bfa":"#475569",
                          width:24,height:24,borderRadius:4,cursor:"pointer",fontSize:11}}>✎</button>
                <button onClick={()=>deleteQuest(q.id)}
                  title="Move to bin"
                  style={{background:"rgba(220,38,38,.08)",border:"none",color:"#dc2626",
                          width:24,height:24,borderRadius:4,cursor:"pointer",fontSize:11}}>🗑</button>
              </div>
            </div>

            <div className="prog-bg">
              <div className="prog-fill" style={{width:`${prog}%`, background:done?"#22c55e":col}}/>
            </div>

            <div style={{display:"flex",alignItems:"center",marginTop:8,gap:7}}>
              <span style={{fontSize:9,color:done?"#22c55e":"#475569",flex:1,fontFamily:"'Share Tech Mono',monospace"}}>
                {done ? "✓ COMPLETE" : `${prog}%`}
              </span>
              {/* Toggle complete button */}
              <button onClick={()=>toggleComplete(q.id)}
                title={done ? "Mark incomplete" : "Mark complete"}
                style={{background:done?"rgba(34,197,94,.12)":"rgba(255,255,255,.06)",
                        border:`1px solid ${done?"rgba(34,197,94,.35)":"rgba(255,255,255,.1)"}`,
                        color:done?"#22c55e":"#475569",padding:"4px 8px",borderRadius:4,
                        cursor:"pointer",fontSize:10,fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>
                {done ? "✓ DONE" : "○ COMPLETE"}
              </button>
              {/* +/- 10% buttons always visible */}
              <button onClick={()=>updQuest(q.id,-10)}
                style={{background:"rgba(255,255,255,.06)",border:"none",color:"#64748b",
                        padding:"4px 9px",borderRadius:4,cursor:"pointer",fontSize:10,
                        fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>−10%</button>
              <button onClick={()=>updQuest(q.id,10)}
                style={{background:`${col}20`,border:`1px solid ${col}40`,color:col,
                        padding:"4px 9px",borderRadius:4,cursor:"pointer",fontSize:10,
                        fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>+10%</button>
            </div>
          </div>
        );
      })}
      <div style={{height:16}}/>
    </div>
  );
}

// ── LOG ───────────────────────────────────────────────────────────────────────
function LogTab({ gs, addLog }) {
  const [xpI,  setXpI]  = useState("");
  const [notI, setNotI] = useState("");
  const totalLogged = gs.weeklyLog.reduce((s,w)=>s+(w.xp||0),0);
  const bestWeek    = gs.weeklyLog.length ? Math.max(...gs.weeklyLog.map(w=>w.xp||0)) : 0;

  return (
    <div style={{paddingTop:8}}>
      <div className="card">
        <div style={{fontSize:9,fontWeight:700,letterSpacing:3,color:"#475569",marginBottom:10}}>⚡ LOG THIS WEEK</div>
        <input className="sl-input" type="number" placeholder="XP earned this week..." value={xpI} onChange={e=>setXpI(e.target.value)} style={{marginBottom:8}}/>
        <input className="sl-input" placeholder="Wins, reflections, notes..." value={notI} onChange={e=>setNotI(e.target.value)} style={{marginBottom:12}}/>
        <button className="btn" onClick={()=>{if(xpI){addLog(xpI,notI);setXpI("");setNotI("");}}} >
          ⚡ LOG WEEK {gs.weeklyLog.length+1}
        </button>
      </div>

      <div style={{display:"flex",gap:8,padding:"0 14px"}}>
        {[
          {lbl:"WEEKS",      val:gs.weeklyLog.length,          col:"#a78bfa"},
          {lbl:"TOTAL XP",   val:totalLogged.toLocaleString(), col:"#22c55e"},
          {lbl:"BEST WEEK",  val:bestWeek.toLocaleString(),    col:"#f59e0b"},
          {lbl:"STREAK 🔥",  val:gs.streak,                   col:"#22d3ee"},
        ].map(({lbl,val,col})=>(
          <div key={lbl} className="mini-stat">
            <div style={{fontSize:14,fontWeight:700,color:col,fontFamily:"'Share Tech Mono',monospace"}}>{val}</div>
            <div style={{fontSize:7,color:"#475569",letterSpacing:1,marginTop:2}}>{lbl}</div>
          </div>
        ))}
      </div>

      <div className="sec-lbl">▸ HISTORY</div>
      <div style={{padding:"0 14px"}}>
        {gs.weeklyLog.length===0 && (
          <div style={{textAlign:"center",color:"#475569",fontSize:12,padding:"24px 0"}}>No weeks logged yet.</div>
        )}
        {[...gs.weeklyLog].reverse().map((w,i)=>(
          <div key={i} className="log-row">
            <div style={{fontSize:10,fontWeight:700,color:"#475569",width:42,fontFamily:"'Share Tech Mono',monospace",flexShrink:0}}>WK {w.week}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:11,color:"#dde0f5"}}>{w.notes||"—"}</div>
              <div style={{fontSize:8,color:"#475569"}}>{w.date}</div>
            </div>
            <div style={{fontSize:13,fontWeight:700,color:"#f59e0b",fontFamily:"'Share Tech Mono',monospace",flexShrink:0}}>+{(w.xp||0).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div style={{height:16}}/>
    </div>
  );
}
