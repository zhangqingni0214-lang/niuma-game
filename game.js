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

// 新手引导卡 1 关闭后要执行的动作（由 btn-start 设置，cap close 时执行）
let _onboardingNextAction = null;

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
    snarkCount: 0,        // 总嘴硬次数（work + life，老存档 & endings.js 仍依赖）
    snarkWorkCount: 0,    // P2: 仅工作场景嘴硬，驱动"怼老板第 6 次"警告
    snarkLifeCount: 0,    // P2: 仅生活场景嘴硬（暂未驱动警告，留作后续彩蛋）
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

  // v0.9.8: 大圣归来从 5% → 10% 继承
  const inheritedMoney = (archive.unlockedSkills.includes('nirvana_rebirth') && archive.lives[0])
    ? Math.floor((archive.lives[0].money || 0) * 0.10)
    : 0;

  state = {
    life: archive.totalLives + 1,
    day: 1,
    timeSlot: 0,
    stats,
    money: Math.round(job.salary / 22) + inheritedMoney,
    inheritedMoney,
    salaryAmount: job.salary,    // 月薪具体数字
    initialSalary: stats.salary, // 投胎时的工资分，用于 Day 7 绩效倒挂判定
    bonusPaidDay7: false,        // Day 7 绩效是否已发
    pendingBonusModal: null,     // 待弹的绩效通知
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
      archive.comboSeen = archive.comboSeen ?? {}; // 老存档迁移
      // v1.4: bestRecords + stats 迁移
      archive.bestRecords = archive.bestRecords ?? {};
      archive.stats = archive.stats ?? defaultArchiveStats();
      archive.unlockedAchievements = archive.unlockedAchievements ?? [];
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
    unlockedSkills: [],
    // 跨局记忆：{ "horse:engineer": [eventId, ...] }
    // 同 (character, job) 组合连续投胎时避免抽到重复事件，组合内事件全见过才清零
    comboSeen: {},
    // v1.4: 本世最佳记录（A 方案）
    bestRecords: {},  // { maxDay, maxSnark, maxMoney, maxKarmaPerLife }
    // v1.4: 累计统计（C 方案）
    stats: defaultArchiveStats(),
    // v1.4: 成就解锁列表（B 方案）
    unlockedAchievements: []
  };
}

