// scripts/gen_dual_character.js
// 给 121 个非角色专属事件生成双角色版本（马头 + 牛头）
// 省成本：mimo 检测现有图是马还是牛 → 只用 Gemini 编辑生成"缺的那一版"
//
// 流程（每个 generic 事件）：
//   1. mimo 看现有 <id>.jpg → 判定 horse/ox
//   2. 现有图 rename → <id>_<已有>.jpg
//   3. Gemini 编辑换头 → <id>_<缺的>.jpg
//
// 角色专属事件（horse_xxx / ox_xxx）：单版即可，rename 加后缀对应自己角色
//
// 用法：
//   node scripts/gen_dual_character.js --dry-run   # 只检测+打印，不生图
//   node scripts/gen_dual_character.js             # 全量
//   node scripts/gen_dual_character.js --skip-existing

const fs = require('fs');
const path = require('path');
const https = require('https');

const MIMO_HOST = 'token-plan-sgp.xiaomimimo.com';
const MIMO_KEY = process.env.MIMO_KEY || 'tp-sz1yq87fkogiqz8mlgokobdm025nkiiajbr4l7ydg10zhngm';
const YUNWU_HOST = 'yunwu.ai';
const YUNWU_PATH = '/v1beta/models/gemini-2.5-flash-image:generateContent';
const YUNWU_KEY = process.env.YUNWU_KEY || 'sk-8IepRQgj5U3hmFP0lMmwpyh2IWUn9CxAyiDauTgjuWpt3ySp';

const DIR = path.join(__dirname, '..', 'assets', 'comics');
const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const SKIP_EXISTING = args.includes('--skip-existing');

// mimo 检测图里是马还是牛
function detectAnimal(file) {
  const b64 = fs.readFileSync(path.join(DIR, file)).toString('base64');
  const body = JSON.stringify({
    model: 'mimo-v2-omni',
    messages: [{ role: 'user', content: [
      { type: 'text', text: '这张图里的主角是马头还是牛头？只回一个字：马 或 牛。' },
      { type: 'image_url', image_url: { url: 'data:image/jpeg;base64,' + b64 } }
    ]}]
  });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: MIMO_HOST, path: '/v1/chat/completions', method: 'POST',
      headers: { 'Authorization': `Bearer ${MIMO_KEY}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 30000
    }, res => {
      let chunks=''; res.on('data',c=>chunks+=c);
      res.on('end',()=>{
        try {
          const txt = (JSON.parse(chunks).choices?.[0]?.message?.content || '').trim();
          if (txt.includes('马')) resolve('horse');
          else if (txt.includes('牛')) resolve('ox');
          else reject(new Error('unclear: ' + txt));
        } catch(e){ reject(new Error(chunks.slice(0,120))); }
      });
    });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

// Gemini 编辑：把现有图的头换成目标动物
function swapHead(srcFile, targetAnimal) {
  const b64 = fs.readFileSync(path.join(DIR, srcFile)).toString('base64');
  const targetDesc = targetAnimal === 'horse'
    ? 'a brown HORSE head with mane'
    : 'a black-and-white COW head with horns and a nose ring';
  const body = JSON.stringify({
    contents: [{ parts: [
      { inlineData: { mimeType: 'image/jpeg', data: b64 } },
      { text: `Edit this image: change ONLY the main protagonist's animal head into ${targetDesc}. Keep the body, clothes, pose, ALL background, ALL other faceless characters, colors, composition and pixel-art style EXACTLY identical. Only swap the head. No text anywhere.` }
    ]}],
    generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '16:9' } }
  });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: YUNWU_HOST, path: YUNWU_PATH, method: 'POST',
      headers: { 'x-goog-api-key': YUNWU_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 120000
    }, res => {
      let chunks=''; res.on('data',c=>chunks+=c);
      res.on('end',()=>{
        if (res.statusCode >= 400) return reject(new Error(`HTTP ${res.statusCode}: ${chunks.slice(0,150)}`));
        try {
          const parts = JSON.parse(chunks).candidates?.[0]?.content?.parts || [];
          const img = parts.find(p => p.inlineData || p.inline_data);
          if (!img) return reject(new Error('no image'));
          const d = img.inlineData || img.inline_data;
          resolve(Buffer.from(d.data, 'base64'));
        } catch(e){ reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

// JPEG 压缩（用 sips，外部命令）
const { execSync } = require('child_process');
function compressInPlace(file) {
  try {
    execSync(`sips -Z 960 -s format jpeg -s formatOptions 82 "${path.join(DIR, file)}" --out "${path.join(DIR, file)}" >/dev/null 2>&1`);
  } catch (e) { /* ignore */ }
}

(async () => {
  global.window = {};
  require(path.join(__dirname, '..', 'events.js'));
  const events = global.window.EVENTS;

  let done = 0, skipped = 0, failed = 0;
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    process.stdout.write(`[${i+1}/${events.length}] ${ev.id.padEnd(34)} `);

    // 角色专属事件：单版即可，直接 rename 加后缀（不烧 token）
    if (ev.characters && ev.characters.length === 1) {
      const ch = ev.characters[0];
      const src = path.join(DIR, `${ev.id}.jpg`);
      const dst = path.join(DIR, `${ev.id}_${ch}.jpg`);
      if (fs.existsSync(src) && !fs.existsSync(dst)) {
        if (!DRY) fs.copyFileSync(src, dst);
        console.log(`角色专属(${ch}) → 复制为 _${ch}`);
      } else {
        console.log(`角色专属(${ch}) 已就绪`);
      }
      skipped++;
      continue;
    }

    // generic 事件：双版本
    const horseFile = `${ev.id}_horse.jpg`;
    const oxFile = `${ev.id}_ox.jpg`;
    if (SKIP_EXISTING && fs.existsSync(path.join(DIR, horseFile)) && fs.existsSync(path.join(DIR, oxFile))) {
      console.log('双版已存在跳过'); skipped++; continue;
    }
    if (!fs.existsSync(path.join(DIR, `${ev.id}.jpg`))) {
      console.log('⚠️ 无源图，跳过'); skipped++; continue;
    }

    try {
      const existing = await detectAnimal(`${ev.id}.jpg`);
      const missing = existing === 'horse' ? 'ox' : 'horse';
      if (DRY) {
        console.log(`检测=${existing}，需生成 ${missing}`);
        done++;
        continue;
      }
      // rename 现有 → _existing
      fs.copyFileSync(path.join(DIR, `${ev.id}.jpg`), path.join(DIR, `${ev.id}_${existing}.jpg`));
      // 生成缺的
      const buf = await swapHead(`${ev.id}.jpg`, missing);
      const tmpFile = `${ev.id}_${missing}.jpg`;
      fs.writeFileSync(path.join(DIR, tmpFile), buf);
      compressInPlace(tmpFile);
      const sz = (fs.statSync(path.join(DIR, tmpFile)).size / 1024).toFixed(0);
      console.log(`✓ 有=${existing}，生成 ${missing} (${sz}KB)`);
      done++;
      await new Promise(r => setTimeout(r, 800));
    } catch (e) {
      console.log(`✗ ${e.message.slice(0,80)}`);
      failed++;
    }
  }
  console.log(`\n完成。处理 ${done} · 跳过 ${skipped} · 失败 ${failed}`);
})();
