# 牛马公司 · 版本日志

一个 14 天打工人轮回模拟器的版本演进记录。

---

## v1.4.0 — 2026-05-25 · 终极激励 + 数据深化

让玩家"为什么继续玩"有了系统层面的回答：满图鉴庆典 + 20 个成就 + 自传 + 破纪录 toast + 全角色全职业 sim 验证 + 戏剧重音。

### 🆕 新功能

#### 🏆 满图鉴 · 地府名人堂（全屏接管）
玩家解锁第 16 个结局的瞬间，**替代普通结局页**进入全屏庆典：

- 金色 🏆 满图鉴标记 + "职场轮回首席死亡专家"终身荣誉称号
- 最后一次挂的死法 + summary
- 16 种死法 4×4 网格全亮
- 你的牛马生涯统计（总投胎/累计存活/累计嘴硬/累计存款/业力/职业）
- 20 个成就墙（按解锁状态高亮/灰显）
- 按钮：📸 分享 + 🪦 回地府

#### 📖 自传 tab（已故牛马名册新增）
自动生成的人物志，基于 archive 数据动态拼装：
```
你已经投胎 47 次。最长一次活了 12 天，那是一只小马，做 IT 后端。
你最常死于：过劳猝死、被开除·走得有尊严、抑郁。
你最爱的死法是：拍桌裸辞·走得潇洒。
嘴硬总次数：312。这相当于每局怼 6.6 次。
你试过 5 种职业：全栈外包、IT 后端、SaaS 销售、乙方设计、小组长。
你两个角色都试过，是个真·两栖牛马。
...
```

#### 🏅 20 个成就（achievements.js）
覆盖嘴硬路线 / 沉默路线 / 通关收集 / 跨职业 / 业力里程碑 / 救援 / 满图鉴等：
首次挂了、首次通关、嘴硬学徒、怼神之王、单局怼神、钢铁打工人、沉默是金、单局首富、职场流浪汉、岗位百科、阴阳两栖、业力大师、秘籍大成、续命大师、轮回老油条、一意孤行、老实人路线、生活也嘴硬、职场反骨、满图鉴·地府名人堂。

#### 🏆 破纪录 toast
点击结局页【再投胎】/【回地府】后，逐个弹出本局破的纪录：
```
🏆 新纪录！最长存活 12 天（旧 8 天）
🏆 新纪录！单局最高存款 ¥3500（旧 ¥2000）
```
维度：单局存活天数 / 嘴硬次数 / 存款 / 业力收益。

#### 🎬 4 个戏剧重音 SFX
- **ending_strike** — 终局触发瞬间：低音"咚" + 五度叠 + 闷锣
- **bonus_strike** — Day 7 绩效正常发放：上行 C-E-G 三和弦
- **bonus_reverse_strike** — Day 7 倒挂：下行半音 + 玻璃裂声
- **unlock_milestone** — 解锁新结局/标签：像素游戏经典升调

#### 📊 sim 全矩阵
sim.js 加 `--matrix` 模式：跑 2 × 7 = 14 组合，每组合 500 局，
输出 markdown 报告 `sim-report.md` 含异常组合告警。

```
$ node sim.js 500 --matrix
> 报告写入 sim-report.md
> ⚠️ ox + outsource: 通关率 0.0% 偏低 + 平均存活 2.9 天，可能 too punishing
```

#### 💬 B 变体覆盖率 82.6% → 95%
再补 12 snark + 3 有故事 neutral 事件的 horse/ox 文本变体：
- 工作类：client_change_after_launch / team_lead_×5 / sales_month_end_push 等 12 个
- 生活类：colleague_owes_you_favor / roommate_depression / parents_visit

### 📊 统计

| 维度 | v1.3 | v1.4 |
|---|---|---|
| 事件总数 | 137 | 137 |
| 角色专属事件 | 16 | 16 |
| 结局总数 | 16 | 16 |
| 技能总数 | 15 | 15 |
| **成就总数** | 0 | **20** |
| B 变体覆盖 | 82.6% | **95.0%** |
| SFX 预设 | ~15 | **~19** |
| sim 测试覆盖 | 4 组合 | **14 组合** |
| 完整度评分 | 88% | **92%** |

---

## v1.3.0 — 2026-05-25 · 体验完整化

新手引导、菜单可视化、再平衡、剩余角色叙事，本版把游戏从「可上线」推到「85% 完整度」。

