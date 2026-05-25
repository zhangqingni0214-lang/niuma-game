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
// work tag 集合 - 复刻 game.js WORK_TAGS
const WORK_TAGS_SIM = new Set(['hr', 'client', 'team_lead', 'boss', 'pm', 'team', 'meeting', 'overtime', 'zeitgeist', 'tech']);
const isWorkScopeEventSim = (ev) => (ev?.tags || []).some(t => WORK_TAGS_SIM.has(t));

function applyEffects(state, effects, ev, choice, character) {
  if (!effects) return;
  const adj = { ...effects };
  const unlocked = state.skills || new Set();

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

  // v1.1 Tier 5 skill passives（同步 game.js）
  const chTags = choice?.tags || [];
  // 政治动物：politics 类选项再 +5 salary（叠加 office_politics 的 +3 = +8）
  if (unlocked.has('political_animal') &&
      (chTags.includes('politics') || choice?.requiredSkill === 'office_politics')) {
    adj.salary = (adj.salary || 0) + 5;
  }
  // 斜杠流派：副业 money 收入 +50%
  if (unlocked.has('side_hustle_pro') &&
      (ev?.pool === 'side_hustle' || (ev?.tags || []).includes('side') || chTags.includes('side_work'))) {
    if (adj.money && adj.money > 0) adj.money = Math.round(adj.money * 1.5);
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

  // v1.1 钝化术：stress < 70 时 mood floor 30 + ceil 90；否则只 ceil 90
  if (unlocked.has('numb_immune')) {
    if (state.stats.stress < 70) {
      state.stats.mood = clamp(state.stats.mood, 30, 90);
    } else {
      state.stats.mood = clamp(state.stats.mood, 0, 90);
    }
  }

  // 怼老板罚款（小马 ×0.8 + Tier 5 减免 + 30% 封顶）
  if (choice?.snark) {
    const baseFine = Math.round((state.salaryAmount || 0) * 0.025 / 100) * 100;
    let fine = baseFine;
    if (state.character === 'horse') fine = Math.round(fine * 0.8 / 100) * 100;
    if (unlocked.has('lawyer_friend') && isWorkScopeEventSim(ev)) {
      fine = Math.round(fine * 0.5 / 100) * 100;
    }
    if (unlocked.has('political_animal')) {
      fine = Math.round(fine * 0.7 / 100) * 100;
    }
    // 再平衡封顶：至少 30% 基数
    const minFine = Math.round(baseFine * 0.3 / 100) * 100;
    if (baseFine > 0 && fine < minFine) fine = minFine;
    state.money -= fine;
  }

  // v1.1 fishing_zen: 心情 < 40 时回到 40
  if (unlocked.has('fishing_zen') && state.stats.mood < 40) {
    state.stats.mood = 40;
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
    snarkWorkCount: state.history.snarkWorkCount,
    snarkLifeCount: state.history.snarkLifeCount,
    sideHustleCount: state.history.sideHustleCount,
    karma: 0, // sim 没 archive，用 0 让 horse_lone_wolf 容易触发
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

// v0.9.7 救援机制 - 模拟玩家"用钱救命"
// 全场只能救援一次（_rescuedOnce）
const RESCUE_OPTIONS_SIM = {
  fatigue80: [
    { cost: 400, costType: null, effects: { fatigue: -18, mood: +3 } },
    { cost: 100, costType: null, effects: { fatigue: -10 } },
    { cost: 0, costType: 'daily_wage', effects: { fatigue: -25 } },
  ],
  stress80: [
    { cost: 800, costType: null, effects: { stress: -22, mood: +6 } },
    { cost: 200, costType: null, effects: { stress: -14, mood: +5, health: -4 } },
    { cost: 0, costType: null, effects: { stress: -8, salary: -10 } },
  ],
  health35: [
    { cost: 1000, costType: null, effects: { health: +28 } },
    { cost: 200,  costType: null, effects: { health: +12 } },
    { cost: 0,    costType: null, effects: {} },
  ],
  mood25: [
    { cost: 1500, costType: null, effects: { mood: +30, health: +10, fatigue: -8, salary: -3 } },
    { cost: 80,   costType: null, effects: { mood: +10 } },
    { cost: 50,   costType: null, effects: { mood: +15, fatigue: +5 } },
  ],
};

// 模拟玩家的救援决策：看哪个属性最危险，选自己买得起且最优的选项
function maybeRescue(state) {
  if (state._rescuedOnce) return;
  const s = state.stats;
  let trigger = null;
  if (s.fatigue >= 80) trigger = 'fatigue80';
  else if (s.stress >= 80) trigger = 'stress80';
  else if (s.health <= 35) trigger = 'health35';
  else if (s.mood <= 25) trigger = 'mood25';
  if (!trigger) return;

  const opts = RESCUE_OPTIONS_SIM[trigger];
  const dailyWage = Math.round((state.salaryAmount || 0) / 22);
  // 计算可负担 + 效果"最佳"的选项
  const affordable = opts.filter(o => {
    const cost = o.costType === 'daily_wage' ? dailyWage : o.cost;
    return state.money >= cost;
  });
  if (affordable.length === 0) return;
  // 简单策略：选第一个能救主属性的（贵但有效）
  const chosen = affordable[0];
  const cost = chosen.costType === 'daily_wage' ? dailyWage : chosen.cost;
  state.money -= cost;
  for (const [k, v] of Object.entries(chosen.effects)) {
    if (state.stats[k] !== undefined) {
      state.stats[k] = clamp(state.stats[k] + v, 0, 100);
    }
  }
  state._rescuedOnce = true;
}

// ============================================================
// 单局
// ============================================================
function simulateOne(charId, jobId, policy, withRescue, skillsArr) {
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
    history: { snarkCount: 0, snarkWorkCount: 0, snarkLifeCount: 0, sideHustleCount: 0, fishingCount: 0, coffeeCount: 0, overtimeCount: 0, totalChoices: 0 },
    seenEventIds: [],
    character: charId,
    profile: { jobId },
    rescue: !!withRescue,
    _rescuedOnce: false,
    skills: new Set(skillsArr || []),  // v1.1 新增：技能集合传入
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
      // Day 7 绩效
      if (state.day === 7 && !state.bonusPaidDay7) {
        state.bonusPaidDay7 = true;
        const cur = state.stats.salary, init = state.initialSalary;
        if (cur < init * 0.9) {
          state.money -= Math.round(state.salaryAmount * 0.025 / 100) * 100;
        } else if (cur < init) {
          state.money += Math.round(state.salaryAmount * 0.01 / 100) * 100;
        } else {
          state.money += Math.round((state.salaryAmount * cur) / 100 / 4);
        }
      }
    }
    ending = checkEnding(state);
    if (!ending && state.rescue) maybeRescue(state);
  }
  if (!ending) ending = W.ENDINGS.find(e => e.id === 'survival');
  return { ending: ending.id, day: state.day, stats: { ...state.stats }, money: state.money, rescued: !!state._rescuedOnce };
}

// ============================================================
// 批量跑
// ============================================================
function run(label, charId, jobId, policy, runs, withRescue=false, skillsArr=null) {
  const dist = {}, days = [];
  let totalStats = { health: 0, stress: 0, mood: 0, fatigue: 0, skill: 0, salary: 0 };
  let totalMoney = 0, rescuedCount = 0, survivalCount = 0;
  for (let i = 0; i < runs; i++) {
    const r = simulateOne(charId, jobId, policy, withRescue, skillsArr);
    dist[r.ending] = (dist[r.ending] || 0) + 1;
    days.push(r.day);
    for (const k in totalStats) totalStats[k] += r.stats[k];
    totalMoney += r.money;
    if (r.rescued) rescuedCount++;
    if (r.ending === 'survival') survivalCount++;
  }
  const avgDay = (days.reduce((a,b)=>a+b,0) / runs).toFixed(1);
  const sorted = Object.entries(dist).sort((a,b) => b[1]-a[1]);
  const survivalRate = (survivalCount / runs * 100).toFixed(1);
  const rescuedRate = withRescue ? `  救援率 ${(rescuedCount/runs*100).toFixed(0)}%` : '';
  console.log(`\n[${label}]  avg存活 ${avgDay} 天  通关率 ${survivalRate}%  avg存款 ¥${(totalMoney/runs).toFixed(0)}${rescuedRate}`);
  for (const [k, v] of sorted) {
    console.log(`  ${k.padEnd(24)} ${String(v).padStart(4)} (${(v/runs*100).toFixed(1)}%)`);
  }
  return { survivalRate: parseFloat(survivalRate), avgMoney: totalMoney / runs };
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

console.log('\n========== 策略 D：保护虚弱属性 + 会自救（最贴近真实玩家） ==========');
for (const [label, c, j] of setups) run(label, c, j, policyBalanced, RUNS, true);

// ============================================================
// v1.1 Tier 5 技能再平衡验证：跑 3 组对照
// ============================================================
console.log('\n\n========== Tier 5 再平衡对照 ==========');
console.log('（policy=balanced + rescue，比较解锁不同技能时的通关率）\n');

const SKILL_SCENARIOS = [
  { label: '基线（无任何技能）',                       skills: [] },
  { label: '中期（Tier 1-4 全开）',                    skills: ['coffee_immune','thick_skin','rubber_duck','social_butterfly','side_hustle','office_politics','promotion_radar','fishing_zen','iron_will','nirvana_rebirth'] },
  { label: '后期（Tier 1-5 全开）',                    skills: ['coffee_immune','thick_skin','rubber_duck','social_butterfly','side_hustle','office_politics','promotion_radar','fishing_zen','iron_will','nirvana_rebirth','boss_reading','lawyer_friend','side_hustle_pro','political_animal','numb_immune'] },
];

for (const sc of SKILL_SCENARIOS) {
  console.log(`\n--- ${sc.label} ---`);
  let totalSurvival = 0;
  for (const [label, c, j] of setups) {
    const result = run(label, c, j, policyBalanced, RUNS, true, sc.skills);
    totalSurvival += result.survivalRate;
  }
  console.log(`>>> 4 组合平均通关率: ${(totalSurvival / setups.length).toFixed(1)}%`);
}
