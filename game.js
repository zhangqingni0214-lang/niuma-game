// 牛马公司 - 核心游戏逻辑

const STORAGE_KEY = 'niuma_game_save_v3';
const ARCHIVE_KEY = 'niuma_game_archive_v2';

const SLOT_NAMES = ['上午', '下午', '晚上'];
const SLOT_TIMES = ['09:00', '14:00', '19:00'];
const MAX_DAY = 14;

let state = null;
let archive = null;

// 投胎临时选择
let investiture = { character: null, jobId: null };

// =====================
// 状态初始化
// =====================
function defaultStats() {
  return {
    health: 80,
    stress: 30,
    mood: 70,
    fatigue: 20,
    skill: 20,
    salary: 30
  };
}

function defaultHistory() {
  return {
    fishingCount: 0,
    coffeeCount: 0,
    overtimeCount: 0,
    snarkCount: 0,
    submissiveCount: 0,
    sideHustleCount: 0,
    politicsCount: 0,
    refuseTeamBuilding: false,
    totalChoices: 0,
    skillsUsed: []
  };
}

function applyOffsets(stats, offset) {
  if (!offset) return;
  for (const [k, v] of Object.entries(offset)) {
    if (stats[k] !== undefined) stats[k] = clamp(stats[k] + v, 0, 100);
  }
}

function newGame(characterId, jobId) {
  const character = window.CHARACTERS.find(c => c.id === characterId) || window.CHARACTERS[0];
  const job = window.JOBS.find(j => j.id === jobId) || window.JOBS[0];

  // 使用职业的 baseStats 作为起始，再叠加角色 offset
  const stats = { ...job.baseStats };
  applyOffsets(stats, character.statOffset);

  const inheritedMoney = (archive.unlockedSkills.includes('nirvana_rebirth') && archive.lives[0])
    ? Math.floor((archive.lives[0].money || 0) * 0.05)
    : 0;

  state = {
    life: archive.totalLives + 1,
    day: 1,
    timeSlot: 0,
    stats,
    money: Math.round(job.salary / 22) + inheritedMoney,
    inheritedMoney,
    salaryAmount: job.salary,    // 月薪具体数字
    medicalCost: 0,              // 累计看病费
    history: defaultHistory(),
    log: [],
    seenEventIds: [],
    pendingEvent: null,
    ended: false,
    ending: null,
    tags: [],
    character: character.id,
    profile: {
      name: character.name,
      emoji: character.emoji,
      character: character.id,
      jobId: job.id,
      jobName: job.name,
      company: job.company,
      role: job.icon,
      salary: job.salary
    }
  };
  saveState();
}

function loadArchive() {
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY);
    if (raw) {
      archive = JSON.parse(raw);
      archive.karma = archive.karma ?? 0;
      archive.unlockedSkills = archive.unlockedSkills ?? [];
      return;
    }
  } catch (e) { console.warn(e); }
  archive = {
    totalLives: 0,
    lives: [],
    unlockedEndings: [],
    unlockedTags: [],
    seenEventIds: [],
    karma: 0,
    unlockedSkills: []
  };
}

function saveArchive() { localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive)); }
function saveState()   { if (state && !state.ended) localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function loadState()   {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { state = JSON.parse(raw); return true; }
  } catch (e) { console.warn(e); }
  return false;
}
function clearState() { localStorage.removeItem(STORAGE_KEY); }
function hasSave()    { return !!localStorage.getItem(STORAGE_KEY); }

// =====================
// 事件选择
// =====================
function pickEvent() {
  const unlockedSkills = new Set(archive.unlockedSkills);
  const jobId = state.profile.jobId;

  const pool = window.EVENTS.filter(e => {
    if (e.timeSlot !== undefined && e.timeSlot !== state.timeSlot) return false;
    if (e.minDay && state.day < e.minDay) return false;
    if (e.maxDay && state.day > e.maxDay) return false;
    if (e.once && state.seenEventIds.includes(e.id)) return false;
    // 副业事件池
    if (e.pool === 'side_hustle' && !unlockedSkills.has('side_hustle')) return false;
    // 职业过滤
    if (e.jobs && !e.jobs.includes(jobId)) return false;
    return true;
  });

  let unseen = pool.filter(e => !state.seenEventIds.includes(e.id));
  if (unseen.length === 0) unseen = pool;
  if (unseen.length === 0) return null;
  return unseen[Math.floor(Math.random() * unseen.length)];
}

