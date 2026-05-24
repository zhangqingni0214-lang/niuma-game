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
    tags: ['meeting', 'boss'],
    timeSlot: 0,
    text: '九点的会议室，空调还没暖起来。老板讲了四十分钟"为什么我们要再次出发"，PPT 上一张图叫做"远方"。你的咖啡凉了。这场会已经是今年第三次"再次出发"，前两次的目的地至今没人提起。',
    choices: [
      {
        text: {
          default: '举手："去年的「再次出发」到底出发去哪了？方便贴一下定位，我们感动一下。"',
          horse: '举手："去年的「再次出发」到底出发去哪了？方便贴一下定位，我们感动一下。"',
          ox: '小声举手："老板，那个……上一次的目标我们有完成么？"'
        },
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
    tags: ['pm', 'tech', 'meeting'],
    timeSlot: 1,
    text: '产品经理在需求评审会上说："这个功能不复杂，我看网上有人用 AI 十分钟就写出来了，咱们排两天够了吧？"他说的是一个用户行为分析看板，包含实时数据聚合、多维度筛选和可视化图表。你看了一眼需求文档——三行字，没有数据源说明，没有性能要求，没有异常处理。',
    choices: [
      {
        text: {
          default: '"您看的那个 AI 十分钟版本，是不是连 hello world 都没跑通就发的截图？"',
          horse: '"您看的那个 AI 十分钟版本，是不是连 hello world 都没跑通就发的截图？"',
          ox: '"那个……AI 截图不太靠谱吧？真做出来要不少时间的。"'
        },
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
        text: {
          default: '"行，两天交付。但您先在文档里签个字：数据不全、性能炸了都不算 bug。"',
          horse: '"行，两天交付。但您先在文档里签个字：数据不全、性能炸了都不算 bug。"',
          ox: '"那个……要不咱们邮件确认下范围，免得到时候说不清。"'
        },
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
    tags: ['boss', 'overtime'],
    timeSlot: 1,
    text: '你已经收好电脑，水杯洗好，外套搭在椅背上。微信弹出："在吗？有个紧急需求，明早 demo。"对方是隔壁部门的总监，你跟他一共说过三句话。',
    choices: [
      {
        text: {
          default: '"在的——下班了，周一九点开工。"',
          horse: '"在的——下班了，周一九点开工。"',
          ox: '"那个……我已经下班了，要不周一处理可以吗？"'
        },
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
        text: {
          default: '"可以，加班费走您部门预算。"',
          horse: '"可以，加班费走您部门预算。"',
          ox: '"那个……可以的，但能不能算加班费？"'
        },
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
    tags: ['commute'],
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
    tags: ['zeitgeist', 'tech'],
    timeSlot: 2,
    text: '下班地铁，刷到一个帖子，标题《公司让我用 AI 重写自己的岗位说明书，写完之后我发现这个岗位不需要我了》。帖子很短，语气很平静。最后一句："我亲手证明了自己可以被替代。绩效评分：优秀。"地铁晃了一下。',
    choices: [
      {
        text: {
          default: '评论："那让 AI 替您去拿那份优秀的奖金。"',
          horse: '评论："那让 AI 替您去拿那份优秀的奖金。"',
          ox: '评论："看完心里好难受，加油。" 发完想撤回。'
        },
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
    tags: ['leisure'],
    timeSlot: 1,
    text: '你眼皮在打架。屏幕上是一个 bug，你已经盯了二十分钟还没读懂报错。茶水间传来咖啡机的声音，像是在召唤你。',
    choices: [
      {
        text: {
          default: '去续一杯美式，路过 PM 工位多停三秒',
          horse: '去续一杯美式，路过 PM 工位多停三秒，盯着他屏幕看了两眼',
          ox: '去续一杯美式，路过 PM 工位低头快走，怕被 @ 改需求'
        },
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
        text: {
          default: 'Slack 里把 bug 截图发给 PM："这是您说的「简单功能」。"',
          horse: 'Slack 里把 bug 截图发给 PM："这是您说的「简单功能」。"',
          ox: 'Slack 里把 bug 截图发给 PM："那个……这个我可能还要再确认下需求。"'
        },
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
    tags: ['leisure', 'boss'],
    timeSlot: 1,
    text: '你正在小红书看《35 岁失业转型做手冲咖啡半年记》，看得入神。一张刷屏图：中年男人在丽江开店，月入两万，配文"这才是生活"。你听见身后有脚步声，闻到老板的须后水。',
    choices: [
      {
        text: {
          default: '直视他："您看，这就是您画的饼最终长成的样子。"',
          horse: '直视他："您看，这就是您画的饼最终长成的样子。"',
          ox: '深吸一口气："老板，我就……瞄一眼。"'
        },
        snark: true,
        effects: { mood: +15, stress: -5, salary: -12 },
        result: {
          default: '老板顿了两秒，没说话，走了。',
          horse: '老板顿了两秒，没说话，走了。你不知道这是赞许还是死缓。',
          ox: '老板没说话，但你听见他在工位上重重叹了口气。'
        }
      },
      {
        text: 'Alt+Tab 切回 Jira，但手抖按错了快捷键，反而打开了 BOSS 直聘',
        effects: { stress: +8, mood: -3, salary: -3 },
        result: '老板看了一眼，转身走了。你猜测他在心里给你的离职日期打了草稿。'
      },
      {
        text: {
          default: '"在做行业调研，研究下一代员工流失方向。"',
          horse: '"在做行业调研，研究下一代员工流失方向。"',
          ox: '"在……研究行业，给您参考。"'
        },
        snark: true,
        effects: { stress: +3, salary: -3, mood: +6 },
        result: '他凑过来看了一眼，"丽江房价多少？" 你说"比这里便宜得多"。'
      },
      // A 机制 - 小马专属：阴阳到底
      {
        text: '"老板，您要不要也看看？说不定您比我更需要。"',
        character: 'horse', snark: true, tags: ['snark', 'boss'],
        effects: { mood: +20, stress: -8, salary: -15 },
        result: '老板冷笑："巧了，我刚买了那家咖啡店的股份。" 你不知道他是不是认真的。'
      },
      // A 机制 - 小牛专属：闷头扛
      {
        text: '什么也不说，默默关掉手机屏，眼睛盯回代码',
        character: 'ox', tags: ['submissive'],
        effects: { fatigue: +5, mood: -3, salary: +3 },
        result: '老板拍了拍你的肩："专心点。" 走了。你盯着屏幕，鼻子有点酸。'
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
    tags: ['overtime'],
    timeSlot: 2,
    text: '晚上九点，办公室还剩三个人。你打开美团，看着三十块的麻辣烫和二十二块的盖饭。屏幕角落弹出消息："今晚能上线吗？"',
    choices: [
      {
        text: {
          default: '点最贵的麻辣烫，截图发部门群："加班餐，仅作存证。"',
          horse: '点最贵的麻辣烫，截图发部门群："加班餐，仅作存证。"',
          ox: '点麻辣烫加双份肉，悄悄截图存到"加班证据"相册里'
        },
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
    tags: ['overtime', 'tech'],
    timeSlot: 2,
    text: '同事都走了，窗外这座城市只剩零星几个亮窗，里面坐的人和你长得差不多。代码还差最后一个 case 没跑通。',
    choices: [
      {
        text: {
          default: 'commit message 写："被 PM 的小天才需求逼死的代码"，提交',
          horse: 'commit message 写："被 PM 的小天才需求逼死的代码"，提交',
          ox: 'commit message 写："修复 PM 提到的边界情况"，规规矩矩'
        },
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
        text: {
          default: '关电脑发邮件抄送老板："已下班，剩余 case 明日工作时间处理。"',
          horse: '关电脑发邮件抄送老板："已下班，剩余 case 明日工作时间处理。"',
          ox: '关电脑，给老板发条 wx："那个……我先回了，明早接着干。"'
        },
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
    tags: ['boss'],
    timeSlot: 2,
    text: '周日晚上十一点，你打开 Word，光标在白纸上闪。你想写"这周改了三个 bug"，但显然不够。你想起去年那个写得花团锦簇的同事现在已经是 leader。',
    choices: [
      {
        text: {
          default: '标题："本周亮点——我和这家公司都还没倒闭。"',
          horse: '标题："本周亮点——我和这家公司都还没倒闭。"',
          ox: '标题："本周工作总结——完成所有任务，下周继续加油。"（其实啥亮点都没有）'
        },
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
    tags: ['boss', 'meeting', 'hr'],
    timeSlot: 1,
    text: 'HR 群里发考核表，附件三十六页，今天下班前自评。第一题："请描述您本季度最有成就感的时刻。"你想了五分钟，最有成就感的事情是上周三晚上一口气吃了两份螺蛳粉。',
    choices: [
      {
        text: {
          default: '自评写："本季度最有成就感的时刻是上厕所没人在群里 at 我。"',
          horse: '自评写："本季度最有成就感的时刻是上厕所没人在群里 at 我。"',
          ox: '自评写："本季度按要求完成所有任务，但希望明年减少些群消息。"'
        },
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
    tags: ['boss'],
    timeSlot: 1,
    text: '老板叫你进会议室"聊一聊"。坐下他先问最近怎么样，紧接着："我很看好你，明年的核心项目你挑大梁。咬咬牙坚持一下，等公司上市了，期权这块……"他没说完，意味深长地看着你。',
    choices: [
      {
        text: {
          default: '"那能不能现在就签一份期权协议？签了我立刻咬牙。"',
          horse: '"那能不能现在就签一份期权协议？签了我立刻咬牙。"',
          ox: '"老板……能不能给我个文件？我回去研究研究。"'
        },
        snark: true,
        effects: { mood: +14, stress: -2, salary: -5 },
        result: {
          default: '他笑了一下，转移话题问"对未来三年怎么规划"。你心里有数了。',
          horse: '他笑了一下，转移话题问"对未来三年怎么规划"。你心里有数了。',
          ox: '他说"小同志要相信公司"。你点头，但心里又开始写简历。'
        }
      },
      {
        text: {
          default: '点头"我会努力的"，回工位就开始更新简历',
          horse: '点头"我会努力的"——回工位立刻打开 BOSS 直聘',
          ox: '点头"我会努力的"——回工位继续改 PPT'
        },
        // 注：这条原本是 snark: true，但行为是表面顺从+暗中行动，更像 submissive
        // 保留 snark 不变以兼容老存档统计
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
      // A 机制 - 小马专属：当场拆台
      {
        text: '"老板，明年的画饼您打算用哪种印章？我好提前准备相框。"',
        character: 'horse', snark: true, tags: ['snark', 'boss'],
        effects: { mood: +22, stress: -5, salary: -18 },
        result: '会议室空气凝固。老板挤出一个笑："小同志……幽默。" 出门后你长舒一口气。'
      },
      // A 机制 - 小牛专属：默默承下
      {
        text: '"……好的老板，我尽力。"（低头）',
        character: 'ox', tags: ['submissive'],
        effects: { fatigue: +5, mood: -8, salary: +5, health: +1 },
        result: '老板满意地拍了拍你的肩。你回工位时电脑前堆着三份没改完的需求。'
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
    tags: ['boss', 'meeting'],
    timeSlot: 0,
    text: '老板讲了一小时"我们正处在一个伟大的时代"，最后说："明年我们要起飞。"会议结束时大家鼓掌。你旁边的同事偷偷在群里发："起飞——指失业。"',
    choices: [
      {
        text: {
          default: '群里接："海运还是空运？如果是空运请准备氧气，公司这两年缺氧很久了。"',
          horse: '群里接："海运还是空运？如果是空运请准备氧气，公司这两年缺氧很久了。"',
          ox: '群里小心翼翼跟一个："飞机票贵吗？……开玩笑哈。"'
        },
        snark: true,
        effects: { mood: +14, stress: -3, salary: -5 },
        result: '群里炸了。HR 发了一个"咳咳"。聊天记录被截图扩散。'
      },
      {
        text: {
          default: '回一个"哈哈哈哈哈"',
          horse: '回一个"哈哈哈哈哈"——心里翻白眼',
          ox: '回一个"哈哈哈哈哈"——又把那条消息往上翻看了一遍'
        },
        effects: { mood: +5, stress: -3 }
      },
      {
        text: {
          default: '会议笔记里认真写"明年要起飞"，旁边备注"——指人员流动"',
          horse: '会议笔记里认真写"明年要起飞"，旁边备注"——指人员流动"',
          ox: '会议笔记里规规矩矩写"明年要起飞"，但页角画了一架坠落的纸飞机'
        },
        snark: true,
        effects: { mood: +8, salary: -3 }
      },
      // A 机制 - 小马专属：当场鼓掌过度
      {
        text: '会议结束起立鼓掌 30 秒，比所有人都久。"老板这次真的让我热泪盈眶。"',
        character: 'horse', snark: true, tags: ['snark', 'meeting', 'boss'],
        effects: { mood: +18, stress: -5, salary: -10 },
        result: '老板下台时握了你的手。HR 第二天在群里 @ 你"全员学习其饱满热情"。你不知道是不是认真的。'
      },
      // A 机制 - 小牛专属：会后留下来扫场
      {
        text: '会议结束帮 HR 搬麦克风、收椅子，老板路过你点头致意',
        character: 'ox', tags: ['flatter', 'submissive'],
        effects: { fatigue: +5, mood: +3, salary: +6, health: +1 },
        result: '老板说"小同志靠谱"。下周你被纳入"明年起飞核心团队"——多了三个项目。'
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
    tags: ['team', 'holiday'],
    timeSlot: 1,
    text: 'HR 群里发："本周六团建！怀柔某农家乐！徒步+晚宴+破冰游戏！"附微笑表情。备注小字："不参加请提前向直属领导报备并说明原因。"',
    choices: [
      {
        text: {
          default: '回复："参加可以，建议把周末按 1.5 倍工时算。"',
          horse: '回复："参加可以，建议把周末按 1.5 倍工时算。"',
          ox: '回复："那个……能不能算加班费？" 发完秒撤回。'
        },
        snark: true,
        effects: { mood: +12, stress: -5, salary: -5 },
        result: {
          default: 'HR 没回。当晚老板私聊："周六是自愿活动。" 你说"那我自愿不去"。',
          horse: 'HR 没回。当晚老板私聊："周六是自愿活动。" 你说"那我自愿不去"。',
          ox: 'HR 在群里 @ 你："收到请回复。" 你回了"收到"。'
        }
      },
      {
        text: '"家里亲戚来。"',
        effects: { mood: +8, stress: +3, salary: -5 },
        result: 'HR 回了一个"哦好的"。你不安了一整周。'
      },
      {
        text: {
          default: '去，但全程黑脸不参加破冰游戏',
          horse: '去，全程冷脸，破冰游戏轮到自己时说"我没什么好破的"',
          ox: '去，硬着头皮玩，但破冰时自我介绍只说了"大家好"就坐下'
        },
        snark: true,
        effects: { fatigue: +12, mood: +5, stress: +3, salary: -3 },
        result: {
          default: '同事说你"今天不在状态"。你说"我每天都不在状态"。',
          horse: '同事说你"今天不在状态"。你说"我每天都不在状态"。',
          ox: '回程车上你在角落睡着了，醒来发现 HR 把你拍照发了朋友圈。'
        }
      },
      // A 机制 - 小马专属：当场起义
      {
        text: '"建议改成把团建预算分了。每人 800，谁都不去。"',
        character: 'horse', snark: true, tags: ['snark', 'team'],
        effects: { mood: +20, stress: -8, salary: -12 },
        result: '群里点赞排到 40+。HR 撤回了通知。老板第二天单独叫你聊"团队凝聚力"。'
      },
      // A 机制 - 小牛专属：全程在线
      {
        text: '默默报名，全程帮 HR 拍照、搬东西、收拾垃圾',
        character: 'ox', tags: ['submissive', 'flatter'],
        effects: { fatigue: +15, mood: -3, salary: +5, health: +1 },
        result: 'HR 在群里夸你"靠谱"。下次团建你又被默认拉进了筹备组。'
      },
      {
        text: '【社交蝴蝶】反建议改成读书会，主动主持，全程读《劳动法》第 36 条',
        hidden: true, requiredSkill: 'social_butterfly', snark: true,
        effects: { mood: +15, stress: -3, salary: -10, money: +88 },
        result: 'HR 哽住。三天后团建被悄悄取消。同事悄悄给你转了 88 块红包。'
      }
    ]
  },

  {
    id: 'colleague_promotion',
    title: '群里发红包',
    tags: ['team'],
    timeSlot: 0,
    text: '部门群里弹出一个红包。点开是同事小李，备注"升职小红包"。一年前你们一起进的公司，他比你晚一个月入职。',
    choices: [
      {
        text: {
          default: '抢完红包，群里发："红包能不能按晋升幅度发？这个金额薄了点。"',
          horse: '抢完红包，群里发："红包能不能按晋升幅度发？这个金额薄了点。"',
          ox: '抢完红包，"恭喜恭喜！" 一句话发了三次，最后撤回了两次。'
        },
        snark: true,
        effects: { mood: +10, money: +3, salary: -5 },
        result: '小李发了一个表情，没回话。三分钟后他追发了一个二十块的大红包。'
      },
      {
        text: {
          default: '抢完发"恭喜恭喜"，回工位投简历',
          horse: '抢完发"恭喜恭喜"——回工位立刻打开 BOSS 直聘',
          ox: '抢完发"恭喜恭喜"——回工位默默把简历存到桌面，没投'
        },
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
    tags: ['health'],
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
    tags: ['health'],
    timeSlot: 0,
    text: '你 38.5 度，喉咙像被砂纸磨过。打开钉钉，看着"请假"按钮犹豫。今天有个评审会，老板说过"这个会很重要"。',
    choices: [
      {
        text: {
          default: '请病假，附体温截图，"病假是法定权利"',
          horse: '请病假，附体温截图，"病假是法定权利"',
          ox: '请病假，附体温截图，"那个……38.5 度，对不起。"'
        },
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
    tags: ['life'],
    timeSlot: 2,
    text: '你躺在床上，刷了两小时短视频。明天周一，你已经听见闹钟在心里响了。睁着眼盯天花板，想起上周还有两个需求没交。',
    choices: [
      {
        text: {
          default: '关灯睡觉，发誓九点零一分到工位（卡点不算迟到）',
          horse: '关灯睡觉。"卡着点到，不算迟到——这是我对公司的最后温柔。"',
          ox: '关灯睡觉。心里默念："明早 8 点 50 必须到。"'
        },
        snark: true,
        effects: { fatigue: -5, mood: +5, salary: -2, stress: -3 }
      },
      {
        text: {
          default: '爬起来把代码写了，明天故意磨洋工',
          horse: '爬起来写代码，明天到公司故意磨洋工——"今晚已经透支了，明天该公司还。"',
          ox: '爬起来写代码，"反正闲着也是闲着"——明天还要早到改 PPT。'
        },
        effects: { fatigue: +12, salary: +3, mood: -2 }
      },
      {
        text: '再刷半小时，刷到一个"普通人怎么逆袭"',
        effects: { fatigue: +5, mood: +1, health: -2, stress: +3 }
      },
      // A 机制 - 小马专属：开始报复性熬夜
      {
        text: '把闹钟关了，开始报复性熬夜——刷视频到凌晨四点',
        character: 'horse', tags: ['snark'],
        effects: { fatigue: +15, health: -5, mood: +8, salary: -3 },
        result: '凌晨四点你在 B 站发了一条弹幕："上班是不可能的。" 第二天迟到 1 小时。'
      },
      // A 机制 - 小牛专属：默默规划下一周
      {
        text: '打开笔记本，列下周 to-do 清单，列到第 17 条',
        character: 'ox', tags: ['submissive'],
        effects: { fatigue: +8, stress: +5, salary: +5, health: +1 },
        result: '列完你睡着了。第二天那张清单成了你给老板的周计划。'
      }
    ]
  },

  {
    id: 'rent_up',
    title: '房东微信',
    tags: ['life', 'finance'],
    timeSlot: 2,
    text: '房东发了一段语音五十六秒。大意是"你住得不错对吧，但是物价涨了我也不容易，下个月开始每月加三百，行不行？"',
    choices: [
      {
        text: {
          default: '回一段 60 秒语音："您不容易，那我容易吗？我也给您简单说一下。"',
          horse: '回一段 60 秒语音："您不容易，那我容易吗？我也给您简单说一下。"',
          ox: '回一段 30 秒语音："那个……我手头也紧，您看能不能再缓缓？"'
        },
        snark: true,
        effects: { mood: +12, stress: +5 },
        result: {
          default: '房东半小时后回："那我们再聊聊。" 没涨成。这场你赢了。',
          horse: '房东半小时后回："那我们再聊聊。" 没涨成。这场你赢了。',
          ox: '房东沉默了一会，回："那……先按老价格吧。下个月再说。" 你松了口气。'
        }
      },
      {
        text: '回"能不能少加点"',
        effects: { stress: +5, mood: -3, money: -200 },
        result: '房东想了一下，少加了一百。'
      },
      {
        text: {
          default: '"那我下个月搬走，押金麻烦三天内退。"',
          horse: '"那我下个月搬走，押金麻烦三天内退。"',
          ox: '"……如果您坚持涨，那我只能考虑搬家了。"'
        },
        snark: true,
        effects: { stress: +10, mood: +5, money: -300 },
        result: '房东拖了一周，只退了一半押金。你小红书发了帖子，他给你打电话求删。'
      },
      {
        text: '【厚脸皮】"行，我加。但我也加房客——下周开始转租给两个室友，分账给您。"',
        hidden: true, requiredSkill: 'thick_skin', snark: true,
        effects: { mood: +18, stress: -3, money: +400 },
        result: '房东沉默了三十秒，最后说"那就别加了"。你乐了一晚上。'
      },
      // A - 小马专属：直接拉黑
      {
        text: '不回。当晚发朋友圈："今年起，房东也要 KPI 化。" 屏蔽房东。',
        character: 'horse', snark: true, tags: ['snark'],
        effects: { mood: +20, stress: -5, money: -200 },
        result: '房东三天后打你电话："你怎么把我朋友圈屏蔽了？" 你说"误触"。'
      },
      // A - 小牛专属：硬咽下
      {
        text: '"……好的。" 转账续了一年。',
        character: 'ox', tags: ['submissive'],
        effects: { money: -3600, mood: -10, stress: +5, salary: +2, health: +1 },
        result: '房东说"你真懂事"。你晚上对着小红书的搬家攻略点了 28 个收藏。'
      }
    ]
  },

  {
    id: 'classmate_reunion',
    title: '同学群消息',
    tags: ['life'],
    timeSlot: 2,
    text: '高中同学群里有人发了张图：苏州河边的房产证、老婆孩子合照，配文"在上海安家了"。下面一长串"恭喜"。你点开他朋友圈，最近一条是马尔代夫。你点开自己朋友圈，最近一条是三周前转发的公司宣传。',
    choices: [
      {
        text: {
          default: '群里回："恭喜，房贷利率多少？现在二套政策好像不太友好。"',
          horse: '群里回："恭喜，房贷利率多少？现在二套政策好像不太友好。"',
          ox: '群里回个"恭喜"，然后小心翼翼问："首付多少呀？"'
        },
        snark: true,
        effects: { mood: +10, stress: -3 },
        result: {
          default: '他没回。半小时后他撤回了那张图。',
          horse: '他没回。半小时后他撤回了那张图。',
          ox: '他回："你也可以的，加油。" 你看完想哭。'
        }
      },
      {
        text: '关掉群，不看',
        effects: { mood: -3, stress: +2 }
      },
      {
        text: {
          default: '认真打字祝贺，然后退群',
          horse: '认真打字祝贺，然后退群。"群里没我也热闹。"',
          ox: '认真打字祝贺，发完没退群，但把消息免打扰了'
        },
        snark: true,
        effects: { mood: +5, stress: -2 }
      },
      // A 机制 - 小马专属：发起阴阳
      {
        text: '群里转发一张《上海当代社畜租房现状》：18㎡，月租 4500',
        character: 'horse', snark: true, tags: ['snark', 'social'],
        effects: { mood: +15, stress: -5 },
        result: '群里短暂沉默，然后三个人接龙发了自己的租房视频。话题被你带跑了。'
      },
      // A 机制 - 小牛专属：默默对比
      {
        text: '把图保存到收藏夹，命名为"等我赚到 100 万再看"',
        character: 'ox', tags: ['submissive'],
        effects: { mood: -5, stress: +5, fatigue: +3 },
        result: '你打开收藏夹，发现里面已经有 23 张类似的图了。'
      }
    ]
  },

  // ========== 工资 / 钱系列 ==========
  {
    id: 'payday',
    title: '工资到账',
    tags: ['finance', 'boss'],
    timeSlot: 0,
    text: '手机震了一下。短信："您尾号 8848 的账户收入 ¥X，余额 ¥Y。"数字跟上个月一样，跟去年这个时候也一样。',
    choices: [
      {
        text: {
          default: '截图发朋友圈："感谢公司持续三年帮我对抗通胀失败。"',
          horse: '截图发朋友圈："感谢公司持续三年帮我对抗通胀失败。"',
          ox: '截图发朋友圈："工资到啦，又能撑一个月～" 配三个 emoji。'
        },
        snark: true,
        effects: { mood: +12, stress: -2, salary: -5 },
        result: {
          default: '老板点赞了。你不知道他是没看清还是在阴你。',
          horse: '老板点赞了。你不知道他是没看清还是在阴你。',
          ox: '同事在评论区追加："工资能到就是赢家。" 你笑了。'
        }
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
    tags: ['holiday', 'finance'],
    timeSlot: 2,
    text: '凌晨零点，购物车里躺着八件东西总价两千四。一件不买你需要意志力，一件不买你心里又痒。优惠倒计时最后一分钟。',
    choices: [
      {
        text: '全部下单，截图发朋友圈："明天起更努力打工。"',
        // P0: 去 snark — 这是消费冲动，不是嘴硬，money:-2400 自带代价
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
    tags: ['life'],
    timeSlot: 1,
    text: '陌生号码打过来，自称某猎头。"您好我是 XX 猎头，有个机会想跟您聊一下，行业头部公司，岗位比您现在高一级，薪资可以谈。"',
    choices: [
      {
        text: {
          default: '"方便。先告诉我，您手上类似 case 平均涨幅多少？"',
          horse: '"方便。先告诉我，您手上类似 case 平均涨幅多少？"',
          ox: '"那个……您说说看，我听听。"'
        },
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
    tags: ['life'],
    timeSlot: 2,
    text: '你今天第八次想"老子不干了"。打开 BOSS 直聘，几个岗位要求"5 年+某框架+某算法+抗压能力强"。你叹气把 APP 卸载了。',
    choices: [
      {
        text: {
          default: '备忘录里写一封《告全公司同仁书》，写完不发',
          horse: '备忘录里写一封《告全公司同仁书》，写完不发——但截图给了好朋友',
          ox: '备忘录里写一封《告全公司同仁书》，写完反复读了三遍，删了'
        },
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
    tags: ['leisure', 'team'],
    timeSlot: 2,
    text: '晚上十点茶水间接水，保洁阿姨在擦桌子。"小伙子，又加班啊。" 你笑了一下。她接着："我儿子跟你差不多大，他在县里超市，每天五点就下班。"',
    choices: [
      {
        text: {
          default: '"阿姨，您儿子比我聪明。"',
          horse: '"阿姨，您儿子比我聪明。"',
          ox: '"阿姨，您儿子在县里挺好的。"'
        },
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
    tags: ['leisure'],
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
    tags: ['side'],
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
    tags: ['side'],
    timeSlot: 2,
    pool: 'side_hustle',
    text: '你的小红书号开通两周，发了五条吐槽职场的笔记，最高点赞 8。今晚你打开后台，看到一条新私信："姐妹，能不能帮我也写一篇？我老板让我离职。"',
    choices: [
      {
        text: {
          default: '回复："199 一篇，付款后两天交付。"',
          horse: '回复："199 一篇，付款后两天交付。"',
          ox: '回复："99 一篇可以吗？我帮您慢慢写。"'
        },
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
    tags: ['side'],
    timeSlot: 2,
    pool: 'side_hustle',
    text: '你打开咸鱼，准备卖掉去年双十一冲动买的"职场穿搭套装"。挂出 80 块，五分钟内来了三个询价的，都问"能不能 30"。',
    choices: [
      {
        text: {
          default: '回："这套上身价 480。30 您去拼夕夕。"',
          horse: '回："这套上身价 480。30 您去拼夕夕。"',
          ox: '回："那个……50 包邮可以吗？"'
        },
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
    tags: ['side'],
    timeSlot: 2,
    pool: 'side_hustle',
    text: '你写了一篇《我用十个月怼掉了三个 PM》，发在公众号上。早上起来发现转载 200+，关注涨了 1500。一家自媒体公司私信你"约稿"。',
    choices: [
      {
        text: {
          default: '回："约稿可以，按千字 500 起。预付 50%。"',
          horse: '回："约稿可以，按千字 500 起。预付 50%。"',
          ox: '回："那个……稿费您看着给吧？"'
        },
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
    tags: ['side', 'overtime'],
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
    tags: ['meeting', 'boss'],
    timeSlot: 0,
    jobs: ['outsource', 'big_ops', 'backend', 'design', 'team_lead'],
    text: '十点站会，规定 15 分钟。PM 已经讲到第 38 分钟，PPT 翻到第二十一页。同组同事眼神涣散，运维已经偷偷把摄像头关了。PM 转头问："你这边有问题吗？"',
    choices: [
      {
        text: {
          default: '"我现在的问题就是站会变坐谈会。"',
          horse: '"我现在的问题就是站会变坐谈会。"',
          ox: '"那个……能不能尽量控制在 15 分钟以内？"'
        },
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
    tags: ['boss', 'overtime'],
    timeSlot: 2,
    text: '23:47，你刚刷牙打算睡。微信弹出老板的消息："还在吗？" 配一个语音消息 47 秒。你点开预览框，标题写着"明天上班前要的资料"。',
    choices: [
      {
        text: '直接装睡，明早起床装作刚看见',
        effects: { mood: +5, stress: +5, salary: -3 },
        result: '早上你回："不好意思昨晚睡早了。" 老板没回。但今天他三次绕路经过你工位。'
      },
      {
        text: {
          default: '回复："老板我已经下班了，明早 9:00 处理。"',
          horse: '回复："老板我已经下班了，明早 9:00 处理。"',
          ox: '回复："老板那个……我现在准备睡了，明早第一时间处理可以吗？"'
        },
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
    tags: ['hr', 'team'],
    timeSlot: 1,
    text: '茶水间里，两个同事低声说话，看到你过来立刻闭嘴。下午部门群里 HR 发了一个"近期组织优化通知 · 内部"的群公告但秒撤回了。你在工位上看着今天的代码提交记录，突然觉得每一行都像证据。',
    choices: [
      {
        text: {
          default: '直接私聊老板："听说要裁，咱们部门在不在名单上？"',
          horse: '直接私聊老板："听说要裁，咱们部门在不在名单上？"',
          ox: '私聊老板："那个……听说有名单，我会在上面么？" 发完后悔了五分钟。'
        },
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
        text: {
          default: '在小群里发"裁就裁，N+1 拿着真香"',
          horse: '在小群里发"裁就裁，N+1 拿着真香"',
          ox: '在小群里发"哎，希望不是我吧 😅" 发完看了一晚上没人回'
        },
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
    tags: ['boss', 'overtime'],
    timeSlot: 0,
    text: '周六早上九点，被一个陌生群拉进去："周一 demo 紧急对齐"。群里十二个人，七个领导五个执行。第一句话来自 VP："早，咱们快速对一下。" 你刚煮上一锅粥。',
    choices: [
      {
        text: {
          default: '直接在群里回："周六上午，建议工作日处理。"',
          horse: '直接在群里回："周六上午，建议工作日处理。"',
          ox: '小心翼翼回："那个……今天是周六，要不咱们周一处理？"'
        },
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
    tags: ['boss', 'meeting'],
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
        text: {
          default: '把整个部门的功劳混在自己条目里',
          horse: '把整个部门的功劳混在自己条目里，写得理直气壮',
          ox: '把整个部门的功劳混在自己条目里，但写完一遍又删了一半'
        },
        snark: true,
        effects: { mood: +8, salary: +12, stress: +8 },
        result: '通过了。同事在群里小窗你："你这页里有我做的三个项目。" 你回："那我感谢您支持。"'
      },
      {
        text: {
          default: '当场反问评委："各位认为我去年贡献多少？ 我们可以先对一下数据，再聊晋升。"',
          horse: '当场反问评委："各位认为我去年贡献多少？ 我们可以先对一下数据，再聊晋升。"',
          ox: '当场小声补充："那个……我去年的数据可能没体现在 PPT 里，可以补一下吗？"'
        },
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
    tags: ['boss', 'finance'],
    timeSlot: 1,
    text: '调薪窗口期。HR 找你聊，"今年公司情况你也知道……" 你打开钉钉看了一眼，去年同期她说的是一样的话。',
    choices: [
      {
        text: '"知道，所以我整理了去年我做的项目数据，您看一下。"',
        effects: { skill: +3, salary: +8, stress: +3 },
        result: 'HR 翻了两页，"我跟老板反馈一下。" 然后一个月没了下文。'
      },
      {
        text: {
          default: '"那就别调了，我直接走人。"',
          horse: '"那就别调了，我直接走人。"',
          ox: '"那个……可不可以稍微涨一点？哪怕 3% 也行。"'
        },
        snark: true,
        effects: { mood: +12, stress: -3, salary: -5 },
        result: 'HR 愣了一下，"你别冲动。" 然后给你涨了 5%。'
      },
      {
        text: {
          default: '"行，那今年也别考核我了。"',
          horse: '"行，那今年也别考核我了。"',
          ox: '"那好吧……" 没再说话，但表情垮到地板。'
        },
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
    tags: ['team'],
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
        text: {
          default: '群里发："恭喜小李，跨部门协作能力——指给老板代驾。"',
          horse: '群里发："恭喜小李，跨部门协作能力——指给老板代驾。"',
          ox: '群里发"恭喜小李！" 心里想"我送过老板五次，怎么不算？"'
        },
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
    tags: ['team'],
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
        text: {
          default: '"我哪边都不站，我只站工资。"',
          horse: '"我哪边都不站，我只站工资。"',
          ox: '"那个……我哪边都不太想站，对不起。"'
        },
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
    tags: ['side'],
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
    tags: ['team'],
    timeSlot: 1,
    text: '项目出事了。线上 bug，影响了三万用户。复盘会上所有人都看向你，包括那位"也参与过设计"的 PM。老板说："我们不追责，但要找出问题根因。" 然后他看着你。',
    choices: [
      {
        text: '"我承担主要责任。"',
        effects: { salary: -15, stress: +10, mood: -8 },
        result: '会议结束。每个人都松了一口气，除了你。'
      },
      {
        text: {
          default: '当场翻出聊天记录：PM 三周前明确说"这个不用做异常处理"',
          horse: '当场翻出聊天记录：PM 三周前明确说"这个不用做异常处理"',
          ox: '吞了一口口水，慢慢说："那个……我这里有一份聊天记录。"'
        },
        snark: true,
        effects: { mood: +15, salary: +5, skill: +3, stress: +8 },
        result: 'PM 脸都白了。复盘报告改了三版，最后写"流程缺陷"。但部门群从此他不太说话了。'
      },
      {
        text: {
          default: '"是我的错。但我们要不要先聊一下流程？"——把问题往制度上引',
          horse: '"是我的错。但我们要不要先聊一下流程？"——把问题往制度上引',
          ox: '"是我的错……不过……能不能也看一下流程上的问题？"'
        },
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
    tags: ['team_lead', 'team'],
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
        text: {
          default: '会议室开会，把任务硬分给三个下属',
          horse: '会议室开会，把任务硬分给三个下属——"做不好别怪我没分清"',
          ox: '会议室开会，吞吞吐吐把任务分给三个下属，最后还是自己接了大半'
        },
        snark: true,
        effects: { stress: +8, salary: -3, mood: +5 },
        result: '一周后任务没人做。新人交了一份 ChatGPT 写的方案。'
      },
      {
        text: {
          default: '回老板："这个我们组接不了，建议老板找其他组。"',
          horse: '回老板："这个我们组接不了，建议老板找其他组。"',
          ox: '回老板："那个……我们组人手不够，能不能找其他组帮一下？"'
        },
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
    tags: ['hr'],
    timeSlot: 0,
    jobs: ['hr'],
    text: '下周三的"优化名单"你刚整理完，准备发给老板。你顺手 Ctrl+F 搜了一下自己的工号——在名单上。你盯着屏幕，喝了一口已经凉了的咖啡。',
    choices: [
      {
        text: {
          default: '把自己的名字删掉，发出去',
          horse: '把自己的名字删掉，发出去，顺便加了三个隔壁组的同事',
          ox: '把自己的名字删掉，发出去，发完手抖了半小时'
        },
        snark: true,
        effects: { mood: +5, salary: +3, stress: +20 },
        result: '老板没注意。这周你又活了五天。下周新名单送来，你又在上面。'
      },
      {
        text: {
          default: '直接走进老板办公室："我也在名单上，咱们聊聊？"',
          horse: '直接走进老板办公室："我也在名单上，咱们聊聊？"',
          ox: '走进老板办公室，关门："那个老板……我有事跟您商量一下。"'
        },
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
    tags: ['client'],
    timeSlot: 2,
    jobs: ['outsource', 'design'],
    client: true,
    text: '凌晨 1:17。甲方对接群弹出一条："临时想了一下，我们整体方向再调一下，明天上午要看新方案。" 配图是一张他家小孩的涂鸦——"参考一下这个的颜色感觉"。',
    choices: [
      {
        text: {
          default: '"凌晨发消息建议不要打扰打工人。"',
          horse: '"凌晨发消息建议不要打扰打工人。"',
          ox: '"那个……我先睡了，明早回您。" 发完关静音。'
        },
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
      // A - 小马专属：当场怼出格
      { text: '"那您家小孩涂鸦的费用您也得给我打过来。"',
        character: 'horse', snark: true, tags: ['snark', 'client'],
        effects: { mood: +25, stress: -10, salary: -25 },
        result: '群里安静了 20 分钟。早上甲方对接人给你老板单独打了电话。你老板说"先冷处理"。' },
      // A - 小牛专属：连夜改 3 版
      { text: '"收到。" 默默打开 Figma，凌晨改了 3 版备选。',
        character: 'ox', tags: ['submissive', 'overtime'],
        effects: { fatigue: +30, health: -8, stress: +10, salary: +12, skill: +5 },
        result: '凌晨 4 点你提交了 3 版。早上甲方说"我看看哪个我老婆喜欢"。' },
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
    tags: ['client'],
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
        text: {
          default: '"那这 12 版的修改费按工时另算，发您账单。"',
          horse: '"那这 12 版的修改费按工时另算，发您账单。"',
          ox: '"那……我能附一个工时清单吗？"（手心冒汗）'
        },
        snark: true,
        effects: { mood: +15, stress: +5, salary: -10, money: +1500 },
        result: '甲方说"我们没说要改 12 版啊"。你截图甩了 47 条聊天记录在他脸上。打款到账。'
      },
      {
        text: {
          default: '"那您之前提的所有修改是？"——直接掀桌',
          horse: '"那您之前提的所有修改是？"——直接掀桌',
          ox: '"那……请问之前的 11 版可以归档处理吗？" 手抖了一下'
        },
        snark: true,
        effects: { mood: +20, stress: +10, health: -3, salary: -15 },
        result: '会议室空气凝固。甲方走了。你老板找你谈话："这个客户不能丢。" 你说"那让他爹来谈"。'
      }
    ]
  },

  {
    id: 'client_acceptance_dodge',
    title: '甲方拖着不签验收单',
    tags: ['client'],
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
        text: {
          default: '直接发邮件抄送甲方老板 + 自家老板："请确认是否需要重新走流程。"',
          horse: '直接发邮件抄送甲方老板 + 自家老板："请确认是否需要重新走流程。"',
          ox: '小心地发邮件给对接人："那个……能不能加一下您领导，我们一起对一下？"'
        },
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
    tags: ['client'],
    timeSlot: 1,
    jobs: ['outsource', 'design'],
    client: true,
    text: '需求评审会。甲方坐对面，端着保温杯，慢悠悠地说："这个东西我有个朋友，他做过类似的，他说一周就能做完。" 你看了一眼需求清单——含三套设计系统 + 移动端适配 + 后端接口对接。',
    choices: [
      {
        text: {
          default: '"那让您朋友做吧，我把工作日报抄送您参考。"',
          horse: '"那让您朋友做吧，我把工作日报抄送您参考。"',
          ox: '"那个……您朋友具体是做什么的？方案能不能让我们参考下？"'
        },
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
    tags: ['client'],
    timeSlot: 1,
    jobs: ['outsource', 'design'],
    client: true,
    text: '甲方对接人 30 岁。今天他爹 60 岁，戴着金链子，被请到会议室"看看孩子的项目"。爹翻着你的设计稿，操着浓重的乡音说："这字儿太小看不见。这个颜色，红一点。这个圈圈，方一点。"',
    choices: [
      {
        text: {
          default: '"叔叔您说得对，回头我们改。"——回去删了所有改动',
          horse: '"叔叔您说得对，回头我们改。"——回去删了所有改动',
          ox: '"叔叔您说得对，回头我们改。"——回去真的改了一版备份'
        },
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
    tags: ['client'],
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
        hidden: true, requiredSkill: 'thick_skin', snark: true, tags: ['snark', 'refuse'],
        effects: { mood: +22, stress: -5, salary: -15 },
        result: '甲方第二天找你老板。你老板私下问你"你怎么想的"。你说"想到就有钱赚才回"。'
      }
    ]
  },

  // ==================================================================
  // ===== v0.9 新增事件包（72 条）=====
  // ==================================================================

  // ========== A. 主线职场（晨会 / 评审 / 汇报）==========
  {
    id: 'quarterly_okr',
    title: '季度 OKR 拍脑袋',
    timeSlot: 0, tags: ['meeting', 'boss'],
    text: '会议室白板上写着"主动认领"四个红字。老板环视一周："咱们 Q3 要比 Q2 高 30%，谁来扛？"沉默了 12 秒。',
    choices: [
      { text: {
          default: '"30% 是哪根手指掐出来的？数据源能不能贴一下。"',
          horse: '"30% 是哪根手指掐出来的？数据源能不能贴一下。"',
          ox: '"那个……30% 这个数据是怎么算的？我们看下基准。"'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +12, stress: -2, salary: -10 },
        result: '老板说"你这个问题很好"。然后还是 30%。' },
      { text: '低头记笔记，不接话。', tags: ['submissive', 'fishing'],
        effects: { mood: -3, stress: +5, salary: +1 },
        result: '锅落在了隔壁组。但老板看你那一眼，你懂的。' },
      { text: '主动认领，问能不能要 2 个 HC。', tags: ['kpi_grind'],
        effects: { stress: +8, salary: +8, skill: +2, mood: -2 },
        result: 'HC 没给，目标已经写进系统了。' },
      { text: '【厚脸皮】"行，但我先把上季度没完成那 30% 的复盘贴出来。"',
        hidden: true, requiredSkill: 'thick_skin', snark: true, tags: ['snark'],
        effects: { mood: +18, stress: -4, salary: -6 },
        result: '老板换话题了。会后 HR 单独问候你。' }
    ]
  },

  {
    id: 'cross_team_fight',
    title: '跨部门撕逼会',
    timeSlot: 1, tags: ['meeting', 'team'],
    text: '产品、研发、运营三方坐一张桌子上，议题写着"上线延期归属"。空气凝固。茶杯滴答两下。',
    choices: [
      { text: {
          default: '把锅原原本本甩回产品："需求文档第三版才到。"',
          horse: '把锅原原本本甩回产品："需求文档第三版才到。"',
          ox: '小声补一句："那个……需求文档其实是第三版才出来的。"'
        },
        snark: true, tags: ['snark', 'politics'],
        effects: { mood: +10, stress: +3, salary: -3 },
        result: 'PM 当场翻脸，但你那句话被会议纪要原文记下来了。' },
      { text: '装睡，喝水，不发言。', tags: ['fishing', 'submissive'],
        effects: { mood: -2, fatigue: +3, salary: -2 },
        result: '最后还是研发背锅。你也是研发。' },
      { text: '"要不大家各退一步，我来拉个时间线。"', tags: ['kpi_grind'],
        effects: { stress: +6, skill: +3, salary: +4, fatigue: +4 },
        result: '你拉完时间线发现，背锅最合理的还是你。' },
      { text: '【王安石】"这事得问 X 总，他上周说过有他兜底。"',
        hidden: true, requiredSkill: 'office_politics', tags: ['politics'],
        effects: { mood: +8, salary: +6, stress: -2 },
        result: 'X 总被点名，会议立刻进入下一项议程。你今天平安下班。' }
    ]
  },

  {
    id: 'boss_inspiration_day',
    title: '老板的灵感日',
    timeSlot: 0, tags: ['boss', 'meeting'],
    text: '周二上午 9:47，部门群弹出 1500 字语音 + 12 张潦草手绘。老板备注："我有个想法，今天要落地。"',
    choices: [
      { text: {
          default: '"上周那个「想法」还在 GitHub 仓库吃灰。"',
          horse: '"上周那个「想法」还在 GitHub 仓库吃灰。"',
          ox: '"老板……上周的想法咱们要不要先收个尾再接新的？"'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +14, stress: -2, salary: -8 },
        result: '老板回了一个"哈哈"。然后单独找你聊了 40 分钟。' },
      { text: '认真听完，问 3 个落地细节。', tags: ['kpi_grind', 'flatter'],
        effects: { stress: +5, skill: +3, salary: +5 },
        result: '他说"你最懂我"。这句话让你今天下不了班。' },
      { text: '在飞书撰写"产品调研报告"模板，逐条假装在评估。', tags: ['fishing'],
        effects: { mood: +6, fatigue: +2, salary: -1 },
        result: '你写了 6 页。老板看了第一页，说"再深入一点"。' },
      { text: '【反向画饼】"老板这个想法已经在 X 公司做过了，我帮您整理下他们的踩坑。"',
        hidden: true, requiredSkill: 'promotion_radar', tags: ['pie_back'],
        effects: { mood: +12, salary: +8, stress: -3 },
        result: '老板若有所思。这个"想法"再也没被提起。' }
    ]
  },

  {
    id: 'ppt_loop',
    title: '述职 PPT 死循环',
    timeSlot: 2, tags: ['meeting', 'overtime'],
    text: '17 版 PPT 改下来，老板说："还是第 3 版的感觉好。"你打开 v3.pptx——那是你三周前已经"按他要求改掉"的版本。',
    choices: [
      { text: {
          default: '"那我把 v3 重发您？反正一样。"',
          horse: '"那我把 v3 重发您？反正一样。"',
          ox: '"那个……我把 v3 重新整理一下发您？"'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +12, stress: -3, salary: -6 },
        result: '老板说"细节再优化下"。你直接重命名 v3 → v18 发过去了。他说"这版可以"。' },
      { text: '咬牙做 v18，融合 v3 的视觉 + v17 的数据。', tags: ['overtime', 'kpi_grind'],
        effects: { stress: +8, fatigue: +10, skill: +3, salary: +3 },
        result: 'v18 还是被打回。你已经分不清自己在改什么。' },
      { text: '直接把 v3 改个文件名提交。', tags: ['fishing'],
        effects: { mood: +10, stress: -2, fatigue: -2, salary: +1 },
        result: '老板没看出来。你笑了三秒，然后笑不出来。' }
    ]
  },

  {
    id: 'three_sixty_review',
    title: '360 互评开始了',
    timeSlot: 1, tags: ['hr', 'team'], once: true,
    text: 'HR 发来表格，让你给周围 5 个同事打分 + 写一段"成长建议"。匿名。但你知道，没有真匿名。',
    choices: [
      { text: '全打 4 分（满分 5），写"无需改进"。', tags: ['submissive', 'flatter'],
        effects: { mood: -2, stress: +3, salary: +2 },
        result: 'HR 把你的评价批改成"未提供建设性反馈"，发回重做。' },
      { text: {
          default: '一一实话实说，包括上次甩你锅的那个。',
          horse: '一一实话实说，包括上次甩你锅的那个。',
          ox: '咬咬牙——实话写了一段，但发完手抖了五分钟。'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +12, stress: +5, salary: -4 },
        result: '那位同事第二天找你"私下聊聊"。你假装没看到消息。' },
      { text: '"今天没空，明天再说。"然后再也没填。', tags: ['refuse', 'fishing'],
        effects: { mood: +5, salary: -2 },
        result: 'HR 在月报里把你列为"未配合考核"。' },
      { text: '【王安石】给所有人 5 分，但对 A 写一段含蓄的负面评价。',
        hidden: true, requiredSkill: 'office_politics', tags: ['politics'],
        effects: { mood: +8, salary: +5, stress: -2 },
        result: 'A 在三个月后被边缘化。你升了半级。' }
    ]
  },

  {
    id: 'client_blames_you_offsite',
    title: '客户复盘扯到你',
    timeSlot: 1, client: true, tags: ['client', 'meeting'],
    text: '老板转给你一段会议录音："客户那边复盘说，XX 项目效果一般，主要是执行问题。"那个项目你做了 11 个版本。',
    choices: [
      { text: {
          default: '"客户那边自己的需求换了 8 次，方便我转他们看下版本树吗？"',
          horse: '"客户那边自己的需求换了 8 次，方便我转他们看下版本树吗？"',
          ox: '"那个……我这边有版本记录，是不是可以让客户看一下需求变更？"'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +12, stress: +5, salary: -8 },
        result: '你老板沉默了。他知道你说的对。但他不会替你说。' },
      { text: '承认问题，主动写复盘 PPT。', tags: ['submissive', 'kpi_grind'],
        effects: { stress: +10, skill: +4, salary: -5, fatigue: +6 },
        result: '复盘 PPT 写了 5 页，老板让你"再深入一点"。' },
      { text: '"哦，知道了。"然后真的什么都没做。', tags: ['refuse', 'fishing'],
        effects: { mood: +5, stress: -3, salary: -2 },
        result: '老板第二天又问。你说"在改"。他说"快点"。' }
    ]
  },

  {
    id: 'boss_late_friend_circle',
    title: '老板朋友圈打卡',
    timeSlot: 2, tags: ['boss'],
    text: '23:47 你刷到老板朋友圈："凌晨的办公室，灯还亮着 ❤️"，配图是你工位的远景。下面已经有 12 个赞。你已经回家了。',
    choices: [
      { text: {
          default: '评论："那是我留的灯，今天忘关。"',
          horse: '评论："那是我留的灯，今天忘关。"',
          ox: '评论："老板辛苦啦 ❤️" 然后偷偷截图发朋友圈小号。'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +14, stress: -2, salary: -8 },
        result: '老板秒删朋友圈。第二天群里宣布"严禁加班浪费电"。' },
      { text: '点赞，截图发同事吐槽群。', tags: ['social'],
        effects: { mood: +8, stress: -1 },
        result: '群里一片"哈哈哈"。但这条截图三个月后流到了别的群。' },
      { text: '什么都不做，关手机睡觉。', tags: ['rest', 'submissive'],
        effects: { mood: -2, fatigue: -5, stress: -3 },
        result: '你睡得很好，但梦里都是老板的笑脸。' },
      { text: '【厚脸皮】发自己的朋友圈："凌晨在床上，梦也很努力。"',
        hidden: true, requiredSkill: 'thick_skin', snark: true, tags: ['snark'],
        effects: { mood: +18, stress: -5, salary: -10 },
        result: '老板没点赞。但同事们点了。这是你今年最有人缘的一天。' }
    ]
  },

  // ========== B. 通勤 ==========
  {
    id: 'shared_bike_dead',
    title: '共享单车坏了',
    timeSlot: 0, tags: ['commute'],
    text: '离地铁 800 米。第一辆扫码后死活开不了锁，第二辆轮胎没气，第三辆——还在被另一个打工人扫描。',
    choices: [
      { text: '走过去。10 分钟能到。', tags: ['kpi_grind'],
        effects: { fatigue: +5, mood: -3 },
        result: '到公司时衬衫已经湿了一片。老板抬眼看了你一秒。' },
      { text: '叫滴滴。¥18。', tags: ['shop'],
        effects: { money: -18, mood: +2 },
        result: '司机说"早高峰这价你算运气好"。你点头，但心里还是疼。' },
      { text: '在路边等下一辆。反正打卡迟到也就 5 分钟。', tags: ['fishing'],
        effects: { mood: +3, salary: -2 },
        result: '迟到了 7 分钟。HR 系统自动扣了半小时工资。' }
    ]
  },

  {
    id: 'last_subway_missed',
    title: '末班地铁过站',
    timeSlot: 2, tags: ['commute', 'overtime'],
    text: '23:14 加班完冲进地铁，4 站后你才意识到方向是反的——你睡着了。现在站台空无一人，末班车刚开走。',
    choices: [
      { text: '打车回家。¥80。', tags: ['shop'],
        effects: { money: -80, mood: -3, fatigue: +3 },
        result: '司机一路没说话，你也没说话。这种沉默你很熟悉。' },
      { text: '步行 + 共享单车拼回去。', tags: ['kpi_grind'],
        effects: { money: -8, fatigue: +12, health: -3, mood: -5 },
        result: '到家凌晨 1:40。明早 8:30 闹钟。你算了算，能睡 6 小时。' },
      { text: {
          default: '在 24 小时麦当劳过一夜。',
          horse: '在 24 小时麦当劳过一夜——"加班加到地铁没了，公司至少给个补贴吧。"',
          ox: '在 24 小时麦当劳过一夜——心里默默把 80 块的打车钱省了，安慰自己"明早能早会"。'
        },
        snark: true, tags: ['snark', 'fishing'],
        effects: { money: -25, fatigue: +15, health: -5, mood: +5 },
        result: '凌晨 3 点你给老板发了条消息："今天直接早会，我已在公司附近。" 他回了"加油"。' }
    ]
  },

  {
    id: 'rainy_day_no_car',
    title: '雨天等不到车',
    timeSlot: 0, tags: ['commute'],
    text: '暴雨。已经在路边站了 28 分钟，打车 App 显示"前面 47 人在等"，定价上浮 1.5×。',
    choices: [
      { text: '叫高级车型，溢价 ¥80 不在乎。', tags: ['shop'],
        effects: { money: -80, mood: +3, fatigue: +2 },
        result: '到公司时你想，省下来的时间值这 80 块。然后老板让你重做。' },
      { text: '硬撑到地铁，反正会迟到。', tags: ['kpi_grind'],
        effects: { health: -5, mood: -8, fatigue: +5, salary: -3 },
        result: '到公司时鞋全湿了。一上午脚冰凉。' },
      { text: '直接请病假，回家。', tags: ['refuse', 'rest'],
        effects: { mood: +12, fatigue: -8, salary: -8 },
        result: '老板问怎么不到。你说"高烧"。他说"那好好休息"，语气听不出真假。' }
    ]
  },

  {
    id: 'elevator_with_ceo',
    title: '电梯里遇到大老板',
    timeSlot: 0, tags: ['boss'], once: true,
    text: '14 层。和 CEO 共乘电梯，他主动问："最近你们组在忙什么？"——他叫不出你的名字。',
    choices: [
      { text: '一口气讲了 4 个项目，每个都带"挑战"和"机会"。', tags: ['flatter', 'kpi_grind'],
        effects: { stress: +5, salary: +6, mood: -2 },
        result: 'CEO 点头："不错。" 他到 8 楼了，他都没看你一眼。' },
      { text: '"还行，按计划推进。"', tags: ['submissive'],
        effects: { mood: -2, salary: 0 },
        result: 'CEO 说"哦"。整个电梯里只剩下楼层提示音。' },
      { text: {
          default: '"忙着活下来。"',
          horse: '"忙着活下来。"',
          ox: '"那个……还行，挺累的。"'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +15, stress: -5, salary: -5 },
        result: 'CEO 愣了一下，然后笑了："你这哥们儿挺有意思。" 他记住了你的脸——这未必是好事。' },
      { text: '【反向画饼】"我们在做 X 方向的探索，您之前提的那个思路给了很大启发。"',
        hidden: true, requiredSkill: 'promotion_radar', tags: ['pie_back', 'flatter'],
        effects: { mood: +8, salary: +12, stress: +2 },
        result: 'CEO 拍了你肩膀。三天后你被叫去汇报。' }
    ]
  },

  // ========== C. 摸鱼 / 咖啡 / 午休 ==========
  {
    id: 'tea_room_ex_colleague',
    title: '茶水间偶遇离职同事',
    timeSlot: 1, tags: ['leisure', 'team'],
    text: '上个月走的小李回来拿东西，茶水间里只剩你们两个。"还没跑啊？"他笑得意味深长。',
    choices: [
      { text: '"你那边怎么样？还招人吗？"', tags: ['social'],
        effects: { mood: +5, skill: +2 },
        result: '他眼神飘了一下："…工资涨了 20%，但你猜怎么着？也卷。"' },
      { text: '"我也想跑，缓一缓。"', tags: ['submissive'],
        effects: { mood: -3, stress: +3 },
        result: '他拍拍你："早跑早超生。" 你点头，然后回工位继续加班。' },
      { text: {
          default: '"我留下来就是为了见证 XX 公司怎么倒的。"',
          horse: '"我留下来就是为了见证 XX 公司怎么倒的。"',
          ox: '"我留下来……总要给公司一个机会吧。" 笑笑没说完。'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +12, stress: -3, salary: -3 },
        result: '他笑出声。回去后他在朋友圈发了一段意味深长的话。HR 看见了。' }
    ]
  },

  {
    id: 'fishing_caught_at_desk',
    title: '摸鱼时被叫到工位',
    timeSlot: 1, tags: ['leisure'],
    text: '你刚切到 B 站标签页，老板从你身后拍了下肩膀："你这个视频，是工作素材吗？"画面上是猫猫翻肚皮。',
    choices: [
      { text: {
          default: '"竞品调研，分析他们的内容形态。"',
          horse: '"竞品调研，分析他们的内容形态。"',
          ox: '"那个……我在看用户喜欢什么类型的内容。"'
        },
        snark: true, tags: ['snark', 'flatter'],
        effects: { mood: +10, stress: -2, salary: -5 },
        result: '老板笑了："那你写份分析报告给我。" 你写了 4 页。这次摸鱼成本是 4 小时。' },
      { text: '"我在午休…"', tags: ['submissive'],
        effects: { mood: -5, stress: +5, salary: -3 },
        result: '老板看了看表："已经 14:20 了。" 你解释了三分钟。他面无表情。' },
      { text: '迅速切回 Excel，假装一直在看数据。', tags: ['fishing'],
        effects: { mood: -2, stress: +3 },
        result: '老板没说什么就走了。但你看到他给 HR 发了消息。' },
      { text: '【厚脸皮】"工作累了看看，怎么了？"',
        hidden: true, requiredSkill: 'thick_skin', snark: true, tags: ['snark'],
        effects: { mood: +18, stress: -5, salary: -12 },
        result: '老板被你噎住了。但他记住了。下次考核你心里有数。' }
    ]
  },

  {
    id: 'nap_overslept',
    title: '午休睡过头',
    timeSlot: 1, tags: ['leisure', 'health'],
    text: '设了 13:30 的闹钟。睁眼一看，14:32。微信里 PM 发了 7 条消息，最新一条是"在吗？？？？"。',
    choices: [
      { text: '"刚开个会，看到了。"', tags: ['flatter'],
        effects: { mood: -3, stress: +5, salary: -2 },
        result: 'PM 没拆穿。但你的 OnCall 评分这周降了。' },
      { text: {
          default: '"睡着了，怎么了？"',
          horse: '"睡着了，怎么了？"',
          ox: '"对不起，刚才眯了一下。怎么了？"'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +10, stress: -2, salary: -5 },
        result: 'PM 沉默了 30 秒，发来一句"哦"。这个"哦"让你今天没好心情。' },
      { text: '直接打电话过去，假装在通勤。', tags: ['fishing'],
        effects: { mood: +3, stress: +3 },
        result: 'PM 信了。你松了口气，然后想起电话里背景安静得过分。' }
    ]
  },

  {
    id: 'coffee_machine_queue',
    title: '咖啡机坏了',
    timeSlot: 0, tags: ['leisure'],
    text: '全公司唯一的咖啡机出故障。茶水间排队 8 个人，没有一个看手机，所有人面无表情地等。',
    choices: [
      { text: '排到，慢慢冲，享受这 4 分钟。', tags: ['fishing', 'coffee'],
        effects: { mood: +8, fatigue: -5, stress: -3 },
        result: '你打了第二杯。回工位时已经 10:42。' },
      { text: '楼下便利店买美式 ¥18。', tags: ['shop', 'coffee'],
        effects: { money: -18, mood: +5, fatigue: -5 },
        result: '路上你想，公司应该承担这 ¥18。但是不会。' },
      { text: '不喝了，硬扛。', tags: ['submissive'],
        effects: { fatigue: +5, mood: -3 },
        result: '一上午你打了 4 次哈欠。会议里被点名。' }
    ]
  },

  {
    id: 'pinduoduo_slash',
    title: '拼多多砍一刀',
    timeSlot: 1, tags: ['team', 'leisure'],
    text: '同事群里弹出："帮我砍一刀！差最后 0.01 元就能领 iPhone！"已经有 8 个人点了。',
    choices: [
      { text: '点进去看了眼，发现要看 30 秒广告。退出。', tags: ['refuse'],
        effects: { mood: +3 },
        result: '同事下午私聊你："你怎么没帮我砍？" 你假装没看到。' },
      { text: '帮砍。结果发现要邀请 5 个新人才有效。', tags: ['social'],
        effects: { mood: -5, fatigue: +2 },
        result: '你被拖进一个 200 人的"砍价互助群"。今晚你的微信红点不会消失。' },
      { text: {
          default: '在群里回："这种链接不建议点，最近有诈骗变种。"',
          horse: '在群里回："这种链接不建议点，最近有诈骗变种。"',
          ox: '在群里回："那个……听说这种链接有点问题哦～" 发完小心翼翼撤回了表情。'
        },
        snark: true, tags: ['snark', 'social'],
        effects: { mood: +8, stress: -2 },
        result: '群里安静了。发链接的同事撤回了消息，5 分钟后单独找你聊天。' },
      { text: '【群聊魅影】@ 全员："建议群规：禁止砍价类链接。"',
        hidden: true, requiredSkill: 'social_butterfly', tags: ['social', 'snark'],
        effects: { mood: +12, salary: +3, stress: -3 },
        result: '群主（你老板）把这条加进了群公告。你成了"群内意见领袖"。' }
    ]
  },

  // ========== D. 加班 / 熬夜 ==========
  {
    id: 'weekend_release_night',
    title: '周末发版前夜',
    timeSlot: 2, tags: ['overtime', 'tech'],
    text: '周六 22:00，灰度环境第三次回滚。测试发来一段你看不懂的报错，外卖凉了。明早 9 点是产品发布会。',
    choices: [
      { text: '硬扛，凌晨 4 点跑通。', tags: ['overtime', 'kpi_grind'],
        effects: { fatigue: +25, health: -10, skill: +8, salary: +8 },
        result: '早上 8 点你冲进会议室，老板说"看你眼睛通红，辛苦了"。然后让你做汇报。' },
      { text: '群里说"今晚搞不完，建议延后发布"。', snark: true, tags: ['snark', 'refuse'],
        effects: { mood: +12, stress: +5, salary: -10 },
        result: '群里十几个红色感叹号。但确实延后了。周一你被叫去喝茶。' },
      { text: '把锅丢给测试："你们用例没覆盖到。"', tags: ['politics'],
        effects: { mood: +5, stress: +3, salary: -2 },
        result: '测试组长发来一长串证据。你删除了那条消息。' },
      { text: '【橡皮鸭】对着 IDE 自言自语，复述报错 → 突然发现是配置项写反了。',
        hidden: true, requiredSkill: 'rubber_duck', tags: ['duck_debug', 'tech'],
        effects: { fatigue: +10, skill: +12, salary: +10, mood: +5 },
        result: '23:40 修完。你早早睡了一觉。明天的会议你最从容。' }
    ]
  },

  {
    id: 'midnight_server_alert',
    title: '半夜服务器报警',
    timeSlot: 2, tags: ['overtime', 'tech'],
    text: '凌晨 3:17 电话响。生产环境 500 错误率飙升到 47%。运维群一片红，老板已经 @ 你三次。',
    choices: [
      { text: '从床上爬起来，电脑还没合盖。开干。', tags: ['overtime', 'kpi_grind'],
        effects: { fatigue: +20, health: -8, skill: +6, salary: +5 },
        result: '5 点恢复。早上 9 点你顶着熊猫眼汇报。老板说"下次更快一点"。' },
      { text: {
          default: '"今天不是 OnCall，请联系当班同事。"挂了。',
          horse: '"今天不是 OnCall，请联系当班同事。"挂了。',
          ox: '"那个……我今天不是 OnCall，可以联系当班的吗？" 然后挂了又内疚。'
        },
        snark: true, tags: ['snark', 'refuse'],
        effects: { mood: +15, stress: -3, salary: -12 },
        result: '老板早上发飞书："以后没有当不当班。" 你截图保存。' },
      { text: '【橡皮鸭】打开监控，5 分钟定位到一个 OOM。',
        hidden: true, requiredSkill: 'rubber_duck', tags: ['duck_debug', 'tech'],
        effects: { fatigue: +8, skill: +10, salary: +8, mood: +3 },
        result: '3:42 修完。你给自己倒了杯水，又睡了。早上来上班是英雄。' }
    ]
  },

  {
    id: 'boss_two_am',
    title: '老板凌晨发消息',
    timeSlot: 2, tags: ['boss', 'overtime'],
    text: '02:14 手机震动。老板："明早开会前我想看到一版方案，行不行？"——你已经睡着两小时。',
    choices: [
      { text: '爬起来开始写。', tags: ['overtime', 'kpi_grind'],
        effects: { fatigue: +18, health: -7, salary: +4, mood: -5 },
        result: '早上 8:55 发出去。老板回："这个方向不对。" 你的眼泪没流出来。' },
      { text: {
          default: '已读不回，继续睡。',
          horse: '已读不回，继续睡。',
          ox: '已读，但回了一句"老板我刚要睡，明早一上班就改"。然后躺着两小时没睡着。'
        },
        snark: true, tags: ['snark', 'refuse'],
        effects: { mood: +12, stress: -3, salary: -8, fatigue: -3 },
        result: '早上他没提这件事。但你知道，他记着。' },
      { text: '"早上 9 点直接讨论，我有思路。"然后睡觉。', tags: ['flatter'],
        effects: { fatigue: -2, salary: +2 },
        result: '早上 9 点你瞎说一通，老板信了。你赌赢了一次。' },
      { text: '【厚脸皮】"老板，方案的关键是您先确认一下方向。请发您的判断。"',
        hidden: true, requiredSkill: 'thick_skin', snark: true, tags: ['snark'],
        effects: { mood: +18, stress: -5, salary: -6 },
        result: '老板没回。早上他直接换了议题。你赢了。' }
    ]
  },

  {
    id: 'panda_eyes_morning',
    title: '通宵后的早会',
    timeSlot: 0, tags: ['meeting', 'overtime'],
    text: '熊猫眼 + 上衣有褶子。老板看着你："你看起来很投入啊。" 整个会议室回头看你。',
    choices: [
      { text: '"昨晚 3 点改完。" 配一个虚弱微笑。', tags: ['flatter', 'overtime'],
        effects: { mood: +3, stress: -2, salary: +5 },
        result: '老板说"年轻人就是有冲劲"。但他没让你早走。' },
      { text: {
          default: '"主要是失眠。" 语气平淡。',
          horse: '"主要是失眠。" 语气平淡。',
          ox: '"那个……昨晚没睡好。" 低头不敢看老板。'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +10, stress: -3, salary: -5 },
        result: '老板换了话题。但他记住了，"这哥们儿不够 buy-in"。' },
      { text: '装精神，全程提问。', tags: ['kpi_grind', 'flatter'],
        effects: { fatigue: +5, salary: +3, mood: -2 },
        result: '会后老板私聊你，让你"再带带新人"。你想哭。' }
    ]
  },

  {
    id: 'cold_overtime_meal',
    title: '加班餐到了',
    timeSlot: 2, tags: ['overtime'],
    text: '21:30 公司报销的麻辣烫送来——纸袋已经凉透，汤洒出来了一半。HR 群里说"加班餐统一 ¥30 标准"。',
    choices: [
      { text: '凑合吃了，继续干。', tags: ['submissive', 'overtime'],
        effects: { health: -5, fatigue: +3, salary: +2 },
        result: '半小时后你跑了三趟洗手间。但活还得干完。' },
      { text: '点了 ¥80 的人均日料外卖，自己出钱。', tags: ['shop'],
        effects: { money: -80, mood: +8, health: +2 },
        result: '你边吃边想，¥80 是公司亏欠你的，但你只能自己出。' },
      { text: {
          default: '直接走人，不吃了。',
          horse: '直接走人，不吃了。',
          ox: '把麻辣烫推到一边，硬撑着工作。等老板看不见再出门买面包。'
        },
        snark: true, tags: ['snark', 'refuse'],
        effects: { mood: +10, stress: -3, salary: -5 },
        result: '老板第二天问你昨晚走得早。你说"麻辣烫凉了"。他没听懂。' }
    ]
  },

  // ========== E. 同事 / 团建 / 政治 ==========
  {
    id: 'newbie_asking_advice',
    title: '新同事请你"喝奶茶"',
    timeSlot: 1, tags: ['team'],
    text: '实习生发来私聊："哥/姐，想跟你取取经，方便约个奶茶吗？"——他下周才入职两周。话术明显。',
    choices: [
      { text: '"行啊，下午茶时间。"', tags: ['social'],
        effects: { mood: +5, fatigue: +3 },
        result: '他问了你 5 个问题。你后来才发现都是想打听老板的喜好。' },
      { text: '"我最近比较忙，下次。"', tags: ['refuse'],
        effects: { mood: -2 },
        result: '他没再约。两个月后他升了，你没升。' },
      { text: {
          default: '"喝奶茶不必，有事直说。"',
          horse: '"喝奶茶不必，有事直说。"',
          ox: '"那个……奶茶就算了，你直接说想问什么吧？"'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +8, stress: -2 },
        result: '他被你噎住了。但他回了一句"那等我想清楚"。' },
      { text: '【群聊魅影】"我拉个群，你想问什么大家一起聊。"',
        hidden: true, requiredSkill: 'social_butterfly', tags: ['social'],
        effects: { mood: +10, salary: +4 },
        result: '群里聊得火热。实习生看你的眼神变了——你赢得了第一个"小弟"。' }
    ]
  },

  {
    id: 'colleague_owes_you_favor',
    title: '同事代你背锅',
    timeSlot: 1, tags: ['team'],
    text: '上次需求评审上的失误，A 公开认领了。今天他私聊："咱俩商量个事？"他想让你下次帮他扛一次。',
    choices: [
      { text: '"行，我记你一次。"', tags: ['social', 'politics'],
        effects: { mood: +3, stress: +5, salary: -2 },
        result: '三天后他让你接手他半个项目。你赌的是友情，他赌的是工时。' },
      { text: '"上次那个本来也不是大事，谢了。"', tags: ['refuse'],
        effects: { mood: +3, stress: +3 },
        result: '他笑了一下："明白。" 但你知道，关系凉了。' },
      { text: '【王安石】"咱俩这账先记着，下次我帮你的时候要看具体情况。"',
        hidden: true, requiredSkill: 'office_politics', tags: ['politics'],
        effects: { mood: +8, salary: +6, stress: -2 },
        result: '他点头。这种含糊的允诺是你最大的资产。' }
    ]
  },

  {
    id: 'team_building_ktv',
    title: '团建被点名表演',
    timeSlot: 2, tags: ['team', 'holiday'], once: true,
    text: 'KTV 包间，第三轮酒过后。老板举杯："咱们让 [你的名字] 来一个！"15 双眼睛看向你。',
    choices: [
      { text: '唱了一首老歌，跑调严重但激情十足。', tags: ['social'],
        effects: { mood: +5, fatigue: +5, stress: +3, salary: +3 },
        result: '老板鼓掌："性格不错！" 你不知道这是好是坏。' },
      { text: '"我五音不全，下次再来。"', tags: ['refuse'],
        effects: { mood: -3, stress: +5, salary: -3 },
        result: '场子冷了三秒。老板说"那让 X 来"。但你知道他记住了。' },
      { text: '"我可以朗诵公司价值观。"', snark: true, tags: ['snark'],
        effects: { mood: +15, stress: -3, salary: -8 },
        result: '同事笑炸了。老板僵笑。三天后你的 360 评估里有人写"团队意识有待提升"。' },
      { text: '【群聊魅影】"咱们玩个真心话大冒险吧，规则我来定。"',
        hidden: true, requiredSkill: 'social_butterfly', tags: ['social'],
        effects: { mood: +12, salary: +5 },
        result: '你成了今晚气氛组组长。老板叫你"小机灵鬼"。' }
    ]
  },

  {
    id: 'dept_red_packet_rain',
    title: '部门群红包雨',
    timeSlot: 1, tags: ['team', 'finance'], once: true,
    text: '老板在部门群发 ¥200 红包，30 人抢。你抢到 ¥0.07。',
    choices: [
      { text: '群里发"谢谢老板！手气不错！"', tags: ['flatter'],
        effects: { mood: -2, salary: +1 },
        result: '老板回了一个😄。你那 7 分钱还在那。' },
      { text: '截图发同事吐槽群："最佳手气：¥45。我：¥0.07。"', tags: ['social'],
        effects: { mood: +5 },
        result: '吐槽群里一片"哈哈哈"。你心里好受了点。' },
      { text: {
          default: '"老板，建议下次按工龄发，谢谢。"',
          horse: '"老板，建议下次按工龄发，谢谢。"',
          ox: '"老板……能不能下次发金额大点的？哈哈～" 发完想撤回。'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +12, salary: -5 },
        result: '群里安静了 4 分钟。老板没回。你在 360 评估里又得了一笔。' }
    ]
  },

  {
    id: 'office_take_sides',
    title: '同事拉你站队',
    timeSlot: 1, tags: ['team', 'politics'],
    text: '中层 A 和 B 在撕项目归属。A 私聊你："你那边的资源我能用吗？" B 也来："你别给 A，他靠不住。"',
    choices: [
      { text: '"我听老板安排。"', tags: ['submissive'],
        effects: { mood: -3, stress: +5, salary: +1 },
        result: '老板说听不下去，最后两人都觉得你"没用"。' },
      { text: '给 A，A 现在势头好。', tags: ['politics'],
        effects: { mood: +3, stress: +5, salary: +5 },
        result: 'A 赢了。但 B 现在天天给你穿小鞋。' },
      { text: {
          default: '"我俩都不掺和，资源走流程申请。"',
          horse: '"我俩都不掺和，资源走流程申请。"',
          ox: '"那个……我可能不太适合站队，资源走流程吧，对不起。"'
        },
        snark: true, tags: ['snark', 'refuse'],
        effects: { mood: +8, stress: -3, salary: -3 },
        result: 'A 和 B 都觉得你"没意思"。但你睡得着。' },
      { text: '【王安石】"我跟 A 走，但我跟 B 私下保持联络。"',
        hidden: true, requiredSkill: 'office_politics', tags: ['politics'],
        effects: { mood: +5, salary: +10, stress: +3 },
        result: 'A 赢了，B 没怪你。你成了双方都"留个余地"的人。' }
    ]
  },

  {
    id: 'ex_colleague_leak',
    title: '离职同事爆料',
    timeSlot: 2, tags: ['team'], once: true,
    text: '前同事小李在脉脉发了你公司的爆料贴，标题是"XX 公司：表面福利好，实际全是套路"。配图有你工位。',
    choices: [
      { text: {
          default: '默默截图发朋友圈，加一句"懂的都懂"。',
          horse: '默默截图发朋友圈，加一句"懂的都懂"。',
          ox: '私下转给朋友："你看这个……我们公司。" 没转朋友圈。'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +10, stress: +5, salary: -8 },
        result: 'HR 第二天找你。"你这条朋友圈，能撤一下吗？" 你撤了。' },
      { text: '在脉脉评论："理性看待，每个公司都有问题。"', tags: ['flatter'],
        effects: { mood: -3, salary: +3 },
        result: 'HR 看到后给你点了赞。你觉得脏。' },
      { text: '什么都不做，假装没看到。', tags: ['refuse'],
        effects: { mood: -2, stress: +3 },
        result: '同事群里有人转发，没人 @ 你。你也没参与。' },
      { text: '【厚脸皮】私聊小李："你这条贴可以再加几个细节，我给你。"',
        hidden: true, requiredSkill: 'thick_skin', snark: true, tags: ['snark'],
        effects: { mood: +18, stress: +8, salary: -15 },
        result: '小李说"哈哈你够狠"。两周后那条爆料涨到 50w 浏览。HR 还没找到证据。' }
    ]
  },

  // ========== F. 老板 / PM / HR ==========
  {
    id: 'pm_ninth_revision',
    title: 'PM 改第 9 版需求',
    timeSlot: 1, tags: ['pm', 'tech'],
    text: '上周评审过的方案，今天 PM 拿着新版本来了："改一改逻辑，主流程不变。"——主流程改了 60%。',
    choices: [
      { text: {
          default: '"主流程不变？那让我看看代码哪里不变。"',
          horse: '"主流程不变？那让我看看代码哪里不变。"',
          ox: '"那个……能给我标一下改动范围吗？我有点搞不清。"'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +12, stress: -2, salary: -8 },
        result: 'PM 笑了："小改动。" 你打开 git diff，整整 800 行。' },
      { text: '叹气，开始改。', tags: ['submissive', 'kpi_grind'],
        effects: { stress: +8, fatigue: +6, skill: +3, salary: +2 },
        result: '你改完了。下周他还会来。' },
      { text: {
          default: '"行，但你先在文档上签字：本次变更影响范围 = 全部。"',
          horse: '"行，但你先在文档上签字：本次变更影响范围 = 全部。"',
          ox: '"……能不能用邮件确认一下？我怕到时候说不清。"'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +10, stress: +3, salary: -3 },
        result: 'PM 没签。但他记住了——你这哥们儿不好惹。' },
      // A - 小马专属：当场关电脑
      { text: '"那我先吃个饭，回来再说。" 关电脑走人。',
        character: 'horse', snark: true, tags: ['snark', 'refuse'],
        effects: { mood: +20, stress: -8, salary: -15 },
        result: 'PM 直接 @ 老板。老板回："让他静静。" 你莫名其妙赢了一回合。' },
      // A - 小牛专属：默默加班改完
      { text: '"好的，我今晚加班改完。" 当场打开 IDE。',
        character: 'ox', tags: ['submissive', 'overtime'],
        effects: { fatigue: +15, stress: +5, salary: +8, health: +1 },
        result: '凌晨 1 点你改完了。第二天 PM 又来："还有个小调整。" 你的眼神空了一秒。' },
      { text: '【橡皮鸭】"咱们重新画一遍流程图，我有几个边界 case 想确认。"',
        hidden: true, requiredSkill: 'rubber_duck', tags: ['duck_debug', 'tech'],
        effects: { stress: +3, skill: +10, salary: +6, mood: +5 },
        result: 'PM 画到第 4 个分支放弃了："那还是按原方案。" 你赢了一周。' }
    ]
  },

  {
    id: 'hr_wants_to_chat',
    title: 'HR 找你"聊一聊"',
    timeSlot: 1, client: true, tags: ['hr'],
    text: 'HR 在飞书发："今天下午 3 点会议室一下，30 分钟。"没说原因。你脑子里过了 4 种可能性，没一个是好的。',
    choices: [
      { text: {
          default: '"什么事？方便告诉一下吗？"',
          horse: '"什么事？方便告诉一下吗？"',
          ox: '"那个……是有什么问题吗？"（手心已经湿了）'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +5, stress: +8, salary: -3 },
        result: 'HR 回："聊聊近期感受。" 你心里凉了半截。' },
      { text: '老老实实去。', tags: ['submissive'],
        effects: { stress: +12, mood: -8, fatigue: +3 },
        result: '聊了 28 分钟。她说"没事，就是了解一下"。你不信。' },
      { text: '"今天下午我有 onsite 客户拜访。"（其实没有）', tags: ['fishing'],
        effects: { stress: -3, mood: +5, salary: -2 },
        result: '改成下周。但你这一周都没睡好。' }
    ]
  },

  {
    id: 'boss_heart_to_heart',
    title: '老板找你谈心',
    timeSlot: 1, tags: ['boss'],
    text: '老板把你叫到他工位："咱俩随便聊聊。" 旁边没人。这是他第一次"随便聊聊"。',
    choices: [
      { text: '"想听您说说我哪里不够。"', tags: ['flatter', 'submissive'],
        effects: { stress: +5, salary: +5, mood: -2 },
        result: '他指出 3 点。每一点都让你想"那为什么不早说"。' },
      { text: '"我有几个想法想跟您对一下。"', tags: ['flatter', 'kpi_grind'],
        effects: { skill: +3, salary: +6, fatigue: +2 },
        result: '你说了 15 分钟。他点头。你后来发现他没听进去。' },
      { text: {
          default: '"老板，您直接说目的吧，我不擅长猜。"',
          horse: '"老板，您直接说目的吧，我不擅长猜。"',
          ox: '"老板……您是不是有什么事要让我做？"'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +12, stress: -3, salary: -8 },
        result: '他笑了："你这哥们儿有意思。" 然后没再说下去。' },
      { text: '【反向画饼】"您之前说要给我更多空间，最近 X 项目正是机会。"',
        hidden: true, requiredSkill: 'promotion_radar', tags: ['pie_back'],
        effects: { mood: +8, salary: +12 },
        result: '他想了想："那你接吧。" 你拿到了一个真项目。' }
    ]
  },

  {
    id: 'hr_weekend_training',
    title: 'HR 推荐内训课',
    timeSlot: 1, tags: ['hr'],
    text: 'HR 群发："本周末，「高效能领导力」必修课，两天，地点公司。" 你下面回了 1 个"。"。HR 单聊你："你必须来。"',
    choices: [
      { text: '"周末有事，能不能下次？"', tags: ['refuse'],
        effects: { mood: +5, salary: -5 },
        result: 'HR 回："这是公司决定。" 你最后还是去了。' },
      { text: '老老实实参加。', tags: ['submissive'],
        effects: { fatigue: +10, mood: -8, skill: +2, salary: +3 },
        result: '两天下来你学到了一句"凡事先沟通"。但你的周末没了。' },
      { text: '"行，那加班费怎么算？"', snark: true, tags: ['snark'],
        effects: { mood: +12, stress: -2, salary: -5 },
        result: 'HR 说"这是培训不是加班"。你说"那不算工时？" HR 不回了。' }
    ]
  },

  {
    id: 'boss_kid_pickup',
    title: '老板让你帮忙带娃',
    timeSlot: 2, tags: ['boss'], once: true,
    text: '老板临时有事："你下班路过 XX 小学吗？帮我接一下小孩，送到我家就行。" 你住在反方向。',
    choices: [
      { text: '"行，没问题。"', tags: ['flatter', 'submissive'],
        effects: { fatigue: +8, money: -30, mood: -8, salary: +5 },
        result: '送完到家已经 21:30。老板回了一个"辛苦了"。' },
      { text: '"今天回家有事，下次。"', tags: ['refuse'],
        effects: { mood: +5, salary: -5 },
        result: '老板说"那算了"。你猜对了——他记着这一笔。' },
      { text: {
          default: '"接娃可以，专车费用 ¥100 行不行？"',
          horse: '"接娃可以，专车费用 ¥100 行不行？"',
          ox: '"那个……可以呀。但是路费……能报销吗？"'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +15, money: +100, salary: -8 },
        result: '老板被你绕住了。给了 ¥100，但脸色不太好。' }
    ]
  },

  {
    id: 'pm_jumps_over_you',
    title: 'PM 越级派活',
    timeSlot: 0, tags: ['pm'],
    text: 'PM 直接私聊你："今天加一个紧急小需求，2 小时能做完。" 没经过你直属老板。',
    choices: [
      { text: '直接做。反正 2 小时。', tags: ['submissive', 'kpi_grind'],
        effects: { fatigue: +5, skill: +3, salary: -2 },
        result: '其实做了 4 小时。你直属老板下午才知道，给你脸色。' },
      { text: '"麻烦您先跟我老板确认下优先级。"', tags: ['politics'],
        effects: { mood: +5, salary: +5 },
        result: 'PM 没去找。需求自然消失。' },
      { text: {
          default: '"这不是绕过流程吗？"',
          horse: '"这不是绕过流程吗？"',
          ox: '"那个……我直属老板还不知道，要不先报备一下？"'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +10, salary: -3 },
        result: 'PM 不爽，但你 PM 一直不爽，反正没差。' },
      { text: '【王安石】把消息转发给老板："PM 找我说有紧急活，您看怎么处理。"',
        hidden: true, requiredSkill: 'office_politics', tags: ['politics'],
        effects: { mood: +10, salary: +8 },
        result: '你老板群里给 PM 立了规矩。你今天能准点下班。' }
    ]
  },

  // ========== G. 客户 / 甲方（全 client: true）==========
  {
    id: 'client_midnight_demand',
    title: '客户半夜要方案',
    timeSlot: 2, client: true, tags: ['client'],
    text: '01:14 客户微信："明早 9 点要看到改版方案。" 你这个客户每周来一次这种。',
    choices: [
      { text: '爬起来做。', tags: ['overtime', 'submissive'],
        effects: { fatigue: +18, health: -8, salary: +5, mood: -8 },
        result: '8:55 发出去。客户 9:30 回："其实不急。"' },
      { text: '"明早正常时间会议讨论。" 关机睡觉。', snark: true, tags: ['snark', 'refuse'],
        effects: { mood: +12, stress: -3, salary: -10 },
        result: '客户早上找你老板告状。但他也没真生气。' },
      { text: '【厚脸皮】"加急费 ¥3000，今晚改完。"',
        hidden: true, requiredSkill: 'thick_skin', snark: true, tags: ['snark'],
        effects: { mood: +15, money: +2000, fatigue: +15, salary: -5 },
        result: '客户砍价到 ¥2000，给了。你成了这周最赚的一晚。' }
    ]
  },

  {
    id: 'client_boss_unspoken',
    title: '客户的领导是关键',
    timeSlot: 1, client: true, tags: ['client'],
    text: '你做了 3 版，客户领导都没点头，但说不出哪不行。"再调调吧，感觉差点意思。"',
    choices: [
      { text: '"哪一处没感觉，方便指一下吗？"', snark: true, tags: ['snark'],
        effects: { mood: +10, stress: -2, salary: -8 },
        result: '客户领导沉默了。然后说"全部都改一下"。' },
      { text: '推倒重做，从零开始。', tags: ['overtime', 'submissive'],
        effects: { fatigue: +15, skill: +5, salary: +3, mood: -8 },
        result: '客户领导看了第 4 版："就这个感觉，第一版的颜色加上。" 你打开了第一版。' },
      { text: '【王安石】"我去问下您的助理，她应该知道您的偏好。"',
        hidden: true, requiredSkill: 'office_politics', tags: ['politics'],
        effects: { mood: +8, salary: +10, stress: -3 },
        result: '助理跟你说"老板最近喜欢蓝绿色"。你按那个改。一稿过。' }
    ]
  },

  {
    id: 'client_bypassed_you',
    title: '客户跳过我方对接',
    timeSlot: 1, client: true, tags: ['client', 'politics'],
    text: '客户绕过你公司直接联系你的同行。你老板转发给你："这怎么回事？"',
    choices: [
      { text: '"客户自己选的，我也没办法。"', tags: ['submissive'],
        effects: { mood: -3, salary: -5, stress: +5 },
        result: '老板"嗯"了一声。这个"嗯"听起来像 K.O. 准备音。' },
      { text: '"是不是因为咱们报价太高？我看到对面 8 折。"', snark: true, tags: ['snark'],
        effects: { mood: +10, salary: -8 },
        result: '老板没回。这种问题他不喜欢被问。' },
      { text: '主动给客户写了封长邮件，澄清+示好。', tags: ['flatter', 'kpi_grind'],
        effects: { stress: +8, fatigue: +5, salary: +5 },
        result: '客户回："不是你的问题，是公司决定。" 你和老板都不信。' }
    ]
  },

  {
    id: 'client_small_change',
    title: '客户的"小修改"',
    timeSlot: 0, client: true, tags: ['client'],
    text: '客户："就改一个颜色。" 然后发来 14 页 PDF，标题是"品牌色系统重做"。',
    choices: [
      { text: '"这不是小修改，是大改。报价单要重过。"', snark: true, tags: ['snark'],
        effects: { mood: +12, stress: +5, salary: -10 },
        result: '客户翻脸："这不就一个颜色嘛。" 但他后来还是签了追加合同。' },
      { text: '硬着头皮全改。', tags: ['overtime', 'submissive'],
        effects: { fatigue: +20, skill: +5, salary: 0, mood: -10 },
        result: '改完客户说"还是用原来的吧"。你那天没说话。' },
      { text: '【王安石】"咱们走个变更单流程，我帮您拉 CC 您领导，更正式一些。"',
        hidden: true, requiredSkill: 'office_politics', tags: ['politics'],
        effects: { mood: +10, salary: +12, stress: -3 },
        result: '客户领导一看就明白这是大改，砍掉一半。你保住了周末。' }
    ]
  },

  {
    id: 'client_boss_daughter',
    title: '客户老板的女儿',
    timeSlot: 2, client: true, tags: ['client'],
    text: '客户领导发来微信："麻烦帮我女儿改一下简历，她准备校招。" 附件 1.3MB，PDF。',
    choices: [
      { text: '"没问题，今晚发您。" 然后真改了。', tags: ['flatter', 'overtime'],
        effects: { fatigue: +6, money: +200, salary: +8, mood: -3 },
        result: '客户领导隔天发了红包 ¥200。你接了。下次他还会来。' },
      { text: '"我不专业，建议找校招顾问。"', snark: true, tags: ['snark', 'refuse'],
        effects: { mood: +10, salary: -12 },
        result: '客户领导没回。一周后合同续约出了问题。' },
      { text: '随便改两笔发回去。', tags: ['fishing'],
        effects: { mood: +5, fatigue: +2, salary: +2 },
        result: '客户领导说"再细一点"。你又改了。最后还是改了两小时。' }
    ]
  },

  // ========== H. 副业（pool:'side_hustle'） ==========
  {
    id: 'side_xhs_viral',
    title: '小红书第一篇 10w+',
    timeSlot: 2, pool: 'side_hustle', tags: ['side', 'finance'], once: true,
    text: '你随手发的吐槽爆了。私信涌入 47 条："请问可以接广告吗？" "可以教教我怎么写吗？"',
    choices: [
      { text: '接！立刻报价 ¥800/条。', tags: ['side_work', 'shop'],
        effects: { money: +1500, fatigue: +5, mood: +12, stress: +5 },
        result: '接了两单，¥1500 到账。下个月你考虑辞职。' },
      { text: '回粉丝，"经验都在贴子里"。', tags: ['side_work', 'social'],
        effects: { mood: +8, fatigue: +3 },
        result: '粉丝涨到 5000。还没变现，但势能在累积。' },
      { text: '截图发朋友圈，被同事看到。', snark: true, tags: ['snark', 'social'],
        effects: { mood: +15, stress: +8, salary: -5 },
        result: 'HR 当天找你"聊聊"。"公司有员工兼职管理规定。"' }
    ]
  },

  {
    id: 'side_didi_meets_boss',
    title: '跑滴滴遇到老板',
    timeSlot: 2, pool: 'side_hustle', tags: ['side'], once: true,
    text: '晚上 21:30 你接了个长单。客人上车："麻烦去 XX 商务区。" 后视镜里——是你公司的总监。',
    choices: [
      { text: '"X 总好！这边路熟。"', tags: ['flatter'],
        effects: { mood: -3, money: +80, salary: -5 },
        result: '总监问"最近忙吗"。你说"还行"。他没问你为什么开滴滴。' },
      { text: '戴口罩沉默到底，假装陌生人。', tags: ['fishing'],
        effects: { stress: +8, money: +80 },
        result: '他下车前看了你两秒。你不知道他认没认出来。' },
      { text: '"是我。怎么了？" 直接坦白。', snark: true, tags: ['snark'],
        effects: { mood: +12, money: +80, stress: -3, salary: -3 },
        result: '总监笑了："不容易啊。" 没追究。但全公司第二天都知道了。' }
    ]
  },

  {
    id: 'side_xianyu_dispute',
    title: '闲鱼买家失踪',
    timeSlot: 1, pool: 'side_hustle', tags: ['side'],
    text: '你卖出去的 iPad 收到货后 3 天，买家投诉"屏幕有划痕"，申请退货退款。但你寄出时是完好的。',
    choices: [
      { text: '"截图发过来，没问题我退。"', tags: ['submissive'],
        effects: { mood: -5, money: -1500, fatigue: +3 },
        result: '截图明显是 PS。但平台判退。你气炸了，但只能认。' },
      { text: '"不退。寄出时有视频。"', snark: true, tags: ['snark', 'refuse'],
        effects: { mood: +12, stress: +5, money: 0 },
        result: '平台介入。你提交了视频证据。3 天后裁决你赢。但买家给你打了差评。' },
      { text: '"退一半。各退一步。"', tags: ['politics'],
        effects: { mood: +3, money: -750 },
        result: '买家同意了。但你之后看闲鱼都不香了。' }
    ]
  },

  {
    id: 'side_blog_reported',
    title: '公众号被举报',
    timeSlot: 1, client: true, pool: 'side_hustle', tags: ['side', 'hr'], once: true,
    text: '你的职场吐槽公众号有一篇文章被实名举报到公司——HR 发飞书："来一下。" 配着你那篇文章截图。',
    choices: [
      { text: {
          default: '"个人公众号，业余时间，不影响工作。"',
          horse: '"个人公众号，业余时间，不影响工作。"',
          ox: '"那个……是我自己写的，业余时间，没想影射公司。"'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +10, stress: +10, salary: -10 },
        result: 'HR 拿出员工手册第 X 条。但你说"那是兜底条款，不构成处分依据"。她愣了。' },
      { text: '当场删号。', tags: ['submissive'],
        effects: { mood: -15, stress: -3, salary: +3 },
        result: '你 18000 粉丝，没了。HR 拍拍你肩膀："这就对了。"' },
      { text: '"哪一篇？我看看是不是真的影射公司。"', tags: ['politics'],
        effects: { mood: +5, stress: +5 },
        result: '你装作认真审查，最后说"这篇我可以改"。改完上线一切照旧。' }
    ]
  },

  // ========== I. 健康 / 医疗 / 心理 ==========
  {
    id: 'checkup_abnormal',
    title: '体检报告异常',
    timeSlot: 2, tags: ['health'], once: true,
    text: '微信弹出体检报告 PDF。打开一看：肝功能复查，甲状腺结节 2 个，颈椎反弓。你 28 岁。',
    choices: [
      { text: '约专家号复查。', tags: ['rest'],
        effects: { money: -300, health: +5, mood: -5, stress: +5 },
        result: '专家说"年轻人这种很常见，但要注意"。你点头，回去继续加班。' },
      { text: '"明年再看吧。" 截图发朋友圈。', snark: true, tags: ['snark', 'fishing'],
        effects: { mood: +5, health: -5, stress: +3 },
        result: '朋友圈下面 23 个赞 8 条"保重"。你点了一根烟。' },
      { text: '今晚开始早睡，戒咖啡。', tags: ['rest'],
        effects: { health: +8, fatigue: -3, mood: +3 },
        result: '坚持了 3 天。第 4 天你又点了双倍美式。' }
    ]
  },

  {
    id: 'stiff_neck_morning',
    title: '颈椎不能转头',
    timeSlot: 0, tags: ['health'],
    text: '早上起床发现头转不动，左转 30 度就剧痛。你 27 岁。',
    choices: [
      { text: '请病假，去医院。', tags: ['rest', 'refuse'],
        effects: { money: -200, health: +10, mood: +3, salary: -5 },
        result: '医生说"是颈椎病，建议每天少看电脑 4 小时"。你笑了出来。' },
      { text: '贴膏药硬扛去公司。', tags: ['submissive', 'overtime'],
        effects: { health: -5, fatigue: +5, salary: +2 },
        result: '一上午你侧着身工作，下午被老板说"姿势不雅"。' },
      { text: '"今天 WFH。" 发飞书然后躺回去。', snark: true, tags: ['snark', 'fishing'],
        effects: { health: +5, mood: +10, fatigue: -5, salary: -3 },
        result: '老板没回。但他下午开会点你名："镜头打开。" 你勉强坐起来。' }
    ]
  },

  {
    id: 'roommate_depression',
    title: '室友确诊抑郁',
    timeSlot: 2, tags: ['health', 'life'],
    text: '室友坐在你床边："我昨天去精神科了。医生说是中度抑郁。" 他眼眶红了。你不知道说什么。',
    choices: [
      { text: '陪他聊了一晚上。', tags: ['social', 'rest'],
        effects: { fatigue: +8, mood: +5, stress: -3, health: -3 },
        result: '凌晨 2 点你们都睡着了。但你第二天上班心里一直牵挂。' },
      { text: '"你这是工作压力太大吧，要不换个工作？"', tags: ['social'],
        effects: { mood: -3, stress: +3 },
        result: '他没说话，回房间了。你意识到说错了。' },
      { text: '陪他去看医生，请了一天假。', tags: ['rest', 'refuse'],
        effects: { fatigue: +5, money: -150, mood: +8, salary: -5 },
        result: '医生说"建议短期休假"。你想到自己上次休假是什么时候。' }
    ]
  },

  {
    id: 'gym_pitch',
    title: '健身房推销',
    timeSlot: 1, tags: ['life'],
    text: '路过新开的健身房，销售拉着你聊。"哥您看身体素质明显需要规划，今天有限时活动……" 40 分钟过去了。',
    choices: [
      { text: '"我先回去考虑下。" 然后逃跑。', tags: ['refuse'],
        effects: { fatigue: +3, mood: -2 },
        result: '销售加了你微信，每天发"今天来吗"。你三天后删了他。' },
      { text: '办了卡，¥3000。', tags: ['shop'],
        effects: { money: -3000, health: +5, mood: +8 },
        result: '一个月后你去了 3 次。但卡还在。' },
      { text: {
          default: '"哥们儿，我们都是打工人，互相放过吧。"',
          horse: '"哥们儿，我们都是打工人，互相放过吧。"',
          ox: '"那个……我真的工作很忙，没时间来健身房的。"'
        }, snark: true, tags: ['snark'],
        effects: { mood: +10 },
        result: '销售笑了："您说得对。" 但他没放过下一个路人。' }
    ]
  },

  {
    id: 'seventh_night_insomnia',
    title: '失眠第七天',
    timeSlot: 2, tags: ['health'],
    text: '凌晨 3:17 你还醒着。明早 9:30 有客户会议。你已经连续 7 天平均 4 小时睡眠。',
    choices: [
      { text: '强迫自己闭眼睛。', tags: ['rest', 'submissive'],
        effects: { fatigue: -3, mood: -3 },
        result: '5 点你才睡着。早会上你脑子像浆糊。' },
      { text: '爬起来工作，反正睡不着。', tags: ['overtime'],
        effects: { fatigue: +5, skill: +5, salary: +3, health: -8 },
        result: '凌晨 5 点你交付了一版方案。客户没注意细节。' },
      { text: '吃褪黑素 + 关手机。', tags: ['rest'],
        effects: { money: -50, fatigue: -8, health: +3 },
        result: '勉强睡了 4 小时。早会勉强撑住。' },
      { text: '【咸鱼心经】打开冥想 App，听海浪声睡着。',
        hidden: true, requiredSkill: 'fishing_zen', tags: ['rest', 'fishing'],
        effects: { fatigue: -10, mood: +10, health: +5 },
        result: '你睡得很深。早上 9 点准时清醒。这是这周最好的一天。' }
    ]
  },

  // ========== J. 都市生活 ==========
  {
    id: 'landlord_rent_up',
    title: '房东要涨房租',
    timeSlot: 2, tags: ['life', 'finance'], once: true,
    text: '续约时房东发来："今年市场行情你也看到了，每月 +¥800。" 你住的是隔断 18㎡。',
    choices: [
      { text: '签了。换房子太麻烦。', tags: ['submissive'],
        effects: { money: -800, mood: -10, stress: +5 },
        result: '你算了下，¥800 = 22 顿外卖。你删除了滴滴外卖账号。' },
      { text: '"那我搬走。" 然后真的开始找房子。', tags: ['refuse'],
        effects: { fatigue: +10, money: -200, mood: -5 },
        result: '看了 6 套，最后租了更贵但更近公司的。每月省了通勤但多了 ¥500。' },
      { text: '"现在市场行情？您挂中介看看，我陪您看。"', snark: true, tags: ['snark'],
        effects: { mood: +12, stress: -3 },
        result: '房东确实挂了一周没人问。最后跟你续约，没涨。' }
    ]
  },

  {
    id: 'blind_date',
    title: '相亲推销',
    timeSlot: 2, tags: ['life'],
    text: '妈："这次的男 / 女孩很优秀的，国企，有房，明天必须见。" 她已经发了对方简历给你。',
    choices: [
      { text: '见。反正吃顿饭。', tags: ['social'],
        effects: { fatigue: +5, money: -200, mood: -5 },
        result: '对方全程聊房贷和孩子计划。你那顿饭吃得想哭。' },
      { text: {
          default: '"我有对象了。"',
          horse: '"我有对象了——还是个您一定看不上的那种。"',
          ox: '"那个……妈，我有对象了。"（小声）'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +10 },
        result: '妈说"图片我都看了！" 你被识破。妈下周还会安排。' },
      { text: '"妈我加班，下次。"', tags: ['refuse', 'overtime'],
        effects: { mood: +5, fatigue: +3 },
        result: '妈在家族群发"我家孩子工作太忙没空相亲"。三个亲戚来劝。' },
      // A - 小马专属：列条件吓退
      { text: '"行，但我要求对方月入 5 万 + 户口 + 不要孩子 + 接受丁克。"',
        character: 'horse', snark: true, tags: ['snark'],
        effects: { mood: +18, stress: -8 },
        result: '妈愣了三秒："那……我再问问。" 一周没催你。' },
      // A - 小牛专属：默默答应不出门
      { text: '"嗯。" 答应了，第二天装病爽约',
        character: 'ox', tags: ['submissive'],
        effects: { mood: -5, stress: +8, health: -3, fatigue: +5 },
        result: '妈在家族群发"我家孩子身体不好"。她真信了。你愧疚到睡不着。' }
    ]
  },

  {
    id: 'hometown_civil_service',
    title: '老家催回去考公',
    timeSlot: 2, tags: ['life'],
    text: '爸："街道办还在招，老家房子留给你。考公吧，别在外面飘了。" 视频里他显老了。',
    choices: [
      { text: '"我考虑一下。"', tags: ['submissive'],
        effects: { mood: -5, stress: +5 },
        result: '挂掉电话你打开了"国考报名"。然后又关了。' },
      { text: {
          default: '"那点工资我在这一个月就赚到了。"',
          horse: '"那点工资我在这一个月就赚到了——但是我下个月可能就赚不到了。"',
          ox: '"爸，那个工资……可能不太够。"'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +12, stress: -3 },
        result: '爸沉默了。他不知道你存款不到 ¥20000。' },
      { text: '"再给我两年，不行我回去。"', tags: ['flatter'],
        effects: { mood: +5, stress: +3 },
        result: '爸说"好"。挂电话后你哭了 5 分钟，然后继续改 PPT。' },
      // A - 小马专属：直接反问
      { text: '"街道办每天打杂端茶倒水，您觉得我能熬住？"',
        character: 'horse', snark: true, tags: ['snark'],
        effects: { mood: +15, stress: -3 },
        result: '爸气得挂了电话。妈下午追打来："你怎么跟你爸说话呢？"' },
      // A - 小牛专属：嘴上答应心里抗拒
      { text: '"好的爸，我看看资料。"（其实一个字都不会点开）',
        character: 'ox', tags: ['submissive', 'flatter'],
        effects: { mood: -8, stress: +8, fatigue: +3, health: +1 },
        result: '爸过了一周问："看了吗？" 你说"还没"。他又问："你打算什么时候看？"' }
    ]
  },

  {
    id: 'wedding_red_packet',
    title: '朋友婚礼红包',
    timeSlot: 1, tags: ['life', 'finance'],
    text: '大学同学群里发婚礼通知。群消息显示"默认 ¥800 起"，已经 7 个人 ✅。',
    choices: [
      { text: '随大流，¥800。', tags: ['submissive', 'shop'],
        effects: { money: -800, mood: -5 },
        result: '你转账时手抖了一下。微信余额提示"低于 ¥1000"。' },
      { text: '到场不到场？只发红包 ¥200。', tags: ['refuse'],
        effects: { money: -200, mood: -3 },
        result: '群里没人 @ 你。但你那条消息底下没人点赞。' },
      { text: {
          default: '"我请假不了，礼到人不到。"',
          horse: '"我请假不了，礼到人不到。" 转 ¥300。',
          ox: '"那个……我请不了假，但我转一点。" 咬咬牙转了 ¥500。'
        },
        snark: true, tags: ['snark', 'shop'],
        effects: { money: -500, mood: +5 },
        result: '同学说"理解的"。你不知道是不是真理解。' },
      // A - 小马专属：直接退群
      { text: '"工资还没到账，下次。" 然后退群。',
        character: 'horse', snark: true, tags: ['snark', 'refuse'],
        effects: { mood: +18, stress: -5 },
        result: '群主小李加你 wx："你咋退群了？" 你说"误触"。再没回他。' },
      // A - 小牛专属：硬挤出钱
      { text: '"恭喜恭喜！" 转 ¥800。（这周饭钱拿副业补）',
        character: 'ox', tags: ['submissive', 'flatter'],
        effects: { money: -800, mood: -8, fatigue: +5, health: +1, salary: +2 },
        result: '小李回："谢谢！" 你这周午饭只吃了 7-11 三明治。' }
    ]
  },

  {
    id: 'parents_visit',
    title: '父母来探望',
    timeSlot: 2, tags: ['life'],
    text: '爸妈下周要来你这住一周。出租屋 18㎡，你睡沙发都难。',
    choices: [
      { text: '订酒店给他们，自己沙发凑合。', tags: ['shop'],
        effects: { money: -1500, mood: -3, fatigue: +5 },
        result: '一周下来 ¥1500 没了。爸说"住酒店多见外"。' },
      { text: '"我这边太挤了，下次回家见吧。"', tags: ['refuse'],
        effects: { mood: -8, stress: +5 },
        result: '妈在群里发"孩子嫌弃我们"。家族群一片"理解理解"。' },
      { text: '请假陪一周。', tags: ['rest'],
        effects: { fatigue: -3, mood: +10, salary: -10 },
        result: '老板皱眉。你五年没陪过爸妈这么久。最后值。' }
    ]
  },

  // ========== K. 节日 / 季节 ==========
  {
    id: 'spring_festival_ticket',
    title: '春节抢票',
    timeSlot: 1, tags: ['holiday', 'commute', 'family'], once: true,
    text: '12306 三个时段，你点击 47 次"提交"，全部"候补中"。隔壁工位的同事 30 秒前抢到了。你妈早上发来语音："今年回不回？我好准备菜。"',
    choices: [
      { text: '加钱找抢票软件，¥150 加速。', tags: ['shop'],
        effects: { money: -150, mood: +5, stress: -3 },
        result: '出票了。你松了口气。然后想到只剩 5 天就要回家了。' },
      { text: '改飞机，溢价 ¥1500。', tags: ['shop'],
        effects: { money: -1500, mood: -5 },
        result: '微信群里你妈发"机票要 ¥1500 别买这么贵的"。你假装没看到。' },
      { text: {
          default: '"今年不回了，远程拜年。"',
          horse: '"今年不回了，远程拜年。"',
          ox: '"妈，我今年加班，能不能除夕之后再回？"'
        },
        snark: true, tags: ['snark', 'refuse'],
        effects: { mood: -8, stress: +5 },
        // 修：result 与 effects 一致（不花钱，但妈难过 + 家族群施压）；不再瞎报扣了 ¥3000
        result: {
          default: '妈打来电话哭了 10 分钟。家族群三天没人理你。',
          horse: '妈打来电话哭了 10 分钟。你挂了，去刷小红书。家族群三天没人理你。',
          ox: '妈打来电话哭了 10 分钟。你听到一半也哭了，但还是没买票。'
        } }
    ]
  },

  {
    id: 'mid_autumn_mooncake',
    title: '中秋月饼礼盒',
    timeSlot: 1, tags: ['holiday'], once: true,
    text: '公司发的月饼礼盒，¥80 标价（你查了）。运回老家快递 ¥45。',
    choices: [
      { text: {
          default: '寄回老家。',
          horse: '寄回老家——"让我妈看看公司发的破月饼长什么样。"',
          ox: '寄回老家——希望妈高兴，宁可亏快递费。'
        },
        tags: ['shop', 'flatter'],
        effects: { money: -45, mood: +3 },
        result: '妈："这种月饼超市才 ¥30，你寄回来花了 45？" 你笑了。' },
      { text: '在公司给同事分了。', tags: ['social'],
        effects: { mood: +8 },
        result: '没人爱吃，最后大家都拿了一块就放下了。' },
      { text: '咸鱼挂出去 ¥40。', tags: ['side_work'],
        effects: { money: +30, mood: +5 },
        result: '卖出去了。同事看到链接，给你点了个赞。' },
      // A - 小马专属：发朋友圈嘲讽
      { text: '拍照发朋友圈："今年公司福利——值 30 块的爱。"',
        character: 'horse', snark: true, tags: ['snark', 'social'],
        effects: { mood: +15, stress: -5 },
        result: '老板点赞了。你不知道他是没看清还是在阴你。HR 第二天私聊："那条能撤一下吗？"' },
      // A - 小牛专属：留下自己慢慢吃
      { text: '默默拎回出租屋，每天吃一个。',
        character: 'ox', tags: ['submissive'],
        effects: { health: -3, mood: +5 },
        result: '吃到第三天你发现月饼有点哈喇味。你还是吃完了。' }
    ]
  },

  {
    id: 'christmas_oncall',
    title: '圣诞节加班',
    timeSlot: 2, tags: ['holiday', 'overtime'],
    text: '平安夜，你被排了 OnCall。朋友圈一片"我爱我家 ❤️"，你的圣诞树在工位电脑桌面壁纸里。',
    choices: [
      { text: '默默加班，发个朋友圈"祝大家平安"。', tags: ['submissive', 'flatter'],
        effects: { fatigue: +8, mood: -5, salary: +3 },
        result: '朋友圈下 18 个赞。老板点的，你不知道怎么回应。' },
      { text: {
          default: '"我下班了。" 关电脑走人。',
          horse: '"我下班了。" 关电脑走人。',
          ox: '"那个……我已经下班了，有事麻烦明天联系。" 关静音。'
        }, snark: true, tags: ['snark', 'refuse'],
        effects: { mood: +15, stress: -3, salary: -8 },
        result: '果然出了报警，但同事 cover 了。你和女朋友吃了顿火锅。' },
      { text: '"OnCall 加班双倍工资，对吧？"', snark: true, tags: ['snark'],
        effects: { mood: +10, money: +200, stress: +3, salary: -3 },
        result: 'HR 说"OnCall 津贴 ¥200"。你接了。不多不少。' }
    ]
  },

  {
    id: 'high_temp_subsidy',
    title: '高温补贴',
    timeSlot: 1, tags: ['holiday', 'finance'],
    text: '今天 38℃。HR 群发："高温补贴：每位员工 ¥10 绿豆汤代金券，电梯口领取。"',
    choices: [
      { text: '去领。然后默默喝完。', tags: ['submissive'],
        effects: { money: +10, mood: -3 },
        result: '绿豆汤味道一般。你想这 ¥10 还不够买杯水。' },
      { text: {
          default: '在群里 @ 老板："建议下次 ¥100 现金。"',
          horse: '在群里 @ 老板："建议下次 ¥100 现金。"',
          ox: '小心翼翼在群里发："老板……能不能下次直接发现金呀？"'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +12, salary: -3 },
        result: 'HR 回："这是公司心意。" 你在心里翻白眼。' },
      { text: '截图发小红书，配文"打工人福利大赏"。', tags: ['side_work', 'snark'],
        effects: { mood: +10, fatigue: +2 },
        result: '4w 浏览。HR 第二天发消息让你"低调一点"。' }
    ]
  },

  {
    id: 'year_end_bonus',
    title: '年终奖发了',
    timeSlot: 0, tags: ['holiday', 'finance'], once: true,
    text: '年终奖到账：¥XX，比预期少一个月。HR 群："感谢大家的付出，明年继续加油！"',
    choices: [
      { text: '"谢谢老板。" 然后开始改简历。', snark: true, tags: ['snark'],
        effects: { mood: +12, stress: +3 },
        result: '改完简历那一刻你觉得轻松。三天后你投了 10 家。' },
      { text: '"少给的那部分什么时候补？" 发飞书 HR。', snark: true, tags: ['snark'],
        effects: { mood: +15, stress: +5, salary: -5 },
        result: 'HR 给了一段公司"考虑到行业大环境"的标准话术。' },
      { text: '默认接受。然后犒劳自己一顿火锅。', tags: ['submissive', 'shop'],
        effects: { money: -300, mood: +5, health: -2 },
        result: '吃完火锅你想这 ¥300 是从年终奖里扣的。' },
      { text: '【厚脸皮】"老板您这么定，是觉得我哪里没做到位？"',
        hidden: true, requiredSkill: 'thick_skin', snark: true, tags: ['snark'],
        effects: { mood: +18, salary: -8, stress: +5 },
        result: '老板没回。但 HR 半个月后通知你"补发了一部分"。' }
    ]
  },

  // ========== L. 时代议题 ==========
  {
    id: 'ai_takes_over',
    title: 'AI 工具上线',
    timeSlot: 0, tags: ['zeitgeist', 'tech'],
    text: '公司接入 GPT 编程助手。老板群："以后基础代码用 AI，研发产能要再提 30%。" 你做的就是基础代码。',
    choices: [
      { text: '主动转型，研究 prompt engineering。', tags: ['kpi_grind'],
        effects: { skill: +10, fatigue: +5, salary: +5 },
        result: '三周后你写的 prompt 在公司内部被推广。你赢了一回。' },
      { text: {
          default: '"那我做什么？" 直接问老板。',
          horse: '"那我做什么？" 直接问老板。',
          ox: '"老板，那个……我以后的工作内容会变吗？"'
        },
        snark: true, tags: ['snark'],
        effects: { mood: +10, salary: -5 },
        result: '老板说"你来管 AI 出来的代码"。你成了 AI 的 code reviewer。' },
      { text: '什么都不做，等被裁。', tags: ['fishing'],
        effects: { mood: -5, skill: -3, salary: -8 },
        result: '三个月后你的工位换了人。你拿到了 N+1。' }
    ]
  },

  {
    id: '35_anxiety',
    title: '35 岁焦虑帖',
    timeSlot: 2, tags: ['zeitgeist'],
    text: '朋友圈被"35 岁被裁"刷屏。今年你 31。一个高赞评论："31 还来得及"，配图是空鱼缸。',
    choices: [
      { text: '点击保存"35 岁前必须存款 100w"教程。', tags: ['shop'],
        effects: { money: -98, mood: -5, stress: +3 },
        result: '教程其实没说什么有用的。你删除了。' },
      { text: '"焦虑也没用，先睡。"', snark: true, tags: ['snark', 'rest'],
        effects: { mood: +5, fatigue: -3 },
        result: '你确实睡着了。但梦里全是简历。' },
      { text: '当晚开始投简历。', tags: ['kpi_grind', 'side_work'],
        effects: { fatigue: +5, stress: +5, skill: +2 },
        result: '投了 8 家。三天后收到 1 个面试通知。' }
    ]
  },

  {
    id: 'gig_economy_news',
    title: '灵活就业新闻',
    timeSlot: 2, tags: ['zeitgeist'],
    text: '新闻："灵活就业人数突破 2 亿。" 你公司刚要求你转"自由职业者"——继续做原岗，无社保。',
    choices: [
      { text: '签了。反正还有工资。', tags: ['submissive'],
        effects: { mood: -10, stress: +8, salary: -3 },
        result: '社保断缴的提示三天后弹出。你才反应过来损失。' },
      { text: '"不签。劳动合同法第 X 条。"', snark: true, tags: ['snark', 'refuse'],
        effects: { mood: +15, stress: +5, salary: -10 },
        result: 'HR 后退了一步："那再考虑下。" 但你已经被列入"不配合"名单。' },
      { text: '"我自由职业，那加班费按市价 ¥300/小时？"', snark: true, tags: ['snark'],
        effects: { mood: +12, stress: +3, salary: -5 },
        result: 'HR 说"那不行那不行"。最后还是按月薪。' }
    ]
  },

  {
    id: 'classmate_startup_invite',
    title: '同学创业了',
    timeSlot: 2, tags: ['zeitgeist'], once: true,
    text: '大学室友微信："我们做 AI 工具，缺一个技术合伙人，期权 5%。来不来？" 他融资刚到位 500w。',
    choices: [
      { text: '"我考虑下，能看看 BP 吗？"', tags: ['kpi_grind'],
        effects: { stress: +5, skill: +3 },
        result: '看了 BP 你发现是个 PPT 公司。但你纠结了一周。' },
      { text: '"我不擅长创业，祝你成功。"', tags: ['refuse'],
        effects: { mood: -3, salary: 0 },
        result: '室友说"理解的"。三年后他公司估值 5 个亿。你看了那条新闻三遍。' },
      { text: '"5% 太少，10% 我考虑。"', snark: true, tags: ['snark'],
        effects: { mood: +12 },
        result: '室友说"那再聊"。后来他给了 8%。你纠结到失眠。' },
      { text: '【反向画饼】"先做个顾问，验证一下方向，半年后再谈合伙。"',
        hidden: true, requiredSkill: 'promotion_radar', tags: ['pie_back'],
        effects: { mood: +10, salary: +5, skill: +5 },
        result: '你成了挂名顾问，无 commitment。半年后产品起来了，你才谈合伙。' }
    ]
  },

  // ========== M. 小组长专属（todo 7）==========
  {
    id: 'team_lead_blamed_by_subordinate',
    title: '下属甩锅给你',
    timeSlot: 1, jobs: ['team_lead'], tags: ['team_lead', 'team'],
    text: '项目延期，下属小张在老板面前说："这是组长让我这么改的。" 你当时根本没说过。',
    choices: [
      { text: '当场反驳："我没说过，飞书记录翻一下。"', snark: true, tags: ['snark'],
        effects: { mood: +10, stress: +8, salary: +3 },
        result: '翻出聊天记录，小张哑火。但他从此对你有意见。' },
      { text: '默默背了。下来再找他谈。', tags: ['submissive'],
        effects: { mood: -10, stress: +12, salary: -5 },
        result: '老板说"你管理有问题"。小张依旧不服管。' },
      { text: '【王安石】"我跟小张下来对一下，但我们组确实方向上有调整。"',
        hidden: true, requiredSkill: 'office_politics', tags: ['politics'],
        effects: { mood: +5, salary: +8, stress: -3 },
        result: '老板满意。小张被你私下教育，没再闹。' }
    ]
  },

  {
    id: 'team_lead_sick_leave',
    title: '下属请假天天有',
    timeSlot: 0, jobs: ['team_lead'], tags: ['team_lead', 'team'],
    text: '你的小组 5 个人，今天又有 2 个请病假。这周第 4 次。HR 群里 @ 你"请关注团队状态"。',
    choices: [
      { text: '挨个打电话问候。', tags: ['flatter'],
        effects: { fatigue: +5, mood: -3, salary: +3 },
        result: '电话里都说"明天来"。明天还有人请。' },
      { text: '"病假需要医院证明。" 发群里。', snark: true, tags: ['snark'],
        effects: { mood: +5, stress: +5, salary: -3 },
        result: '下属真的提交了证明。你看了一眼，三家不同医院。' },
      { text: '自己顶上做了所有人的活。', tags: ['overtime', 'submissive'],
        effects: { fatigue: +20, skill: +5, salary: +5, mood: -10 },
        result: '你那一周睡了 18 小时。老板表扬你"带头干"。' }
    ]
  },

  {
    id: 'team_lead_salary_adjustment',
    title: '给下属调薪',
    timeSlot: 1, jobs: ['team_lead'], tags: ['team_lead', 'hr', 'finance'],
    text: 'HR："这季度团队加薪预算只有 8%，5 个人你来分。" 你看着 5 张脸，有 3 个都觉得自己该涨 15%。',
    choices: [
      { text: '一碗水端平，每人 +1.6%。', tags: ['submissive'],
        effects: { mood: -5, stress: +3, salary: -3 },
        result: '没人满意。两个人当场说"不公平"。' },
      { text: '给干活最多的两个 +5%，其他人 0。', tags: ['kpi_grind'],
        effects: { mood: +5, stress: +8, salary: +3 },
        result: '另外三个找你单聊。你解释了 4 次"业绩导向"。' },
      { text: '【王安石】私下找每个人聊一遍，给的人感激，没给的人觉得"下次"。',
        hidden: true, requiredSkill: 'office_politics', tags: ['politics'],
        effects: { mood: +10, salary: +8, stress: -3 },
        result: '人际网维持住了。HR 评价你"管理得当"。' }
    ]
  },

  {
    id: 'team_lead_subordinate_jumps',
    title: '下属越级汇报',
    timeSlot: 1, jobs: ['team_lead'], tags: ['team_lead', 'boss'],
    text: '老板找你："小张直接找我反馈，说你管得太死。" 你愣了。小张昨天还跟你说"组长辛苦了"。',
    choices: [
      { text: '"管得死？哦那我以后不管了。"', snark: true, tags: ['snark'],
        effects: { mood: +12, stress: +5, salary: -8 },
        result: '老板看你一眼："你这态度不行。" 你心里想"那他态度行？"' },
      { text: '"我跟他下来沟通。" 然后真的去找他。', tags: ['kpi_grind'],
        effects: { fatigue: +5, mood: -3, stress: +5 },
        result: '小张承认了，但说"我希望有更多空间"。你给了。他没用好。' },
      { text: '【厚脸皮】"老板，他越级汇报本身就是问题，您怎么看？"',
        hidden: true, requiredSkill: 'thick_skin', snark: true, tags: ['snark'],
        effects: { mood: +18, salary: +5, stress: -3 },
        result: '老板沉默。他确实没料到你会反问。后来他重新强调了汇报流程。' }
    ]
  },

  {
    id: 'team_lead_dinner_check',
    title: '团建吃饭谁买单',
    timeSlot: 2, jobs: ['team_lead'], tags: ['team_lead', 'team', 'finance'],
    text: '团建在餐厅，账单 ¥1500。下属们已经站起来："组长辛苦了！" 等你结账。',
    choices: [
      { text: '"行行行，AA 不好意思。" 自己结了。', tags: ['flatter'],
        effects: { money: -1500, mood: -5, fatigue: +3 },
        result: '下属们群发"谢谢组长 ❤️"。但你这周存款只剩 ¥800。' },
      { text: '"找 HR 报销，公司预算。"', tags: ['kpi_grind'],
        effects: { stress: +3, salary: +3, money: -1500 },
        result: 'HR 说"团建超出预算，要老板特批"。你最后还是自己出了。' },
      { text: '"AA 啊，咱们成年人。"', snark: true, tags: ['snark'],
        effects: { mood: +12, stress: -3, salary: -3, money: -300 },
        result: '下属们脸僵了。但你那 ¥1500 还是 AA 分摊了——你头上 ¥300。' }
    ]
  },

  {
    id: 'team_lead_last_rank',
    title: '末位淘汰摊到你组',
    timeSlot: 1, client: true, jobs: ['team_lead'], tags: ['team_lead', 'hr'], once: true,
    text: 'HR："本季度末位淘汰名额每组 1 名，你这组 3 个人，下周提交。" 三个人都干得不算差。',
    choices: [
      { text: '挑表现最弱的小李。', tags: ['kpi_grind', 'submissive'],
        effects: { stress: +12, mood: -10, salary: +3 },
        result: '小李哭着问"为什么是我"。你给不出答案。' },
      { text: '"我组就 3 人，要末位我去找老板谈。"', snark: true, tags: ['snark', 'refuse'],
        effects: { mood: +15, stress: +8, salary: -10 },
        result: '老板说"那你的位置也要重新评估"。你赌赢了一半，下季度你的预算被砍。' },
      { text: '私下劝小李"主动跳槽，我给推荐"。', tags: ['social'],
        effects: { mood: +5, stress: +5, salary: -3 },
        result: '小李跳了。HR 在系统里把他记为"主动离职"。你感觉自己脏。' },
      { text: '【王安石】把名额甩给隔壁组，"他们组人多更适合。"',
        hidden: true, requiredSkill: 'office_politics', tags: ['politics'],
        effects: { mood: +10, salary: +8, stress: -3 },
        result: '隔壁组组长怒。但 HR 拍板转到那边。你保住了三个人。' }
    ]
  },

  // ========== N. 其他职业专属 ==========
  {
    id: 'sales_month_end_push',
    title: '销售月底冲刺',
    timeSlot: 2, jobs: ['sales'], tags: ['boss', 'finance'],
    text: '离月底还有 3 天，业绩缺 ¥20w。老板群："周末别想休息了，每人电话至少 50 通。"',
    choices: [
      { text: '硬打 80 通电话。', tags: ['overtime', 'kpi_grind'],
        effects: { fatigue: +15, health: -5, money: +800, salary: +8 },
        result: '签了一单 ¥3w。提成 ¥800。你嗓子哑了一周。' },
      { text: '挑老客户软磨硬泡。', tags: ['flatter'],
        effects: { stress: +5, money: +500, salary: +5 },
        result: '老客户给面子签了。但说"以后这种节奏不接受"。' },
      { text: '"指标谁定的，不切实际。"', snark: true, tags: ['snark'],
        effects: { mood: +12, salary: -10, stress: +5 },
        result: '老板群里点名："X 同学注意态度。" 你的提成系数被调低了。' }
    ]
  },

  {
    id: 'hr_anonymous_complaint',
    title: 'HR 收到员工骂街',
    timeSlot: 1, jobs: ['hr'], tags: ['hr', 'team'],
    text: '系统反馈里有匿名长文骂 HR，3000 字，标题"XX 公司 HR 真实评价"。点赞 47。',
    choices: [
      { text: '逐条回复，澄清。', tags: ['kpi_grind'],
        effects: { fatigue: +8, mood: -8, salary: +3 },
        result: '匿名用户没回。但你那段回复被截图传到外网了。' },
      { text: '"匿名留言不予回应。" 关闭板块。', snark: true, tags: ['snark', 'refuse'],
        effects: { mood: +10, stress: +5, salary: -5 },
        result: '员工小群里炸了。第二天 5 个人请病假。' },
      { text: '【王安石】私下查 IP，找出来约谈。',
        hidden: true, requiredSkill: 'office_politics', tags: ['politics'],
        effects: { mood: +5, stress: +5, salary: +5 },
        result: '查到是上个月被劝退那位。这件事不了了之，但你心里凉。' }
    ]
  },

  {
    id: 'backend_prod_incident',
    title: '后端线上事故',
    timeSlot: 2, jobs: ['backend'], tags: ['tech', 'overtime'],
    text: '你昨晚的发版影响了 5w 用户。客服群已经爆了 800 条消息。监控大盘一片红。老板已经在飞书 @ 你 4 次。',
    choices: [
      { text: '立刻回滚 + 写复盘报告。', tags: ['overtime', 'kpi_grind'],
        effects: { fatigue: +12, health: -5, skill: +5, salary: -3 },
        result: '20 分钟回滚完。复盘报告写了 6 页。老板说"下次不要犯"。' },
      { text: '"测试覆盖率不够。锅不全在我。"', snark: true, tags: ['snark', 'politics'],
        effects: { mood: +8, stress: +8, salary: -8 },
        result: '测试组长公开 PR 你的代码，证明 review 也是你做的。' },
      { text: '【橡皮鸭】"我重现一下，找到是配置项的边界 case。"',
        hidden: true, requiredSkill: 'rubber_duck', tags: ['duck_debug', 'tech'],
        effects: { fatigue: +8, skill: +12, salary: +5 },
        result: '15 分钟定位。老板群里发了一个 🙏。复盘会上你成了"分析最专业"的。' }
    ]
  },

  {
    id: 'design_client_rejected',
    title: '设计稿被甲方爸爸否',
    timeSlot: 1, client: true, jobs: ['design'], tags: ['client', 'team_lead'],
    text: '甲方一句话："美感不够。" 没了。你做了 12 版。',
    choices: [
      { text: '"那您具体指哪一块？"', snark: true, tags: ['snark'],
        effects: { mood: +10, stress: +5, salary: -5 },
        result: '甲方支吾了半天，最后说"整体感觉"。你想哭。' },
      { text: '推翻重来，从灵感板做起。', tags: ['overtime', 'kpi_grind'],
        effects: { fatigue: +20, health: -5, skill: +6, salary: 0 },
        result: '第 13 版甲方说"行吧"。但你这周已经废了。' },
      { text: '把 v1 改个文件名发回去。', tags: ['fishing'],
        effects: { mood: +8, salary: -3 },
        result: '甲方："这版好多了。" 你笑了一下，没说话。' }
    ]
  },

  {
    id: 'ops_data_falsify',
    title: '运营数据造假',
    timeSlot: 1, jobs: ['big_ops'], tags: ['boss'],
    text: '老板："明天投资人来看数据，你把曲线画得好看一点。" "好看"具体是 DAU 翻 1.5 倍。',
    choices: [
      { text: '"做不到，数据真实是底线。"', snark: true, tags: ['snark', 'refuse'],
        effects: { mood: +15, stress: +8, salary: -10 },
        result: '老板让别人做了。但你这个季度的项目被砍。' },
      { text: '"行，但出问题不能算我。" 改了。', tags: ['submissive'],
        effects: { stress: +12, salary: +3, mood: -10 },
        result: '投资人没看出来。但你那一周失眠到第 6 天。' },
      { text: '【厚脸皮】"老板我可以改，但请用邮件发给我书面指令。"',
        hidden: true, requiredSkill: 'thick_skin', snark: true, tags: ['snark'],
        effects: { mood: +15, salary: -5, stress: -3 },
        result: '老板没发邮件。这件事不了了之。' }
    ]
  },

  // ========================================
  // v1.0 角色专属事件 - 🐴 小马 (4 条)
  // ========================================

  {
    id: 'horse_late_night_rant',
    title: '凌晨小红书发癫',
    timeSlot: 2, tags: ['life', 'social'],
    characters: ['horse'],
    minDay: 3,
    text: '凌晨 2:17，你打开小红书，"创建笔记"。手指悬在键盘上 0.3 秒，然后开始打字。800 字之后你点了"发布"。',
    choices: [
      {
        text: '标题《我就是不想干了》，配图工位夜景',
        snark: true, tags: ['snark', 'social'],
        effects: { mood: +18, stress: -8, fatigue: +5 },
        result: '早起来看：转发 1.2k，关注 +400。评论区第一条："姐你是不是在我们公司？"'
      },
      {
        text: '标题《公司给我的精神 PUA 大全》，列了 12 条',
        snark: true, tags: ['snark', 'social', 'side_work'],
        effects: { mood: +20, stress: -5, money: +88, fatigue: +8 },
        result: '一夜爆 2.3k 转发。早上 HR 私聊："那个号是你吗？" 你回："您怎么这么熟？"'
      },
      {
        text: '写到一半删了，关电脑',
        effects: { fatigue: +8, mood: -3, stress: +5 },
        result: '你躺在床上盯天花板。"我连发都不敢发，我真没救了。" 然后又打开了。'
      }
    ]
  },

  {
    id: 'horse_screenshot_war',
    title: '截图战争',
    timeSlot: 1, tags: ['boss', 'snark'],
    characters: ['horse'],
    minDay: 5,
    text: '老板上周在大会上画的饼："明年人均涨薪 30%。" 你截了图，存到桌面"证据"文件夹——文件夹里已经有 17 张。',
    choices: [
      {
        text: '在部门小群发："存档供大家参考。" 配老板原话截图。',
        snark: true, tags: ['snark', 'boss'],
        effects: { mood: +22, stress: -8, salary: -15 },
        result: '群里 7 个人秒发"哈哈哈"。老板第二天单独叫你聊："小同志，群里说话注意分寸。"'
      },
      {
        text: '发朋友圈：屏蔽老板，公司同事可见。',
        snark: true, tags: ['snark', 'social'],
        effects: { mood: +15, stress: -5, salary: -8 },
        result: '不知道哪个同事截图给老板了。第二天他朋友圈把你屏蔽了。'
      },
      {
        text: '存着，等离职那天群发',
        effects: { mood: +10, stress: +3 },
        result: '你把文件夹命名改成"离职大礼包"。睡觉时心情好了一点。'
      }
    ]
  },

  {
    id: 'horse_resign_drama',
    title: '朋友圈裸辞小作文',
    timeSlot: 2, tags: ['life', 'social'],
    characters: ['horse'],
    minDay: 4,
    text: '你工资分跌到不能再低。你打开朋友圈，开始写小作文：《为什么我要辞职》。写到 600 字时你停下，盯着屏幕。',
    choices: [
      {
        text: '发了。3 分钟撤回。再发。再撤回。再发。',
        snark: true, tags: ['snark', 'social'],
        effects: { mood: +18, stress: -3, salary: -10 },
        result: '最后留在朋友圈里的版本是第 6 版，800 字。点赞 47 个。老板没点。'
      },
      {
        text: '发了，不撤回',
        snark: true, tags: ['snark', 'social'],
        effects: { mood: +25, stress: -10, salary: -20, fatigue: +5 },
        result: '老板早上叫你 1:1。"咱们好聚好散吧。" 你说"我还没说要走"。他说"你已经说了"。'
      },
      {
        text: '存到草稿。第二天打卡上班。',
        effects: { mood: -8, stress: +8, fatigue: +5 },
        result: '上班路上你又打开草稿读了一遍。修改了三个错别字。你已经哭过两次了。'
      }
    ]
  },

  {
    id: 'horse_anonymous_complaint',
    title: '匿名投诉信',
    timeSlot: 1, tags: ['hr', 'boss'],
    characters: ['horse'],
    minDay: 7, once: true,
    text: 'HR 在大群发："公司收到一封匿名投诉信，详述了部门管理问题。请相关同事自觉前来配合调查。" 信是你写的。',
    choices: [
      {
        text: '主动找 HR："信是我写的。咱们聊。"',
        snark: true, tags: ['snark', 'hr'],
        effects: { mood: +18, stress: +10, salary: -20 },
        result: 'HR 愣了三秒："你……怎么直接承认了？" 你说"反正你们也查得出来"。'
      },
      {
        text: '什么都不说，假装没看到群消息',
        effects: { stress: +15, mood: -5, fatigue: +5 },
        result: '一周后 HR 找你单独聊。她没明说，但她的眼神在等你承认。'
      },
      {
        text: '在群里发："请问能否查到 IP？我也想知道是哪位勇士。"',
        snark: true, tags: ['snark', 'hr'],
        effects: { mood: +22, stress: -3, salary: -25 },
        result: '群里 8 个人发了笑哭表情。HR 默默关闭了群讨论功能。'
      }
    ]
  },

  // ========================================
  // v1.0 角色专属事件 - 🐂 小牛 (4 条)
  // ========================================

  {
    id: 'ox_brought_into_extra',
    title: '又被甩烂货',
    timeSlot: 0, tags: ['team'],
    characters: ['ox'],
    minDay: 3,
    text: '同事小李走到你工位："这块你最擅长了，帮我接一下？" 你看了下自己的日程——已经满了三个项目。',
    choices: [
      {
        text: '"那个……我下周也满了，能不能找别人？"',
        // 礼貌推回不算嘴硬，去 snark 避免 2.5% 月薪罚款 + ox trait 重锤
        tags: ['refuse'],
        effects: { mood: +10, stress: -3, salary: -3 },
        result: '小李愣了一下："你不是一直都帮我吗？" 你不知道怎么回答。'
      },
      {
        text: '"好的，今晚加班搞。"',
        tags: ['submissive', 'overtime'],
        effects: { fatigue: +15, health: -3, salary: +5, mood: -8 },
        result: '你接了。小李拍拍你肩："你最靠谱。" 然后转身又把另一个活甩给了新来的实习生。'
      },
      {
        text: '"小李，你这个我已经接了三次了，能不能换换？"',
        // 用事实说话不算嘴硬，去 snark；保留小幅 salary 代价（得罪同事）
        tags: ['refuse'],
        effects: { mood: +12, stress: +3, salary: -2 },
        result: '小李沉默了两秒："那……行吧。" 走了。你不确定他是真理解还是在记仇。'
      }
    ]
  },

  {
    id: 'ox_silent_overtime',
    title: '默默加班到天亮',
    timeSlot: 2, tags: ['overtime'],
    characters: ['ox'],
    minDay: 3,
    text: '凌晨 5:14。你最后一封邮件发出去。窗外天亮了。你看了一眼工位上同事留的便利贴："明早 9 点见。" 距离 9 点还有 3 小时 46 分。',
    choices: [
      {
        text: '工位上眯 20 分钟，然后去刷牙、装作刚来。',
        tags: ['submissive', 'overtime'],
        effects: { fatigue: +25, health: -10, salary: +8, mood: -5 },
        result: '9 点开会时你的脸已经麻木。老板说"你看起来很投入"。你回"嗯"。'
      },
      {
        text: '打车回家睡 2 小时，迟到也认。',
        effects: { money: -80, fatigue: -3, health: -3, salary: -5 },
        result: '你 10:30 才到公司。HR 系统扣了半天工资。你坐下后睡着了 5 分钟。'
      },
      {
        text: '直接给老板请病假："发烧。"',
        snark: true, tags: ['snark', 'refuse'],
        effects: { mood: +15, stress: -5, salary: -10, health: +5 },
        result: '老板没回。但他知道你昨晚发了凌晨 5 点的邮件。这个借口太透了。'
      }
    ]
  },

  {
    id: 'ox_quiet_recognition',
    title: '老板路过点头',
    timeSlot: 1, tags: ['boss'],
    characters: ['ox'],
    minDay: 5,
    text: '你在工位低头改文档，第 23 版。老板路过，停了 0.5 秒，说："你这态度很好。" 然后走了。',
    choices: [
      {
        text: '默默继续改。心里偷偷高兴。',
        tags: ['submissive', 'flatter'],
        effects: { mood: +12, fatigue: +5, salary: +5, health: +1 },
        result: '你那天文档改到了第 27 版。老板没再来。但你那一刻的满足感持续到了下班。'
      },
      {
        text: '抬头："谢谢老板！您具体是指哪方面？"',
        tags: ['flatter', 'kpi_grind'],
        effects: { stress: +3, salary: +8, mood: +5 },
        result: '老板说"细节做得不错"。你后来发现他指的其实是另一个同事的文档。'
      },
      {
        text: '心里想："就这点表扬。" 嘴上"嗯"。',
        snark: true, tags: ['snark'],
        effects: { mood: +8, stress: -3, salary: -5 },
        result: '老板回头看了你一眼。你装作专心改文档。这一眼后来在 360 评估里出现。'
      }
    ]
  },

  {
    id: 'ox_team_lead_dumps',
    title: '下属把活甩你',
    timeSlot: 0, tags: ['team_lead', 'team'],
    characters: ['ox'],
    jobs: ['team_lead'],
    minDay: 3,
    text: '下属小张走过来："组长，我下周休陪产假，这个项目的代码我先休了再写，你看怎么办？" 你打开他的项目——50% 没写。',
    choices: [
      {
        text: '"那我先接着写一下。" 默默接锅。',
        tags: ['submissive', 'overtime'],
        effects: { fatigue: +20, health: -5, skill: +5, salary: +3, mood: -8 },
        result: '一周加班到凌晨。小张休完假回来说："写完了？太好了。" 你笑了笑没说话。'
      },
      {
        text: '"那个……能不能你先写完再休？陪产假晚一周也可以吧？"',
        snark: true, tags: ['snark'],
        effects: { mood: +12, stress: +5, salary: -3 },
        result: '小张脸色变了："组长，陪产假是法定的。" 你哑口无言。三天后他举报你"打压员工"。'
      },
      {
        text: '"行，你休你的。我安排其他人接。"',
        tags: ['submissive'],
        effects: { stress: +8, salary: +5, mood: -5 },
        result: '你又找了两个下属接活。他们都说"我手头也满"。最后还是你自己写。'
      }
    ]
  }

];
