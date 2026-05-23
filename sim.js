// 平衡模拟器 - Monte Carlo 1000 局 - 统计结局分布
//
// 用法：node sim.js [runs]
//
// 模拟两种策略：
//   random   - 玩家瞎选（除技能锁定的紫色选项）
//   balanced - 玩家会保护虚弱的属性（启发式策略）

// 模拟浏览器 window 全局，让 jobs/events/endings/skills 可在 Node 里 require
global.window = {};
require('./jobs.js');
require('./events.js');
require('./endings.js');
require('./skills.js');
const W = global.window;

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const rand = arr => arr[Math.floor(Math.random() * arr.length)];

// ============================================================
// 核心游戏逻辑（复刻 game.js 的关键流程，无 UI）
// ============================================================
function applyEffects(state, effects, ev, choice, character) {
  if (!effects) return;
  const adj = { ...effects };

  // 甲方 ×1.2 放大负向
  if (ev?.client) {
    for (const k of ['health', 'mood', 'fatigue', 'stress']) {
      if (adj[k] === undefined) continue;
      const isNeg = (k === 'health' || k === 'mood') ? adj[k] < 0 : adj[k] > 0;
      if (isNeg) adj[k] = Math.round(adj[k] * 1.2);
    }
  }

  // 角色 trait
  const t = character.traits || {};
  if (choice?.snark) {
    if (t.snarkBonus)   for (const [k,v] of Object.entries(t.snarkBonus))   adj[k] = (adj[k]||0)+v;
    if (t.snarkPenalty) for (const [k,v] of Object.entries(t.snarkPenalty)) adj[k] = (adj[k]||0)+v;
  } else {
    const isSub = /忍|默|低头|跟着|不抢|潜水|关电脑|关灯|不吃|盯着|画|不看|装/.test(choice?.text || '');
    if (isSub) {
      if (t.submissiveBonus)   for (const [k,v] of Object.entries(t.submissiveBonus))   adj[k] = (adj[k]||0)+v;
      if (t.submissivePenalty) for (const [k,v] of Object.entries(t.submissivePenalty)) adj[k] = (adj[k]||0)+v;
    }
  }

  // 全局难度调节（同步 game.js v0.9.6）
  if (adj.salary && adj.salary < 0)   adj.salary  = Math.ceil(adj.salary * 0.7);
  if (adj.fatigue && adj.fatigue > 0) adj.fatigue = Math.ceil(adj.fatigue * 0.8);
  if (adj.health && adj.health < 0)   adj.health  = Math.ceil(adj.health * 0.8);

  // 应用
  for (const [k, v] of Object.entries(adj)) {
    if (k === 'money') state.money += v;
    else if (state.stats[k] !== undefined) state.stats[k] = clamp(state.stats[k] + v, 0, 100);
  }

  // 怼老板罚款（小马 ×0.8）
  if (choice?.snark) {
    let fine = Math.round((state.salaryAmount || 0) * 0.025 / 100) * 100;
    if (state.character === 'horse') fine = Math.round(fine * 0.8 / 100) * 100;
    state.money -= fine;
  }

  // 看病费简化：health drop >=10 时按 2/3 概率扣 ¥200
  // （sim 里不严格追踪 healthDebt 累积）
}

function checkEnding(state) {
  const ctx = {
    day: state.day,
    character: state.character,
    job: state.profile.jobId,
    snarkCount: state.history.snarkCount,
    sideHustleCount: state.history.sideHustleCount,
  };
  for (const ending of [...W.ENDINGS].sort((a, b) => b.priority - a.priority)) {
    if (ending.condition(state.stats, ctx)) return ending;
  }
  return null;
}

function pickEvent(state) {
  const jobId = state.profile.jobId;
  const pool = W.EVENTS.filter(e => {
    if (e.timeSlot !== undefined && e.timeSlot !== state.timeSlot) return false;
    if (e.minDay && state.day < e.minDay) return false;
    if (e.maxDay && state.day > e.maxDay) return false;
    if (e.once && state.seenEventIds.includes(e.id)) return false;
    if (e.pool === 'side_hustle') return false; // sim 不解锁副业池
    if (e.jobs && !e.jobs.includes(jobId)) return false;
    return true;
  });
  let unseen = pool.filter(e => !state.seenEventIds.includes(e.id));
  if (unseen.length === 0) unseen = pool;
  if (unseen.length === 0) return null;
  return rand(unseen);
}

// ============================================================
// 策略
// ============================================================
function policyRandom(ev) {
  const visible = ev.choices.map((c, i) => ({c, i})).filter(x => !x.c.hidden);
  return rand(visible).i;
}

function policyBalanced(ev, state) {
  const s = state.stats;
  let best = -Infinity, bestIdx = 0;
  ev.choices.forEach((c, i) => {
    if (c.hidden || !c.effects) return;
    let score = 0;
    for (const [k, v] of Object.entries(c.effects)) {
      if (k === 'money') { score += v / 100; continue; }
      if (k === 'stress' || k === 'fatigue') score -= v * (s[k] > 60 ? 2 : 1);
      else if (k === 'health' || k === 'mood') score += v * (s[k] < 40 ? 2 : 1);
      else if (k === 'salary') score += v * (s[k] < 30 ? 2 : 1);
      else score += v;
    }
    if (score > best) { best = score; bestIdx = i; }
  });
  return bestIdx;
}