function isChoiceVisible(choice) {
  if (!choice.hidden) return true;
  return archive.unlockedSkills.includes(choice.requiredSkill);
}

// =====================
// 应用 effects（带技能 + 角色性格 修正）
// =====================
function applyEffects(effects, ctx) {
  if (!effects) return;
  const unlocked = new Set(archive.unlockedSkills);
  const ev = ctx?.event;
  const choice = ctx?.choice;
  const character = window.CHARACTERS.find(c => c.id === state.character);

  const adj = { ...effects };

  // === 甲方挫折 ×1.2 ===
  // 事件标记 client: true 时，负面的健康/压力/心情/疲劳变化全部放大 1.2x
  if (ev?.client) {
    for (const k of ['health', 'mood', 'fatigue', 'stress']) {
      if (adj[k] === undefined) continue;
      const v = adj[k];
      // 健康/心情：负值是变差 → 放大
      // 压力/疲劳：正值是变差 → 放大
      const isNegative = (k === 'health' || k === 'mood') ? v < 0 : v > 0;
      if (isNegative) adj[k] = Math.round(v * 1.2);
    }
  }

  // === 角色性格修正 ===
  if (character) {
    const t = character.traits || {};
    if (choice?.snark) {
      // 怼回去
      if (t.snarkBonus) {
        for (const [k, v] of Object.entries(t.snarkBonus)) adj[k] = (adj[k] || 0) + v;
      }
      if (t.snarkPenalty) {
        for (const [k, v] of Object.entries(t.snarkPenalty)) adj[k] = (adj[k] || 0) + v;
      }
    } else {
      // 忍气吞声/摸鱼/常规
      const isSubmissive = /忍|默|低头|跟着|不抢|潜水|关电脑|关灯|不吃|盯着|画|不看|装/.test(choice?.text || '');
      if (isSubmissive) {
        if (t.submissiveBonus) {
          for (const [k, v] of Object.entries(t.submissiveBonus)) adj[k] = (adj[k] || 0) + v;
        }
        if (t.submissivePenalty) {
          for (const [k, v] of Object.entries(t.submissivePenalty)) adj[k] = (adj[k] || 0) + v;
        }
      }
    }
  }

  // === 技能 passive 修正 ===
  if (unlocked.has('coffee_immune') && /咖啡|美式|黑咖/.test(choice?.text || '')) {
    if (adj.health && adj.health < 0) adj.health = 0;
    if (adj.fatigue && adj.fatigue < 0) adj.fatigue = Math.floor(adj.fatigue * 1.5);
  }
  if (unlocked.has('thick_skin') && choice?.snark && adj.salary && adj.salary < 0) {
    adj.salary = Math.ceil(adj.salary / 2);
  }
  if (unlocked.has('rubber_duck') && /加班|凌晨|代码|bug|功能|case/.test(ev?.text + ev?.title || '')) {
    adj.skill = (adj.skill || 0) + 2;
  }
  if (unlocked.has('social_butterfly') && /同事|团建|红包|破冰|聚会/.test(ev?.text + ev?.title || '')) {
    adj.mood = (adj.mood || 0) + 3;
  }
  if (unlocked.has('promotion_radar') && /老板|画饼|期权|晋升|考核|HR/.test(ev?.text + ev?.title || '')) {
    adj.salary = (adj.salary || 0) + 2;
  }
  if (unlocked.has('iron_will') && state.stats.health < 30 && adj.stress && adj.stress > 0) {
    adj.stress = Math.ceil(adj.stress / 2);
  }

  const oldHealth = state.stats.health;

  for (const [k, v] of Object.entries(adj)) {
    if (k === 'money') {
      state.money += v;
    } else if (state.stats[k] !== undefined) {
      state.stats[k] = clamp(state.stats[k] + v, 0, 100);
    }
  }

  // 怼老板扣月薪：snark 选项扣月薪的 5%（向下取整到百元）
  if (choice?.snark) {
    const fine = Math.floor((state.salaryAmount || 0) * 0.05 / 100) * 100;
    if (fine > 0) {
      state.money -= fine;
      state.snarkFine = (state.snarkFine || 0) + fine;
    }
  }

  // 健康每降 10 点扣 500 看病费（按下降幅度算，不到 10 不扣）
  // 余数累积到 state.healthDebt，达到 10 也扣
  const drop = oldHealth - state.stats.health;
  if (drop > 0) {
    state.healthDebt = (state.healthDebt || 0) + drop;
    const rounds = Math.floor(state.healthDebt / 10);
    if (rounds > 0) {
      const medical = rounds * 500;
      state.money -= medical;
      state.medicalCost = (state.medicalCost || 0) + medical;
      state.healthDebt -= rounds * 10;
    }
  }

  if (unlocked.has('fishing_zen') && state.stats.mood < 40) {
    state.stats.mood = 40;
  }
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function trackChoice(event, choiceIdx) {
  const h = state.history;
  h.totalChoices += 1;
  const choice = event.choices[choiceIdx];
  const text = choice.text;

  if (choice.snark) h.snarkCount += 1;
  if (event.pool === 'side_hustle') h.sideHustleCount += 1;
  if (choice.requiredSkill === 'office_politics') h.politicsCount += 1;
  if (choice.requiredSkill && !h.skillsUsed.includes(choice.requiredSkill)) {
    h.skillsUsed.push(choice.requiredSkill);
  }

  if (/摸鱼|装作|拍照|盯着|画一|趴一会|不抢|潜水|关电脑|关灯睡|看不见|偷偷|关掉|不看了/.test(text)) {
    h.fishingCount += 1;
    h.submissiveCount += 1;
  }
  if (/咖啡|美式|黑咖/.test(text)) h.coffeeCount += 1;
  if (/凌晨|加班|硬扛|咬牙|跑通|爬起来把代码/.test(text)) h.overtimeCount += 1;
  if (event.id === 'team_building' && choiceIdx >= 1) h.refuseTeamBuilding = true;
}

// =====================
// 推进与结局
// =====================
function advanceTime() {
  state.timeSlot += 1;
  if (state.timeSlot > 2) {
    state.timeSlot = 0;
    state.day += 1;

    // 小组长：每天烂货自动累积
    if (state.profile.jobId === 'team_lead') {
      state.stats.fatigue = clamp(state.stats.fatigue + 4, 0, 100);
      state.stats.stress = clamp(state.stats.stress + 3, 0, 100);
    }
  }
}

function checkEnding() {
  const ctx = {
    day: state.day,
    character: state.character,
    job: state.profile.jobId,
    snarkCount: state.history.snarkCount
  };
  for (const ending of [...window.ENDINGS].sort((a, b) => b.priority - a.priority)) {
    if (ending.condition(state.stats, ctx)) return ending;
  }
  return null;
}

function statusLabel() {
  const s = state.stats;
  if (s.fatigue >= 80) return '疲惫';
  if (s.stress >= 80) return '崩溃边缘';
  if (s.health <= 30) return '虚弱';
  if (s.mood <= 30) return '低落';
  if (s.mood >= 80 && s.fatigue <= 30) return '神清气爽';
  return '正常';
}

function computeTags() {
  const tags = [];
  for (const t of window.TAGS) {
    if (t.condition(state.stats, state.history)) tags.push(t);
  }
  return tags;
}

function finalizeLife(ending) {
  state.ended = true;
  state.ending = ending;
  state.tags = computeTags();

  archive.totalLives = Math.max(archive.totalLives, state.life);

  let karmaGain = state.day;
  if (!archive.unlockedEndings.includes(ending.id)) {
    karmaGain += 5;
    archive.unlockedEndings.push(ending.id);
  }
  for (const t of state.tags) {
    if (!archive.unlockedTags.includes(t.id)) {
      karmaGain += 2;
      archive.unlockedTags.push(t.id);
    }
  }
  for (const id of state.seenEventIds) {
    if (!archive.seenEventIds.includes(id)) {
      karmaGain += 1;
      archive.seenEventIds.push(id);
    }
  }
  archive.karma += karmaGain;

  archive.lives.unshift({
    life: state.life,
    day: state.day,
    profile: state.profile,
    character: state.character,
    stats: { ...state.stats },
    money: state.money,
    ending: { id: ending.id, name: ending.name, summary: ending.summary },
    tags: state.tags.map(t => ({ id: t.id, name: t.name })),
    log: state.log.slice(),
    seenEventIds: state.seenEventIds.slice(),
    karmaGain,
    isNew: true,
    timestamp: Date.now()
  });
  saveArchive();
  clearState();
}

// =====================
// UI
// =====================
const $  = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function showScreen(id) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  $('#' + id).classList.add('active');
  window.scrollTo(0, 0);
}

