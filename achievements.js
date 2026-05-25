// 成就系统 v1.4
// 每个成就有：id / name / icon / desc / condition(state, archive) -> bool
//
// condition 在 finalizeLife 末尾被调用，state 是即将被 clear 的本局状态，
// archive 是全局存档（含 totalLives, lives, stats, bestRecords 等）

window.ACHIEVEMENTS = [
  {
    id: 'first_death',
    name: '首次挂了',
    icon: '💀',
    desc: '完成第一次轮回',
    condition: (s, a) => a.totalLives === 1
  },
  {
    id: 'first_survival',
    name: '首次通关',
    icon: '🎓',
    desc: '撑过 14 天活下来一次',
    condition: (s, a) => s.ending?.id === 'survival' && (a.stats.endingCounts?.survival || 0) === 1
  },
  {
    id: 'snark_apprentice',
    name: '嘴硬学徒',
    icon: '💢',
    desc: '累计嘴硬 ≥ 50 次',
    condition: (s, a) => (a.stats.totalSnark || 0) >= 50
  },
  {
    id: 'snark_master',
    name: '怼神之王',
    icon: '👹',
    desc: '累计嘴硬 ≥ 300 次',
    condition: (s, a) => (a.stats.totalSnark || 0) >= 300
  },
  {
    id: 'snark_one_life',
    name: '单局怼神',
    icon: '🔥',
    desc: '单局嘴硬 ≥ 15 次',
    condition: (s, a) => (s.history?.snarkCount || 0) >= 15
  },
  {
    id: 'iron_worker',
    name: '钢铁打工人',
    icon: '🛡',
    desc: '0 体检异常通关（健康全程 ≥ 50）',
    condition: (s, a) => s.ending?.id === 'survival' && (s.stats?.health || 0) >= 50
  },
  {
    id: 'silent_ox',
    name: '沉默是金',
    icon: '🤐',
    desc: '0 嘴硬通关',
    condition: (s, a) => s.ending?.id === 'survival' && (s.history?.snarkCount || 0) === 0
  },
  {
    id: 'rich_one_life',
    name: '单局首富',
    icon: '💰',
    desc: '单局存款 ≥ ¥5000',
    condition: (s, a) => (s.money || 0) >= 5000
  },
  {
    id: 'jobs_5',
    name: '职场流浪汉',
    icon: '🛄',
    desc: '试过 5 种不同职业',
    condition: (s, a) => (a.stats.jobsUsed || []).length >= 5
  },
  {
    id: 'jobs_all',
    name: '岗位百科',
    icon: '🌐',
    desc: '试过全部 7 种职业',
    condition: (s, a) => (a.stats.jobsUsed || []).length >= 7
  },
  {
    id: 'both_characters',
    name: '阴阳两栖',
    icon: '☯️',
    desc: '小马 + 小牛都体验过',
    condition: (s, a) => (a.stats.charactersUsed || []).length >= 2
  },
  {
    id: 'karma_500',
    name: '业力大师',
    icon: '🌀',
    desc: '业力曾达到 ≥ 500',
    condition: (s, a) => (a.stats.totalKarma || 0) >= 500
  },
  {
    id: 'all_skills',
    name: '秘籍大成',
    icon: '📜',
    desc: '解锁全部 15 个秘籍',
    condition: (s, a) => (a.unlockedSkills || []).length >= 15
  },
  {
    id: 'rescue_user',
    name: '续命大师',
    icon: '🆘',
    desc: '触发过救援购买',
    condition: (s, a) => (a.stats.rescueUsedCount || 0) >= 1
  },
  {
    id: 'lives_50',
    name: '轮回老油条',
    icon: '♻️',
    desc: '投胎 ≥ 50 次',
    condition: (s, a) => (a.totalLives || 0) >= 50
  },
  {
    id: 'horse_only',
    name: '一意孤行',
    icon: '🐴',
    desc: '专注小马 ≥ 5 局（且未碰过小牛）',
    condition: (s, a) => (a.stats.charactersUsed || []).length === 1
      && (a.stats.charactersUsed || [])[0] === 'horse'
      && (a.totalLives || 0) >= 5
  },
  {
    id: 'ox_only',
    name: '老实人路线',
    icon: '🐂',
    desc: '专注小牛 ≥ 5 局（且未碰过小马）',
    condition: (s, a) => (a.stats.charactersUsed || []).length === 1
      && (a.stats.charactersUsed || [])[0] === 'ox'
      && (a.totalLives || 0) >= 5
  },
  {
    id: 'snark_at_life',
    name: '生活也嘴硬',
    icon: '🏠',
    desc: '生活场景嘴硬 ≥ 30 次',
    condition: (s, a) => (a.stats.snarkAtLifeTotal || 0) >= 30
  },
  {
    id: 'snark_at_work',
    name: '职场反骨',
    icon: '💼',
    desc: '工作场景嘴硬 ≥ 50 次',
    condition: (s, a) => (a.stats.snarkAtWorkTotal || 0) >= 50
  },
  // 终极成就
  {
    id: 'museum_complete',
    name: '满图鉴 · 地府名人堂',
    icon: '🏆',
    desc: '解锁全部 16 种死法',
    condition: (s, a) => (a.unlockedEndings || []).length >= (window.ENDINGS || []).length
  }
];

// 计算成就解锁率（用于"满图鉴庆典"modal）
window.getAchievementStats = function() {
  const total = window.ACHIEVEMENTS.length;
  const unlocked = (window.archive?.unlockedAchievements || []).length;
  return { unlocked, total, pct: total > 0 ? Math.round(unlocked / total * 100) : 0 };
};