function policySnarky(ev) {
  // 玩家偏好怼回去（每次有 snark 选项 70% 概率选）
  const snarks = ev.choices.map((c, i) => ({c, i})).filter(x => x.c.snark && !x.c.hidden);
  if (snarks.length > 0 && Math.random() < 0.7) return rand(snarks).i;
  return policyRandom(ev);
}

// ============================================================
// 单局
// ============================================================
function simulateOne(charId, jobId, policy) {
  const character = W.CHARACTERS.find(c => c.id === charId);
  const job = W.JOBS.find(j => j.id === jobId);
  const stats = { ...job.baseStats };
  for (const [k, v] of Object.entries(character.statOffset || {})) {
    stats[k] = clamp(stats[k] + v, 0, 100);
  }
  const state = {
    day: 1, timeSlot: 0,
    stats,
    money: Math.round(job.salary / 22) + (job.startMoney || 0),
    salaryAmount: job.salary,
    initialSalary: stats.salary,
    bonusPaidDay7: false,
    history: { snarkCount: 0, sideHustleCount: 0, fishingCount: 0, coffeeCount: 0, overtimeCount: 0, totalChoices: 0 },
    seenEventIds: [],
    character: charId,
    profile: { jobId },
  };

  let ending = null;
  let steps = 0;
  while (!ending && state.day <= 14 && steps < 50) {
    steps++;
    const ev = pickEvent(state);
    if (ev) {
      state.seenEventIds.push(ev.id);
      const idx = policy(ev, state);
      const choice = ev.choices[idx];
      if (choice) {
        applyEffects(state, choice.effects, ev, choice, character);
        if (choice.snark) state.history.snarkCount++;
      }
    }
    state.timeSlot++;
    if (state.timeSlot > 2) {
      state.timeSlot = 0;
      state.day++;
      const wage = Math.round(job.salary / 22);
      state.money += wage;
      if (state.profile.jobId === 'team_lead') {
        state.stats.fatigue = clamp(state.stats.fatigue + 4, 0, 100);
        state.stats.stress = clamp(state.stats.stress + 3, 0, 100);
      }
      if (state.character === 'ox') {
        state.stats.health = clamp(state.stats.health + 1, 0, 100);
      }
      // Day 3 绩效
      if (state.day === 3 && !state.bonusPaidDay7) {
        state.bonusPaidDay7 = true;
        const cur = state.stats.salary, init = state.initialSalary;
        if (cur >= init * 0.8) {
          state.money += cur < init
            ? Math.round(state.salaryAmount * 0.025 / 100) * 100
            : Math.round((state.salaryAmount * cur) / 100 / 5);
        }
      }
    }
    ending = checkEnding(state);
  }
  if (!ending) ending = W.ENDINGS.find(e => e.id === 'survival');
  return { ending: ending.id, day: state.day, stats: { ...state.stats }, money: state.money };
}

// ============================================================
// 批量跑
// ============================================================
function run(label, charId, jobId, policy, runs) {
  const dist = {}, days = [];
  let totalStats = { health: 0, stress: 0, mood: 0, fatigue: 0, skill: 0, salary: 0 };
  let totalMoney = 0;
  for (let i = 0; i < runs; i++) {
    const r = simulateOne(charId, jobId, policy);
    dist[r.ending] = (dist[r.ending] || 0) + 1;
    days.push(r.day);
    for (const k in totalStats) totalStats[k] += r.stats[k];
    totalMoney += r.money;
  }
  const avgDay = (days.reduce((a,b)=>a+b,0) / runs).toFixed(1);
  const sorted = Object.entries(dist).sort((a,b) => b[1]-a[1]);
  console.log(`\n[${label}]  avg存活 ${avgDay} 天  avg存款 ¥${(totalMoney/runs).toFixed(0)}`);
  for (const [k, v] of sorted) {
    console.log(`  ${k.padEnd(24)} ${String(v).padStart(4)} (${(v/runs*100).toFixed(1)}%)`);
  }
}

const RUNS = parseInt(process.argv[2]) || 1000;
console.log(`========== Monte Carlo · ${RUNS} runs / config ==========`);

const setups = [
  ['horse + outsource', 'horse', 'outsource'],
  ['horse + backend',   'horse', 'backend'],
  ['ox    + outsource', 'ox',    'outsource'],
  ['ox    + backend',   'ox',    'backend'],
];

console.log('\n========== 策略 A：随机选项 ==========');
for (const [label, c, j] of setups) run(label, c, j, policyRandom, RUNS);

console.log('\n========== 策略 B：保护虚弱属性（启发式） ==========');
for (const [label, c, j] of setups) run(label, c, j, policyBalanced, RUNS);

console.log('\n========== 策略 C：偏爱怼回去（70% snark） ==========');
for (const [label, c, j] of setups) run(label, c, j, policySnarky, RUNS);
