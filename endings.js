// 结局定义 - performance 已统一改名为 salary（工资水平 0-100）
// 每天结束按 priority 倒序检查，第一个命中的就是结局。

window.ENDINGS = [
  {
    id: 'overwork_death',
    name: '过劳猝死',
    summary: '体检报告里那行红字应验了。同事在你工位上点了一支烟，HR 在群里发了"沉痛悼念"，又撤回。',
    priority: 100,
    condition: (s, ctx) => s.fatigue >= 100 && s.health <= 25
  },
  {
    id: 'mental_collapse',
    name: '精神崩溃裸辞',
    summary: '你把工牌摔在 HR 桌上，走出大楼时阳光很刺眼。你哭了，但不知道为什么。三天后你接到老板电话，他说"再考虑一下"。',
    priority: 90,
    condition: (s, ctx) => s.stress >= 100 && s.mood <= 20
  },
  {
    id: 'fired_with_honor',
    name: '被开除·但走得有尊严',
    summary: 'HR 拿着解约书，你拿着两个月工资截图、加班记录、和老板朋友圈那个意味深长的赞。你笑着签字，临走前把工位上的小绿植带走了，顺便把茶水间最后一包速溶咖啡也拿了。',
    priority: 85,
    condition: (s, ctx) => s.salary <= 15 && s.mood >= 70
  },
  {
    id: 'optimized',
    name: '被优化',
    summary: 'HR 约你"聊一聊"。一杯水还没喝完，你已经签了 N+1。出门时她还说"未来一定常联系"。这是她今年说的第 47 次这句话。',
    priority: 80,
    condition: (s, ctx) => s.salary <= 10
  },
  {
    id: 'era_abandoned',
    name: '不符合时代精神（时代弃民）',
    summary: 'AI 接管了你的活，你的工位被改成了"灵活工位"。老板在大会上说"这是组织优化"，没提你的名字。',
    priority: 70,
    condition: (s, ctx) => s.skill <= 15 && ctx.day >= 7
  },
  {
    id: 'broke',
    name: '破产滚回老家',
    summary: '房东把锁换了，你拖着行李箱去高铁站。窗外是熟悉又陌生的稻田。爸妈在群里发"回来好回来好"，你哭着回了一个笑脸。',
    priority: 60,
    condition: (s, ctx) => s.money <= -300
  },
  {
    id: 'depression',
    name: '陷入抑郁',
    summary: '你周一早上醒来，看着天花板，发现自己一动也不想动。医生建议你休息三个月。你的工位三天后换了人。',
    priority: 50,
    condition: (s, ctx) => s.mood <= 10 && ctx.day >= 5
  },
  {
    id: 'side_hustle_win',
    name: '副业反超·辞职自雇',
    summary: '副业收入连续三个月超过主业，你递了辞职信。HR 问你下一站，你说"自雇"。她沉默了。三个月后你的小红书账号 5w 粉。',
    priority: 75,
    condition: (s, ctx) => ctx.day >= 10 && s.money >= 5000
  },
  // 角色专属：小马 - 拍桌裸辞
  {
    id: 'horse_slam_quit',
    name: '拍桌裸辞·走得潇洒',
    summary: '你站起来，把工牌摔在 HR 桌上，"我自己走，N+1 我不要，我只要明天不上班。" HR 愣了两秒，"那也要交接……" 你已经下楼了。下楼的电梯里你哭了，但脸是笑的。',
    priority: 95,
    condition: (s, ctx) => ctx.character === 'horse' && (ctx.snarkCount || 0) >= 5 && s.stress >= 70 && ctx.day >= 5
  },
  // 角色专属：小牛 - 被劳损拍拍损
  {
    id: 'ox_loyal_collapsed',
    name: '老实人之死·公司发了讣告',
    summary: '你倒在工位上的时候，是周五下午五点。同事说"他刚发了周报"。HR 在群里发了"沉痛悼念"，配图是你抱着电脑的微笑工牌照。老板朋友圈转发，配文："这才是真正的奋斗者。"',
    priority: 95,
    condition: (s, ctx) => ctx.character === 'ox' && s.fatigue >= 95 && s.salary >= 50
  },
  // HR 专属：被自己优化
  {
    id: 'hr_self_optimized',
    name: '被自己优化',
    summary: '你给自己发了 N+1，自己面试自己，自己写自己的离职原因："性格与岗位不匹配。" 临走那天你给办公室所有人发了告别邮件，自动回复设为"我已不在公司，请联系新的 HR。"',
    priority: 88,
    condition: (s, ctx) => ctx.job === 'hr' && ctx.day >= 5 && s.salary <= 25
  },
  // 通关结局：第 14 天结束没死
  {
    id: 'survival',
    name: '活下来了',
    summary: '十四天过去，你还是那个你。明天还是要上班。但你已经学会了几招——保住命，怼回去，然后继续。',
    priority: 10,
    condition: (s, ctx) => ctx.day > 14
  }
];

// 人设标签
window.TAGS = [
  // 怼/阴阳系
  { id: 'snark_god', name: '怼神',
    condition: (s, h) => h.snarkCount >= 6 },
  { id: 'tough_mouth', name: '嘴硬牛马',
    condition: (s, h) => h.snarkCount >= 3 && s.mood >= 60 },
  { id: 'yin_yang_master', name: '阴阳大师',
    condition: (s, h) => h.snarkCount >= 4 && s.stress < 60 },
  { id: 'truth_teller', name: '当代魏征',
    condition: (s, h) => h.snarkCount >= 5 && s.salary < 40 },

  // 摸鱼/咖啡系
  { id: 'fishing_master', name: '摸鱼哲学家',
    condition: (s, h) => h.fishingCount >= 4 },
  { id: 'coffee_addict', name: '咖啡因等价物',
    condition: (s, h) => h.coffeeCount >= 4 },

  // 加班 / 健康系
  { id: 'overtime_eternal', name: '加班永生族',
    condition: (s, h) => h.overtimeCount >= 3 && s.fatigue >= 70 },
  { id: 'wellness_fishing', name: '养生摸鱼',
    condition: (s, h) => s.health >= 70 && h.fishingCount >= 2 },
  { id: 'old_oil', name: '老油条',
    condition: (s, h) => h.totalChoices >= 25 && s.stress < 70 },
  { id: 'social_zero', name: '社交零分',
    condition: (s, h) => h.refuseTeamBuilding === true },

  // 副业 / 政治系
  { id: 'side_hustler', name: '斜杠选手',
    condition: (s, h) => h.sideHustleCount >= 2 },
  { id: 'politician', name: '办公室王安石',
    condition: (s, h) => h.politicsCount >= 2 },

  // 状态结果
  { id: 'broke_pioneer', name: '月光先锋',
    condition: (s, h) => s.money < 50 },
  { id: 'tough_buffalo', name: '钢铁意志',
    condition: (s, h) => s.stress >= 80 && s.salary >= 70 },
  { id: 'true_xianyu', name: '真·咸鱼',
    condition: (s, h) => s.salary < 30 && s.mood >= 70 && h.snarkCount < 3 }
];