function defaultArchiveStats() {
  return {
    totalDaysSurvived: 0,    // 累计存活天数
    totalSnark: 0,           // 累计嘴硬次数
    totalMoney: 0,           // 累计存款（每局结束时累加）
    totalKarma: 0,           // 累计业力（包含已花掉的）
    jobsUsed: [],            // 用过的 jobId 列表
    charactersUsed: [],      // 用过的 character 列表
    favoriteEnding: null,    // 最常死法（每次 finalize 时计算）
    endingCounts: {},        // 每种结局触发次数
    snarkAtWorkTotal: 0,
    snarkAtLifeTotal: 0,
    rescueUsedCount: 0       // 救援购买总次数
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
  const comboKey = state.character + ':' + jobId;
  archive.comboSeen = archive.comboSeen || {};
  const comboSeen = new Set(archive.comboSeen[comboKey] || []);

  const pool = window.EVENTS.filter(e => {
    if (e.timeSlot !== undefined && e.timeSlot !== state.timeSlot) return false;
    if (e.minDay && state.day < e.minDay) return false;
    if (e.maxDay && state.day > e.maxDay) return false;
    if (e.once && state.seenEventIds.includes(e.id)) return false;
    // 副业事件池
    if (e.pool === 'side_hustle' && !unlockedSkills.has('side_hustle')) return false;
    // 职业过滤
    if (e.jobs && !e.jobs.includes(jobId)) return false;
    // v1.0 角色过滤：事件加 characters: ['horse'] 后只对该角色出现
    if (e.characters && !e.characters.includes(state.character)) return false;
    return true;
  });

  // 优先级 1：本世没见过 且 同组合也没见过（最新鲜）
  let unseen = pool.filter(e =>
    !state.seenEventIds.includes(e.id) && !comboSeen.has(e.id)
  );
  // 优先级 2：同组合记忆把池子掏空 → 该组合一轮见完，清零开启新一轮
  if (unseen.length === 0) {
    unseen = pool.filter(e => !state.seenEventIds.includes(e.id));
    if (unseen.length > 0) archive.comboSeen[comboKey] = [];
  }
  // 优先级 3：本世也见完了 → 兜底任意池
  if (unseen.length === 0) unseen = pool;
  if (unseen.length === 0) return null;
  return unseen[Math.floor(Math.random() * unseen.length)];
}

function isChoiceVisible(choice) {
  // 角色限定：choice.character 指定后只对该角色显示
  if (choice.character && choice.character !== state?.character) return false;
  if (!choice.hidden) return true;
  return archive.unlockedSkills.includes(choice.requiredSkill);
}

// 角色文本变体解析：choice.text 可以是 string 或 {default, horse, ox}
// 用法：
//   { text: '吃饭', ... }                       — 通用
//   { text: { default: '怼回去', horse: '阴阳一句：...', ox: '硬着头皮哼一声' }, ... }
//   choice.result 也支持同样的格式
function resolveText(text, character) {
  if (typeof text !== 'object' || text === null) return text;
  return text[character] || text.default || text.horse || text.ox || '';
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
      const choiceTextStr = resolveText(choice?.text, state?.character) || '';
      const isSubmissive = /忍|默|低头|跟着|不抢|潜水|关电脑|关灯|不吃|盯着|画|不看|装/.test(choiceTextStr);
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

  // === 技能 passive 修正（v0.9: 已迁移到 tag 字段，正则回退仅作兜底）===
  const evTags = ev?.tags || [];
  const chTags = choice?.tags || [];

  // v0.9.8 平衡强化版

  // 不眠咒：咖啡不扣健康，提神 ×1.5，额外 -3 压力
  if (unlocked.has('coffee_immune') &&
      (chTags.includes('coffee') || /咖啡|美式|黑咖/.test(resolveText(choice?.text, state?.character) || ''))) {
    if (adj.health && adj.health < 0) adj.health = 0;
    if (adj.fatigue && adj.fatigue < 0) adj.fatigue = Math.floor(adj.fatigue * 1.5);
    adj.stress = (adj.stress || 0) - 3;
  }

  // 金钟罩：怼老板工资损失 −60%（×0.4 而非 ÷2）
  if (unlocked.has('thick_skin') && (choice?.snark || chTags.includes('snark'))
      && adj.salary && adj.salary < 0) {
    adj.salary = Math.ceil(adj.salary * 0.4);
  }

  // 橡皮鸭：技术类事件 +4 skill, -2 fatigue
  if (unlocked.has('rubber_duck') &&
      (evTags.includes('tech') || evTags.includes('overtime')
       || /加班|凌晨|代码|bug|功能|case/.test((ev?.text || '') + (ev?.title || '')))) {
    adj.skill = (adj.skill || 0) + 4;
    adj.fatigue = (adj.fatigue || 0) - 2;
  }

  // 群聊魅影：同事 / 团建场景 +5 mood, -2 stress
  if (unlocked.has('social_butterfly') &&
      (evTags.includes('team') || evTags.includes('holiday')
       || /同事|团建|红包|破冰|聚会/.test((ev?.text || '') + (ev?.title || '')))) {
    adj.mood = (adj.mood || 0) + 5;
    adj.stress = (adj.stress || 0) - 2;
  }

  // 办公室王安石 passive：政治类选项额外 +3 salary
  if (unlocked.has('office_politics') &&
      (chTags.includes('politics') || choice?.requiredSkill === 'office_politics')) {
    adj.salary = (adj.salary || 0) + 3;
  }

  // 反向画饼术：老板 / HR 类对话 +3 salary
  if (unlocked.has('promotion_radar') &&
      (evTags.includes('boss') || evTags.includes('hr')
       || /老板|画饼|期权|晋升|考核|HR/.test((ev?.text || '') + (ev?.title || '')))) {
    adj.salary = (adj.salary || 0) + 3;
  }

  // 钢铁老脸：健康<30 时 stress + fatigue 增量均减半
  if (unlocked.has('iron_will') && state.stats.health < 30) {
    if (adj.stress && adj.stress > 0)   adj.stress  = Math.ceil(adj.stress / 2);
    if (adj.fatigue && adj.fatigue > 0) adj.fatigue = Math.ceil(adj.fatigue / 2);
  }

  // ===== v1.1 Tier 5 渡劫技能 =====

  // 政治动物：政治类选项再 +5 salary（叠加 office_politics 的 +3 = +8）
  if (unlocked.has('political_animal') &&
      (chTags.includes('politics') || choice?.requiredSkill === 'office_politics')) {
    adj.salary = (adj.salary || 0) + 5;
  }

  // 斜杠流派：副业事件 money 收入 +50%
  if (unlocked.has('side_hustle_pro') &&
      (ev?.pool === 'side_hustle' || evTags.includes('side') || chTags.includes('side_work'))) {
    if (adj.money && adj.money > 0) adj.money = Math.round(adj.money * 1.5);
  }

  // v0.9.6 全局难度调节 - 给玩家活路（不破坏单事件的相对设计）
  // 模拟器数据显示：salary 负向累积过快导致 70%+ 玩家 day-5 前被开除
  if (adj.salary && adj.salary < 0)   adj.salary  = Math.ceil(adj.salary * 0.7);
  if (adj.fatigue && adj.fatigue > 0) adj.fatigue = Math.ceil(adj.fatigue * 0.8);
  if (adj.health && adj.health < 0)   adj.health  = Math.ceil(adj.health * 0.8);

  const oldHealth = state.stats.health;

  // 每次选项前清空上次扣款明细
  state.lastChoiceCosts = [];

  for (const [k, v] of Object.entries(adj)) {
    if (k === 'money') {
      state.money += v;
      // 事件本身的 money 变化（吃饭/购物/猎头费等）走 toast；
      // 怼老板/看病费走下面的 modal，不在这里 toast
      // 用 effects.moneyNote 优先，否则 fallback 用事件标题
      if (v !== 0) showMoneyToast(v, effects.moneyNote || ev?.title);
    } else if (state.stats[k] !== undefined) {
      state.stats[k] = clamp(state.stats[k] + v, 0, 100);
    }
  }

  // v1.1 钝化术：心情永远 ≥ 30，但上限锁 90（兜底+封顶的二级人格）
  // 再平衡：mood floor 30 只在 stress < 70 时生效，压力爆表时心情依然能崩
  // （否则 mood/stress 双危机制被破坏，depression ending 触发不到）
  if (unlocked.has('numb_immune')) {
    if (state.stats.stress < 70) {
      state.stats.mood = clamp(state.stats.mood, 30, 90);
    } else {
      // 高压时仍封顶 90，但不再保底 30
      state.stats.mood = clamp(state.stats.mood, 0, 90);
    }
  }

  // 怼老板扣月薪：snark 选项扣月薪的 2.5%（四舍五入到百元）
  // v0.9.6 小马专属：罚款 ×0.8（社畜里的小老板娘，骂得起）
  // v1.1 律师朋友：work 场景再 -50%；政治动物：再 -30%（叠加）
  // 再平衡：减免最多 70%（保留 30% 基数罚款，避免"嘴硬零成本"）
  if (choice?.snark) {
    const baseFine = Math.round((state.salaryAmount || 0) * 0.025 / 100) * 100;
    let fine = baseFine;
    if (state.character === 'horse') fine = Math.round(fine * 0.8 / 100) * 100;
    // 律师朋友：work 场景 snark 罚款 ×0.5
    if (unlocked.has('lawyer_friend') && isWorkScopeEvent(ev)) {
      fine = Math.round(fine * 0.5 / 100) * 100;
    }
    // 政治动物：怼老板罚款再 ×0.7
    if (unlocked.has('political_animal')) {
      fine = Math.round(fine * 0.7 / 100) * 100;
    }
    // 再平衡封顶：所有减免叠加后，至少留 30% 基数（避免后期玩家完全免罚）
    const minFine = Math.round(baseFine * 0.3 / 100) * 100;
    if (baseFine > 0 && fine < minFine) fine = minFine;
    if (fine > 0) {
      state.money -= fine;
      state.snarkFine = (state.snarkFine || 0) + fine;
      state.lastChoiceCosts.push({ type: 'snark', amount: fine, reason: pickSnarkReason(ev, choice) });
    }
  }

  // 健康看病费 - 按本次累计降幅档位算（不累进）：1×=¥200, 2×=¥500, 3×+=¥1000
  // 看病有效：扣款后 health 恢复 +5
  const drop = oldHealth - state.stats.health;
  if (drop > 0) {
    state.healthDebt = (state.healthDebt || 0) + drop;
    const rounds = Math.floor(state.healthDebt / 10);
    if (rounds > 0) {
      let medical;
      if (rounds === 1) medical = 200;
      else if (rounds === 2) medical = 500;
      else medical = 1000;
      state.money -= medical;
      state.medicalCost = (state.medicalCost || 0) + medical;
      state.healthDebt -= rounds * 10;
      state.stats.health = clamp(state.stats.health + 5, 0, 100);
      state.lastChoiceCosts.push({
        type: 'medical',
        amount: medical,
        reason: pickMedicalReason(rounds),
        recover: 5
      });
    }
  }

  if (unlocked.has('fishing_zen') && state.stats.mood < 40) {
    state.stats.mood = 40;
  }

  // ===== 选项特殊机制 =====

  // dailyWageCost: 扣一天日薪（用于"请病假"等行为）
  if (choice?.dailyWageCost) {
    const dayWage = Math.round((state.salaryAmount || 0) / 22);
    if (dayWage > 0) {
      state.money -= dayWage;
      state.lastChoiceCosts.push({
        type: 'daywage',
        amount: dayWage,
        reason: '请病假，扣一天日薪'
      });
    }
  }

  // clientComplaintChance: 按概率随机触发客户投诉扣款
  // 用法：choice.clientComplaintChance = 0.3 (30%)
  //      choice.complaintAmount = 200 (默认 200)
  //      choice.complaintReason = 自定义文案（可选）
  if (choice?.clientComplaintChance && Math.random() < choice.clientComplaintChance) {
    const amount = choice.complaintAmount || 200;
    state.money -= amount;
    state.lastChoiceCosts.push({
      type: 'client',
      amount,
      reason: choice.complaintReason || '客户内部投诉，公司扣款（工资分 +10 已入账）'
    });
  }
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

// =====================
// 扣款戏谑文案池
// =====================
// v0.9.3: 扣款理由按事件 tag 分池，让"罚款原因"和事件场景对得上
const SNARK_REASONS_BY_TAG = {
  hr: [
    'HR 标记你"团队意识有待提升"',
    'HR 把这段录音存了档',
    'HR 说她"听到了不太合适的发言"',
    '你这句话被写进了背调记录',
    'HR 在系统里给你打了"沟通态度"差评',
    '"情商培训"强制报名费'
  ],
  boss: [
    '老板觉得你"嗯"的语气不对',
    '老板朋友圈你没点赞',
    '老板在群里发"你看看这态度"',
    '老板把你 360 评分调低了',
    '老板让人去"了解一下"你最近',
    '老板眼神里写着"明年别在这"'
  ],
  pm: [
    'PM 群里 at 你两次没"收到"',
    'PM 把你的回复贴进项目复盘',
    'PM 跟你老板说"这哥们儿不好沟通"',
    'PM 把你的话截图发到了产品群'
  ],
  client: [
    '客户给你公司发了投诉邮件',
    '客户跟你老板说"换个人对接"',
    '客户把你的回复截图发到了群里',
    '客户砍掉下季度预算给你看'
  ],
  team_lead: [
    '下属把你这句话录音存档',
    '团队 360 评分里"管理风格"扣了 2 分',
    'HR 给你预约了"领导力反思"课程'
  ],
  team: [
    '团结氛围损失补偿金',
    '同事在小群发了你的"金句"截图',
    '同事开始绕路避开茶水间',
    '你被踢出了部门小群'
  ],
  meeting: [
    '你的发言被记进了会议纪要',
    '老板会后说"今天有人态度有问题"',
    '会议录音被转发到了 HR',
    '会议室一片寂静，气氛凝固 30 秒'
  ],
  overtime: [
    '加班记录里你被备注"配合度不足"',
    'OnCall 评分被调低',
    '老板第二天没跟你打招呼'
  ],
  zeitgeist: [
    '"思想觉悟"考核打分',
    '"组织认同感"指标扣 5 分'
  ],
  // 兜底：通用嘴贱税
  default: [
    '你那句话进了"言论档案"',
    '本季度第 N 次嘴贱税',
    '工位反思费（一次性）',
    '微信响应慢于 30 秒，行政罚',
    '"情商培训"强制报名费'
  ],

  // ===== P1: 生活罚款池 — 嘴硬扣款照旧 2.5%，但理由对得上场景 =====
  // 家人 / 相亲 / 老家
  life_family: [
    '妈在家族群发了三段语音',
    '亲戚连环 call 你三个晚上',
    '妈给你转了 ¥200，备注"想清楚"',
    '七大姑八大姨群里热议"我家这孩子"',
    '外婆托人捎了一袋特产，纸条上写"别太倔"'
  ],
  // 同学群 / 朋友圈 / 婚礼
  life_social: [
    '同学群三天后把你踢了',
    '高中老同学朋友圈点 9 个赞——都给别人',
    '大学闺蜜的下次聚餐没叫你',
    '班级群你的备注被改成了"那个谁"',
    '你那条朋友圈下面 0 个赞'
  ],
  // 房东 / 租房
  life_landlord: [
    '房东磨蹭一周才退一半押金',
    '中介把你 pull 到了"敏感客户"名单',
    '物业第二天没给你停车位',
    '房东在小区群里 @ "某些租客"',
    '续约时房租又涨了 ¥200'
  ],
  // 双11 / 咸鱼 / 购物
  life_shopping: [
    '购物 APP 推了一周"戒断治疗"广告',
    '咸鱼平台给你的"信誉分"扣 5',
    '快递小哥不再给你送上门',
    '自动续费的会员卡偷偷又扣了 ¥98',
    '朋友圈微商私信你三天'
  ],
  // 生活场景兜底
  life_default: [
    '微信运动里没人给你点赞了',
    '心情记录 APP 弹窗"今天感觉怎么样？"',
    '美团给你推了"减压套餐"',
    '短视频算法连推三天"打工人语录"',
    '你那条 emoji 状态被 3 个朋友"看到"，无人回应'
  ]
};

// work tag 集合：用于区分事件是工作场景还是生活场景
const WORK_TAGS = new Set([
  'hr', 'client', 'team_lead', 'boss', 'pm',
  'team', 'meeting', 'overtime', 'zeitgeist', 'tech'
]);

// 判断事件是否为工作场景（决定 snark 走 work 池还是 life 池 + snarkWorkCount 是否累加）
function isWorkScopeEvent(ev) {
  const tags = ev?.tags || [];
  return tags.some(t => WORK_TAGS.has(t));
}

// 优先级：越具体的 tag 越优先匹配
const SNARK_TAG_PRIORITY = [
  'hr', 'client', 'team_lead', 'boss', 'pm',
  'team', 'meeting', 'overtime', 'zeitgeist'
];

const MEDICAL_REASONS_1X = [
  '胃药 + 颈椎贴', '挂号费 + 药店一趟', '理疗一次',
  '体检复查项 + 出租车', '心理咨询半小时', '夜间急诊挂号',
  '中医开了三贴', '过敏药 + 眼药水', '感冒糖浆 × 2'
];
const MEDICAL_REASONS_2X = [
  '挂号 + 拍片 + 取药', '急诊押金 + 输液', '医院折腾一下午',
  '体检 + 复查 + 解读费', '颈椎理疗 5 次包月'
];
const MEDICAL_REASONS_3X = [
  '住院一晚 + 检查全套', '急救 + 转院 + 留观',
  '体检报告解读 + 推荐疗法'
];

function pickSnarkReason(ev, choice) {
  // 1. 选项自带 snarkReason → 优先
  if (choice?.snarkReason) return choice.snarkReason;

  const tags = ev?.tags || [];
  const text = (ev?.title || '') + ' ' + (ev?.text || '');

  // 2. 工作场景：按 work tag 优先级匹配
  if (isWorkScopeEvent(ev)) {
    for (const t of SNARK_TAG_PRIORITY) {
      if (tags.includes(t) && SNARK_REASONS_BY_TAG[t]) {
        const pool = SNARK_REASONS_BY_TAG[t];
        return pool[Math.floor(Math.random() * pool.length)];
      }
    }
    // 工作场景兜底
    const pool = SNARK_REASONS_BY_TAG.default;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // 3. 生活场景：按子桶关键词路由
  let lifeBucket = null;
  if (/妈|爸|父母|相亲|老家|亲戚|家族|家里/.test(text)) {
    lifeBucket = 'life_family';
  } else if (tags.includes('social') || /同学|朋友圈|婚礼|红包|班级|聚会/.test(text)) {
    lifeBucket = 'life_social';
  } else if (/房东|房租|中介|物业|租房/.test(text)) {
    lifeBucket = 'life_landlord';
  } else if (tags.includes('side_work') || tags.includes('side') ||
             (tags.includes('holiday') && /双十一|购物车|咸鱼|闲鱼|月饼/.test(text)) ||
             /购物|咸鱼|闲鱼/.test(text)) {
    lifeBucket = 'life_shopping';
  } else {
    lifeBucket = 'life_default';
  }
  const pool = SNARK_REASONS_BY_TAG[lifeBucket];
  return pool[Math.floor(Math.random() * pool.length)];
}
function pickMedicalReason(rounds) {
  let pool = MEDICAL_REASONS_1X;
  if (rounds >= 3) pool = MEDICAL_REASONS_3X;
  else if (rounds >= 2) pool = MEDICAL_REASONS_2X;
  return pool[Math.floor(Math.random() * pool.length)];
}

const QUIPS_SNARK = [
  '钱没了，活还在干。',
  '存款少了，你也少了。',
  '公司不会亏待你 —— 是亏你。',
  '工资条上又少了一行。',
  '这笔钱，建议忘掉。',
  '认了认了，明天接着上。',
  '怼一句，少一顿外卖。'
];
const QUIPS_MEDICAL = [
  '建议下次别熬夜了。',
  '健康每减 10，钱包减 500，这就是性价比。',
  '你这身体，已经在贷款打工了。',
  '看病的钱，是公司发的工资里出的。',
  '医生比老板挣得多，建议转行。'
];
const QUIPS_BOTH = [
  '怼一句、病一下，¥XXX 蒸发。',
  '今天身体和工资同时遭难。',
  '财务和体检报告同时变红。',
  '老板看了一眼，HR 笑了一下，¥XXX 就没了。'
];

function pickQuip(costs) {
  const hasSnark = costs.some(c => c.type === 'snark');
  const hasMedical = costs.some(c => c.type === 'medical');
  let pool = QUIPS_SNARK;
  if (hasSnark && hasMedical) pool = QUIPS_BOTH;
  else if (hasMedical) pool = QUIPS_MEDICAL;
  return pool[Math.floor(Math.random() * pool.length)];
}

// =====================
// 顶部 Toast 队列（避免连续 toast 互相覆盖）
// =====================
const _toastQueue = [];
let _toastShowing = false;
function showToast(text, duration = 1800) {
  // v0.9.6: ⚠️ 开头自动识别为警告，加 warning 样式 + 延长停留
  const isWarning = typeof text === 'string' && text.startsWith('⚠️');
  if (isWarning && duration < 2800) duration = 2800;
  _toastQueue.push({ text, duration, isWarning });
  if (!_toastShowing) _renderNextToast();
}
function _renderNextToast() {
  const el = $('#toast');
  if (!el) return;
  if (_toastQueue.length === 0) { _toastShowing = false; return; }
  _toastShowing = true;
  const { text, duration, isWarning } = _toastQueue.shift();
  el.textContent = text;
  el.classList.toggle('warning', !!isWarning);
  el.classList.remove('hidden');
  void el.offsetWidth;
  el.classList.add('show');
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => {
      el.classList.add('hidden');
      _renderNextToast();
    }, 260);
  }, duration);
}

