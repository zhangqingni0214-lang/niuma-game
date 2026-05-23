# Suno BGM 生成指南 v2

> 目标：给《牛马公司》生成 3 首循环 BGM
> 工时预估：注册 + 生成 + 下载 ≈ 30 分钟
> 费用：Suno 免费版每天 10 首生成额度，足够多次试做

---

## 一、注册与准备

### 1.1 访问与登录

1. 打开 [suno.com](https://suno.com)（**需要科学上网**）
2. 点 "Sign Up"，用 Google / Apple / Microsoft / Discord 账号登录
3. 进入后页面左侧导航：**Create**（生成）

### 1.2 关键设置

进入 Create 页面后，**务必打开 Custom Mode**（右上角小开关）。默认的 Simple Mode 出来的几乎一定带人声，不能当 BGM。

Custom Mode 下能看到 3 个核心输入框：

| 字段 | 说明 | 我们的用法 |
|---|---|---|
| **Style of Music** | 风格描述（最重要） | 粘下面的英文 prompt |
| **Title** | 曲名 | 填中文也行，影响不大 |
| **Lyrics** | 歌词 | **保持空白** |
| **Instrumental** | 纯音乐开关 | **必须打开 ✅** |

⚠️ **Instrumental 不打开会自动生成人声**，对 BGM 是灾难。打开后 Lyrics 框会变灰，确认即可。

---

## 二、3 首 BGM 提示词

每首生成时，会一次返回 2 个候选。试 2–3 轮挑最满意的。

---

### BGM #1：主菜单 / 投胎页（`menu.mp3`）

**情绪定位**：玩家刚打开游戏，看着"今日投胎"按钮。要的是慵懒、有点丧、但又有种"行吧再来一次"的余韵。

**Style of Music**（直接复制粘贴）：

```
8-bit chiptune fused with lo-fi hip hop, slow 70 BPM,
mellow FM synth lead playing minor pentatonic melody,
warm sub-bass, soft brushed snare,
distant rain ambient layer, vinyl crackle, tape hiss,
inspired by KOF '94 character select screen but slower and more melancholic,
late-night urban office vibe, resigned but resilient,
loopable, instrumental only, no vocals
```

**Title**：`牛马公司 - 投胎厅`
**Persona**：留空

**目标时长**：60–90 秒（Suno 默认输出 ~2-3 分钟，截一段循环就行）

**听感关键词**：你听到的应该像——拳皇选关音乐被拖慢 + 雨声 + 老磁带嘶嘶。

---

### BGM #2：游戏主页面（`game.mp3`）

**情绪定位**：玩家在做选择、打工、加班。BGM **绝不能抢戏**——要的是背景化、循环不烦、轻微推进感。

**Style of Music**：

```
lo-fi hip hop beat at 75 BPM with subtle 8-bit chiptune accents,
muted jazz electric piano chords, soft brushed drums,
slight tape saturation and warmth,
faint office ambience layer: distant keyboard typing, AC hum, paper rustle,
emotion: focused but slightly resigned, like working through a long afternoon,
minimal melody, repetitive but not boring,
loopable, instrumental only, no vocals
```

**Title**：`牛马公司 - 工位午后`

**目标时长**：90–120 秒

**听感关键词**：像 Lofi Girl 直播间的那种慵懒 Beat + 一点点 8-bit 高音点缀。

---

### BGM #3：结局结算页（`ending.mp3`）

**情绪定位**：玩家刚 K.O. / 通关，看着结局文案。要的是叹一口气的复盘感。

**Style of Music**：

```
slow ambient piano at 60 BPM, single sustained minor chord progression,
heavy tape hiss and vinyl crackle, very quiet 8-bit pad ghost layer fading in and out,
emotion: bittersweet acceptance, end credits of a small indie game,
like Persona 5 cafe scene at 3am,
extremely minimal, no percussion,
loopable, instrumental only, no vocals
```

**Title**：`牛马公司 - 终局复盘`

**目标时长**：30–60 秒

**听感关键词**：钢琴 + 嘶嘶声 + 几乎不动的和弦。**越无聊越对**。

---

### 备选 BGM #4（可选）：致死结局专属短 jingle

**情绪定位**：玩家过劳猝死那一瞬间，KO 字样砸下来。要一个 3–5 秒的爆发音 + 长尾。

**Style of Music**：

```
short retro arcade game over jingle, 3 seconds,
8-bit descending minor scale on square wave lead,
KOF '94 KO sound but slower and longer reverb tail,
final note sustains with distant gong-like resonance,
dramatic but melancholic, no humor,
instrumental only
```

**Title**：`KO`

**目标时长**：3–5 秒

**说明**：这条不是循环 BGM，是结局触发时的一次性 stinger。如果懒得做可以跳过——sfx.js 里 `death` 预设已经能起到类似作用。

---

## 三、生成 → 试听 → 下载

### 3.1 生成流程

1. 填好 Style / Title / 开 Instrumental → 点 **Create**
2. 等 30–60 秒，会出来 **2 个候选**
3. 点播放按钮试听
4. 满意的→点 **下载图标（⤓）** → 选 **Download MP3**
5. 不满意的→换 prompt 重试（**每首做 2–3 轮**找最佳）

### 3.2 下载文件命名

按这个表保存：

| 用途 | 文件名 |
|---|---|
| 主菜单 BGM | `assets/bgm/menu.mp3` |
| 游戏主页 BGM | `assets/bgm/game.mp3` |
| 结局页 BGM | `assets/bgm/ending.mp3` |
| 致死 jingle (可选) | `assets/bgm/death_jingle.mp3` |

⚠️ 注意：`assets/bgm/` 目录如果不存在，需要先创建。我之前在 sfx.js 里写死的路径就是这 3 个，文件名必须一字不差。

### 3.3 文件大小预期

- 每首 mp3 大约 1.5–3 MB
- 3 首加起来 ~6–9 MB
- 对网页游戏完全可接受

---

## 四、生成完成后我帮你接入

把 3 个 mp3 放到 `assets/bgm/` 之后告诉我，我会改 game.js 加 3 处自动播放：

```js
renderMenu()    → SFX.playBGM('menu');
renderGame()    → SFX.playBGM('game');
showEnding()    → SFX.playBGM('ending');
```

之所以我现在没主动加，是因为文件不在的时候浏览器会一直 404 报警，反而干扰你测试。等你 mp3 到位再接，5 行代码的事。

---

## 五、踩坑提示

### 5.1 Suno 常见雷区

| 雷 | 怎么避 |
|---|---|
| 出来带人声 | 开 Instrumental 开关，Lyrics 留空 |
| 出来太燃 / 战斗向 | prompt 强调 "slow", "melancholic", "lo-fi", "minimal" |
| 风格漂移到流行歌 | 多加 "instrumental BGM", "ambient", "no drops" |
| 节奏太快不像 BGM | prompt 明确 BPM（70-75 适合本游戏） |
| 循环时有断点 | Suno 不能完美无缝循环，需要用 Audacity 之类工具修剪两端（5 分钟搞定，要教程告诉我） |

### 5.2 提示词调整空间

如果出来不满意，先调这两项：

1. **BPM 数字**——70 改 65 更慢更丧；改 80 更明快
2. **关键风格词**——把 "lo-fi hip hop" 换成 "ambient" / "chillhop" / "downtempo" 风格会大变

### 5.3 商业授权

- **免费版生成的音乐 → 仅个人非商用**
- **Pro $8/月起 → 商用 OK**
- 你这个游戏如果只是个人项目自娱自乐 → 免费版没问题
- 如果要正式上线 / 做分享传播 → 建议买 **1 个月 Pro = $8**，生成完导出来，再退订，**总成本 ¥60** 解决终身 BGM 版权问题

---

## 六、备选：不想用 Suno 怎么办

如果你不想科学上网或者 Suno 体验不好，可以试国产替代：

| 平台 | URL | 特点 |
|---|---|---|
| **海绵音乐** | music.bytedance.com | 字节出品，中文界面，免费 |
| **天工 SkyMusic** | tiangong.cn | 昆仑万维，国产对标 Suno 较早 |
| **Mureka** | mureka.ai | 2025 起声量上来的，质量接近 Suno v3 |

把上面的英文 Style prompt **翻译成中文**直接用，例如 BGM #1 译成：

```
8-bit 芯片音乐融合 lo-fi hip hop，慢速 70 BPM，
柔和的 FM 合成器主旋律演奏小调五声音阶，
温暖的低音，柔软的刷扫军鼓，
远处的雨声氛围层，黑胶唱片噪音，磁带嘶声，
受拳皇 94 选关画面启发但更慢更忧郁，
深夜城市办公室氛围，认命但有韧性，
可循环，纯音乐，无人声
```

---

## 七、Checklist（你照这个走）

- [ ] 注册 Suno 账号
- [ ] 进 Create → 开 Custom Mode → 开 Instrumental
- [ ] 生成 BGM #1 menu（2 轮挑 1）→ 下载 `menu.mp3`
- [ ] 生成 BGM #2 game（2 轮挑 1）→ 下载 `game.mp3`
- [ ] 生成 BGM #3 ending（2 轮挑 1）→ 下载 `ending.mp3`
- [ ] 在 `assets/` 下创建 `bgm/` 文件夹
- [ ] 把 3 个 mp3 改名放进去
- [ ] 告诉我 "BGM 已就位"，我接入代码

预计你的总时间：**30 分钟内搞定**。

---

*Have fun. 听完三首记得听一下 sfx.js 里的 day_advance 远钟音效——它会和 BGM 自然叠在一起，那个"颓废感"就是这两层叠出来的。*
