// 怼人技能树 - 10 招式 4 tier，命名走"嘴硬牛马武功秘籍"风
//
// v0.9.8 平衡调整：
//   - 全部价格 -20%（T1: 10→8，T2: 20→16，T3: 30→24，T4: 50→40）
//   - 增强多个偏弱的 passive 效果
//   - T4 继承存款 5% → 10%
//
// 业力点（karma）来源：
//   - 死亡时按存活天数 × 1
//   - 首次解锁结局 +5
//   - 首次解锁人设标签 +2
//   - 首次触发事件 +1
//   - 通关结局额外 +20（v0.9.8 新增）
//
// 技能效果分两类：
//   - active: 解锁事件中带 requiredSkill = id 的隐藏第 4 选项（紫色特效）
//   - passive: 在 game.js 中拦截属性变化或事件触发逻辑

window.SKILLS = [
  // ===== Tier 1 · 嘴硬入门（8 业力）=====
  {
    id: 'coffee_immune',
    tier: 1,
    name: '不眠咒',
    icon: '☕',
    cost: 8,
    requires: [],
    type: 'passive',
    description: '咖啡因不再伤身。咖啡选项不扣健康，提神效果 +50%，额外减压 3 点。',
  },
  {
    id: 'thick_skin',
    tier: 1,
    name: '金钟罩',
    icon: '🛡',
    cost: 8,
    requires: [],
    type: 'active+passive',
    description: '脸皮如钟罩。怼老板时工资损失 −60%，解锁部分事件的"嘴更硬"选项。',
  },
  {
    id: 'rubber_duck',
    tier: 1,
    name: '小黄鸭咒语',
    icon: '🦆',
    cost: 8,
    requires: [],
    type: 'active+passive',
    description: '对鸭念咒，bug 自现。技术类事件 +4 技能、−2 疲劳，解锁技术类隐藏解法。',
  },
  {
    id: 'social_butterfly',
    tier: 1,
    name: '群聊魅影',
    icon: '🦋',
    cost: 8,
    requires: [],
    type: 'active+passive',
    description: '群里阴影里的影子操盘手。同事/团建类心情 +5、压力 −2，解锁"拉同事下水"选项。',
  },

  // ===== Tier 2 · 怼术成形（16 业力）=====
  {
    id: 'side_hustle',
    tier: 2,
    name: '暗度陈仓',
    icon: '💼',
    cost: 16,
    requires: ['coffee_immune', 'rubber_duck'],
    type: 'event-pool',
    description: '主业为饵，副业为枪。解锁副业事件池：跑滴滴、写公众号、做小红书、卖咸鱼。',
  },
  {
    id: 'office_politics',
    tier: 2,
    name: '办公室王安石',
    icon: '🎭',
    cost: 16,
    requires: ['thick_skin', 'social_butterfly'],
    type: 'active+passive',
    description: '变法者，先变心。政治类选项额外 +3 工资分，解锁"站队/甩锅/借势"类隐藏选项。',
  },
  {
    id: 'promotion_radar',
    tier: 2,
    name: '反向画饼术',
    icon: '📡',
    cost: 16,
    requires: ['thick_skin', 'rubber_duck', 'social_butterfly'],
    type: 'active+passive',
    description: '老板给你画饼，你给老板画饼。老板/HR 对话工资 +3，解锁"反向画饼"选项。',
  },

  // ===== Tier 3 · 心法精进（24 业力）=====
  {
    id: 'fishing_zen',
    tier: 3,
    name: '咸鱼·心经',
    icon: '🧘',
    cost: 24,
    requires: ['side_hustle', 'office_politics'],
    type: 'passive',
    description: '心如咸鱼，魂归大海。心情低于 40 时自动回升到 40，无事能扰。',
  },
  {
    id: 'iron_will',
    tier: 3,
    name: '钢铁老脸',
    icon: '⚙️',
    cost: 24,
    requires: ['office_politics', 'promotion_radar'],
    type: 'passive',
    description: '久病成医，逆境出英雄。健康低于 30 时，压力 + 疲劳 增量均减半。',
  },

  // ===== Tier 4 · 化境（40 业力）=====
  {
    id: 'nirvana_rebirth',
    tier: 4,
    name: '大圣归来',
    icon: '🔥',
    cost: 40,
    requires: ['fishing_zen', 'iron_will'],
    type: 'meta',
    description: '一个跟头十万八千里，财不离身。新一世继承上一世存款的 10%。',
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
