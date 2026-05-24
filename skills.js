// 怼人技能树 - 10 招式 4 tier，命名走"嘴硬牛马武功秘籍"风
//
// v0.9.10 价格表（按 PM 指定）：
//   - T1: 15，T2: 30，T3: 40，T4: 50
//   - 增强多个偏弱的 passive 效果（保留）
//   - T4 继承存款 10%（保留）
//
// 业力点（karma）来源：
//   - 死亡时按存活天数 × 1
//   - 首次解锁结局 +5
//   - 首次解锁人设标签 +2
//   - 首次触发事件 +1
//   - 通关结局额外 +10（v0.9.10 调整）
//
// 技能效果分两类：
//   - active: 解锁事件中带 requiredSkill = id 的隐藏第 4 选项（紫色特效）
//   - passive: 在 game.js 中拦截属性变化或事件触发逻辑

window.SKILLS = [
  // ===== Tier 1 · 嘴硬入门（15 业力）=====
  {
    id: 'coffee_immune',
    tier: 1,
    name: '不眠咒',
    icon: '☕',
    cost: 15,
    requires: [],
    type: 'passive',
    description: '咖啡因不再伤身。咖啡选项不扣健康，提神效果 +50%，额外减压 3 点。',
  },
  {
    id: 'thick_skin',
    tier: 1,
    name: '金钟罩',
    icon: '🛡',
    cost: 15,
    requires: [],
    type: 'active+passive',
    description: '脸皮如钟罩。怼老板时工资损失 −60%，解锁部分事件的"嘴更硬"选项。',
  },
  {
    id: 'rubber_duck',
    tier: 1,
    name: '小黄鸭咒语',
    icon: '🦆',
    cost: 15,
    requires: [],
    type: 'active+passive',
    description: '对鸭念咒，bug 自现。技术类事件 +4 技能、−2 疲劳，解锁技术类隐藏解法。',
  },
  {
    id: 'social_butterfly',
    tier: 1,
    name: '群聊魅影',
    icon: '🦋',
    cost: 15,
    requires: [],
    type: 'active+passive',
    description: '群里阴影里的影子操盘手。同事/团建类心情 +5、压力 −2，解锁"拉同事下水"选项。',
  },

  // ===== Tier 2 · 怼术成形（30 业力）=====
  {
    id: 'side_hustle',
    tier: 2,
    name: '暗度陈仓',
    icon: '💼',
    cost: 30,
    requires: ['coffee_immune', 'rubber_duck'],
    type: 'event-pool',
    description: '主业为饵，副业为枪。解锁副业事件池：跑滴滴、写公众号、做小红书、卖咸鱼。',
  },
  {
    id: 'office_politics',
    tier: 2,
    name: '办公室王安石',
    icon: '🎭',
    cost: 30,
    requires: ['thick_skin', 'social_butterfly'],
    type: 'active+passive',
    description: '变法者，先变心。政治类选项额外 +3 工资分，解锁"站队/甩锅/借势"类隐藏选项。',
  },
  {
    id: 'promotion_radar',
    tier: 2,
    name: '反向画饼术',
    icon: '📡',
    cost: 30,
    requires: ['thick_skin', 'rubber_duck', 'social_butterfly'],
    type: 'active+passive',
    description: '老板给你画饼，你给老板画饼。老板/HR 对话工资 +3，解锁"反向画饼"选项。',
  },

  // ===== Tier 3 · 心法精进（40 业力）=====
  {
    id: 'fishing_zen',
    tier: 3,
    name: '咸鱼·心经',
    icon: '🧘',
    cost: 40,
    requires: ['side_hustle', 'office_politics'],
    type: 'passive',
    description: '心如咸鱼，魂归大海。心情低于 40 时自动回升到 40，无事能扰。',
  },
  {
    id: 'iron_will',
    tier: 3,
    name: '钢铁老脸',
    icon: '⚙️',
    cost: 40,
    requires: ['office_politics', 'promotion_radar'],
    type: 'passive',
    description: '久病成医，逆境出英雄。健康低于 30 时，压力 + 疲劳 增量均减半。',
  },

  // ===== Tier 4 · 化境（50 业力）=====
  {
    id: 'nirvana_rebirth',
    tier: 4,
    name: '大圣归来',
    icon: '🔥',
    cost: 50,
    requires: ['fishing_zen', 'iron_will'],
    type: 'meta',
    description: '一个跟头十万八千里，财不离身。新一世继承上一世存款的 10%。',
  },

  // ===== Tier 5 · 渡劫（v1.1 新增 — 60-150 业力）=====
  // 长线追求：5 个高级技能，让业力积累的目标感持续到 10+ 局
  {
    id: 'boss_reading',
    tier: 5,
    name: '读心术',
    icon: '👁',
    cost: 60,
    requires: ['promotion_radar'],
    type: 'passive',
    description: '老板嘴里说什么，眼里写什么，你都看得见。老板/HR 类事件先看 result 再选。',
  },
  {
    id: 'lawyer_friend',
    tier: 5,
    name: '我朋友是律师',
    icon: '⚖️',
    cost: 80,
    requires: ['office_politics', 'thick_skin'],
    type: 'passive',
    description: '法盲怕的就是这句话。HR / 客户 / 老板事件的 snark 扣款减半，再加一句"我让我律师朋友看看"震慑感。',
  },
  {
    id: 'side_hustle_pro',
    tier: 5,
    name: '斜杠流派',
    icon: '⚡',
    cost: 100,
    requires: ['side_hustle', 'fishing_zen'],
    type: 'passive',
    description: '副业的钱不比主业少。所有副业事件 money 收入 +50%，解锁第二副业池（待开发）。',
  },
  {
    id: 'political_animal',
    tier: 5,
    name: '政治动物',
    icon: '🦊',
    cost: 120,
    requires: ['office_politics', 'promotion_radar'],
    type: 'passive',
    description: '在公司养成的二级人格。政治类选项额外 +5 工资分（叠加原 +3，总共 +8），怼老板罚款再减 30%。',
  },
  {
    id: 'numb_immune',
    tier: 5,
    name: '钝化术',
    icon: '🪨',
    cost: 150,
    requires: ['iron_will', 'fishing_zen'],
    type: 'passive',
    description: '万事不动心。心情永远 ≥ 30（兜底），但代价是上限锁 90。终身 buff，激进玩家的保险绳。',
  },
];

// 判断某技能是否满足前置条件（OR 关系：requires 里任一项被解锁即可）
window.canUnlockSkill = function(skillId, unlockedSet) {
  const skill = window.SKILLS.find(s => s.id === skillId);
  if (!skill) return false;
  if (unlockedSet.has(skillId)) return false;
  if (skill.requires.length === 0) return true;
  return skill.requires.some(r => unlockedSet.has(r));
};