function renderMenu() {
  const saveExists = hasSave();
  $('#btn-continue').disabled = !saveExists;
  $('#btn-continue').classList.toggle('disabled', !saveExists);
  $('#btn-continue').classList.toggle('has-save', saveExists);
  $('#archive-summary').textContent = archive.totalLives > 0
    ? `已死 ${archive.totalLives} 次 · 终局解锁 ${archive.unlockedEndings.length}/${window.ENDINGS.length} · 业力 ${archive.karma}`
    : '尚未投胎，准备开怼。';
  $('#menu-karma').textContent = `业力 ${archive.karma}`;
  showScreen('screen-menu');
}

// =====================
// 投胎选择
// =====================
function renderInvestiture(step = 'character') {
  investiture.step = step;
  $('#inv-step-character').classList.toggle('hidden', step !== 'character');
  $('#inv-step-job').classList.toggle('hidden', step !== 'job');

  if (step === 'character') {
    const wrap = $('#inv-characters');
    wrap.innerHTML = '';
    window.CHARACTERS.forEach(c => {
      const card = document.createElement('div');
      card.className = 'char-card ' + (investiture.character === c.id ? 'selected' : '');
      card.innerHTML = `
        <div class="char-emoji">${c.emoji}</div>
        <div class="char-name">${c.name}</div>
        <div class="char-tagline">${c.tagline}</div>
        <div class="char-desc">${c.description}</div>
      `;
      card.onclick = () => {
        investiture.character = c.id;
        renderInvestiture('character');
      };
      wrap.appendChild(card);
    });
    $('#inv-next-job').disabled = !investiture.character;
    $('#inv-next-job').classList.toggle('disabled', !investiture.character);
  }

  if (step === 'job') {
    const wrap = $('#inv-jobs');
    wrap.innerHTML = '';
    window.JOBS.forEach(j => {
      const unlocked = window.isJobUnlocked(j.id, archive.totalLives);
      const card = document.createElement('div');
      card.className = 'job-card ' + (unlocked ? '' : 'locked ') + (investiture.jobId === j.id ? 'selected' : '');
      card.innerHTML = `
        <div class="job-icon">${j.icon}</div>
        <div class="job-name">${j.name}</div>
        <div class="job-company">${j.company}</div>
        <div class="job-desc">${unlocked ? j.description : '需累计第 ' + j.unlockAt + ' 世解锁'}</div>
      `;
      if (unlocked) {
        card.onclick = () => {
          investiture.jobId = j.id;
          renderInvestiture('job');
        };
      }
      wrap.appendChild(card);
    });
    $('#inv-start').disabled = !investiture.jobId;
    $('#inv-start').classList.toggle('disabled', !investiture.jobId);
  }

  showScreen('screen-investiture');
}

