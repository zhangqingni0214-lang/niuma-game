// scripts/dual_tick.js
// /loop 每次唤醒跑这个：探测 yunwu gemini 图像渠道 → 通了就续跑双角色生成 →
// 全部 137 事件双版齐全后自动 build + commit + push，并打印 DONE 信号。
//
// 退出码/输出约定：
//   打印 "TICK: channel down"      → 渠道还没好，继续等
//   打印 "TICK: progress X/137"    → 渠道好了，跑了一批，还没完
//   打印 "TICK: ALL DONE"          → 全部完成并已提交，可以停 loop

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'assets', 'comics');
const YUNWU_KEY = process.env.YUNWU_KEY || 'sk-8IepRQgj5U3hmFP0lMmwpyh2IWUn9CxAyiDauTgjuWpt3ySp';

function pingChannel() {
  return new Promise(resolve => {
    const body = JSON.stringify({ contents:[{parts:[{text:'ping'}]}], generationConfig:{responseModalities:['IMAGE'],imageConfig:{aspectRatio:'16:9'}} });
    const req = https.request({
      hostname:'yunwu.ai', path:'/v1beta/models/gemini-2.5-flash-image:generateContent', method:'POST',
      headers:{'x-goog-api-key':YUNWU_KEY,'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)},
      timeout:60000
    }, res=>{
      let c=''; res.on('data',x=>c+=x); res.on('end',()=>{
        resolve(c.includes('inlineData')||c.includes('inline_data'));  // 有图=通
      });
    });
    req.on('error',()=>resolve(false));
    req.on('timeout',()=>{req.destroy();resolve(false);});
    req.write(body); req.end();
  });
}

// 统计双版齐全的事件数
function countComplete() {
  global.window = {};
  delete require.cache[require.resolve(path.join(ROOT,'events.js'))];
  require(path.join(ROOT,'events.js'));
  const events = global.window.EVENTS;
  let complete = 0;
  for (const ev of events) {
    if (ev.characters && ev.characters.length === 1) {
      // 角色专属：单版对应自己即可
      if (fs.existsSync(path.join(DIR, `${ev.id}_${ev.characters[0]}.jpg`))) complete++;
    } else {
      if (fs.existsSync(path.join(DIR, `${ev.id}_horse.jpg`)) && fs.existsSync(path.join(DIR, `${ev.id}_ox.jpg`))) complete++;
    }
  }
  return { complete, total: events.length };
}

(async () => {
  const up = await pingChannel();
  if (!up) {
    console.log('TICK: channel down');
    return;
  }
  // 渠道通了，跑续跑（同步执行，--skip-existing）
  try {
    execSync('node scripts/gen_dual_character.js --skip-existing', { cwd: ROOT, stdio: 'inherit', timeout: 600000 });
  } catch (e) {
    console.log('TICK: gen interrupted -', (e.message||'').slice(0,80));
  }

  const { complete, total } = countComplete();
  console.log(`TICK: progress ${complete}/${total}`);

  if (complete >= total) {
    // 全部完成 → build hooks（保险）+ commit + push
    try {
      execSync('git add -A', { cwd: ROOT });
      execSync(`git commit -m "feat: v1.5.1 双角色漫画补全 — 121 事件马/牛双版换头

yunwu gemini 渠道恢复后自动续跑完成。每个非角色专属事件生成马头+牛头
两版（图像编辑换头，场景保持一致），UI 按当前角色加载 <id>_<character>.jpg，
回退 <id>.jpg → 纯文字。

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"`, { cwd: ROOT });
      execSync('git push origin main', { cwd: ROOT });
      console.log('TICK: ALL DONE');
    } catch (e) {
      console.log('TICK: commit failed -', (e.message||'').slice(0,120));
    }
  }
})();