// money 变化时的戏谑短句池
const MONEY_OUT_TIPS = [
  // 第一批
  '钱包流泪', '钱包震三震', '出血了', '又花了', '心疼一下', '哎呀',
  '钱长腿了', '没了没了', '月光预演', '钱包深呼吸',
  '又掉一截血', '钱包又瘦了', '一咬牙', '蒸发',
  '钱：我先走一步', '心头一紧', '又不是必需品吧',
  '钱包失重', '算了算了', '看着数字往下掉',
  // 第二批
  '钱包：再这样下去要塌方', '钱包：早知道不出门', '钱包：又要瘦身',
  '月底见', '当代社畜真实写照', '黯然神伤',
  '离月光又近了一步', '离破产又近一公里', '我不疼，我不疼',
  // 第三批
  '工资还没焐热', '又给资本家充电了', '数字往下掉的速度比头发还快',
  '钱包：哥们儿，节制点', '我没花，是它自己走的', '钱像水一样'
];
const MONEY_IN_TIPS = [
  // 第一批
  '钱包微笑', '终于有点收入', '回血', '到手了', '不容易', '难得',
  '钱包鼓了点', '加血了', '真的吗', '总算',
  '老天爷开眼', '喜出望外', '钱包暂时不流泪了', '收到收到',
  '像捡到一样', '抬头看看蓝天', '心头一暖', '谢天谢地',
  '一点点希望', '终于轮到我',
  // 第二批
  '钱包:终于喘口气', '钱包:我活了', '钱包:拜见财神',
  '阿弥陀佛', '感谢资本主义', '难得阳光普照', '老天爷今天上班了',
  '喜从天降', '当代锦鲤上身', '久违的多巴胺',
  '像是中了二等奖', '被命运奖了一下'
];
function showMoneyToast(amount, note) {
  if (!amount) return;
  const noteText = note ? `（${note}）` : '';
  if (amount > 0) {
    const tip = MONEY_IN_TIPS[Math.floor(Math.random() * MONEY_IN_TIPS.length)];
    showToast(`💰 ${tip} +¥${amount}${noteText}`);
    if (window.SFX) SFX.play('money_in');
  } else {
    const tip = MONEY_OUT_TIPS[Math.floor(Math.random() * MONEY_OUT_TIPS.length)];
    showToast(`💸 ${tip} −¥${Math.abs(amount)}${noteText}`);
    if (window.SFX) SFX.play('money_out');
  }
}