// =====================
// 游戏主页面
// =====================
function renderGame() {
  // 给 .app 加角色 class，CSS 据此切换背景
  const app = document.querySelector('.app');
  app.classList.remove('char-horse', 'char-ox');
  app.classList.add('char-' + (state.character || 'horse'));

  const s = state.stats;
  $('#stat-health').style.width = s.health + '%';   $('#stat-health-val').textContent = s.health;
  $('#stat-stress').style.width = s.stress + '%';   $('#stat-stress-val').textContent = s.stress;
  $('#stat-mood').style.width   = s.mood + '%';     $('#stat-mood-val').textContent   = s.mood;
  $('#stat-fatigue').style.width= s.fatigue + '%';  $('#stat-fatigue-val').textContent= s.fatigue;
  $('#stat-skill').style.width  = s.skill + '%';    $('#stat-skill-val').textContent  = s.skill;
  $('#stat-salary').style.width = s.salary + '%';   $('#stat-salary-val').textContent = s.salary;
  $('#money').textContent = '存款 ¥' + state.money;
  $('#salary-amount').textContent = '月薪 ¥' + (state.salaryAmount || 0);
  $('#status-tag').textContent = statusLabel();

  // 头像 + 名字 + 公司/职业（按当前角色和职业）
  $('#avatar-emoji').textContent = state.profile.emoji || '🐴';
  $('#name-label').textContent   = state.profile.name;
  $('#day-label').textContent    = `Day ${state.day}`;
  $('#slot-label').textContent   = `${SLOT_NAMES[state.timeSlot]} ${SLOT_TIMES[state.timeSlot]}`;
  $('#role-label').textContent   = state.profile.jobName || state.profile.role;
  $('#company-label').textContent= state.profile.company;

  const progress = ((state.day - 1) * 3 + state.timeSlot) / (MAX_DAY * 3);
  $('#survival-progress').style.width = (progress * 100) + '%';

  if (!state.pendingEvent) {
    const ev = pickEvent();
    if (!ev) {
      advanceTime();
      const ending = checkEnding();
      if (ending) return showEnding(ending);
      return renderGame();
    }
    state.pendingEvent = ev.id;
    state.seenEventIds.push(ev.id);
    saveState();
  }
  const ev = window.EVENTS.find(e => e.id === state.pendingEvent);
  $('#event-title').textContent = ev.title;
  $('#event-text').textContent = ev.text;

  const choicesEl = $('#choices');
  choicesEl.innerHTML = '';
  ev.choices.forEach((c, idx) => {
    if (!isChoiceVisible(c)) return;
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    if (c.hidden) btn.classList.add('skill-choice');
    btn.textContent = c.text;
    btn.onclick = () => makeChoice(ev, idx);
    choicesEl.appendChild(btn);
  });

  $('#choice-result').classList.add('hidden');
  showScreen('screen-game');
}

