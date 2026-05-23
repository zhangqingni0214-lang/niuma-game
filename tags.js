// Tag 字典 - 取代正则匹配，给事件 / 选项打元数据
//
// 用法：
//   - 事件级 tag 描述"场景类型"（这件事属于什么）
//   - 选项级 tag 描述"玩家行为"（你选了一个什么样的应对）
//   - applyEffects、trackChoice、人设标签条件统一查 tag，不再扫文本

window.EVENT_TAGS = {
  // 场景类别
  meeting:   '会议 / 评审 / 述职',
  tech:      '技术 / 代码 / 加班修 bug',
  pm:        'PM 提需求 / 改需求',
  boss:      '老板对话 / 画饼 / 谈心',
  hr:        'HR 约谈 / 培训 / 招聘',
  client:    '客户对接（与字段 client:true 配套）',
  team:      '同事互动 / 团建 / 政治',
  commute:   '通勤 / 早高峰 / 晚归',
  leisure:   '摸鱼 / 茶水间 / 午休',
  overtime:  '加班 / 通宵',
  health:    '体检 / 医院 / 心理',
  side:      '副业（与 pool:"side_hustle" 配套）',
  life:      '都市生活 / 房租 / 相亲',
  holiday:   '节假日 / 春节 / 圣诞',
  zeitgeist: '时代议题 / AI / 35 岁 / 灵活就业',
  finance:   '金钱事件 / 工资 / 年终奖',
  team_lead: '小组长场景',
};

window.CHOICE_TAGS = {
  // 玩家行为
  snark:        '怼回去（与 choice.snark=true 同义，保留两者）',
  submissive:   '忍气吞声 / 跟着说',
  fishing:      '摸鱼 / 装作 / 关电脑',
  coffee:       '喝咖啡 / 提神',
  overtime:     '加班 / 通宵 / 硬扛',
  social:       '社交 / 团建参与 / 打成一片',
  refuse:       '拒绝 / 走人 / 不参加',
  flatter:      '拍马屁 / 配合演出',
  kpi_grind:    '认真干活 / 啃需求',
  duck_debug:   '技术解法（橡皮鸭风格）',
  politics:     '站队 / 甩锅 / 借势',
  pie_back:     '反向画饼 / 抠老板话',
  shop:         '消费 / 购物 / 充值',
  rest:         '休息 / 看病 / 早睡',
  side_work:    '副业行动',
};
