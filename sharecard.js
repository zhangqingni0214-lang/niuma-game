// 分享卡片生成 - 致死结局走 KO 风，其他走朋友圈风
//
// 依赖：html2canvas（已在 index.html 通过 CDN 引入）
// 接入点：结局页"生成分享卡"按钮调用 showShareCard(state, archive)

(function() {
  // 致死类结局 id —— 走拳皇 KO 风
  const DEATH_ENDINGS = new Set([
    'overwork_death', 'mental_collapse', 'horse_slam_quit',
    'ox_loyal_collapsed', 'broke', 'depression',
    'optimized', 'era_abandoned', 'hr_self_optimized'
  ]);

  // 段子池 - 朋友圈风用
  const FEED_LINES = [
    '今天我在牛马公司活到了第 X 天。',
    'HR 还没找到由头开掉我。',
    '我学会了：',
    ' · 老板画饼时假装认真做笔记',
    ' · 怼回去之前先复制聊天记录',
    ' · 摸鱼时把手放在键盘但不打字',
    ' · 把"收到"打成"好的"假装更主动',
    ' · 周报里写"持续推进"等于没推进',
    ' · 开会戳手指比打字更像在记笔记'
  ];

  let currentStyle = 'auto'; // auto / ko / feed

  function pickStyleFor(endingId) {
    if (currentStyle === 'ko') return 'ko';
    if (currentStyle === 'feed') return 'feed';
    return DEATH_ENDINGS.has(endingId) ? 'ko' : 'feed';
  }

  function pickRandomLines(n) {
    const pool = FEED_LINES.slice(2); // 跳过头两行（固定）
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  }

  // ===== 拳皇 KO 风 =====
  function renderKOCard(life, archive) {
    const s = life.stats;
    const tags = life.tags.map(t => `<span class="ko-tag">${t.name}</span>`).join('');
    return `
      <div class="share-card-ko">
        <div class="ko-banner">
          <div class="ko-banner-text">K.O.</div>
          <div class="ko-banner-sub">· · · · · · · · ·</div>
        </div>

        <div class="ko-charcard">
          <div class="ko-charcard-emoji">${life.profile.emoji || '🐴'}</div>
          <div class="ko-charcard-name">${life.profile.name} · ${life.profile.jobName || ''}</div>
          <div class="ko-charcard-meta">第 ${life.life} 世 · 存活 ${life.day} 天</div>
        </div>

        <div class="ko-ending-name">【 ${life.ending.name} 】</div>

        <div class="ko-summary">${life.ending.summary}</div>

        <div class="ko-stats">
          ${statBar('健康', s.health)}
          ${statBar('压力', s.stress)}
          ${statBar('心情', s.mood)}
          ${statBar('疲劳', s.fatigue)}
          ${statBar('工资', s.salary)}
          ${moneyLine(life.money)}
        </div>

        <div class="ko-tags">${tags || '<span class="ko-tag">无标签</span>'}</div>

        <div class="ko-foot">
          <div class="ko-foot-brand">
            <div class="ko-foot-title">牛 马 公 司</div>
            <div class="ko-foot-tagline">你上一次感觉自己还活着，是何时？</div>
          </div>
          <div class="ko-qr">扫码<br>投胎</div>
        </div>
      </div>
    `;
  }

  function statBar(label, val) {
    return `
      <div class="ko-stat">
        <span class="ko-stat-label">${label}</span>
        <div class="ko-stat-bar"><div class="ko-stat-fill" style="width:${val}%"></div></div>
        <span class="ko-stat-val">${val}</span>
      </div>`;
  }

  function moneyLine(money) {
    return `
      <div class="ko-stat" style="grid-column: span 2;">
        <span class="ko-stat-label">存款</span>
        <span class="ko-stat-val" style="width: auto; flex: 1; font-size: 30px;">¥ ${money.toLocaleString()}</span>
      </div>`;
  }

  // ===== 朋友圈截图风 =====
  function renderFeedCard(life, archive) {
    const tags = life.tags.map(t => `<span class="feed-tag">${t.name}</span>`).join('');
    const lines = pickRandomLines(3).map(s => `<div>${s}</div>`).join('');
    const headLine = `今天我在牛马公司活到了第 ${life.day} 天。`;
    const subLine = life.ending.id === 'survival'
      ? 'HR 还没找到由头开掉我。' : `不过最后还是【${life.ending.name}】了。`;

    return `
      <div class="share-card-feed">
        <div class="feed-statusbar">
          <span>22:47</span>
          <span>📶 5G · 🔋 11%</span>
        </div>

        <div class="feed-nav">
          <span class="feed-nav-back">‹</span>
          <span>${life.profile.name} 的动态</span>
        </div>

        <div class="feed-post">
          <div class="feed-post-head">
            <div class="feed-avatar">${life.profile.emoji || '🐴'}</div>
            <div>
              <div class="feed-author">${life.profile.name} · 牛马公司</div>
              <div class="feed-time">2 分钟前 · ${life.profile.company}</div>
            </div>
          </div>

          <div class="feed-body">${headLine}\n${subLine}\n\n我学会了：\n${lines.replace(/<\/?div>/g, '')}</div>

          <div class="feed-hashtag">#牛马公司 #打工人轮回 #第${life.life}世</div>

          <div class="feed-screenshot">
            <div class="feed-shot-day">Day ${life.day} · 存活 ${life.day} 天</div>
            <div class="feed-shot-ending">${life.ending.name}</div>
            <div class="feed-shot-summary">${truncate(life.ending.summary, 80)}</div>
          </div>

          <div class="feed-stats">
            <span>❤️ 2.3w</span>
            <span>💬 891</span>
            <span>↗️ 分享</span>
          </div>
        </div>

        <div class="feed-tags-row">${tags || '<span class="feed-tag">未获得人设</span>'}</div>

        <div class="feed-foot">
          <div class="feed-foot-text">👇 也来怼一把？<br><b>牛马公司</b> · niu.ma</div>
          <div class="feed-qr">扫码<br>试玩</div>
        </div>
      </div>
    `;
  }

  function truncate(s, n) {
    if (!s) return '';
    return s.length > n ? s.slice(0, n) + '…' : s;
  }

  // ===== 公开 API =====
  window.showShareCard = function(life, archive) {
    const modal = document.getElementById('share-modal');
    const canvas = document.getElementById('share-card-canvas');
    const style = pickStyleFor(life.ending.id);
    canvas.innerHTML = style === 'ko' ? renderKOCard(life, archive) : renderFeedCard(life, archive);

    // 缩放适配预览框
    const wrap = canvas.parentElement;
    const scale = Math.min(wrap.clientWidth / 1080, 1);
    canvas.style.transform = `scale(${scale})`;
    canvas.parentElement.style.height = (1350 * scale + 8) + 'px';

    modal.classList.remove('hidden');
  };

  window.downloadShareCard = function(life) {
    const canvas = document.getElementById('share-card-canvas');
    const target = canvas.firstElementChild;
    if (!target || !window.html2canvas) {
      alert('截图组件未就绪。');
      return;
    }
    // 临时复原 1:1 渲染
    const oldTransform = canvas.style.transform;
    canvas.style.transform = 'scale(1)';
    html2canvas(target, { backgroundColor: null, scale: 1, useCORS: true }).then(out => {
      canvas.style.transform = oldTransform;
      const a = document.createElement('a');
      a.download = `niuma_${life.profile.name}_${life.ending.name}.png`;
      a.href = out.toDataURL('image/png');
      a.click();
    });
  };

  window.toggleShareStyle = function(life, archive) {
    currentStyle = currentStyle === 'ko' ? 'feed' : 'ko';
    window.showShareCard(life, archive);
  };
})();