function makeChoice(ev, idx) {
  const choice = ev.choices[idx];
  applyEffects(choice.effects, { event: ev, choice });
  trackChoice(ev, idx);

  state.log.push({
    day: state.day,
    timeSlot: state.timeSlot,
    eventId: ev.id,
    eventTitle: ev.title,
    choiceIdx: idx,
    choiceText: choice.text,
    result: choice.result || null,
    skill: choice.requiredSkill || null
  });

  if (choice.result) {
    $('#choice-result-text').textContent = choice.result;
    $('#choice-result').classList.remove('hidden');
    $$('.choice-btn').forEach(b => b.disabled = true);
    state.pendingEvent = null;
    saveState();
    $('#next-btn').onclick = nextStep;
  } else {
    state.pendingEvent = null;
    nextStep();
  }
}

function nextStep() {
  advanceTime();
  const ending = checkEnding();
  if (ending) return showEnding(ending);
  saveState();
  renderGame();
}

function showEnding(ending) {
  finalizeLife(ending);
  $('#ending-name').textContent = ending.name;
  $('#ending-summary').textContent = ending.summary;
  $('#ending-day').textContent = `存活 ${state.day - (state.timeSlot === 0 && state.day > 1 ? 1 : 0)} 天`;
  $('#ending-stats').innerHTML = `
    健康 ${state.stats.health} · 压力 ${state.stats.stress} · 心情 ${state.stats.mood}<br>
    疲劳 ${state.stats.fatigue} · 技能 ${state.stats.skill} · 工资 ${state.stats.salary}<br>
    存款 ¥${state.money}
  `;
  const tagsEl = $('#ending-tags');
  tagsEl.innerHTML = '';
  if (state.tags.length === 0) {
    tagsEl.innerHTML = '<span class="tag muted">无人设标签</span>';
  } else {
    state.tags.forEach(t => {
      const el = document.createElement('span');
      el.className = 'tag';
      el.textContent = t.name;
      tagsEl.appendChild(el);
    });
  }
  const lastLife = archive.lives[0];
  $('#ending-karma').textContent = `本世业力 +${lastLife?.karmaGain || 0} · 当前总业力 ${archive.karma}`;
  showScreen('screen-ending');
}