// =====================
// 绩效到账弹窗
// =====================
const BONUS_QUIPS = [
  '这就是绩效。下周接着干。',
  '钱到账了，老板的笑也到账了。',
  '老板说这是你应得的——所以你应得的也就这么多。',
  '终于有个数字让你不那么想辞职了。',
  '感谢公司，不感谢老板。'
];
const MINIMAL_QUIPS = [
  '老板说："看在你还在岗的份上。"',
  '工资分跌了，但 HR 替你说了几句好话。',
  '这叫"温情绩效"——意思是聊胜于无。',
  '保底两个字，是公司唯一的温柔。',
  '不算奖励，算"安抚"。'
];
const REVERSE_QUIPS = [
  '你比刚来的时候还菜，\n老板不发钱。',
  'HR 在群里\n贴了一个红色感叹号。',
  '"绩效倒挂"——高情商说法。\n低情商叫：做得越多越亏。',
  '老板看了你的表现，\n叹了口气没说话。',
  '绩效面谈预约：\n下周一上午 10 点。'
];

function showBonusModal(data, onClose) {
  // v1.4 重音：绩效正常发放 → bonus_strike；倒挂 → bonus_reverse_strike
  if (window.SFX) {
    if (data.type === 'reverse') SFX.play('bonus_reverse_strike');
    else SFX.play('bonus_strike');
  }
  const titleEl = $('#bonus-title');
  const iconEl = $('#bonus-icon');
  const mainEl = $('#bonus-main');
  const amountEl = $('#bonus-amount');
  const noteEl = $('#bonus-quip');

  if (data.type === 'paid') {
    if (data.minimal) {
      titleEl.textContent = '🪙 保底绩效';
      iconEl.textContent = '🪙';
      mainEl.textContent = `工资分 ${data.current}，起步 ${data.initial}，勉强保住保底`;
      amountEl.textContent = `+¥${data.amount}`;
      amountEl.classList.remove('zero');
      amountEl.classList.add('positive');
      noteEl.textContent = MINIMAL_QUIPS[Math.floor(Math.random() * MINIMAL_QUIPS.length)];
    } else {
      titleEl.textContent = '💰 绩效到账';
      iconEl.textContent = '💰';
      mainEl.textContent = `老板给你打了 ${data.salary} 分`;
      amountEl.textContent = `+¥${data.amount}`;
      amountEl.classList.remove('zero');
      amountEl.classList.add('positive');
      noteEl.textContent = BONUS_QUIPS[Math.floor(Math.random() * BONUS_QUIPS.length)];
    }
  } else {
    titleEl.textContent = '⚠️ 绩效倒挂';
    iconEl.textContent = '📉';
    mainEl.textContent = `工资分 ${data.current}，比起步 ${data.initial} 还低`;
    if (data.penalty > 0) {
      amountEl.textContent = `−¥${data.penalty}`;
      amountEl.classList.remove('positive');
      amountEl.classList.remove('zero');
      amountEl.classList.add('negative');
    } else {
      amountEl.textContent = '+¥0';
      amountEl.classList.remove('positive');
      amountEl.classList.remove('negative');
      amountEl.classList.add('zero');
    }
    noteEl.textContent = REVERSE_QUIPS[Math.floor(Math.random() * REVERSE_QUIPS.length)];
  }

  $('#bonus-modal').classList.remove('hidden');
  $('#bonus-close').onclick = () => {
    $('#bonus-modal').classList.add('hidden');
    if (onClose) onClose();
  };
}

// =====================
// 扣款弹窗
// =====================
function showDeductionModal(costs, onClose) {
  if (window.SFX) SFX.play('deduction');
  const total = costs.reduce((a, c) => a + c.amount, 0);
  const listEl = $('#deduction-list');
  listEl.innerHTML = '';
  costs.forEach(c => {
    const row = document.createElement('div');
    row.className = 'deduction-item';
    const recoverTag = c.recover ? `<span class="deduction-recover">健康 +${c.recover}</span>` : '';
    // 类型 icon：snark 嘴硬 / medical 看病 / daywage 请假 / client 客户投诉
    const iconMap = { snark: '💼', medical: '🏥', daywage: '📅', client: '📞' };
    const icon = iconMap[c.type] || '💼';
    row.innerHTML = `
      <span class="deduction-reason">${icon} ${c.reason} ${recoverTag}</span>
      <span class="deduction-amount">−¥${c.amount}</span>
    `;
    listEl.appendChild(row);
  });
  $('#deduction-total').textContent = `合计 −¥${total}`;
  $('#deduction-quip').textContent = pickQuip(costs);
  $('#deduction-modal').classList.remove('hidden');
  $('#deduction-close').onclick = () => {
    $('#deduction-modal').classList.add('hidden');
    if (onClose) onClose();
  };
}

function trackChoice(event, choiceIdx) {
  const h = state.history;
  h.totalChoices += 1;
  const choice = event.choices[choiceIdx];
  const text = resolveText(choice.text, state.character);
  const tags = choice.tags || [];

  // 兼容：snark 字段或 snark tag 均可触发
  if (choice.snark || tags.includes('snark')) {
    h.snarkCount += 1;
    // P2: 按事件场景分桶，避免家里催相亲被算"怼老板"
    if (isWorkScopeEvent(event)) h.snarkWorkCount = (h.snarkWorkCount || 0) + 1;
    else h.snarkLifeCount = (h.snarkLifeCount || 0) + 1;
  }
  if (event.pool === 'side_hustle' || tags.includes('side_work')) h.sideHustleCount += 1;
  if (choice.requiredSkill === 'office_politics' || tags.includes('politics')) h.politicsCount += 1;
  if (choice.requiredSkill && !h.skillsUsed.includes(choice.requiredSkill)) {
    h.skillsUsed.push(choice.requiredSkill);
  }

  // v0.9: 优先用 tag，正则回退
  if (tags.includes('fishing')
      || /摸鱼|装作|拍照|盯着|画一|趴一会|不抢|潜水|关电脑|关灯睡|看不见|偷偷|关掉|不看了/.test(text)) {
    h.fishingCount += 1;
    h.submissiveCount += 1;
  }
  if (tags.includes('coffee') || /咖啡|美式|黑咖/.test(text)) h.coffeeCount += 1;
  if (tags.includes('overtime') || /凌晨|加班|硬扛|咬牙|跑通|爬起来把代码/.test(text)) {
    h.overtimeCount += 1;
  }
  if (event.id === 'team_building' && choiceIdx >= 1) h.refuseTeamBuilding = true;
  if (tags.includes('refuse') && event.tags?.includes('team')) h.refuseTeamBuilding = true;
}

// =====================
// 推进与结局
// =====================
function advanceTime() {
  state.timeSlot += 1;
  if (state.timeSlot > 2) {
    state.timeSlot = 0;
    state.day += 1;

    // 每过一天结日薪到存款 + 顶部 toast
    const dailyWage = Math.round((state.salaryAmount || 0) / 22);
    state.money += dailyWage;
    if (dailyWage > 0) {
      showToast(`💰 日薪到账 +¥${dailyWage}`);
      if (window.SFX) SFX.play('day_advance');
    }

    // 小组长：每天烂货自动累积
    if (state.profile.jobId === 'team_lead') {
      state.stats.fatigue = clamp(state.stats.fatigue + 4, 0, 100);
      state.stats.stress = clamp(state.stats.stress + 3, 0, 100);
    }
    // v0.9.6 小牛专属：每天健康 +1（身体好，扛得住）
    if (state.character === 'ox') {
      state.stats.health = clamp(state.stats.health + 1, 0, 100);
    }

    // Day 7 绩效结算
    // 公式：bonus = round(salaryAmount × currentSalary / 100 / 4)
    // 容忍区间：工资分跌幅 ≤ 10% 时，保底绩效 = 月薪 × 1%
    if (state.day === 7 && !state.bonusPaidDay7) {
      state.bonusPaidDay7 = true;
      const currentSalary = state.stats.salary;
      const initial = state.initialSalary;
      const tolerance = initial * 0.9; // 容忍下限

      if (currentSalary < tolerance) {
        // 跌幅 > 10% → 真倒挂，扣月薪 × 2.5%（向百元取整）
        const penalty = Math.round((state.salaryAmount || 0) * 0.025 / 100) * 100;
        if (penalty > 0) state.money -= penalty;
        state.pendingBonusModal = { type: 'reverse', initial, current: currentSalary, penalty };
      } else if (currentSalary < initial) {
        // 容忍区间内 → 保底绩效（月薪的 1%，向百元取整）
        const minBonus = Math.round((state.salaryAmount || 0) * 0.01 / 100) * 100;
        if (minBonus > 0) state.money += minBonus;
        state.pendingBonusModal = {
          type: 'paid', amount: minBonus, salary: currentSalary, minimal: true, initial
        };
      } else {
        // 正常绩效
        const bonus = Math.round((state.salaryAmount * currentSalary) / 100 / 4);
        state.money += bonus;
        state.pendingBonusModal = { type: 'paid', amount: bonus, salary: currentSalary };
      }
    }
  }
}

