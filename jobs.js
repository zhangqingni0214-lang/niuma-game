// 角色 + 职业定义

window.CHARACTERS = [
  {
    id: 'horse',
    emoji: '🐴',
    name: '小马',
    tagline: '烈但被世俗搓磨，暴怒只敢干吼。',
    description: '骨子里不服，怼起人来一套一套，但下了班还是要交房租。',
    statOffset: { stress: +5, mood: +5 },
    traits: {
      // v0.9.6: 重新拉大角色差异
      // 小马的 snark 有爽感（mood+2/stress-2）但代价是工资分跌得快（salary-2）
      // 忍气吞声反而伤心情 - 让小马"必须怼"
      snarkBonus:    { mood: +2, stress: -2 },
      snarkPenalty:  { salary: -2 },
      submissivePenalty: { mood: -5 }
    }
  },
  {
    id: 'ox',
    emoji: '🐂',
    name: '小牛',
    tagline: '老好人，烂货都甩给你。',
    description: '不会拒绝，谁找谁帮忙，干完了别人去抢功劳。',
    statOffset: { salary: +5, fatigue: +5 },
    traits: {
      // v0.9.6: 小牛忍气吞声有甜头（疲劳减得多 + 工资分涨）
      // 但怼回去代价巨大（工资跌得狠 + 压力上得快）— 让小牛"不该怼"
      submissiveBonus: { fatigue: -5, salary: +2 },
      submissiveBonusExtra: { health: +1 },  // 小牛专属：忍气吞声还回血
      snarkPenalty:    { salary: -5, stress: +5 }
    }
  }
];

window.JOBS = [
  {
    id: 'outsource',
    name: '全栈外包',
    company: '某乙方科技',
    icon: '🛠',
    unlockAt: 1,
    salary: 3000,             // 月薪
    // v0.9.6 平衡：salary 从 15 提到 25，避免起步就濒临被开除
    baseStats: { health: 70, stress: 60, mood: 50, fatigue: 40, skill: 50, salary: 25 },
    startMoney: 200,
    description: '什么都干，什么都救火，工资按头算。',
    eventTags: ['outsource', 'tech', 'all']
  },
  {
    id: 'big_ops',
    name: '大厂运营',
    company: '某大厂',
    icon: '📈',
    unlockAt: 2,
    salary: 8000,
    baseStats: { health: 75, stress: 70, mood: 55, fatigue: 30, skill: 60, salary: 40 },
    startMoney: 300,
    description: '一天 8 小时开会，剩下 4 小时拉群。',
    eventTags: ['ops', 'boss', 'all']
  },
  {
    id: 'backend',
    name: 'IT 后端',
    company: '小而美公司',
    icon: '🖥',
    unlockAt: 2,
    salary: 12000,
    baseStats: { health: 65, stress: 60, mood: 50, fatigue: 50, skill: 80, salary: 60 },
    startMoney: 200,
    description: '改 bug 修架构跑接口，PM 永远在催。',
    eventTags: ['tech', 'pm', 'all']
  },
  {
    id: 'sales',
    name: 'SaaS 销售',
    company: '某 SaaS 厂',
    icon: '📞',
    unlockAt: 2,
    salary: 10000,
    baseStats: { health: 70, stress: 65, mood: 60, fatigue: 35, skill: 55, salary: 50 },
    startMoney: 500,
    description: '提成是命，客户是爹，业绩永远不达标。',
    eventTags: ['sales', 'client', 'all']
  },
  {
    id: 'design',
    name: '乙方设计',
    company: '某乙方设计公司',
    icon: '🎨',
    unlockAt: 3,
    salary: 5000,
    baseStats: { health: 80, stress: 50, mood: 70, fatigue: 30, skill: 70, salary: 25 },
    startMoney: 150,
    description: '改稿改一百版，client 最后说"用第一版"。',
    eventTags: ['design', 'client', 'all']
  },
  {
    id: 'team_lead',
    name: '小组长',
    company: '小而美公司',
    icon: '👔',
    unlockAt: 4,
    salary: 15000,
    baseStats: { health: 60, stress: 85, mood: 40, fatigue: 55, skill: 65, salary: 75 },
    startMoney: 400,
    description: '上司全甩烂货给你，下属不服管也干不好，烂货自己消化。',
    eventTags: ['boss', 'team', 'all'],
    special: 'team_lead'
  },
  {
    id: 'hr',
    name: 'HR',
    company: '某互联网公司',
    icon: '📋',
    unlockAt: 5,
    salary: 7000,
    baseStats: { health: 75, stress: 60, mood: 55, fatigue: 35, skill: 50, salary: 35 },
    startMoney: 250,
    description: '今天发裁员名单，下周可能轮到自己。',
    eventTags: ['hr', 'layoff', 'all'],
    special: 'hr_self_optimize'
  }
];

window.isJobUnlocked = function(jobId, totalLives) {
  const job = window.JOBS.find(j => j.id === jobId);
  if (!job) return false;
  return totalLives >= job.unlockAt - 1;
};