// =====================
// 档案
// =====================
function renderArchive(tab = 'lives') {
  ['lives', 'endings', 'events', 'rank'].forEach(t => {
    $('#archive-' + t).classList.toggle('hidden', t !== tab);
  });
  $$('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));

  $('#archive-meta').textContent =
    `已死 [${archive.totalLives}] 次 · 终局解锁 [${archive.unlockedEndings.length}/${window.ENDINGS.length}] · 业力 [${archive.karma}]`;

  if (tab === 'lives') {
    const el = $('#archive-lives');
    el.innerHTML = '';
    if (archive.lives.length === 0) {
      el.innerHTML = '<div class="empty">还没有轮回记录。</div>';
    }
    archive.lives.forEach(life => {
      const card = document.createElement('div');
      card.className = 'life-card';
      const charEmoji = life.profile?.emoji || '🐴';
      card.innerHTML = `
        <div class="life-head">
          <span class="life-no">【第 ${life.life} 世】</span>
          ${life.isNew ? '<span class="badge-new">NEW</span>' : ''}
        </div>
        <div class="life-day">Day ${life.day}</div>
        <div class="life-meta">${charEmoji} ${life.profile.name} · ${life.profile.company} · ${life.profile.jobName || life.profile.role}</div>
        <div class="life-divider"></div>
        <div class="life-ending"><b>终局：</b>${life.ending.name}</div>
        <div class="life-divider"></div>
        <div class="life-stats">
          健康：${life.stats.health}　压力：${life.stats.stress}　心情：${life.stats.mood}　疲劳：${life.stats.fatigue}<br>
          技能：${life.stats.skill}　工资：${life.stats.salary}　存款：¥${life.money}
        </div>
        <div class="life-tags"></div>
      `;
      const tagsEl = card.querySelector('.life-tags');
      life.tags.forEach(t => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = t.name;
        tagsEl.appendChild(span);
      });
      el.appendChild(card);
    });
    archive.lives.forEach(l => l.isNew = false);
    saveArchive();
  }

  if (tab === 'endings') {
    const el = $('#archive-endings');
    el.innerHTML = '';
    window.ENDINGS.forEach(e => {
      const unlocked = archive.unlockedEndings.includes(e.id);
      const card = document.createElement('div');
      card.className = 'ending-card ' + (unlocked ? '' : 'locked');
      card.innerHTML = `
        <div class="ending-card-name">${unlocked ? e.name : '???'}</div>
        <div class="ending-card-desc">${unlocked ? e.summary : '尚未解锁。'}</div>
      `;
      el.appendChild(card);
    });
  }

  if (tab === 'events') {
    const el = $('#archive-events');
    el.innerHTML = '';
    window.EVENTS.forEach(e => {
      const unlocked = archive.seenEventIds.includes(e.id);
      const card = document.createElement('div');
      card.className = 'archive-event-card ' + (unlocked ? '' : 'locked');
      card.innerHTML = `
        <div class="archive-event-card-title">${unlocked ? e.title : '???'}</div>
        <div class="archive-event-card-text">${unlocked ? e.text.slice(0, 60) + '…' : '事件未触发。'}</div>
      `;
      el.appendChild(card);
    });
  }

  if (tab === 'rank') {
    const el = $('#archive-rank');
    el.innerHTML = '';
    const sorted = [...archive.lives].sort((a, b) => b.day - a.day);
    if (sorted.length === 0) {
      el.innerHTML = '<div class="empty">还没有数据，先去打几次工。</div>';
    } else {
      const top = sorted.slice(0, 10);
      top.forEach((life, idx) => {
        const row = document.createElement('div');
        row.className = 'rank-row ' + (idx === 0 ? 'first' : '');
        const charEmoji = life.profile?.emoji || '🐴';
        row.innerHTML = `
          <div class="rank-no">${idx + 1}</div>
          <div class="rank-info">
            <div class="rank-day">${charEmoji} 存活 ${life.day} 天</div>
            <div class="rank-meta">第 ${life.life} 世 · ${life.profile.jobName || life.profile.role} · ${life.ending.name}</div>
          </div>
          <div class="rank-money">¥${life.money}</div>
        `;
        el.appendChild(row);
      });
    }
  }

  showScreen('screen-archive');
}