function checkEnding() {
  const ctx = {
    day: state.day,
    character: state.character,
    job: state.profile.jobId,
    snarkCount: state.history.snarkCount,
    snarkWorkCount: state.history.snarkWorkCount,
    snarkLifeCount: state.history.snarkLifeCount,
    sideHustleCount: state.history.sideHustleCount,
    karma: archive.karma // v1.0: 部分结局看业力（如 horse_lone_wolf）
  };
  for (const ending of [...window.ENDINGS].sort((a, b) => b.priority - a.priority)) {
    if (ending.condition(state.stats, ctx)) return ending;
  }
  return null;
}

// =====================
// v0.9.5 濒死预警 - 升级为救援购买弹窗 + 简单 toast 两档
// 4 类核心（fatigue/stress/health/mood）→ 弹窗，玩家可花钱缓解
// 3 类辅助（salary/money/snark）→ 仍然只是 toast 提醒
// 每种警告全场仅触发一次（_warnedFlags）
// =====================

// 救援弹窗 - 4 类可花钱干预的危险态
// v0.9.7：全场只能救援一次（_rescuedOnce 锁），价格上调让"救命"成为真决策
const RESCUE_WARNINGS = [
  {
    key: 'fatigue80',
    when: (s, h) => s.fatigue >= 80,
    title: '⚠️ 疲劳爆表了',
    desc: '你已经好几天没好好睡过觉，眼皮一直跳。要不要花点钱缓一缓？',
    options: [
      { icon: '💆', label: '去按摩店深度放松一晚',  cost: 400,            effects: { fatigue: -18, mood: +3 } },
      { icon: '🍱', label: '叫高级外卖 + 早睡',     cost: 100,            effects: { fatigue: -10 } },
      { icon: '🛏', label: '请假一天躺尸',         costType: 'daily_wage', effects: { fatigue: -25 } },
    ]
  },
  {
    key: 'stress80',
    when: (s, h) => s.stress >= 80,
    title: '⚠️ 压力快撑不住了',
    desc: '梦里全是 PPT 和会议。要不要花点钱泄一下洪？',
    options: [
      { icon: '🧠', label: '约心理咨询师 1 小时', cost: 800, effects: { stress: -22, mood: +6 } },
      { icon: '🍻', label: '约朋友撸串喝啤酒',   cost: 200, effects: { stress: -14, mood: +5, health: -4 } },
      { icon: '🏠', label: '装病假在家闭关一天',  cost: 0,   effects: { stress: -8, salary: -10 } },
    ]
  },
  {
    key: 'health35',
    when: (s, h) => s.health <= 35,
    title: '⚠️ 健康亮红灯了',
    desc: '体检报告里那行红字越来越大，再拖会真出事。',
    options: [
      { icon: '🏥', label: '三甲医院全套检查 + 调理', cost: 1000, effects: { health: +28 } },
      { icon: '💊', label: '社区医院开点药 + 多休息',  cost: 200,  effects: { health: +12 } },
      { icon: '😶', label: '自己扛过去',             cost: 0,    effects: {} },
    ]
  },
  {
    key: 'mood25',
    when: (s, h) => s.mood <= 25,
    title: '⚠️ 心情低到谷底',
    desc: '已经一周没真心笑过了。给自己一点光？',
    options: [
      { icon: '✈️', label: '请年假 + 短途旅行', cost: 1500, effects: { mood: +30, health: +10, fatigue: -8, salary: -3 } },
      { icon: '🎬', label: '一个人去看场电影',   cost: 80,   effects: { mood: +10 } },
      { icon: '💬', label: '约朋友吐槽一整晚',   cost: 50,   effects: { mood: +15, fatigue: +5 } },
    ]
  },
];

// 简单 toast - 没有简单"买药"能解决的警告
const TOAST_WARNINGS = [
  { key: 'salary20',  when: (s, h) => s.salary <= 20,    msg: '⚠️ 工资分跌得太狠，老板要动手了' },
  { key: 'money_low', when: (s, h) => s.money <= -100,   msg: '⚠️ 存款见底，再花点就破产了' },
  // P2: 只看工作场景嘴硬，家里 / 同学 / 房东 / 相亲 的嘴硬不算"怼老板"
  { key: 'snark6',    when: (s, h) => (h?.snarkWorkCount || 0) >= 6, msg: '⚠️ 你怼老板第 6 次了，HR 在盯着' },
];

function checkWarnings() {
  if (!state._warnedFlags) state._warnedFlags = {};
  const s = { ...state.stats, money: state.money };
  const h = state.history;

  // Toast 类
  for (const w of TOAST_WARNINGS) {
    if (state._warnedFlags[w.key]) continue;
    if (w.when(s, h)) {
      state._warnedFlags[w.key] = true;
      showToast(w.msg, 2400);
    }
  }

  // 救援弹窗类 - v0.9.7: 全场只能救一次（_rescuedOnce 锁）
  // 跳过不锁全场，但锁当前 key（避免反复弹同一个）
  if (state._rescuedOnce) return;
  const queue = [];
  for (const w of RESCUE_WARNINGS) {
    if (state._warnedFlags[w.key]) continue;
    if (w.when(s, h)) {
      state._warnedFlags[w.key] = true;
      queue.push(w);
      break; // 一次只弹一个，玩家选完后 _rescuedOnce 锁住后续
    }
  }
  if (queue.length > 0) showRescueQueue(queue);
}

function showRescueQueue(queue) {
  if (queue.length === 0) return;
  const w = queue.shift();
  showRescueModal(w, () => showRescueQueue(queue));
}

const STAT_NAMES = { health:'健康', stress:'压力', mood:'心情', fatigue:'疲劳', skill:'技能', salary:'工资分' };

// 计算 cost - 支持 'daily_wage' 动态价
function resolveCost(opt) {
  if (opt.costType === 'daily_wage') {
    return Math.round((state.salaryAmount || 0) / 22);
  }
  return opt.cost || 0;
}

