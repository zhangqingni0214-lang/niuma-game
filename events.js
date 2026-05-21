// 事件数据 - 25 个主事件 + 5 个副业事件（要 side_hustle 技能解锁）
//
// 文风设定：嘴硬牛马第二人称，刻薄、精准、不绕弯。
//
// effects: health/stress/mood/fatigue/skill/salary/money 增减值
//   注：原 performance 字段统一改名为 salary（工资水平 0-100）
// choice.snark = true 表示算"怼"
// choice.hidden + choice.requiredSkill = id 表示是某技能解锁的紫色隐藏选项
// event.pool = 'side_hustle' 表示属于副业池，需要解锁副业启蒙才会出现

window.EVENTS = [

  // ========== 周一系列 ==========
  {
    id: 'monday_morning_meeting',
    title: '周一晨会',
    timeSlot: 0,
    text: '九点的会议室，空调还没暖起来。老板讲了四十分钟"为什么我们要再次出发"，PPT 上一张图叫做"远方"。你的咖啡凉了。这场会已经是今年第三次"再次出发"，前两次的目的地至今没人提起。',
    choices: [
      {
        text: '举手："去年的「再次出发」到底出发去哪了？方便贴一下定位，我们感动一下。"',
        snark: true,
        effects: { mood: +14, stress: -3, salary: -10 },
        result: '老板停顿了五秒，说"问得好"，然后接着讲他的远方。HR 把你的发言记进了会议纪要。'
      },
      {
        text: '在笔记本上画一个棺材，外加一行小字"团魂安息"',
        effects: { mood: +6, stress: -2, salary: -3 },
        result: '旁边同事偷偷拍了张照片，发到部门群外的小群。你成了今日 meme。'
      },
      {
        text: '同步在脑子里写辞职信，第三版了',
        effects: { mood: +6, stress: -1, salary: -4 },
        result: '腹稿写到结尾你发现自己已经骂了三页，但落款写的是"敬上"。'
      },
      {
        text: '【厚脸皮】直接打断："您每年都让我们再次出发，能不能告诉我们上一次到底有没有到达？"',
        hidden: true, requiredSkill: 'thick_skin', snark: true,
        effects: { mood: +18, stress: -5, salary: -6 },
        result: '会议室一片寂静。老板僵笑："你今天怎么了？" 你回："还没醒。"'
      }
    ]
  },

  {
    id: 'pm_simple_feature',
    title: '这个功能应该很简单吧',
    timeSlot: 1,
    text: '产品经理在需求评审会上说："这个功能不复杂，我看网上有人用 AI 十分钟就写出来了，咱们排两天够了吧？"他说的是一个用户行为分析看板，包含实时数据聚合、多维度筛选和可视化图表。你看了一眼需求文档——三行字，没有数据源说明，没有性能要求，没有异常处理。',
    choices: [
      {
        text: '"您看的那个 AI 十分钟版本，是不是连 hello world 都没跑通就发的截图？"',
        snark: true,
        effects: { mood: +14, stress: -2, salary: -10, skill: +2 },
        result: 'PM 笑了一下，"开个玩笑"。开玩笑的是排期。'
      },
      {
        text: '当场打开飞书把所有技术风险一条条列出来',
        effects: { stress: +5, skill: +5, salary: +2, mood: -2 },
        result: '你写了二十分钟。他点头："嗯嗯有道理。" 最后排期还是两天。'
      },
      {
        text: '"行，两天交付。但您先在文档里签个字：数据不全、性能炸了都不算 bug。"',
        snark: true,
        effects: { mood: +10, stress: +3, salary: -3 },
        result: '他没签。但你心里清楚他不敢再压你工时。'
      },
      {
        text: '【橡皮鸭】当场把需求拆成 7 个子任务表，每个挂上具体卡点和工时，让 PM 自己挑',
        hidden: true, requiredSkill: 'rubber_duck',
        effects: { stress: +2, skill: +8, salary: +6, mood: +5 },
        result: 'PM 翻到第三页就放弃了，"那就排五天吧"。会议室里有个实习生在偷偷给你比拇指。'
      }
    ]
  },

  {
    id: 'urgent_friday',
    title: '周五五点半',
    timeSlot: 1,
    text: '你已经收好电脑，水杯洗好，外套搭在椅背上。微信弹出："在吗？有个紧急需求，明早 demo。"对方是隔壁部门的总监，你跟他一共说过三句话。',
    choices: [
      {
        text: '"在的——下班了，周一九点开工。"',
        snark: true,
        effects: { mood: +15, stress: -8, salary: -10 },
        result: '他十分钟后回了一个"……好的"。周一你看到他绕路避开咖啡机。'
      },
      {
        text: '"今晚有事，明早处理。"',
        effects: { stress: +5, fatigue: +5, mood: -2, salary: -3 },
        result: '他回了一个"哦"。这个"哦"让你周末没睡好。'
      },
      {
        text: '"可以，加班费走您部门预算。"',
        snark: true,
        effects: { mood: +10, stress: +2, money: +50, salary: -3 },
        result: '他说"我跟你老板说说"。然后就没下文了。你乐了，提包走人。'
      },
      {
        text: '【职场政治学】把消息原文转发给自己直属老板："这是 X 总让我加班，请您确认优先级。"',
        hidden: true, requiredSkill: 'office_politics',
        effects: { mood: +12, stress: -3, salary: +5 },
        result: '你老板秒回："今天就到这吧，下周一处理。" 他在你部门群里立威，你下班吃了顿好的。'
      }
    ]
  },

  // ========== 通勤系列 ==========
  {
    id: 'subway_jam',
    title: '地铁早高峰',
    timeSlot: 0,
    text: '地铁里挤得像被人按进真空袋的衣服。你的脸贴在一个陌生男人的西装后背上，闻到一股淡淡的洗衣液和汗水。广播提醒前方还有四站。',
    choices: [
      {
        text: '在备忘录里写《我对资本主义早高峰的十二条意见》',
        snark: true,
        effects: { mood: +10, fatigue: +2 },
        result: '写到第七条你就到站了，但你保留了草稿。'
      },
      {
        text: '戴上耳机，听一期讲"如何把工作做成兴趣"的播客',
        effects: { mood: -2, fatigue: +2, skill: +1 },
        result: '关掉了。"把工作做成兴趣"这句话像是在说"把毒药做成饮料"。'
      },
      {
        text: '盯着车窗里自己的倒影，研究黑眼圈和宇航员梦想哪个更远',
        effects: { mood: -3, stress: -2 }
      }
    ]
  },

  {
    id: 'ai_replacement_post',
    title: '被融了',
    timeSlot: 2,
    text: '下班地铁，刷到一个帖子，标题《公司让我用 AI 重写自己的岗位说明书，写完之后我发现这个岗位不需要我了》。帖子很短，语气很平静。最后一句："我亲手证明了自己可以被替代。绩效评分：优秀。"地铁晃了一下。',
    choices: [
      {
        text: '评论："那让 AI 替您去拿那份优秀的奖金。"',
        snark: true,
        effects: { mood: +10, stress: -3 },
        result: '点赞数蹭蹭涨。一小时后你的评论被折叠了。'
      },
      {
        text: '点开公司岗位说明书，研究怎么把自己写得不可替代',
        effects: { stress: +5, skill: +4, mood: -3 },
        result: '写到一半你发现最不可替代的能力是"愿意周五五点半接需求"。'
      },
      {
        text: '锁屏，回家煮一锅红烧肉',
        effects: { mood: +5, stress: -3, fatigue: +2, money: -40 }
      },
      {
        text: '【副业启蒙】打开手机，今晚就注册一个小红书号',
        hidden: true, requiredSkill: 'side_hustle',
        effects: { mood: +8, stress: -5, skill: +3, money: -20 },
        result: '注册花了五分钟。账号名想了一晚。'
      }
    ]
  },

  // ========== 下午茶 / 摸鱼系列 ==========
  {
    id: 'afternoon_coffee',
    title: '下午三点',
    timeSlot: 1,
    text: '你眼皮在打架。屏幕上是一个 bug，你已经盯了二十分钟还没读懂报错。茶水间传来咖啡机的声音，像是在召唤你。',
    choices: [
      {
        text: '去续一杯美式，路过 PM 工位多停三秒',
        snark: true,
        effects: { fatigue: -8, stress: +2, health: -2, money: -10, mood: +3 },
        result: 'PM 抬头问"怎么了"，你笑笑说"没事，看看您今天忙不忙"。然后走了。'
      },
      {
        text: '趴一会儿，五分钟就好',
        effects: { fatigue: -10, mood: +3, salary: -3 },
        result: '醒来已经四点了。'
      },
      {
        text: 'Slack 里把 bug 截图发给 PM："这是您说的「简单功能」。"',
        snark: true,
        effects: { stress: -3, mood: +10, salary: -5 },
        result: 'PM 回："你怎么写的。" 你回："按需求文档写的。" 他没再回。'
      },
      {
        text: '【咖啡免疫体】连灌三杯黑咖，刷新今日记录',
        hidden: true, requiredSkill: 'coffee_immune',
        effects: { fatigue: -25, stress: -3, skill: +3, money: -30 },
        result: '心率正常，眼神锐利。你像换了一颗 CPU。'
      }
    ]
  },

  {
    id: 'fishing_caught',
    title: '老板从背后走过',
    timeSlot: 1,
    text: '你正在小红书看《35 岁失业转型做手冲咖啡半年记》，看得入神。一张刷屏图：中年男人在丽江开店，月入两万，配文"这才是生活"。你听见身后有脚步声，闻到老板的须后水。',
    choices: [
      {
        text: '直视他："您看，这就是您画的饼最终长成的样子。"',
        snark: true,
        effects: { mood: +15, stress: -5, salary: -12 },
        result: '老板顿了两秒，没说话，走了。你不知道这是赞许还是死缓。'
      },
      {
        text: 'Alt+Tab 切回 Jira，但手抖按错了快捷键，反而打开了 BOSS 直聘',
        effects: { stress: +8, mood: -3, salary: -3 },
        result: '老板看了一眼，转身走了。你猜测他在心里给你的离职日期打了草稿。'
      },
      {
        text: '"在做行业调研，研究下一代员工流失方向。"',
        snark: true,
        effects: { stress: +3, salary: -3, mood: +6 },
        result: '他凑过来看了一眼，"丽江房价多少？" 你说"比这里便宜得多"。'
      },
      {
        text: '【升职雷达】不慌不忙："老板，我在研究公司下一个增长点——比如咖啡赛道。"',
        hidden: true, requiredSkill: 'promotion_radar',
        effects: { mood: +10, salary: +8, skill: +2 },
        result: '老板眼睛亮了。"具体说说？" 一周后你被调去做"新业务调研"，没人管你写代码了。'
      }
    ]
  },

  // ========== 加班系列 ==========
  {
    id: 'late_night_dinner',
    title: '加班外卖',
    timeSlot: 2,
    text: '晚上九点，办公室还剩三个人。你打开美团，看着三十块的麻辣烫和二十二块的盖饭。屏幕角落弹出消息："今晚能上线吗？"',
    choices: [
      {
        text: '点最贵的麻辣烫，截图发部门群："加班餐，仅作存证。"',
        snark: true,
        effects: { mood: +12, money: -45, stress: -3, fatigue: -3 },
        result: '老板潜水十几分钟后回了一个"辛苦"，没有报销。'
      },
      {
        text: '点最便宜的盖饭',
        effects: { health: -2, mood: -3, money: -22, fatigue: -2 }
      },
      {
        text: '不吃了，回家煮泡面',
        effects: { health: -5, stress: +3, money: -3, fatigue: +5 }
      }
    ]
  },

  {
    id: 'overtime_to_dawn',
    title: '凌晨三点',
    timeSlot: 2,
    text: '同事都走了，窗外这座城市只剩零星几个亮窗，里面坐的人和你长得差不多。代码还差最后一个 case 没跑通。',
    choices: [
      {
        text: 'commit message 写："被 PM 的小天才需求逼死的代码"，提交',
        snark: true,
        effects: { fatigue: +18, stress: +5, salary: +5, mood: +10, health: -3 },
        result: '第二天 PM 私聊问能不能改一下。你说"我看看"。'
      },
      {
        text: '提交"暂时能跑"的代码，明天再说',
        effects: { fatigue: +8, stress: +3, skill: +1, salary: -2 },
        result: '第二天 QA 提了三个 bug。你装作没看见。'
      },
      {
        text: '关电脑发邮件抄送老板："已下班，剩余 case 明日工作时间处理。"',
        snark: true,
        effects: { fatigue: +3, stress: -3, salary: -5, mood: +12 },
        result: '抄送让你松了一口气。你睡了今年最香的一觉。'
      },
      {
        text: '【橡皮鸭】把代码读给桌上那只小黄鸭，三分钟后你发现是少了一个分号',
        hidden: true, requiredSkill: 'rubber_duck',
        effects: { fatigue: +5, skill: +8, salary: +8, mood: +6 },
        result: '小黄鸭面无表情，但你心里它已经升了 P7。'
      }
    ]
  },

  // ========== 周报 / 绩效系列 ==========
  {
    id: 'weekly_report',
    title: '周报模板',
    timeSlot: 2,
    text: '周日晚上十一点，你打开 Word，光标在白纸上闪。你想写"这周改了三个 bug"，但显然不够。你想起去年那个写得花团锦簇的同事现在已经是 leader。',
    choices: [
      {
        text: '标题："本周亮点——我和这家公司都还没倒闭。"',
        snark: true,
        effects: { mood: +15, salary: -10, stress: -3 },
        result: '老板没回。周一晨会上他看了你一眼。'
      },
      {
        text: '用 AI 扩写：把"修了三个 bug"扩成 800 字行业感悟',
        effects: { skill: +2, salary: +4, mood: -3, fatigue: +3 },
        result: '老板回："写得不错，下周分享给全组学习。" 你在桌底骂了一句。'
      },
      {
        text: '老实写干的事，加一句"如需详细，欢迎 1:1"',
        snark: true,
        effects: { mood: +5, salary: -3, stress: +2 },
        result: '老板回："写得太简短了。" 你回："那我们 1:1。" 他没再回。'
      },
      {
        text: '【厚脸皮】直接不发了，第二天解释："本周没有亮点，不浪费您时间。"',
        hidden: true, requiredSkill: 'thick_skin', snark: true,
        effects: { mood: +20, salary: -8, stress: -5 },
        result: '老板表情精彩。你升级了。'
      }
    ]
  },

  {
    id: 'kpi_review',
    title: '季度考核',
    timeSlot: 1,
    text: 'HR 群里发考核表，附件三十六页，今天下班前自评。第一题："请描述您本季度最有成就感的时刻。"你想了五分钟，最有成就感的事情是上周三晚上一口气吃了两份螺蛳粉。',
    choices: [
      {
        text: '自评写："本季度最有成就感的时刻是上厕所没人在群里 at 我。"',
        snark: true,
        effects: { mood: +15, salary: -10, stress: -3 },
        result: 'HR 私聊："这样写老板会不开心的。" 你回："那再写一版？"'
      },
      {
        text: '挑一个最大的项目，吹一点点',
        effects: { salary: +5, skill: +1, stress: +3 }
      },
      {
        text: 'ChatGPT 写得花团锦簇',
        effects: { salary: +6, skill: +2, mood: -2 },
        result: '老板批语："写得很好，但你具体做了什么？"'
      },
      {
        text: '【职场政治学】把同事小李上半年的项目写进自己的成就，引用他原话作证',
        hidden: true, requiredSkill: 'office_politics',
        effects: { mood: +5, salary: +12, stress: +6 },
        result: '小李后来知道了，但已经太晚。这个季度的优秀员工是你。'
      }
    ]
  },

  // ========== 老板 / 画饼系列 ==========
  {
    id: 'boss_painting_pie',
    title: '老板找你谈话',
    timeSlot: 1,
    text: '老板叫你进会议室"聊一聊"。坐下他先问最近怎么样，紧接着："我很看好你，明年的核心项目你挑大梁。咬咬牙坚持一下，等公司上市了，期权这块……"他没说完，意味深长地看着你。',
    choices: [
      {
        text: '"那能不能现在就签一份期权协议？签了我立刻咬牙。"',
        snark: true,
        effects: { mood: +14, stress: -2, salary: -5 },
        result: '他笑了一下，转移话题问"对未来三年怎么规划"。你心里有数了。'
      },
      {
        text: '点头"我会努力的"，回工位就开始更新简历',
        snark: true,
        effects: { stress: +3, mood: +5, salary: +1, skill: +2 },
        result: '你简历的"在职公司"那一栏写完，删掉，又写，又删。'
      },
      {
        text: '"去年画的饼我攒到现在已经能开一家全家了，今年改成签合同行不行？"',
        snark: true,
        effects: { stress: +5, salary: -8, mood: +12 },
        result: '老板说"小同志说话很有意思"。他记下了。'
      },
      {
        text: '【升职雷达】反向画饼："我看好您。明年我可以再写一封 24 小时随叫随到的承诺书。"',
        hidden: true, requiredSkill: 'promotion_radar',
        effects: { mood: +6, salary: +15, stress: +2 },
        result: '他愣了一下，然后开始夸你"会做人"。下个季度你被提名了。'
      }
    ]
  },

  {
    id: 'company_speech',
    title: '全员大会',
    timeSlot: 0,
    text: '老板讲了一小时"我们正处在一个伟大的时代"，最后说："明年我们要起飞。"会议结束时大家鼓掌。你旁边的同事偷偷在群里发："起飞——指失业。"',
    choices: [
      {
        text: '群里接："海运还是空运？如果是空运请准备氧气，公司这两年缺氧很久了。"',
        snark: true,
        effects: { mood: +14, stress: -3, salary: -5 },
        result: '群里炸了。HR 发了一个"咳咳"。聊天记录被截图扩散。'
      },
      {
        text: '回一个"哈哈哈哈哈"',
        effects: { mood: +5, stress: -3 }
      },
      {
        text: '会议笔记里认真写"明年要起飞"，旁边备注"——指人员流动"',
        snark: true,
        effects: { mood: +8, salary: -3 }
      },
      {
        text: '【社交蝴蝶】在小群里发起接龙："起飞——指__"，三分钟收集了十二个版本',
        hidden: true, requiredSkill: 'social_butterfly',
        effects: { mood: +18, stress: -5, salary: -8 },
        result: '排第一的是"起飞——指 N+1 拿到手"。截图后来挂在公司茶水间整整一周。'
      }
    ]
  },

  // ========== 同事 / 团建系列 ==========
  {
    id: 'team_building',
    title: '团建通知',
    timeSlot: 1,
    text: 'HR 群里发："本周六团建！怀柔某农家乐！徒步+晚宴+破冰游戏！"附微笑表情。备注小字："不参加请提前向直属领导报备并说明原因。"',
    choices: [
      {
        text: '回复："参加可以，建议把周末按 1.5 倍工时算。"',
        snark: true,
        effects: { mood: +12, stress: -5, salary: -5 },
        result: 'HR 没回。当晚老板私聊："周六是自愿活动。" 你说"那我自愿不去"。'
      },
      {
        text: '"家里亲戚来。"',
        effects: { mood: +8, stress: +3, salary: -5 },
        result: 'HR 回了一个"哦好的"。你不安了一整周。'
      },
      {
        text: '去，但全程黑脸不参加破冰游戏',
        snark: true,
        effects: { fatigue: +12, mood: +5, stress: +3, salary: -3 },
        result: '同事说你"今天不在状态"。你说"我每天都不在状态"。'
      },
      {
        text: '【社交蝴蝶】反建议改成读书会，主动主持，全程读《劳动法》第 36 条',
        hidden: true, requiredSkill: 'social_butterfly', snark: true,
        effects: { mood: +15, stress: -3, salary: -10 },
        result: 'HR 哽住。三天后团建被悄悄取消。同事悄悄给你转了 88 块红包。'
      }
    ]
  },

  {
    id: 'colleague_promotion',
    title: '群里发红包',
    timeSlot: 0,
    text: '部门群里弹出一个红包。点开是同事小李，备注"升职小红包"。一年前你们一起进的公司，他比你晚一个月入职。',
    choices: [
      {
        text: '抢完红包，群里发："红包能不能按晋升幅度发？这个金额薄了点。"',
        snark: true,
        effects: { mood: +10, money: +3, salary: -5 },
        result: '小李发了一个表情，没回话。三分钟后他追发了一个二十块的大红包。'
      },
      {
        text: '抢完发"恭喜恭喜"，回工位投简历',
        snark: true,
        effects: { mood: +3, money: +3, skill: +2 },
        result: '你投了三家，没接到一个面试电话。'
      },
      {
        text: '不抢，潜水',
        effects: { mood: -5, stress: +3 }
      },
      {
        text: '【社交蝴蝶】拉小李去喝下午茶，套话他怎么升的',
        hidden: true, requiredSkill: 'social_butterfly',
        effects: { mood: +5, money: -30, salary: +8, skill: +3 },
        result: '他喝多了三杯，告诉你"上半年送了三次老板下班"。你记下了。'
      }
    ]
  },

  // ========== 健康 / 身体系列 ==========
  {
    id: 'health_checkup',
    title: '体检报告',
    timeSlot: 0,
    text: '公司发的年度体检报告到了。脂肪肝（轻度）、血压偏高、颈椎反弓、视力下降。最后一行红字："建议改善生活方式。"',
    choices: [
      {
        text: '截图发部门群："建议公司改善加班制度。"',
        snark: true,
        effects: { mood: +15, stress: -3, salary: -10 },
        result: '群里有六个人秒发"+1"。HR 撤回了一次群通知。'
      },
      {
        text: '淘宝下单一个鱼油和一个枸杞',
        effects: { mood: +3, money: -88, health: +1 },
        result: '快递到了你把它放在角落，再没拆封。'
      },
      {
        text: '截图发家庭群',
        effects: { mood: -3, stress: +3 },
        result: '你妈秒回了五个 60 秒的语音。'
      },
      {
        text: '【厚脸皮】把报告甩老板邮箱，附言："请安排下季度全员复检并给一天假。"',
        hidden: true, requiredSkill: 'thick_skin', snark: true,
        effects: { mood: +18, stress: -5, salary: -12 },
        result: '一周后老板没安排复检，但安排了一次"团队心理建设"。'
      }
    ]
  },

  {
    id: 'sick_day',
    title: '感冒发烧',
    timeSlot: 0,
    text: '你 38.5 度，喉咙像被砂纸磨过。打开钉钉，看着"请假"按钮犹豫。今天有个评审会，老板说过"这个会很重要"。',
    choices: [
      {
        text: '请病假，附体温截图，"病假是法定权利"',
        snark: true,
        effects: { health: +10, fatigue: -15, salary: -5, mood: +12, money: -50 },
        result: '老板回"好好休息"。三分钟后又问"会上你那部分能不能让小王代替"。你回"小王也病了"。'
      },
      {
        text: '硬扛去开会',
        effects: { health: -10, fatigue: +15, stress: +8, salary: +5 },
        result: '你咳了一整场，第二天部门有三个人感冒。算复仇了。'
      },
      {
        text: '居家办公，开会关摄像头',
        effects: { health: -3, fatigue: +5, stress: +3, salary: +2 }
      },
      {
        text: '【职场政治学】请病假，并悄悄把今天的活推给那个总抢功劳的同事',
        hidden: true, requiredSkill: 'office_politics',
        effects: { health: +10, mood: +12, salary: +5, fatigue: -10 },
        result: '他没扛住，搞砸了。你病好后老板特意感谢你"做了正确判断"。'
      }
    ]
  },

  // ========== 通勤 / 生活系列 ==========
  {
    id: 'sunday_night',
    title: '周日晚上十点',
    timeSlot: 2,
    text: '你躺在床上，刷了两小时短视频。明天周一，你已经听见闹钟在心里响了。睁着眼盯天花板，想起上周还有两个需求没交。',
    choices: [
      {
        text: '关灯睡觉，发誓九点零一分到工位（卡点不算迟到）',
        snark: true,
        effects: { fatigue: -5, mood: +5, salary: -2, stress: -3 }
      },
      {
        text: '爬起来把代码写了，明天故意磨洋工',
        snark: true,
        effects: { fatigue: +12, salary: +3, mood: -2 }
      },
      {
        text: '再刷半小时，刷到一个"普通人怎么逆袭"',
        effects: { fatigue: +5, mood: +1, health: -2, stress: +3 }
      }
    ]
  },

  {
    id: 'rent_up',
    title: '房东微信',
    timeSlot: 2,
    text: '房东发了一段语音五十六秒。大意是"你住得不错对吧，但是物价涨了我也不容易，下个月开始每月加三百，行不行？"',
    choices: [
      {
        text: '回一段 60 秒语音："您不容易，那我容易吗？我也给您简单说一下。"',
        snark: true,
        effects: { mood: +12, stress: +5 },
        result: '房东半小时后回："那我们再聊聊。" 没涨成。这场你赢了。'
      },
      {
        text: '回"能不能少加点"',
        effects: { stress: +5, mood: -3, money: -200 },
        result: '房东想了一下，少加了一百。'
      },
      {
        text: '"那我下个月搬走，押金麻烦三天内退。"',
        snark: true,
        effects: { stress: +10, mood: +5, money: -300 },
        result: '房东拖了一周，只退了一半押金。你小红书发了帖子，他给你打电话求删。'
      },
      {
        text: '【厚脸皮】"行，我加。但我也加房客——下周开始转租给两个室友，分账给您。"',
        hidden: true, requiredSkill: 'thick_skin', snark: true,
        effects: { mood: +18, stress: -3, money: +400 },
        result: '房东沉默了三十秒，最后说"那就别加了"。你乐了一晚上。'
      }
    ]
  },

  {
    id: 'classmate_reunion',
    title: '同学群消息',
    timeSlot: 2,
    text: '高中同学群里有人发了张图：苏州河边的房产证、老婆孩子合照，配文"在上海安家了"。下面一长串"恭喜"。你点开他朋友圈，最近一条是马尔代夫。你点开自己朋友圈，最近一条是三周前转发的公司宣传。',
    choices: [
      {
        text: '群里回："恭喜，房贷利率多少？现在二套政策好像不太友好。"',
        snark: true,
        effects: { mood: +10, stress: -3 },
        result: '他没回。半小时后他撤回了那张图。'
      },
      {
        text: '关掉群，不看',
        effects: { mood: -3, stress: +2 }
      },
      {
        text: '认真打字祝贺，然后退群',
        snark: true,
        effects: { mood: +5, stress: -2 }
      }
    ]
  },

  // ========== 工资 / 钱系列 ==========
  {
    id: 'payday',
    title: '工资到账',
    timeSlot: 0,
    text: '手机震了一下。短信："您尾号 8848 的账户收入 ¥X，余额 ¥Y。"数字跟上个月一样，跟去年这个时候也一样。',
    choices: [
      {
        text: '截图发朋友圈："感谢公司持续三年帮我对抗通胀失败。"',
        snark: true,
        effects: { mood: +12, stress: -2, salary: -5 },
        result: '老板点赞了。你不知道他是没看清还是在阴你。'
      },
      {
        text: '去吃顿好的',
        effects: { mood: +12, money: -200, health: -2 }
      },
      {
        text: '还花呗，研究基金',
        effects: { mood: -3, stress: -5, money: -500 }
      }
    ]
  },

  {
    id: 'double11',
    title: '双十一',
    timeSlot: 2,
    text: '凌晨零点，购物车里躺着八件东西总价两千四。一件不买你需要意志力，一件不买你心里又痒。优惠倒计时最后一分钟。',
    choices: [
      {
        text: '全部下单，截图发朋友圈："明天起更努力打工。"',
        snark: true,
        effects: { mood: +15, money: -2400, stress: +5 },
        result: '收到货后发现有三件都不太需要。'
      },
      {
        text: '只买一件最需要的',
        effects: { mood: +5, money: -300 }
      },
      {
        text: '清空购物车',
        effects: { mood: -3, stress: -3 },
        result: '睡前你又默默把那件最需要的加回了购物车。'
      }
    ]
  },

  // ========== 离职 / 跳槽系列 ==========
  {
    id: 'job_offer',
    title: '猎头电话',
    timeSlot: 1,
    text: '陌生号码打过来，自称某猎头。"您好我是 XX 猎头，有个机会想跟您聊一下，行业头部公司，岗位比您现在高一级，薪资可以谈。"',
    choices: [
      {
        text: '"方便。先告诉我，您手上类似 case 平均涨幅多少？"',
        snark: true,
        effects: { mood: +10, stress: -3, skill: +2 },
        result: '猎头愣了一下，"通常 20%-30%"。你说"那继续聊"。'
      },
      {
        text: '"我现在挺好的，不考虑。"',
        effects: { mood: +3, stress: -3, salary: +2 }
      },
      {
        text: '"加微信发 JD，看完联系您。"',
        snark: true,
        effects: { mood: +8, stress: +2, skill: +1 },
        result: 'JD 发来你看了一眼，要求"5 年+某框架+某算法+抗压"。你已读不回。'
      },
      {
        text: '【升职雷达】把猎头微信转发给现公司老板："有人挖我，您看着办。"',
        hidden: true, requiredSkill: 'promotion_radar',
        effects: { mood: +12, salary: +20, money: +500, stress: +3 },
        result: '三天后老板找你 1:1，给你涨了 15%。Counter offer 真香。'
      }
    ]
  },

  {
    id: 'resign_thought',
    title: '裸辞的念头',
    timeSlot: 2,
    text: '你今天第八次想"老子不干了"。打开 BOSS 直聘，几个岗位要求"5 年+某框架+某算法+抗压能力强"。你叹气把 APP 卸载了。',
    choices: [
      {
        text: '备忘录里写一封《告全公司同仁书》，写完不发',
        snark: true,
        effects: { mood: +10, stress: -5, skill: +1 },
        result: '写完心情舒畅。明天还是要上班。'
      },
      {
        text: '认真改一版简历',
        effects: { skill: +3, salary: -2, stress: +2 },
        result: '改到一半你发现自己列不出三个亮点。'
      },
      {
        text: '点开余额，再忍一个月就跑',
        effects: { stress: +3, mood: -2, salary: +1 }
      },
      {
        text: '【副业启蒙】打开 B 站和小红书，研究"下班副业排行榜"',
        hidden: true, requiredSkill: 'side_hustle',
        effects: { mood: +8, stress: -3, skill: +2 },
        result: '研究到凌晨两点，你列出了七条候选。第二天上班路上你想了一路。'
      }
    ]
  },

  // ========== 奇遇 / 隐藏事件 ==========
  {
    id: 'cleaner_wisdom',
    title: '保洁阿姨',
    timeSlot: 2,
    text: '晚上十点茶水间接水，保洁阿姨在擦桌子。"小伙子，又加班啊。" 你笑了一下。她接着："我儿子跟你差不多大，他在县里超市，每天五点就下班。"',
    choices: [
      {
        text: '"阿姨，您儿子比我聪明。"',
        snark: true,
        effects: { mood: +8, fatigue: -3 },
        result: '阿姨笑了，"哪有，他就是不爱念书。" 你说"念书出来也这样。"'
      },
      {
        text: '"阿姨您几点下班？"',
        effects: { mood: +5, fatigue: -3 },
        result: '"十一点。" 你说"那您比我们还累"。她笑笑"习惯了"。'
      },
      {
        text: '"那挺好的"',
        effects: { mood: -3, stress: +2 },
        result: '她说"也不好，工资低"。你顿了顿不知道说什么。'
      }
    ]
  },

  {
    id: 'window_view',
    title: '落地窗',
    timeSlot: 1,
    text: '你站在落地窗前喝水，向下看车水马龙。一只鸽子飞过窗外，往北边去了。你忽然想起一个问题——这只鸽子也要打卡吗？',
    choices: [
      {
        text: '拍张照发朋友圈，配文："想做一只鸽子，至少它不用写周报。"',
        snark: true,
        effects: { mood: +10, salary: -3 },
        result: '老板三十秒后点了赞。你不确定他是没看清还是看清了。'
      },
      {
        text: '盯着鸽子看到看不见',
        effects: { mood: +6, fatigue: -3, salary: -3 }
      },
      {
        text: '回工位继续干活',
        effects: { mood: -2, stress: +2, salary: +2 }
      }
    ]
  },

  // ========== 副业事件池（需 side_hustle 解锁）==========
  {
    id: 'side_didi',
    title: '副业·跑滴滴',
    timeSlot: 2,
    pool: 'side_hustle',
    text: '下班后你把车开出地库，APP 上接了第一单。乘客是个穿西装的男人，全程接电话："这个 case 必须明天交！" 你瞄了一眼后视镜——和你早上骂的那个 PM 长得一模一样。',
    choices: [
      {
        text: '装作不认识，开稳一点，等他下车再开导航',
        effects: { mood: +5, money: +60, fatigue: +8 },
        result: '他全程没看你，下车给了五星好评。备注："师傅安静专业。"'
      },
      {
        text: '装作打电话，故意大声："这个 case 我两天才能交，PM 别催。"',
        snark: true,
        effects: { mood: +15, money: +60, fatigue: +8 },
        result: '后视镜里他愣了几秒，下车前盯了你一眼。第二天你又混进了人海。'
      },
      {
        text: '直接告诉他你认识他',
        effects: { mood: -3, money: +60, fatigue: +8, stress: +5 },
        result: '他下车后给你打了三星。备注："师傅话多。"'
      }
    ]
  },

  {
    id: 'side_xhs',
    title: '副业·小红书',
    timeSlot: 2,
    pool: 'side_hustle',
    text: '你的小红书号开通两周，发了五条吐槽职场的笔记，最高点赞 8。今晚你打开后台，看到一条新私信："姐妹，能不能帮我也写一篇？我老板让我离职。"',
    choices: [
      {
        text: '回复："199 一篇，付款后两天交付。"',
        snark: true,
        effects: { mood: +12, money: +199, skill: +2 },
        result: '她秒付款。你写到凌晨。这是你第一笔副业收入。'
      },
      {
        text: '免费帮她写，赚口碑',
        effects: { mood: +6, fatigue: +8, skill: +3 },
        result: '她发出后火了，三天涨粉 800。你的号没涨。'
      },
      {
        text: '不接，专心做自己内容',
        effects: { mood: +3, stress: -3 },
        result: '当晚你写了今年最好的一条笔记，第二天爆了，点赞 1.2k。'
      }
    ]
  },

  {
    id: 'side_xianyu',
    title: '副业·咸鱼出闲置',
    timeSlot: 2,
    pool: 'side_hustle',
    text: '你打开咸鱼，准备卖掉去年双十一冲动买的"职场穿搭套装"。挂出 80 块，五分钟内来了三个询价的，都问"能不能 30"。',
    choices: [
      {
        text: '回："这套上身价 480。30 您去拼夕夕。"',
        snark: true,
        effects: { mood: +10, money: +0 },
        result: '其中一个回了："好的姐我去看看。" 然后再也没回。'
      },
      {
        text: '让步，挂 50 包邮',
        effects: { mood: +3, money: +50 }
      },
      {
        text: '撤下来，自己穿',
        effects: { mood: -3, money: 0 }
      }
    ]
  },

  {
    id: 'side_writing',
    title: '副业·公众号',
    timeSlot: 2,
    pool: 'side_hustle',
    text: '你写了一篇《我用十个月怼掉了三个 PM》，发在公众号上。早上起来发现转载 200+，关注涨了 1500。一家自媒体公司私信你"约稿"。',
    choices: [
      {
        text: '回："约稿可以，按千字 500 起。预付 50%。"',
        snark: true,
        effects: { mood: +15, money: +500, skill: +3 },
        result: '对方爽快付款。你这个月副业收入超过了主业的零头。'
      },
      {
        text: '答应免费写一篇，先建立合作',
        effects: { mood: +5, fatigue: +10, skill: +4 },
        result: '稿子发出来后他们没再联系你。'
      },
      {
        text: '不回，写下一篇',
        effects: { mood: +3, fatigue: +5 }
      }
    ]
  },

  {
    id: 'side_overload',
    title: '副业·身兼二职',
    timeSlot: 2,
    pool: 'side_hustle',
    text: '副业收入超过主业三个月了。但你昨天在地铁上发了主业的群消息到副业客户对话框，今天又把客户的稿子推送到了主业群。你正在被两个工作同时挤压。',
    choices: [
      {
        text: '辞掉主业，全职做副业',
        snark: true,
        effects: { mood: +20, stress: +15, salary: -50, money: +0 },
        result: '你提交了辞职信。HR 找你谈话，问你下一站去哪。你说"自雇"。'
      },
      {
        text: '砍掉副业，专心打工',
        effects: { mood: -10, stress: -10, skill: -2, money: -200 },
        result: '账户里少了一份收入，心里多了一种不甘。'
      },
      {
        text: '硬扛，两边都做',
        effects: { fatigue: +20, mood: +5, money: +300, health: -8 },
        result: '你睡眠时间从 6 小时降到 4。但卡里数字在变大。'
      }
    ]
  },

  // ========== 新增事件（v2）：站会 / 老板深夜 / 裁员 / 周末群 / 升职 / 薪资 / 宫斗 / 站队 / 背锅 ==========
  {
    id: 'standup_blast',
    title: '日站会炸场',
    timeSlot: 0,
    jobs: ['outsource', 'big_ops', 'backend', 'design', 'team_lead'],
    text: '十点站会，规定 15 分钟。PM 已经讲到第 38 分钟，PPT 翻到第二十一页。同组同事眼神涣散，运维已经偷偷把摄像头关了。PM 转头问："你这边有问题吗？"',
    choices: [
      {
        text: '"我现在的问题就是站会变坐谈会。"',
        snark: true,
        effects: { mood: +14, stress: -3, salary: -8 },
        result: 'PM 僵笑，"那我们尽快结束。" 又讲了十分钟才散。'
      },
      {
        text: '"没问题。"——然后默默把 Slack 关了，专心摸鱼',
        effects: { mood: +5, fatigue: -3, salary: -2 }
      },
      {
        text: '"有，第 12 页那个口径对不上，咱们要不会后单独对一下？"',
        effects: { stress: +3, skill: +3, salary: +3 },
        result: '会后没人对。第二天还是同样的口径。'
      },
      {
        text: '【职场政治学】"PM，咱们要不每周轮值一个人主持，限时 15 分钟，超时谁主持谁请奶茶？"',
        hidden: true, requiredSkill: 'office_politics',
        effects: { mood: +12, salary: +5, stress: -3 },
        result: '同事在群里偷偷给你发了一个鼓掌。PM 当周请了奶茶。从此站会再没超过 20 分钟。'
      }
    ]
  },

  {
    id: 'boss_late_night',
    title: '老板深夜消息',
    timeSlot: 2,
    text: '23:47，你刚刷牙打算睡。微信弹出老板的消息："还在吗？" 配一个语音消息 47 秒。你点开预览框，标题写着"明天上班前要的资料"。',
    choices: [
      {
        text: '直接装睡，明早起床装作刚看见',
        effects: { mood: +5, stress: +5, salary: -3 },
        result: '早上你回："不好意思昨晚睡早了。" 老板没回。但今天他三次绕路经过你工位。'
      },
      {
        text: '回复："老板我已经下班了，明早 9:00 处理。"',
        snark: true,
        effects: { mood: +12, stress: -3, salary: -8 },
        result: '他过了一分钟回了一个"好"。你不知道这个好是什么意思。但你睡着了。'
      },
      {
        text: '爬起来开电脑做，凌晨 1:30 发回去',
        effects: { fatigue: +20, mood: -5, salary: +6, health: -3 },
        result: '老板第二天没提这事。你顶着黑眼圈干了一天活。'
      },
      {
        text: '【厚脸皮】回："老板，您这条信息按劳动法算加班费。我替您算好了。"',
        hidden: true, requiredSkill: 'thick_skin', snark: true,
        effects: { mood: +18, stress: -5, salary: -10 },
        result: '他没回。但第二天上班，他没再找你要资料。你成功立了一道墙。'
      }
    ]
  },

  {
    id: 'layoff_rumor',
    title: '被裁员风声',
    timeSlot: 1,
    text: '茶水间里，两个同事低声说话，看到你过来立刻闭嘴。下午部门群里 HR 发了一个"近期组织优化通知 · 内部"的群公告但秒撤回了。你在工位上看着今天的代码提交记录，突然觉得每一行都像证据。',
    choices: [
      {
        text: '直接私聊老板："听说要裁，咱们部门在不在名单上？"',
        snark: true,
        effects: { stress: +8, salary: -3, mood: +5 },
        result: '老板回："小道消息不要信。" 但他没说"不在"。'
      },
      {
        text: '默默把最近三个月的工作成果整理成离职交接文档',
        effects: { skill: +4, stress: +5, fatigue: +5 },
        result: '整理到一半你发现自己也想不起干了什么大事。'
      },
      {
        text: '在小群里发"裁就裁，N+1 拿着真香"',
        snark: true,
        effects: { mood: +12, stress: -5, salary: -5 },
        result: '截图传到了部门群。你的工位第二天被绕道走的人变多了。'
      },
      {
        text: '【升职雷达】把传言反向利用："老板，听说要优化，我可以承担更多职责。"',
        hidden: true, requiredSkill: 'promotion_radar',
        effects: { mood: +6, salary: +15, stress: +3 },
        result: '老板很意外，但他记下了你。两周后你被划进了"保留名单"。'
      }
    ]
  },

  {
    id: 'weekend_group_pull',
    title: '周末被拉群',
    timeSlot: 0,
    text: '周六早上九点，被一个陌生群拉进去："周一 demo 紧急对齐"。群里十二个人，七个领导五个执行。第一句话来自 VP："早，咱们快速对一下。" 你刚煮上一锅粥。',
    choices: [
      {
        text: '直接在群里回："周六上午，建议工作日处理。"',
        snark: true,
        effects: { mood: +15, stress: -3, salary: -10 },
        result: 'VP 没回。你老板私聊你："你能不能配合一下。" 你回："好，那今晚加班费按 2 倍算？"'
      },
      {
        text: '默默打开电脑，参与对齐',
        effects: { fatigue: +18, stress: +10, salary: +3, mood: -8 },
        result: '对到下午两点。中午粥糊了。'
      },
      {
        text: '"在的"，然后真的没参与，全程已读',
        snark: true,
        effects: { mood: +8, stress: +3, salary: -5 }
      },
      {
        text: '【厚脸皮】退群，理由："拉错人了。"',
        hidden: true, requiredSkill: 'thick_skin', snark: true,
        effects: { mood: +20, stress: -8, salary: -12 },
        result: '半小时后你被重新拉回来。你又退了。第三次他们没拉了。'
      }
    ]
  },

  {
    id: 'promotion_defense',
    title: '升职答辩',
    timeSlot: 1,
    jobs: ['big_ops', 'backend', 'design', 'team_lead'],
    text: '一年一度晋升答辩，你要做 30 分钟 PPT。评委里有你的老板，老板的老板，还有那个总在群里阴阳你绩效的隔壁部门总监。你的 PPT 还停在第 7 页"工作亮点"。',
    choices: [
      {
        text: '老老实实写做了什么',
        effects: { skill: +5, salary: +3, stress: +5 },
        result: '答辩当天评委问"还有呢？" 你说"没了"。结果出来：未通过。'
      },
      {
        text: '把整个部门的功劳混在自己条目里',
        snark: true,
        effects: { mood: +8, salary: +12, stress: +8 },
        result: '通过了。同事在群里小窗你："你这页里有我做的三个项目。" 你回："那我感谢您支持。"'
      },
      {
        text: '当场反问评委："各位认为我去年贡献多少？ 我们可以先对一下数据，再聊晋升。"',
        snark: true,
        effects: { mood: +15, salary: -8, skill: +3 },
        result: '会议室空气凝固。结果你没升职，但隔壁总监三周后离职了。'
      },
      {
        text: '【职场政治学】提前请几位评委吃饭，PPT 上每页都引用他们的发言',
        hidden: true, requiredSkill: 'office_politics',
        effects: { money: -300, salary: +18, mood: +5 },
        result: '答辩当天评委一致通过。你升了，但工资条只多了 800 块。'
      }
    ]
  },

  {
    id: 'salary_negotiation',
    title: '薪资谈判',
    timeSlot: 1,
    text: '调薪窗口期。HR 找你聊，"今年公司情况你也知道……" 你打开钉钉看了一眼，去年同期她说的是一样的话。',
    choices: [
      {
        text: '"知道，所以我整理了去年我做的项目数据，您看一下。"',
        effects: { skill: +3, salary: +8, stress: +3 },
        result: 'HR 翻了两页，"我跟老板反馈一下。" 然后一个月没了下文。'
      },
      {
        text: '"那就别调了，我直接走人。"',
        snark: true,
        effects: { mood: +12, stress: -3, salary: -5 },
        result: 'HR 愣了一下，"你别冲动。" 然后给你涨了 5%。'
      },
      {
        text: '"行，那今年也别考核我了。"',
        snark: true,
        effects: { mood: +15, stress: +3, salary: -10 },
        result: 'HR 转身就走。第二天你被叫去聊"工作态度"。'
      },
      {
        text: '【升职雷达】"已经有公司发了 offer 给我，涨幅 30%。你们能 counter 吗？"',
        hidden: true, requiredSkill: 'promotion_radar',
        effects: { mood: +10, salary: +18, money: +500, stress: +3 },
        result: '三天后 HR 回来："老板给了 25%。" 你笑了一下。第一次你赢得这么干脆。'
      }
    ]
  },

  {
    id: 'rival_promotion',
    title: '对手升职',
    timeSlot: 0,
    text: '部门公告：你的同期，绩效一直不如你的小李，升职了。理由是"展现了优秀的跨部门协作能力"。你查了一下，小李去年送了老板三次下班。',
    choices: [
      {
        text: '群里发一个"恭喜恭喜"',
        effects: { mood: -8, stress: +5 }
      },
      {
        text: '私聊老板："请教一下，我下一步怎么对齐升职标准？"',
        effects: { skill: +3, salary: +5, stress: +3 },
        result: '老板说"再历练一年"。你已经历练了三年。'
      },
      {
        text: '群里发："恭喜小李，跨部门协作能力——指给老板代驾。"',
        snark: true,
        effects: { mood: +14, salary: -10, stress: -5 },
        result: '群里 30 秒后撤回的撤回，截图传遍了公司。下周你被叫去谈话。'
      },
      {
        text: '【职场政治学】私下找小李喝下午茶，"你怎么升的，教教我"',
        hidden: true, requiredSkill: 'office_politics',
        effects: { money: -40, mood: +5, salary: +8, skill: +3 },
        result: '他喝多了两杯，说了一些你早就猜到的话。你记下了。'
      }
    ]
  },

  {
    id: 'office_palace_war',
    title: '组内宫斗',
    timeSlot: 1,
    text: '组里两位资深 — A 哥和 B 姐 — 公开撕了三周。今天 A 哥拉你去抽烟，问你"你站哪边？" B 姐三十秒后在小群里 at 你，"今晚一起吃饭？"',
    choices: [
      {
        text: '都答应，但都不去',
        snark: true,
        effects: { mood: +8, stress: +5, salary: -3 },
        result: '第二天 A 哥不理你，B 姐冷冰冰。但都没把你怎么样。'
      },
      {
        text: '"我哪边都不站，我只站工资。"',
        snark: true,
        effects: { mood: +12, stress: +3, salary: -5 },
        result: '这句话传到了老板耳朵里。老板笑了，说你"有点意思"。'
      },
      {
        text: '挑实力强的那边站',
        effects: { stress: +5, salary: +8, mood: -3 },
        result: '半年后你站的那边输了。你被牵连。'
      },
      {
        text: '【职场政治学】把两边的对话截图全部备份，先观望',
        hidden: true, requiredSkill: 'office_politics',
        effects: { mood: +5, salary: +12, skill: +3, stress: +3 },
        result: '一个月后宫斗结束，胜者私下找你："你那些截图给我看看。" 你笑笑没给。'
      }
    ]
  },

  {
    id: 'side_picking',
    title: '站队博弈',
    timeSlot: 1,
    jobs: ['team_lead', 'big_ops', 'hr', 'sales', 'design'],
    text: '老板找你 1:1。"最近高层有一些方向上的分歧，你怎么看？" 他看着你，眼神里没有答案，只有期待。',
    choices: [
      {
        text: '"我支持您的方向。"',
        effects: { salary: +8, stress: +3, mood: -3 },
        result: '老板满意。但他没告诉你他的方向到底是什么。'
      },
      {
        text: '"我看不出哪个方向有数据支撑，能不能再聊一下？"',
        snark: true,
        effects: { skill: +5, salary: -3, stress: +5 },
        result: '老板说"你想得太多"。你看着他的脸，确认他自己也想得太多。'
      },
      {
        text: '"我倾向另一个方向。"',
        snark: true,
        effects: { mood: +12, salary: -10, stress: +5 },
        result: '老板沉默了五秒，"好，我知道了。" 你知道你以后开会少了一个发言机会。'
      },
      {
        text: '【职场政治学】先问回去："您打算怎么走，我配合您。"',
        hidden: true, requiredSkill: 'office_politics',
        effects: { mood: +5, salary: +15, stress: +2 },
        result: '老板满意，但他还是没告诉你方向。你也没问。你们达成了某种默契。'
      }
    ]
  },

  {
    id: 'scapegoat',
    title: '背锅侠',
    timeSlot: 1,
    text: '项目出事了。线上 bug，影响了三万用户。复盘会上所有人都看向你，包括那位"也参与过设计"的 PM。老板说："我们不追责，但要找出问题根因。" 然后他看着你。',
    choices: [
      {
        text: '"我承担主要责任。"',
        effects: { salary: -15, stress: +10, mood: -8 },
        result: '会议结束。每个人都松了一口气，除了你。'
      },
      {
        text: '当场翻出聊天记录：PM 三周前明确说"这个不用做异常处理"',
        snark: true,
        effects: { mood: +15, salary: +5, skill: +3, stress: +8 },
        result: 'PM 脸都白了。复盘报告改了三版，最后写"流程缺陷"。但部门群从此他不太说话了。'
      },
      {
        text: '"是我的错。但我们要不要先聊一下流程？"——把问题往制度上引',
        snark: true,
        effects: { stress: +3, salary: -3, skill: +5, mood: +5 },
        result: '老板点头。复盘报告变成"流程改进方案"。锅小了一点。'
      },
      {
        text: '【职场政治学】会前先把锅分给"参与设计"的人，会上"团结一致总结教训"',
        hidden: true, requiredSkill: 'office_politics',
        effects: { mood: +8, salary: +8, stress: +3 },
        result: 'PM 当场愣住。但他没法反驳——你确实把他名字写进了"参与设计"的文档里。'
      }
    ]
  },

  // ========== 小组长专属：烂货自动累积 ==========
  {
    id: 'team_lead_garbage',
    title: '上面甩下来的活',
    timeSlot: 0,
    jobs: ['team_lead'],
    text: '老板早会上："这个事情就让你们组负责，你来牵头。" 他没说细节。你回到工位发现下属三人：一个在面试别家、一个怀孕请假、一个刚入职不会用 Git。',
    choices: [
      {
        text: '自己扛，下班再做',
        effects: { fatigue: +18, stress: +12, salary: +5, mood: -5 },
        result: '凌晨两点你提交了代码。下属三人朋友圈都在跑步、晒娃、做菜。'
      },
      {
        text: '会议室开会，把任务硬分给三个下属',
        snark: true,
        effects: { stress: +8, salary: -3, mood: +5 },
        result: '一周后任务没人做。新人交了一份 ChatGPT 写的方案。'
      },
      {
        text: '回老板："这个我们组接不了，建议老板找其他组。"',
        snark: true,
        effects: { mood: +15, salary: -12, stress: -3 },
        result: '老板没回。两周后这个项目变成了你的 KPI 失败案例。'
      },
      {
        text: '【职场政治学】拉一个跨部门"协作小组"，把锅分散到 5 个组',
        hidden: true, requiredSkill: 'office_politics',
        effects: { stress: +5, salary: +12, skill: +3 },
        result: '五个组扯了一个月，最后由"重要性下降"为由停掉了。你保住了一切。'
      }
    ]
  },

  // ========== HR 专属：被自己优化 ==========
  {
    id: 'hr_self_layoff',
    title: '名单上有自己',
    timeSlot: 0,
    jobs: ['hr'],
    text: '下周三的"优化名单"你刚整理完，准备发给老板。你顺手 Ctrl+F 搜了一下自己的工号——在名单上。你盯着屏幕，喝了一口已经凉了的咖啡。',
    choices: [
      {
        text: '把自己的名字删掉，发出去',
        snark: true,
        effects: { mood: +5, salary: +3, stress: +20 },
        result: '老板没注意。这周你又活了五天。下周新名单送来，你又在上面。'
      },
      {
        text: '直接走进老板办公室："我也在名单上，咱们聊聊？"',
        snark: true,
        effects: { mood: +15, salary: -10, stress: -5 },
        result: '老板愣了三秒。"……这是 HR 排的。" 你说"我就是 HR"。'
      },
      {
        text: '默默把自己的离职流程也走完',
        effects: { mood: -10, stress: -5, money: +2000, salary: -50 },
        result: '你给自己签了 N+1，自己面试自己，自己送自己出门。'
      },
      {
        text: '【职场政治学】把自己换成另一个"贡献度更低"的同事',
        hidden: true, requiredSkill: 'office_politics',
        effects: { mood: -3, salary: +5, stress: +12 },
        result: '名单发出去了。被换上的同事三天后离职，临走前盯着你看了很久。'
      }
    ]
  },

  // ========== 甲方挫折事件（仅外包/乙方设计可见，client: true → 负面效果 ×1.2）==========
  {
    id: 'client_midnight_revision',
    title: '甲方深夜改需求',
    timeSlot: 2,
    jobs: ['outsource', 'design'],
    client: true,
    text: '凌晨 1:17。甲方对接群弹出一条："临时想了一下，我们整体方向再调一下，明天上午要看新方案。" 配图是一张他家小孩的涂鸦——"参考一下这个的颜色感觉"。',
    choices: [
      {
        text: '"凌晨发消息建议不要打扰打工人。"',
        snark: true,
        effects: { mood: +14, stress: -3, salary: -5 },
        result: '对方过半小时回："您也是打工人吗？我以为您是接需求的。" 这句话你后来截图保存了。'
      },
      {
        text: '"收到，明早 10 点出新方案。"——爬起来熬通宵',
        effects: { fatigue: +25, stress: +15, health: -10, mood: -10 },
        result: '凌晨 4:30 你提交了。对方早上九点说"不太对，再调一下"。'
      },
      {
        text: '装睡，明早装作刚看见',
        effects: { mood: +5, stress: +8, salary: -3 },
        result: '早上你回"昨晚睡早了"。甲方在群里 at 了你老板。'
      },
      {
        text: '【厚脸皮】"加急方案另算费用，您先打款 50% 我才开工。"',
        hidden: true, requiredSkill: 'thick_skin', snark: true,
        effects: { mood: +18, stress: -3, salary: -8, money: +800 },
        result: '甲方愣了三十秒，回了一个"好"。你拿到了人生第一笔加急费。'
      }
    ]
  },

  {
    id: 'client_use_first_draft',
    title: '甲方："还是用第一版吧"',
    timeSlot: 1,
    jobs: ['outsource', 'design'],
    client: true,
    text: '你已经为这个项目改了 12 版。从字号到颜色到排版，每一版都是甲方亲口提出的修改。今天甲方在群里发："想了一下，第一版的感觉最好，咱们用第一版。" 你打开第一版的文件，时间显示是 28 天前。',
    choices: [
      {
        text: '"好的，等会儿就发原文件。"——压住怒火',
        effects: { stress: +12, mood: -15, fatigue: -5, skill: +1 },
        result: '你发了第一版。对方说"对就是这个感觉"。你删了第 2-12 版所有源文件。'
      },
      {
        text: '"那这 12 版的修改费按工时另算，发您账单。"',
        snark: true,
        effects: { mood: +15, stress: +5, salary: -10, money: +1500 },
        result: '甲方说"我们没说要改 12 版啊"。你截图甩了 47 条聊天记录在他脸上。打款到账。'
      },
      {
        text: '"那您之前提的所有修改是？"——直接掀桌',
        snark: true,
        effects: { mood: +20, stress: +10, health: -3, salary: -15 },
        result: '会议室空气凝固。甲方走了。你老板找你谈话："这个客户不能丢。" 你说"那让他爹来谈"。'
      }
    ]
  },

  {
    id: 'client_acceptance_dodge',
    title: '甲方拖着不签验收单',
    timeSlot: 0,
    jobs: ['outsource', 'design'],
    client: true,
    text: '项目交付一个月零八天。验收单发过去了三次，每次甲方回的都一样："再让团队看看，没问题就签。" 财务问你这笔款什么时候到，你不敢说。',
    choices: [
      {
        text: '私聊甲方对接人："今天能签吗？我们财务在催。"',
        effects: { stress: +10, mood: -8 },
        result: '"我尽快帮您催。" 三周后他离职了。'
      },
      {
        text: '直接发邮件抄送甲方老板 + 自家老板："请确认是否需要重新走流程。"',
        snark: true,
        effects: { mood: +14, stress: +8, salary: -10, fatigue: -3 },
        result: '甲方老板亲自回了："是我们沟通问题，今天下午就签。" 验收单当天到账。'
      },
      {
        text: '"行吧。"——等',
        effects: { stress: +15, mood: -10, fatigue: +5, health: -8 },
        result: '又拖了一个月。下个项目又来了，前面这笔款还没到。'
      },
      {
        text: '【职场政治学】把验收 SOP 公布在甲方群里，让他们的法务背锅',
        hidden: true, requiredSkill: 'office_politics',
        effects: { mood: +12, stress: -3, money: +2000 },
        result: '甲方法务三天后催着自家业务签了。你这单变现了。'
      }
    ]
  },

  {
    id: 'client_friend_says',
    title: '甲方："我朋友说能做"',
    timeSlot: 1,
    jobs: ['outsource', 'design'],
    client: true,
    text: '需求评审会。甲方坐对面，端着保温杯，慢悠悠地说："这个东西我有个朋友，他做过类似的，他说一周就能做完。" 你看了一眼需求清单——含三套设计系统 + 移动端适配 + 后端接口对接。',
    choices: [
      {
        text: '"那让您朋友做吧，我把工作日报抄送您参考。"',
        snark: true,
        effects: { mood: +16, stress: -3, salary: -12 },
        result: '甲方愣了五秒，"……开个玩笑嘛。" 然后改口"两周也行"。'
      },
      {
        text: '当场打开需求文档，逐条标技术复杂度',
        effects: { skill: +5, stress: +6, salary: +3 },
        result: '甲方翻到第三条说"你们专业的，你看着办"。后面排期由你定了。'
      },
      {
        text: '"行，一周可以，但要 50% 的预付，做不完也不退。"',
        snark: true,
        effects: { mood: +12, stress: +5, money: +2000, fatigue: +10 },
        result: '甲方愣住，最后没付预付，但答应了两周排期。这次你赢了。'
      }
    ]
  },

  {
    id: 'client_dad_suggestion',
    title: '甲方爹给的"建议"',
    timeSlot: 1,
    jobs: ['outsource', 'design'],
    client: true,
    text: '甲方对接人 30 岁。今天他爹 60 岁，戴着金链子，被请到会议室"看看孩子的项目"。爹翻着你的设计稿，操着浓重的乡音说："这字儿太小看不见。这个颜色，红一点。这个圈圈，方一点。"',
    choices: [
      {
        text: '"叔叔您说得对，回头我们改。"——回去删了所有改动',
        snark: true,
        effects: { mood: +8, stress: +5, salary: -5 },
        result: '甲方对接人下午私聊你："谢谢你忍着。我已经习惯了。" 你回："忍是我们的专业能力。"'
      },
      {
        text: '认真按爹的"建议"全改一遍',
        effects: { fatigue: +18, stress: +10, mood: -15, health: -5, skill: -2 },
        result: '改完之后，他爹下次过来又说"不如上一版"。'
      },
      {
        text: '"叔叔，您这套审美我们一般给广场舞协会用。"',
        snark: true,
        effects: { mood: +20, stress: +12, salary: -20, health: -3 },
        result: '甲方爹冷笑。甲方对接人在桌下踢你。这单丢了。'
      }
    ]
  },

  {
    id: 'client_change_after_launch',
    title: '甲方："上线了我再调一下"',
    timeSlot: 2,
    jobs: ['outsource', 'design'],
    client: true,
    text: '项目今晚 8 点正式上线。你已经收拾好东西准备走人。8:03，甲方发消息："上线挺好的。我刚想到一个小调整，麻烦今晚改一下。" 你看了一眼"小调整"清单——27 项。',
    choices: [
      {
        text: '"这些都是新需求，下周走变更流程。"',
        snark: true,
        effects: { mood: +14, stress: -3, salary: -8 },
        result: '甲方回："你们怎么这么不灵活。" 你说"流程是您去年要求加的"。'
      },
      {
        text: '咬牙改到凌晨',
        effects: { fatigue: +25, stress: +15, health: -12, mood: -12 },
        result: '凌晨 3:50 你提交了。第二天甲方说"不太对，回退到上线版"。'
      },
      {
        text: '"加急费 5000，今晚改完。"',
        snark: true,
        effects: { mood: +10, stress: +8, money: +3000, fatigue: +20 },
        result: '甲方砍到 3000。你接了。这是你这周最值的一次熬夜。'
      },
      {
        text: '【厚脸皮】关电脑，群里发一句"已下班"',
        hidden: true, requiredSkill: 'thick_skin', snark: true,
        effects: { mood: +22, stress: -5, salary: -15 },
        result: '甲方第二天找你老板。你老板私下问你"你怎么想的"。你说"想到就有钱赚才回"。'
      }
    ]
  }

];