// =====================
// 技能树
// =====================
function renderSkillTree() {
  const el = $('#skill-tree');
  el.innerHTML = '';
  const unlocked = new Set(archive.unlockedSkills);

  for (let tier = 1; tier <= 4; tier++) {
    const tierWrap = document.createElement('div');
    tierWrap.className = 'tier-wrap';
    const tierTitle = document.createElement('div');
    tierTitle.className = 'tier-title';
    const labels = { 1: 'Tier 1 · 基础', 2: 'Tier 2 · 进阶', 3: 'Tier 3 · 高阶', 4: 'Tier 4 · 终极' };
    tierTitle.textContent = labels[tier];
    tierWrap.appendChild(tierTitle);

    const row = document.createElement('div');
    row.className = 'tier-row';
    window.SKILLS.filter(s => s.tier === tier).forEach(skill => {
      const isUnlocked = unlocked.has(skill.id);
      const canUnlock = window.canUnlockSkill(skill.id, unlocked);
      const canAfford = archive.karma >= skill.cost;
      const node = document.createElement('div');
      node.className = 'skill-node';
      if (isUnlocked) node.classList.add('unlocked');
      else if (canUnlock && canAfford) node.classList.add('available');
      else node.classList.add('locked');

      node.innerHTML = `
        <div class="skill-icon">${skill.icon}</div>
        <div class="skill-name">${skill.name}</div>
        <div class="skill-desc">${skill.description}</div>
        <div class="skill-foot">${isUnlocked ? '已解锁' : `业力 ${skill.cost}`}</div>
      `;
      if (!isUnlocked && canUnlock && canAfford) {
        node.onclick = () => {
          if (!confirm(`花费 ${skill.cost} 业力解锁【${skill.name}】？`)) return;
          archive.karma -= skill.cost;
          archive.unlockedSkills.push(skill.id);
          saveArchive();
          renderSkillTree();
        };
      } else if (!isUnlocked && !canUnlock) {
        node.title = '需要先解锁前置技能：' + skill.requires.map(r => {
          const s = window.SKILLS.find(x => x.id === r);
          return s ? s.name : r;
        }).join(' / ');
      }
      row.appendChild(node);
    });
    tierWrap.appendChild(row);
    el.appendChild(tierWrap);
  }

  $('#skill-karma').textContent = `当前业力 ${archive.karma}`;
  $('#skill-count').textContent = `已解锁 ${archive.unlockedSkills.length}/${window.SKILLS.length}`;
  showScreen('screen-skills');
}

// =====================
// 入口
// =====================
window.addEventListener('DOMContentLoaded', () => {
  loadArchive();

  $('#btn-start').onclick = () => {
    if (hasSave()) {
      if (!confirm('上一只牛马还没死透，重新投胎会覆盖。继续？')) return;
      clearState();
    }
    investiture = { character: null, jobId: null };
    renderInvestiture('character');
  };

  $('#btn-continue').onclick = () => {
    if (loadState()) renderGame(); else alert('没有上次怼到一半的牛马。');
  };

  $('#btn-archive').onclick = () => renderArchive('lives');
  $('#btn-skills').onclick  = renderSkillTree;
  $('#btn-back-menu').onclick = renderMenu;
  $('#archive-back').onclick  = renderMenu;
  $('#skills-back').onclick   = renderMenu;
  $('#ending-back').onclick   = renderMenu;
  $('#ending-replay').onclick = () => {
    investiture = { character: null, jobId: null };
    renderInvestiture('character');
  };
  $('#ending-to-skills').onclick = renderSkillTree;

  // 投胎导航
  $('#inv-next-job').onclick = () => renderInvestiture('job');
  $('#inv-back-char').onclick = () => renderInvestiture('character');
  $('#inv-cancel').onclick = renderMenu;
  $('#inv-start').onclick = () => {
    if (!investiture.character || !investiture.jobId) return;
    newGame(investiture.character, investiture.jobId);
    renderGame();
  };

  $('#btn-destroy').onclick = () => {
    if (!confirm('销毁前世会清空所有轮回、技能、业力。从头做牛马？')) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ARCHIVE_KEY);
    loadArchive();
    renderMenu();
  };

  $$('.tab-btn').forEach(b => {
    b.onclick = () => renderArchive(b.dataset.tab);
  });

  renderMenu();
});
