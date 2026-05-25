// 音效模块 v3 - Web Audio API 重写
//
// 设计哲学：办公室 Lofi 触感风
//   - 不要 8-bit / 红白机感
//   - 全部用正弦波或软三角波（无方波、无噪声）
//   - 音量克制（macOS / iOS UI 反馈级别）
//   - ADSR 包络起音不脆、收音不硬
//   - 低通滤波削掉高频刺耳成分
//
// 接口保持兼容：
//   SFX.play('click')          触发音效
//   SFX.toggle()               切换开关
//   SFX.isEnabled()
//   SFX.playBGM(name) / stopBGM()  循环 BGM（需要外部 mp3）

const SFX_STORAGE = 'niuma_sfx_enabled';

// ============================================================
// 音效引擎
// ============================================================
class SFXEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this._enabled = localStorage.getItem(SFX_STORAGE) !== '0';
    this._bgmEl = null;
    this._bgmName = null;
  }

  _ensureCtx() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.6;  // 全局总音量阀
    this.master.connect(this.ctx.destination);
  }

  isEnabled() { return this._enabled; }

  toggle() {
    this._enabled = !this._enabled;
    localStorage.setItem(SFX_STORAGE, this._enabled ? '1' : '0');
    if (!this._enabled) this.stopBGM();
    return this._enabled;
  }

  play(name) {
    if (!this._enabled) return;
    this._ensureCtx();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const preset = PRESETS[name];
    if (preset) {
      try { preset(this.ctx, this.master); }
      catch (e) { console.warn('sfx', e); }
    }
  }

  // v0.9.9 真正的 crossfade：
  //   旧 BGM 和 新 BGM 在同一段时间内同时进行，
  //   使用 sin/cos 等响度曲线，中点感受总响度恒定，没有"凹"
  //
  //   crossfadeSeconds：默认 2s（菜单/游戏/结局通用）
  //   结局可单独传 3s 让更慢一点
  playBGM(name, crossfadeSeconds = 2.0) {
    if (!this._enabled) return;

    // v0.9.11 修 bug：首次进菜单时 renderMenu 调 playBGM('menu')，
    // 但浏览器 autoplay 策略导致 el.play() 失败，el 处于 paused。
    // _bgmName 已被设为 'menu'，下次再调 playBGM('menu')（首次点击后的 kickBGM）
    // 会因"已在播 menu"早返回，BGM 永远起不来。
    // 修：检查 el 是否真在播；paused 时丢弃旧引用重来。
    if (this._bgmName === name && this._bgmEl && !this._bgmEl.paused) return;
    if (this._bgmEl && this._bgmEl.paused) {
      // 之前一次失败的 attempt，直接丢弃，不需要 crossfade
      this._bgmEl = null;
      this._bgmName = null;
    } else {
      this.stopBGM(crossfadeSeconds);
    }

    const url = BGM_PATHS[name];
    if (!url) return;
    const targetVolume = 0.18;
    const el = new Audio(url);
    el.loop = true;
    el.volume = 0;
    el.play().catch(() => {});
    this._bgmEl = el;
    this._bgmName = name;

    if (crossfadeSeconds <= 0) {
      el.volume = targetVolume;
      return;
    }

    // 等响度曲线 fade in：sin(t·π/2) — 中点 0.707（人耳感受 -3dB）
    const startTime = Date.now();
    const duration = crossfadeSeconds * 1000;
    const tick = () => {
      if (!this._bgmEl || this._bgmEl !== el) return;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      el.volume = targetVolume * Math.sin(progress * Math.PI / 2);
      if (progress < 1) setTimeout(tick, 50);
    };
    tick();
  }

  stopBGM(fadeOutSeconds = 0) {
    if (!this._bgmEl) return;
    const el = this._bgmEl;
    this._bgmEl = null;
    this._bgmName = null;
    if (fadeOutSeconds <= 0) {
      el.pause();
      return;
    }
    // 等响度曲线 fade out：cos(t·π/2) — 与 sin 配对，crossfade 中点总响度恒定
    const startVol = el.volume;
    const startTime = Date.now();
    const duration = fadeOutSeconds * 1000;
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      el.volume = Math.max(0, startVol * Math.cos(progress * Math.PI / 2));
      if (progress < 1) setTimeout(tick, 50);
      else el.pause();
    };
    tick();
  }

  // 提前缓存 BGM 文件，避免首次 playBGM 时网络/解码延迟造成空白。
  // 用法：在切场之前 5-10 秒调一次，比如进投胎页就 preloadBGM('game')。
  // 同一 name 多次调用是幂等的（已缓存就直接返回）。
  preloadBGM(name) {
    this._preloaded = this._preloaded || {};
    if (this._preloaded[name]) return;
    const url = BGM_PATHS[name];
    if (!url) return;
    const el = new Audio();
    el.preload = 'auto';
    el.src = url;
    // 不调 play()，浏览器仍会按 preload="auto" 下载并解码
    el.load();
    this._preloaded[name] = el;
  }

  // Debug 用：依次播放全部 15 个音效，控制台调用 SFX.previewAll()
  previewAll(gap = 800) {
    const names = Object.keys(PRESETS);
    const wasEnabled = this._enabled;
    this._enabled = true;
    names.forEach((n, i) => {
      setTimeout(() => {
        console.log(`▶ [${i+1}/${names.length}] ${n}`);
        this.play(n);
        if (i === names.length - 1) {
          setTimeout(() => { this._enabled = wasEnabled; }, gap);
        }
      }, i * gap);
    });
  }
}