### 🆕 新功能

#### 新手引导卡（2 张）
- **首次点【今日投胎】**：弹 5 秒须知卡片
  ```
  🐂 牛马公司 🐎
  14 天，每天 3 件破事（早/午/晚）。
  存活就算赢，但你 emmm 大概率会挂 —— 共 16 种死法。
  ⚖️ 每个选项都有代价
  ♻️ 挂了攒业力，买嘴硬秘籍
  ```
- **首次挂掉**：弹「💀 第一次挂了」卡，动态显示业力 +N / 死法 1/16 / 标签 +X，双按钮「去看秘籍」「直接再投胎」
- 销毁前世会清掉两个引导 flag，下次重新触发

#### 菜单结局收藏进度条
- 像素风黄色进度条 + 红色 `X / 16` 计数
- 玩家完成 1 轮后才显示（避免新手压力）
- 销毁前世后重置隐藏
- 满图鉴时填充变金黄 + 加 🏆 后缀

#### 8 个新角色专属事件（事件总数 129 → 137）

🐴 小马新增（烈风格 - 公开炸场）：
- `horse_meeting_walk_out` 当场离席
- `horse_glassdoor_review` 脉脉打 1 星
- `horse_dramatic_resignation_letter` 5000 字辞职信
- `horse_public_callout` 群里 @ 老板要加班费

🐂 小牛新增（闷风格 - 默默扛）：
- `ox_take_blame_for_others` 主动背锅
- `ox_birthday_alone_at_office` 工位过生日
- `ox_cant_say_no_boss_kid` 帮老板接娃
- `ox_kitchen_helper` 默默洗杯子

#### B 变体覆盖率 64% → 82.6%
再补 20 个高频事件的小马/小牛文本变体：subway_jam / health_checkup / weekend_release_night / team_building_ktv / client_midnight_demand 等。

### ⚖️ 数值再平衡

- **Snark 罚款减免封顶 70%**：lawyer_friend + political_animal + 小马 ×0.8 叠加后，仍至少保留 30% 基数罚款。避免后期玩家"嘴硬零成本"。
- **`numb_immune` 加 stress 条件**：mood floor 30 只在 stress < 70 时生效。高压时 mood 仍可崩，保留 depression ending 可达性。
- **sim 验证**（500 局 × 4 组合）：基线通关率 0.8% → Tier 5 全开通关率 1.2%，差距合理，没变成无敌模式。

### 🛠️ 机制升级

- **`choice.dailyWageCost: true`**：通用机制，应用时扣一天日薪（salary/22）。用于"请病假"等场景。
- **`choice.clientComplaintChance: 0.3`**：按概率随机触发"客户内部投诉"扣款。用于"嘴硬讨钱"灰色场景。
- **deduction modal 类型 icon 扩展**：snark 💼 / medical 🏥 / daywage 📅 / client 📞

### 🐛 Bug 修复

- 修 4 处 result 文案与 effects 金额不一致 bug（春节抢票 / 团建 / 客户红包 / 团建吃饭）
- `ox_brought_into_extra` 两个礼貌推回选项去 snark（不再被算作"嘴硬"）
- `sick_day` 改为扣一天日薪 + 加 `boss` tag（罚款理由从 work-boss 池抽，对应"病假是法定权利"那句怼）
- `client_change_after_launch #2` 加急费改为工资分 +10 + 30% 概率客户投诉扣 ¥200
- `rent_up #4` 去掉无 narrative 解释的 money: -200

### 🎨 UI / 视觉

- 菜单底部小牛背景上移：`center top` → `center 20%`，减少头部留白
- 新手卡片复用菜单卡像素风（米黄底 + 黑边框 + 红重点字）

### 📊 统计

| 维度 | v1.2 末 | v1.3 |
|---|---|---|
| 事件总数 | 129 | **137** |
| 角色专属事件 | 8 | **16** (8 horse + 8 ox) |
| 结局总数 | 16 | 16 |
| 技能总数 | 15 | 15（含再平衡） |
| B 变体覆盖 | 64% | **82.6%** |
| 完整度评分 | 76% | **88%** |

---

## v1.2 — 2026-05-25 · B 变体补完第一轮

延续 v1.0 的 C 机制，把 horse/ox 文本变体推到 64% 覆盖率。