function showRescueModal(warning, onDone) {
  $('#rescue-title').textContent = warning.title;
  $('#rescue-desc').textContent = warning.desc;
  const optsEl = $('#rescue-options');
  optsEl.innerHTML = '';

  warning.options.forEach(opt => {
    const cost = resolveCost(opt);
    const affordable = state.money >= cost;
    const div = document.createElement('div');
    div.className = 'rescue-option' + (affordable ? '' : ' disabled');

    // 拼接 effects 文字
    const parts = [];
    if (cost > 0) {
      const label = opt.costType === 'daily_wage'
        ? `−¥${cost} <span style="opacity:0.7;font-size:11px">(扣 1 天日薪)</span>`
        : `−¥${cost}`;
      parts.push(`<span class="rescue-cost">${label}</span>`);
    } else {
      parts.push('<span class="rescue-free">免费</span>');
    }

    for (const [k, v] of Object.entries(opt.effects)) {
      const name = STAT_NAMES[k] || k;
      const sign = v > 0 ? '+' : '';
      // 减压减疲劳是好事（gain 绿），加压加疲劳是坏事（loss 橙）
      const cls = ['stress','fatigue'].includes(k)
        ? (v < 0 ? 'rescue-gain' : 'rescue-loss')
        : (v > 0 ? 'rescue-gain' : 'rescue-loss');
      parts.push(`<span class="${cls}">${name} ${sign}${v}</span>`);
    }

    div.innerHTML = `
      <div class="rescue-option-label">${opt.icon} ${opt.label}</div>
      <div class="rescue-option-effects">${parts.join(' · ')}</div>
      ${!affordable ? '<div class="rescue-option-warn">存款不足</div>' : ''}
    `;

    if (affordable) {
      div.onclick = () => {
        if (window.SFX) SFX.play('choice_select');
        // 扣钱
        if (cost > 0) {
          state.money -= cost;
          showMoneyToast(-cost, '紧急救援');
        }
        // 应用 effects
        for (const [k, v] of Object.entries(opt.effects)) {
          if (state.stats[k] !== undefined) {
            state.stats[k] = clamp(state.stats[k] + v, 0, 100);
          }
        }
        // v0.9.7: 选择即锁定全场救援次数
        state._rescuedOnce = true;
        $('#rescue-modal').classList.add('hidden');
        saveState();
        if (typeof renderGame === 'function' && state && !state.ended) renderGame();
        if (onDone) onDone();
      };
    }

    optsEl.appendChild(div);
  });

  $('#rescue-skip').onclick = () => {
    if (window.SFX) SFX.play('back');
    // 跳过不锁 _rescuedOnce，下次别的 warning 还能弹
    $('#rescue-modal').classList.add('hidden');
    if (onDone) onDone();
  };

  $('#rescue-modal').classList.remove('hidden');
  if (window.SFX) SFX.play('modal_open');
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
  // v0.9.10: 通关结局额外 +10 业力
  if (ending.id === 'survival') karmaGain += 10;
  let hasUnlockedMilestone = false;  // v1.4 重音：解锁里程碑标记
  if (!archive.unlockedEndings.includes(ending.id)) {
    karmaGain += 5;
    archive.unlockedEndings.push(ending.id);
    hasUnlockedMilestone = true;
  }
  for (const t of state.tags) {
    if (!archive.unlockedTags.includes(t.id)) {
      karmaGain += 2;
      archive.unlockedTags.push(t.id);
      hasUnlockedMilestone = true;
    }
  }
  // v1.4 重音：本局首次解锁结局或新标签 → 1.5 秒后播解锁里程碑音
  // 延迟是为了让前面的 ending_strike + death 重音先响完
  if (hasUnlockedMilestone && window.SFX) {
    setTimeout(() => SFX.play('unlock_milestone'), 1500);
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

  // ===== v1.4 本世最佳记录 + 累计统计 + 成就检测 =====
  archive.bestRecords = archive.bestRecords || {};
  archive.stats = archive.stats || defaultArchiveStats();
  archive.unlockedAchievements = archive.unlockedAchievements || [];

  state.brokeRecords = [];  // 本局破的纪录，给后续 toast 用

  // 检测纪录
  const checkRecord = (key, value, label, formatter) => {
    const oldBest = archive.bestRecords[key] || 0;
    if (value > oldBest) {
      archive.bestRecords[key] = value;
      if (oldBest > 0) {  // 第一次不算"破纪录"
        state.brokeRecords.push({
          label,
          newValue: formatter ? formatter(value) : value,
          oldValue: formatter ? formatter(oldBest) : oldBest
        });
      }
    }
  };
  checkRecord('maxDay', state.day, '最长存活', v => v + ' 天');
  checkRecord('maxSnark', state.history.snarkCount, '单局最多嘴硬', v => v + ' 次');
  checkRecord('maxMoney', state.money, '单局最高存款', v => '¥' + v);
  checkRecord('maxKarmaPerLife', karmaGain, '单局最高业力', v => v + ' 点');

  // 累加统计
  const s = archive.stats;
  s.totalDaysSurvived += state.day;
  s.totalSnark += state.history.snarkCount || 0;
  s.totalMoney += Math.max(0, state.money);
  s.totalKarma += karmaGain;
  s.snarkAtWorkTotal += state.history.snarkWorkCount || 0;
  s.snarkAtLifeTotal += state.history.snarkLifeCount || 0;
  if (!s.jobsUsed.includes(state.profile.jobId)) s.jobsUsed.push(state.profile.jobId);
  if (!s.charactersUsed.includes(state.character)) s.charactersUsed.push(state.character);
  s.endingCounts = s.endingCounts || {};
  s.endingCounts[ending.id] = (s.endingCounts[ending.id] || 0) + 1;
  // 重算最常死法
  let maxCount = 0, fav = null;
  for (const [id, c] of Object.entries(s.endingCounts)) {
    if (c > maxCount) { maxCount = c; fav = id; }
  }
  s.favoriteEnding = fav;

  // 成就检测：返回本次新解锁的成就列表（用于 modal 显示）
  const newlyUnlockedAchievements = (window.ACHIEVEMENTS || []).filter(a => {
    if (archive.unlockedAchievements.includes(a.id)) return false;
    return a.condition(state, archive);
  });
  for (const a of newlyUnlockedAchievements) {
    archive.unlockedAchievements.push(a.id);
  }

  // 满图鉴判定：本次是否首次解锁所有 16 个结局
  const isMuseumComplete =
    archive.unlockedEndings.length === window.ENDINGS.length
    && newlyUnlockedAchievements.some(a => a.id === 'museum_complete');

  // 缓存 flags 供 clearState 之后的逻辑读取
  const flags = {
    brokeRecords: state.brokeRecords.slice(),
    newlyUnlockedAchievements,
    isMuseumComplete
  };

  saveArchive();
  clearState();
  return flags;
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

  // 结局收藏进度条 — 玩家完成一轮（即 totalLives ≥ 1）后才显示
  // 销毁前世会把 totalLives 清零，进度条又会隐藏，等下次再完成一轮再出现
  const hasDied = archive.totalLives >= 1;
  $('#endings-progress').classList.toggle('hidden', !hasDied);
  if (hasDied) {
    const unlockedCount = archive.unlockedEndings.length;
    const totalEndings = window.ENDINGS.length;
    const pct = totalEndings > 0 ? Math.round(unlockedCount / totalEndings * 100) : 0;
    $('#ep-count').textContent = `${unlockedCount} / ${totalEndings}`;
    $('#ep-fill').style.width = pct + '%';
    $('#endings-progress').classList.toggle('full', unlockedCount >= totalEndings);
  }

  showScreen('screen-menu');
  if (window.SFX) SFX.playBGM('menu');
}

// =====================
// 投胎选择
// =====================
function renderInvestiture(step = 'character') {
  investiture.step = step;
  $('#inv-step-character').classList.toggle('hidden', step !== 'character');
  $('#inv-step-job').classList.toggle('hidden', step !== 'job');

  // 底部按钮根据步骤切换显隐
  $('#inv-next-job').classList.toggle('hidden', step !== 'character');
  $('#inv-back-char').classList.toggle('hidden', step !== 'job');
  $('#inv-start').classList.toggle('hidden', step !== 'job');

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
        if (window.SFX) SFX.play('choice_select');
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
          if (window.SFX) SFX.play('choice_select');
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
  // P3: 0.4s crossfade — 菜单 BGM 同步 0.4s fadeOut（playBGM 内部把这个值传给 stopBGM），
  // 游戏 BGM 0.4s fadeIn，整个过渡 < 0.5s 完成，听感"切"而非"渐"
  if (window.SFX) SFX.playBGM('game', 0.4);
  // Day 7 绩效通知优先弹出
  if (state.pendingBonusModal) {
    const data = state.pendingBonusModal;
    state.pendingBonusModal = null;
    saveState();
    showBonusModal(data, () => renderGame());
    return;
  }

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
    // 同时写入跨局组合记忆，下次同 (character, job) 投胎会避开
    const comboKey = state.character + ':' + state.profile.jobId;
    archive.comboSeen = archive.comboSeen || {};
    archive.comboSeen[comboKey] = archive.comboSeen[comboKey] || [];
    if (!archive.comboSeen[comboKey].includes(ev.id)) {
      archive.comboSeen[comboKey].push(ev.id);
    }
    saveState();
    saveArchive();
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
    btn.textContent = resolveText(c.text, state.character);
    btn.onclick = () => makeChoice(ev, idx);
    choicesEl.appendChild(btn);
  });

  $('#choice-result').classList.add('hidden');
  showScreen('screen-game');
}

function makeChoice(ev, idx) {
  const choice = ev.choices[idx];
  // 音效：技能选项 / 怼 / 普通各不同
  if (window.SFX) {
    if (choice.hidden) SFX.play('skill_choice');
    else if (choice.snark) SFX.play('snark');
    else SFX.play('choice_select');
  }
  applyEffects(choice.effects, { event: ev, choice });
  trackChoice(ev, idx);

  state.log.push({
    day: state.day,
    timeSlot: state.timeSlot,
    eventId: ev.id,
    eventTitle: ev.title,
    choiceIdx: idx,
    choiceText: resolveText(choice.text, state.character),
    result: resolveText(choice.result, state.character) || null,
    skill: choice.requiredSkill || null
  });

  state.pendingEvent = null;
  saveState();

  const showResultOrNext = () => {
    const resolvedResult = resolveText(choice.result, state.character);
    if (resolvedResult) {
      $('#choice-result-text').textContent = resolvedResult;
      $('#choice-result').classList.remove('hidden');
      $$('.choice-btn').forEach(b => b.disabled = true);
      $('#next-btn').onclick = nextStep;
    } else {
      nextStep();
    }
  };

  // 有扣款先显示弹窗，关闭后再继续
  if (state.lastChoiceCosts && state.lastChoiceCosts.length > 0) {
    showDeductionModal(state.lastChoiceCosts, showResultOrNext);
  } else {
    showResultOrNext();
  }
}

function nextStep() {
  advanceTime();
  const ending = checkEnding();
  if (ending) return showEnding(ending);
  checkWarnings();
  saveState();
  renderGame();
}