// ============================================================
// 辅助：创建带 ADSR 包络 + 低通滤波 的音色
// ============================================================
function tone(ctx, dest, {
  type = 'sine',
  freq = 440,
  freqEnd = null,      // 不为 null 则做频率扫频
  freqRamp = 'exp',    // 'exp' 或 'linear'
  attack = 0.005,
  decay = 0.05,
  sustain = 0,
  release = 0.05,
  peak = 0.18,         // 峰值音量
  lpf = 2000,          // 低通截止频率
  lpfQ = 0.7,
  detune = 0,
  vibrato = null,      // { rate: 6, depth: 5 }
  startOffset = 0
} = {}) {
  const now = ctx.currentTime + startOffset;
  const total = attack + decay + release;

  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;

  if (freqEnd !== null) {
    if (freqRamp === 'exp') {
      osc.frequency.exponentialRampToValueAtTime(Math.max(0.001, freqEnd), now + total);
    } else {
      osc.frequency.linearRampToValueAtTime(freqEnd, now + total);
    }
  }

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = lpf;
  filter.Q.value = lpfQ;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(peak, now + attack);
  gain.gain.linearRampToValueAtTime(peak * sustain, now + attack + decay);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + total);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  osc.start(now);
  osc.stop(now + total + 0.05);

  // 颤音
  if (vibrato) {
    const lfo = ctx.createOscillator();
    lfo.frequency.value = vibrato.rate;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = vibrato.depth;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start(now);
    lfo.stop(now + total + 0.05);
  }

  return { osc, gain, filter, endTime: now + total };
}