### 改动
- 45 个非签名事件加角色文本变体
- 覆盖工作（PM/客户/老板/HR）+ 生活（春节/月饼/婚礼）双线

---

## v1.1 — 2026-05-25 · 5 个 Tier 5 渡劫技能

业力上限提到 760，让长期玩家有目标可追。

### 新技能（60-150 业力）
- `boss_reading` 读心术（60）— 老板/HR 事件先看 result（passive 描述）
- `lawyer_friend` 我朋友是律师（80）— work 场景 snark 罚款 ×0.5
- `side_hustle_pro` 斜杠流派（100）— 副业 money 收入 +50%
- `political_animal` 政治动物（120）— 政治选项 salary +5，snark 罚款 ×0.7
- `numb_immune` 钝化术（150）— 心情封顶 90 + 兜底 30

---

## v1.0 — 2026-05-25 · 角色叙事专属

游戏的核心机制升级。两个角色不再共用同一套选项文本，开始有真正的故事线分支。

### 机制（C 方案）
- **`choice.character: 'horse' | 'ox'`** — 角色限定选项，不属于本角色就不显示
- **`choice.text: { default, horse, ox }`** — 文本变体解析

### 8 个角色专属事件
🐴 小马：`horse_late_night_rant` / `horse_screenshot_war` / `horse_resign_drama` / `horse_anonymous_complaint`

🐂 小牛：`ox_brought_into_extra` / `ox_silent_overtime` / `ox_quiet_recognition` / `ox_team_lead_dumps`

### 4 个角色专属结局
- `horse_internet_celebrity` 网红出圈
- `horse_lone_wolf` 独狼离场
- `ox_promoted_to_supervisor` 升职带新人
- `ox_loyal_burnout` 请病假回来工位没了

### B 文本变体（13 签名事件）
fishing_caught / boss_painting_pie / company_speech / team_building / sunday_night / rent_up / classmate_reunion / blind_date / hometown_civil_service / wedding_red_packet / mid_autumn_mooncake / pm_ninth_revision / client_midnight_revision

---

## v0.9.x — 早期开发（v0.9 → v0.9.11）

### v0.9.10 — 业力价格按 PM 收紧
T1 15, T2 30, T3 40, T4 50

### v0.9.9 — BGM 真 crossfade
等响度曲线融合，中点感受总响度恒定。

### v0.9.8 — 嘴硬秘籍重平衡 + BGM 渐入
首版 BGM 接入。

### v0.9.7 — 救援经济重做 + 全场只救一次
4 类濒死警告，0-1500 救援购买。

### v0.9.6 — 多轮调参 + 角色专属机制
小马 trait（snarkBonus mood+2 stress-2 / snarkPenalty salary-2）；小牛 trait（submissiveBonus fatigue-5 salary+2 + health+1 / snarkPenalty salary-5 stress+5）。

### v0.9.5 — 濒死预警升级
救援购买弹窗。

### v0.9 ship — 121 事件 + Tag 化 + 分享卡 + Web Audio 圆润音效
事件库扩到 121 条；引入 tag 系统；sharecard.js 接入；SFX 改为 Web Audio 合成。

---

## v0.1 ~ v0.8 — 原型期

- 牛马公司 v1 像素风职场轮回模拟器立项
- 6 维属性系统（health/stress/mood/fatigue/skill/salary）
- 14 天 × 3 时段
- 业力 + 技能购买
- 已故牛马名册存档
- iOS 风重设 + 工资系统 + 扣款/绩效通知
- toast 队列 + 戏谑短句池（共 35+）

---

## 项目结构

```
├── index.html         入口（约 270 行）
├── styles.css         样式（约 1400 行）
├── game.js            主游戏逻辑（约 1750 行）
├── events.js          事件库 137 条（约 3850 行）
├── endings.js         结局 16 + 人设标签 15
├── jobs.js            2 角色 + 7 职业
├── skills.js          15 技能（5 Tier × 3-4 招）
├── sfx.js             Web Audio 音效 + BGM 控制
├── sharecard.js       分享卡渲染
├── tags.js            tag 字典
├── sim.js             Monte Carlo 平衡验证
└── assets/            像素图 + BGM × 3 + 字体
```

## 链接

- 线上：https://zhangqingni0214-lang.github.io/niuma-game/
- 源码：https://github.com/zhangqingni0214-lang/niuma-game