// v1.4: 缓存上一局生命的 flags（finalizeLife 调用 clearState 后 state 不可用）
let _lastLifeFlags = null;

function showEnding(ending) {
  const flags = finalizeLife(ending);
  _lastLifeFlags = flags;
  // 满图鉴：全屏接管，跳过普通结局页
  if (flags.isMuseumComplete) {
    showMuseumComplete(ending, flags);
    return;
  }
  showEndingScreen(ending);
}

function showEndingScreen(ending) {
  if (window.SFX) {
    // v1.4 重音：终局触发瞬间一记低音锣 + 戏剧停顿
    if (ending.id !== 'survival') {
      SFX.play('ending_strike');
      setTimeout(() => SFX.play('death'), 500);  // 0.5s 后追加原 death 音效
    } else {
      SFX.play('survive');
    }
    // v0.9.8: 结局 BGM 慢渐入 3 秒，给玩家先看完结局名再听音乐
    SFX.playBGM('ending', 3);
  }
  finalizeLife(ending);
  $('#ending-name').textContent = ending.name;
  $('#ending-summary').textContent = ending.summary;
  $('#ending-day').textContent = `存活 ${state.day - (state.timeSlot === 0 && state.day > 1 ? 1 : 0)} 天`;
  // v0.9.3: 终局触发条件清晰化
  const triggerEl = $('#ending-trigger');
  if (triggerEl) {
    triggerEl.textContent = ending.trigger ? '触发：' + ending.trigger : '';
    triggerEl.style.display = ending.trigger ? '' : 'none';
  }
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

// v1.4 满图鉴 · 全屏接管
function showMuseumComplete(ending, flags) {
  if (window.SFX) {
    SFX.play('ending_strike');
    setTimeout(() => SFX.play('unlock_milestone'), 800);
    SFX.playBGM('ending', 3);
  }

  // 1. 最后一次死亡的信息
  $('#museum-final-name').textContent = ending.name;
  $('#museum-final-summary').textContent = ending.summary;

  // 2. 16 个结局缩略图
  const grid = $('#museum-endings-grid');
  grid.innerHTML = '';
  window.ENDINGS.forEach(e => {
    const cell = document.createElement('div');
    cell.className = 'museum-ending-cell';
    cell.innerHTML = `<span class="me-icon">💀</span><span>${e.name}</span>`;
    grid.appendChild(cell);
  });

  // 3. 总数据
  const s = archive.stats || {};
  $('#museum-stats').innerHTML = `
    <div class="ms-row"><span>总投胎次数</span><span class="ms-val">${archive.totalLives} 次</span></div>
    <div class="ms-row"><span>累计存活</span><span class="ms-val">${s.totalDaysSurvived || 0} 天</span></div>
    <div class="ms-row"><span>累计嘴硬</span><span class="ms-val">${s.totalSnark || 0} 次</span></div>
    <div class="ms-row"><span>累计存款</span><span class="ms-val">¥${s.totalMoney || 0}</span></div>
    <div class="ms-row"><span>当前业力</span><span class="ms-val">${archive.karma}</span></div>
    <div class="ms-row"><span>已用职业</span><span class="ms-val">${(s.jobsUsed || []).length} / 7</span></div>
  `;

  // 4. 成就列表
  const allAch = window.ACHIEVEMENTS || [];
  const unlocked = new Set(archive.unlockedAchievements || []);
  $('#museum-achievement-count').textContent = `${unlocked.size} / ${allAch.length}`;
  const list = $('#museum-achievement-list');
  list.innerHTML = '';
  allAch.forEach(a => {
    const isUnlocked = unlocked.has(a.id);
    const row = document.createElement('div');
    row.className = 'ach-row' + (isUnlocked ? '' : ' ach-locked');
    row.innerHTML = `
      <span class="ach-icon">${a.icon}</span>
      <div><span class="ach-name">${a.name}</span><span class="ach-desc"> · ${a.desc}</span></div>
    `;
    list.appendChild(row);
  });

  showScreen('screen-museum-complete');
}

// v1.4 破纪录 toast 序列 + 满图鉴后续衔接
function runPostEndingCelebration(onDone) {
  const flags = _lastLifeFlags;
  _lastLifeFlags = null;
  if (!flags || !flags.brokeRecords || flags.brokeRecords.length === 0) {
    onDone();
    return;
  }
  // 顺序弹破纪录 toast
  let i = 0;
  const showNext = () => {
    if (i >= flags.brokeRecords.length) {
      onDone();
      return;
    }
    const r = flags.brokeRecords[i++];
    showToast(`🏆 新纪录！${r.label} ${r.newValue}（旧 ${r.oldValue}）`, 2200);
    setTimeout(showNext, 2400);
  };
  showNext();
}

// =====================
// 档案
// =====================
function renderArchive(tab = 'lives') {
  ['lives', 'endings', 'events', 'rank', 'bio'].forEach(t => {
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

  if (tab === 'bio') {
    $('#archive-bio').innerHTML = renderBiographyHTML();
  }

  showScreen('screen-archive');
}

// v1.4 自传板块 - 自动生成叙事文本
function renderBiographyHTML() {
  const a = archive;
  const s = a.stats || defaultArchiveStats();
  if (a.totalLives === 0) {
    return '<div class="empty">还没有故事可写——先去投个胎吧。</div>';
  }

  // 找最长存活那一世
  const longestLife = a.lives.reduce((best, l) => l.day > (best?.day || 0) ? l : best, null);
  const longestStr = longestLife
    ? `${longestLife.day} 天，那是一只 ${longestLife.profile?.name?.replace(/^.*?(小马|小牛).*$/, '$1') || '牛马'}，做${longestLife.profile?.jobName || '不知道什么职业'}。`
    : '还没有最长记录。';

  // 死法 top 3
  const endingCounts = s.endingCounts || {};
  const sortedEndings = Object.entries(endingCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const endingNameMap = {};
  (window.ENDINGS || []).forEach(e => { endingNameMap[e.id] = e.name; });
  const top3Endings = sortedEndings.length === 0 ? '暂无' :
    sortedEndings.map(([id, c]) => `${endingNameMap[id] || id}（${c} 次）`).join('、');

  // 最爱死法
  const favEnding = s.favoriteEnding ? (endingNameMap[s.favoriteEnding] || s.favoriteEnding) : '还没有最爱';

  // 嘴硬次数
  const avgSnark = a.totalLives > 0 ? (s.totalSnark / a.totalLives).toFixed(1) : '0';

  // 职业 + 角色
  const jobNames = (s.jobsUsed || []).map(jid => {
    const j = (window.JOBS || []).find(x => x.id === jid);
    return j?.name || jid;
  });
  const charNames = (s.charactersUsed || []).map(cid => {
    const c = (window.CHARACTERS || []).find(x => x.id === cid);
    return c?.name || cid;
  });

  // 业力 + 还能买几个技能
  const cheapestUnboughtSkill = (window.SKILLS || [])
    .filter(sk => !(a.unlockedSkills || []).includes(sk.id))
    .sort((a, b) => a.cost - b.cost)[0];
  const canBuyMore = cheapestUnboughtSkill
    ? Math.floor(a.karma / cheapestUnboughtSkill.cost)
    : 0;
  const skillsLine = cheapestUnboughtSkill
    ? `你目前积累的业力是 ${a.karma}，足够再买 ${canBuyMore} 个秘籍。`
    : `你已经把 ${(window.SKILLS || []).length} 个秘籍全解锁了。再无可买。`;

  const charLine = charNames.length === 2
    ? '你两个角色都试过，是个真·两栖牛马。'
    : charNames.length === 1
      ? `你只玩过 ${charNames[0]}，从没换过身。`
      : '你还没投过任何胎。';

  return `
<div class="mydata-section">
  <h3>📖 你的牛马自传</h3>
  <div class="mydata-bio">你已经投胎 <b>${a.totalLives}</b> 次。最长一次活了 ${longestStr}

你最常死于：<b>${top3Endings}</b>。
你最爱的死法是：<b>${favEnding}</b>。

嘴硬总次数：<b>${s.totalSnark || 0}</b>。这相当于每局怼 <b>${avgSnark}</b> 次。
你试过 ${jobNames.length} 种职业${jobNames.length > 0 ? '：' + jobNames.join('、') : '（还没换过岗）'}。
${charLine}

${skillsLine}
累计存活了 ${s.totalDaysSurvived || 0} 天，累计存款 ¥${s.totalMoney || 0}。

你目前解锁的成就：${(a.unlockedAchievements || []).length} / ${(window.ACHIEVEMENTS || []).length}。${
    (a.unlockedAchievements || []).length === (window.ACHIEVEMENTS || []).length ? ' 🏆 满成就！' : ''
  }</div>
</div>
  `.trim();
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
    if (window.SFX) {
      SFX.play('choice_select');
      // 进投胎页就开始预载游戏 BGM，等玩家挑完性格/岗位（通常 5-10s），
      // game.mp3 已经在缓存里，切游戏屏时 playBGM 几乎零延迟
      SFX.preloadBGM('game');
    }
    if (hasSave()) {
      if (!confirm('上一只牛马还没死透，重新投胎会覆盖。继续？')) return;
      clearState();
    }
    // 首次点「今日投胎」先弹引导卡 1；看完后再进投胎页
    if (!localStorage.getItem('onboarding_seen_v1')) {
      _onboardingNextAction = () => {
        investiture = { character: null, jobId: null };
        renderInvestiture('character');
      };
      $('#onboarding-modal').classList.remove('hidden');
      return;
    }
    investiture = { character: null, jobId: null };
    renderInvestiture('character');
  };

  $('#btn-continue').onclick = () => {
    if (window.SFX) {
      SFX.play('click');
      SFX.preloadBGM('game'); // 继续存档路径也预载一次（虽然紧接 renderGame，但起码并发起来）
    }
    if (loadState()) renderGame(); else alert('没有上次怼到一半的牛马。');
  };

  $('#btn-archive').onclick = () => { if (window.SFX) SFX.play('click'); renderArchive('lives'); };
  $('#btn-skills').onclick  = () => { if (window.SFX) SFX.play('click'); renderSkillTree(); };
  $('#btn-back-menu').onclick = () => { if (window.SFX) SFX.play('back'); renderMenu(); };
  $('#archive-back').onclick  = () => { if (window.SFX) SFX.play('back'); renderMenu(); };
  $('#skills-back').onclick   = () => { if (window.SFX) SFX.play('back'); renderMenu(); };
  $('#ending-back').onclick   = () => {
    if (window.SFX) SFX.play('back');
    // 首次挂了拦截：弹引导卡 2
    if (maybeShowFirstDeathCard()) return;
    // v1.4: 满图鉴拦截 + 破纪录 toast → 再回菜单
    runPostEndingCelebration(() => renderMenu());
  };
  $('#ending-replay').onclick = () => {
    if (window.SFX) SFX.play('choice_select');
    if (maybeShowFirstDeathCard()) return;
    runPostEndingCelebration(() => {
      investiture = { character: null, jobId: null };
      renderInvestiture('character');
    });
  };
  $('#ending-to-skills').onclick = () => { if (window.SFX) SFX.play('click'); renderSkillTree(); };

  // 分享卡片
  $('#ending-share').onclick = () => {
    const last = archive.lives[0];
    if (last) window.showShareCard(last, archive);
  };

  // v1.4 满图鉴 全屏接管按钮
  $('#museum-back').onclick = () => {
    if (window.SFX) SFX.play('back');
    runPostEndingCelebration(() => renderMenu());
  };
  $('#museum-share').onclick = () => {
    if (window.SFX) SFX.play('click');
    const last = archive.lives[0];
    if (last) window.showShareCard(last, archive);
  };
  $('#share-close').onclick = () => $('#share-modal').classList.add('hidden');
  $('#share-toggle-style').onclick = () => {
    const last = archive.lives[0];
    if (last) window.toggleShareStyle(last, archive);
  };
  $('#share-download').onclick = () => {
    const last = archive.lives[0];
    if (last) window.downloadShareCard(last);
  };

  // 音效开关
  $('#sfx-toggle').onclick = () => {
    if (window.SFX) {
      const enabled = window.SFX.toggle();
      $('#sfx-toggle').textContent = enabled ? '🔊' : '🔇';
      $('#sfx-toggle').classList.toggle('muted', !enabled);
    }
  };
  if (window.SFX) {
    const enabled = window.SFX.isEnabled();
    $('#sfx-toggle').textContent = enabled ? '🔊' : '🔇';
    $('#sfx-toggle').classList.toggle('muted', !enabled);
  }

  // 投胎导航
  $('#inv-next-job').onclick = () => { if (window.SFX) SFX.play('choice_select'); renderInvestiture('job'); };
  $('#inv-back-char').onclick = () => { if (window.SFX) SFX.play('back'); renderInvestiture('character'); };
  $('#inv-cancel').onclick = () => { if (window.SFX) SFX.play('back'); renderMenu(); };
  $('#inv-start').onclick = () => {
    if (!investiture.character || !investiture.jobId) return;
    if (window.SFX) SFX.play('skill_choice');  // 投胎仪式感，用紫色技能音
    newGame(investiture.character, investiture.jobId);
    renderGame();
  };

  $('#btn-destroy').onclick = () => {
    if (window.SFX) SFX.play('click');
    if (!confirm('销毁前世会清空所有轮回、技能、业力、事件库存。从头做牛马？')) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ARCHIVE_KEY);
    // 销毁前世顺手把新手引导 flag 也清掉，老玩家下次点「今日投胎」会再看一遍引导
    localStorage.removeItem('onboarding_seen_v1');
    localStorage.removeItem('onboarding_death_v1');
    loadArchive();
    renderMenu();
  };

  $$('.tab-btn').forEach(b => {
    b.onclick = () => renderArchive(b.dataset.tab);
  });

  renderMenu();

  // 浏览器自动播放策略：首次进入页面时 BGM 会被拦截，
  // 注册一次性点击监听，用户第一次点任何地方就启动当前屏幕的 BGM。
  // 用 capture 阶段，确保在按钮 onclick 切屏之前读到 active screen
  // （否则用户点"今日投胎"会直接跳过 menu BGM，跑到 game 分支）。
  const kickBGM = () => {
    if (!window.SFX) return;
    const active = document.querySelector('.screen.active')?.id;
    if (active === 'screen-game') SFX.playBGM('game');
    else if (active === 'screen-ending') SFX.playBGM('ending');
    else SFX.playBGM('menu');
    document.removeEventListener('click', kickBGM, { capture: true });
    document.removeEventListener('touchstart', kickBGM, { capture: true });
  };
  document.addEventListener('click', kickBGM, { capture: true });
  document.addEventListener('touchstart', kickBGM, { capture: true });

  // ===== 新手引导卡 1：点【今日投胎】后才弹（不是 DOMContentLoaded 即弹） =====
  // _onboardingNextAction 由 btn-start 设置，关闭时执行（继续进投胎页）
  // v1.4.x: 手机端容错——SFX 或 localStorage 抛错时仍能关闭并继续
  const onboardingCloseHandler = () => {
    try { if (window.SFX) SFX.play('click'); } catch (e) { console.warn('SFX failed:', e); }
    try { localStorage.setItem('onboarding_seen_v1', '1'); } catch (e) { console.warn('localStorage failed:', e); }
    $('#onboarding-modal').classList.add('hidden');
    if (_onboardingNextAction) {
      const action = _onboardingNextAction;
      _onboardingNextAction = null;
      try { action(); } catch (e) { console.warn('next action failed:', e); }
    }
  };
  $('#onboarding-close').onclick = onboardingCloseHandler;
  // 手机端 touchend 兜底（iOS Safari 偶尔吞掉 click）
  $('#onboarding-close').addEventListener('touchend', e => {
    e.preventDefault();
    onboardingCloseHandler();
  });

  // ===== 新手引导卡 2：首次挂掉之后按钮处理 =====
  // 触发逻辑写在 ending-replay / ending-back 的 onclick 里（见上面）
  $('#first-death-skills').onclick = () => {
    if (window.SFX) SFX.play('click');
    localStorage.setItem('onboarding_death_v1', '1');
    $('#first-death-modal').classList.add('hidden');
    renderSkillTree();
  };
  $('#first-death-restart').onclick = () => {
    if (window.SFX) SFX.play('choice_select');
    localStorage.setItem('onboarding_death_v1', '1');
    $('#first-death-modal').classList.add('hidden');
    investiture = { character: null, jobId: null };
    renderInvestiture('character');
  };
});

// 拦截 ending 按钮：首次挂了先弹卡片 2
// 返回 true = 已拦截（卡片在显示），false = 没拦截（按原流程走）
function maybeShowFirstDeathCard() {
  // 第一次挂了的判定：archive 已有第 1 条记录（finalizeLife 已执行），但卡未弹过
  const isFirstDeath = (archive?.totalLives === 1);
  const seen = localStorage.getItem('onboarding_death_v1') === '1';
  if (!isFirstDeath || seen) return false;
  // 填入实际数据
  const last = archive.lives[0];
  const stats = $('#first-death-stats');
  if (stats && last) {
    const karma = last.karmaGain || 0;
    const tags = (last.tags || []).length;
    const totalEndings = (window.ENDINGS || []).length;
    stats.innerHTML =
      `· 业力 +${karma} 点<br>` +
      `· 死法 1 / ${totalEndings}<br>` +
      `· 人设标签 +${tags} 个`;
  }
  $('#first-death-modal').classList.remove('hidden');
  return true;
}