// ============================================================
// 15 个音效预设（Web Audio 表达）
// ============================================================
const PRESETS = {
  // === UI 触感类 - 极轻 ===

  // 通用点击 - 像 iOS 键盘"嗒"
  click: (ctx, dest) => {
    tone(ctx, dest, {
      type: 'sine', freq: 1320, attack: 0.001, decay: 0.04,
      peak: 0.10, lpf: 1800,
    });
  },

  // 选项点击 - 翻页"沙"，三角波+短促
  choice_select: (ctx, dest) => {
    tone(ctx, dest, {
      type: 'triangle', freq: 880, attack: 0.003, decay: 0.06,
      peak: 0.14, lpf: 1600,
    });
    tone(ctx, dest, {
      type: 'sine', freq: 1760, attack: 0.001, decay: 0.03,
      peak: 0.06, lpf: 2400, startOffset: 0.005,
    });
  },

  // 紫色技能选项 - 三音和弦，柔软铃声
  skill_choice: (ctx, dest) => {
    [880, 1108, 1320].forEach((f, i) => {
      tone(ctx, dest, {
        type: 'sine', freq: f, attack: 0.01, decay: 0.4,
        peak: 0.12 - i * 0.02, lpf: 3000,
        startOffset: i * 0.015,
        vibrato: { rate: 5, depth: 2 },
      });
    });
  },

  // === Toast 钱包类 ===

  // 钱包微笑 - 上行两音，温和提示
  money_in: (ctx, dest) => {
    tone(ctx, dest, {
      type: 'sine', freq: 660, attack: 0.005, decay: 0.12,
      peak: 0.16, lpf: 2400,
    });
    tone(ctx, dest, {
      type: 'sine', freq: 990, attack: 0.005, decay: 0.18,
      peak: 0.14, lpf: 2400,
      startOffset: 0.08,
    });
  },

  // 钱包流泪 - 下行两音，轻叹
  money_out: (ctx, dest) => {
    tone(ctx, dest, {
      type: 'sine', freq: 660, attack: 0.005, decay: 0.12,
      peak: 0.14, lpf: 1800,
    });
    tone(ctx, dest, {
      type: 'sine', freq: 440, attack: 0.005, decay: 0.18,
      peak: 0.12, lpf: 1800,
      startOffset: 0.08,
    });
  },

  // === 弹窗 / 推进 ===

  // 弹窗打开 - 低频"呼"
  modal_open: (ctx, dest) => {
    tone(ctx, dest, {
      type: 'sine', freq: 200, freqEnd: 320, freqRamp: 'linear',
      attack: 0.02, decay: 0.15, peak: 0.15, lpf: 800,
    });
  },

  // 弹窗关闭 - 短促低音
  modal_close: (ctx, dest) => {
    tone(ctx, dest, {
      type: 'sine', freq: 320, freqEnd: 220, freqRamp: 'linear',
      attack: 0.005, decay: 0.07, peak: 0.10, lpf: 1000,
    });
  },

  // 跨日 - 远处钟声，温和悠长（核心颓废音）
  day_advance: (ctx, dest) => {
    // 基频
    tone(ctx, dest, {
      type: 'sine', freq: 330, attack: 0.02, decay: 0.6, release: 0.8,
      sustain: 0.3, peak: 0.20, lpf: 1800,
      vibrato: { rate: 4, depth: 3 },
    });
    // 八度泛音
    tone(ctx, dest, {
      type: 'sine', freq: 660, attack: 0.02, decay: 0.4, release: 0.5,
      sustain: 0.2, peak: 0.10, lpf: 2400, startOffset: 0.01,
    });
    // 五度
    tone(ctx, dest, {
      type: 'sine', freq: 495, attack: 0.02, decay: 0.3, release: 0.3,
      sustain: 0.15, peak: 0.08, lpf: 2200, startOffset: 0.02,
    });
  },

  // 返回 - 短下行
  back: (ctx, dest) => {
    tone(ctx, dest, {
      type: 'sine', freq: 660, freqEnd: 440, freqRamp: 'linear',
      attack: 0.003, decay: 0.07, peak: 0.10, lpf: 1500,
    });
  },

  // === 事件交互 ===

  // 怼回去 - 短促圆润"哼"，三角波低频
  snark: (ctx, dest) => {
    tone(ctx, dest, {
      type: 'triangle', freq: 220, freqEnd: 280, freqRamp: 'linear',
      attack: 0.005, decay: 0.18, peak: 0.22, lpf: 1200,
    });
    tone(ctx, dest, {
      type: 'sine', freq: 440, attack: 0.005, decay: 0.10,
      peak: 0.10, lpf: 1800, startOffset: 0.01,
    });
  },

  // 扣款 - 老式收银机"叮咚"低音
  deduction: (ctx, dest) => {
    tone(ctx, dest, {
      type: 'triangle', freq: 330, attack: 0.003, decay: 0.08,
      peak: 0.16, lpf: 1400,
    });
    tone(ctx, dest, {
      type: 'sine', freq: 247, attack: 0.003, decay: 0.20,
      peak: 0.14, lpf: 1000, startOffset: 0.06,
    });
  },

  // === 重大反馈 ===

  // 绩效奖金 - 三音和弦升起，温暖
  bonus: (ctx, dest) => {
    [523, 659, 784].forEach((f, i) => {  // C-E-G 大三和弦
      tone(ctx, dest, {
        type: 'sine', freq: f, attack: 0.01, decay: 0.3, release: 0.4,
        sustain: 0.4, peak: 0.16 - i * 0.02, lpf: 3000,
        startOffset: i * 0.06,
        vibrato: { rate: 5, depth: 2 },
      });
    });
  },

  // 绩效倒挂 - 三音和弦下行，叹气
  bonus_reverse: (ctx, dest) => {
    [659, 523, 392].forEach((f, i) => {  // E-C-G 下行
      tone(ctx, dest, {
        type: 'triangle', freq: f, attack: 0.02, decay: 0.4, release: 0.5,
        sustain: 0.3, peak: 0.14 - i * 0.02, lpf: 1600,
        startOffset: i * 0.12,
      });
    });
  },

  // 致死结局 - 低频钟声 + 长尾，肃穆
  death: (ctx, dest) => {
    // 主音
    tone(ctx, dest, {
      type: 'sine', freq: 165, attack: 0.05, decay: 0.5, release: 1.5,
      sustain: 0.4, peak: 0.28, lpf: 1200,
      vibrato: { rate: 3, depth: 2 },
    });
    // 八度
    tone(ctx, dest, {
      type: 'sine', freq: 330, attack: 0.05, decay: 0.4, release: 1.2,
      sustain: 0.25, peak: 0.14, lpf: 1500, startOffset: 0.02,
    });
    // 高泛音点缀
    tone(ctx, dest, {
      type: 'sine', freq: 880, attack: 0.05, decay: 0.3, release: 0.6,
      sustain: 0.1, peak: 0.06, lpf: 2200, startOffset: 0.1,
    });
  },

  // 通关结局 - 大三和弦温暖升起
  survive: (ctx, dest) => {
    [392, 494, 587].forEach((f, i) => {  // G-B-D 大三和弦
      tone(ctx, dest, {
        type: 'sine', freq: f, attack: 0.04, decay: 0.4, release: 0.8,
        sustain: 0.5, peak: 0.18 - i * 0.02, lpf: 2800,
        startOffset: i * 0.08,
        vibrato: { rate: 4, depth: 2 },
      });
    });
  },

  // ===== v1.4.0 戏剧重音（4 个）=====

  // A. 终局触发 - 角色之死，低音长尾 + 心跳停顿感
  ending_strike: (ctx, dest) => {
    // 低音"咚"
    tone(ctx, dest, {
      type: 'sine', freq: 65, attack: 0.005, decay: 0.4, release: 0.6,
      sustain: 0.3, peak: 0.4, lpf: 600,
    });
    // 同时加一个 130Hz 五度叠
    tone(ctx, dest, {
      type: 'sine', freq: 130, attack: 0.005, decay: 0.3, release: 0.5,
      sustain: 0.2, peak: 0.18, lpf: 800,
      startOffset: 0.01,
    });
    // 远处余响 - 闷锣
    tone(ctx, dest, {
      type: 'triangle', freq: 98, attack: 0.06, decay: 0.6, release: 1.2,
      sustain: 0.15, peak: 0.12, lpf: 400,
      startOffset: 0.1,
    });
  },

  // B. Day 7 绩效正常发放 - 上行三音，命运结算"咚"
  bonus_strike: (ctx, dest) => {
    [523, 659, 784].forEach((f, i) => {  // C-E-G 大调
      tone(ctx, dest, {
        type: 'sine', freq: f, attack: 0.005, decay: 0.15, release: 0.3,
        sustain: 0.5, peak: 0.18 - i * 0.02, lpf: 3000,
        startOffset: i * 0.06,
      });
    });
    // 收尾低音"咚"
    tone(ctx, dest, {
      type: 'sine', freq: 196, attack: 0.005, decay: 0.2, release: 0.4,
      sustain: 0.2, peak: 0.15, lpf: 800,
      startOffset: 0.2,
    });
  },

  // C. Day 7 绩效倒挂 - 下行半音 + 玻璃裂声
  bonus_reverse_strike: (ctx, dest) => {
    [659, 622, 587].forEach((f, i) => {  // E-Eb-D 下行半音
      tone(ctx, dest, {
        type: 'triangle', freq: f, attack: 0.005, decay: 0.12, release: 0.25,
        sustain: 0.3, peak: 0.14, lpf: 2400,
        startOffset: i * 0.05,
      });
    });
    // 噪声"裂" - 用高频快速衰减
    tone(ctx, dest, {
      type: 'sawtooth', freq: 3200, attack: 0.001, decay: 0.05, release: 0.1,
      sustain: 0, peak: 0.08, lpf: 4000,
      startOffset: 0.18,
    });
  },

  // D. 解锁里程碑（新结局/技能/标签）- 像素游戏经典升调
  unlock_milestone: (ctx, dest) => {
    [659, 880, 1175].forEach((f, i) => {  // E-A-D 五度递进
      tone(ctx, dest, {
        type: 'square', freq: f, attack: 0.002, decay: 0.05, release: 0.08,
        sustain: 0.7, peak: 0.12 - i * 0.01, lpf: 2800,
        startOffset: i * 0.06,
      });
    });
    // 收尾闪音 + 高八度
    tone(ctx, dest, {
      type: 'sine', freq: 2349, attack: 0.001, decay: 0.04, release: 0.1,
      sustain: 0.5, peak: 0.1, lpf: 4000,
      startOffset: 0.25,
    });
  },
};

// ============================================================
// 公开实例
// ============================================================
window.SFX = new SFXEngine();

const BGM_PATHS = {
  menu: 'assets/bgm/menu.mp3',
  game: 'assets/bgm/game.mp3',
  ending: 'assets/bgm/ending.mp3',
};
