// scripts/gen_comic_yunwu.js
// 用 yunwu 的 gemini-2.5-flash-image 原生端点生成 16:9 干净场景图（不画字）
//
// 气泡用 HTML overlay（2A 方案），所以 AI 只画场景，不画文字。
//
// 依赖：先跑 scripts/gen_hooks_mimo.js 生成 data/hooks.json（用于 UI 气泡，不用于生图）
//
// 用法：
//   node scripts/gen_comic_yunwu.js              # 默认 2 张
//   node scripts/gen_comic_yunwu.js --limit 10
//   node scripts/gen_comic_yunwu.js --all        # 全量 137
//   node scripts/gen_comic_yunwu.js --all --skip-existing  # 断点续跑

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_HOST = 'yunwu.ai';
const API_PATH = '/v1beta/models/gemini-2.5-flash-image:generateContent';  // 原生端点
const API_KEY = process.env.YUNWU_KEY || 'sk-8IepRQgj5U3hmFP0lMmwpyh2IWUn9CxAyiDauTgjuWpt3ySp';
const ASPECT = '16:9';

const OUT_DIR = path.join(__dirname, '..', 'assets', 'comics');
fs.mkdirSync(OUT_DIR, { recursive: true });

const args = process.argv.slice(2);
const SKIP_EXISTING = args.includes('--skip-existing');
const LIMIT = args.includes('--all') ? null :
  (() => { const i = args.indexOf('--limit'); return i >= 0 ? parseInt(args[i + 1], 10) : 2; })();

function inferScene(ev) {
  const tags = ev.tags || [];
  const text = (ev.text || '') + (ev.title || '');
  if (tags.includes('boss') || /老板/.test(text)) return 'tense Chinese open-plan office, a boss figure standing with back to viewer near a PPT projector screen, fluorescent lighting';
  if (tags.includes('meeting') || /会议|会场|站会|评审/.test(text)) return 'Chinese corporate meeting room, PPT projector screen on wall, several people seen only from behind';
  if (tags.includes('client') || /客户|甲方/.test(text)) return 'meeting room, a client figure (faceless, from behind) across the table';
  if (tags.includes('overtime') || /加班|凌晨/.test(text)) return 'dim office at midnight, only one desk lamp on, computer screen glow, empty cubicles';
  if (tags.includes('commute') || /地铁|通勤/.test(text)) return 'packed Beijing subway car at rush hour, faceless commuters crammed together (seen from behind/side)';
  if (tags.includes('hr') || /HR/.test(text)) return 'HR office with corporate motivational posters on the wall';
  if (tags.includes('holiday') || /春节|中秋|圣诞|双十一|年终|月饼/.test(text)) return 'office break room with subtle holiday decorations';
  if ((tags.includes('life') || tags.includes('family')) && /妈|爸|相亲|家|父母|亲戚/.test(text)) return 'cramped Chinese apartment living room, a family member visible only from behind';
  if (tags.includes('side') || /副业|滴滴|咸鱼|小红书|公众号/.test(text)) return 'protagonist hunched over a laptop at home doing a side hustle at night';
  if (tags.includes('leisure') || /茶水间|摸鱼|咖啡/.test(text)) return 'office tea room with a coffee machine';
  if (/房东|房租|中介|物业/.test(text)) return 'cramped Beijing rental apartment, a landlord figure visible only from behind';
  return 'Chinese office cubicle under fluorescent lighting';
}

function buildPrompt(ev) {
  const charPart = ev.characters && ev.characters.length === 1
    ? (ev.characters[0] === 'horse'
        ? 'The protagonist is a horse-headed person in a wrinkled beige plaid shirt, tired weary eyes, slouched.'
        : 'The protagonist is a cow-headed person with a nose ring, wearing a dark green hoodie, weary expression.')
    : 'The protagonist is either a horse-headed OR a cow-headed office worker (pick one).';

  return `Single-panel comic illustration, 16:9 wide horizontal.

Art style: pixel art retro cartoon, muted earth tones (beige, brown, dark green), 1990s seinen manga + pixel-game hybrid, detailed but slightly grainy.

Scene: ${inferScene(ev)}.
${charPart}
All side characters / coworkers / other people MUST be faceless — show them only from behind, or only their torso/legs/hands. Never show a side character's face.

Mood: melancholy, slightly oppressive office-worker atmosphere matching this story beat: "${ev.title} — ${ev.text.slice(0, 80)}".

CRITICAL: Absolutely NO text, NO speech bubbles, NO captions, NO letters or characters of any kind anywhere in the image. Output a clean wordless scene only. No watermark, no border, no signature.`;
}

function callImageAPI(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio: ASPECT }
      }
    });
    const req = https.request({
      hostname: API_HOST, path: API_PATH, method: 'POST',
      headers: {
        'x-goog-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      timeout: 120000
    }, res => {
      let chunks = '';
      res.on('data', c => chunks += c);
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error(`HTTP ${res.statusCode}: ${chunks.slice(0, 200)}`));
        try {
          const json = JSON.parse(chunks);
          const parts = json.candidates?.[0]?.content?.parts || [];
          const imgPart = parts.find(p => p.inlineData || p.inline_data);
          if (!imgPart) return reject(new Error('No image: ' + chunks.slice(0, 200)));
          const d = imgPart.inlineData || imgPart.inline_data;
          const mime = d.mimeType || d.mime_type || 'image/png';
          const ext = mime.includes('jpeg') ? 'jpg' : mime.includes('webp') ? 'webp' : 'png';
          resolve({ ext, data: Buffer.from(d.data, 'base64') });
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function getUsage() {
  return new Promise(resolve => {
    const req = https.request({
      hostname: API_HOST, path: '/v1/dashboard/billing/usage', method: 'GET',
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => { try { resolve(JSON.parse(body).total_usage); } catch { resolve(null); } });
    });
    req.on('error', () => resolve(null));
    req.end();
  });
}

(async () => {
  global.window = {};
  require(path.join(__dirname, '..', 'events.js'));
  let events = global.window.EVENTS;
  if (LIMIT) events = events.slice(0, LIMIT);

  const startUsage = await getUsage();
  console.log(`基线 total_usage: ${startUsage}`);
  console.log(`生成 ${events.length} 张 16:9 干净场景图（不画字，气泡走 HTML）`);
  console.log('');

  let success = 0, skipped = 0, failed = 0;
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    process.stdout.write(`[${i + 1}/${events.length}] ${ev.id.padEnd(36)} `);

    if (SKIP_EXISTING) {
      const exists = ['jpg', 'png', 'webp'].some(e => fs.existsSync(path.join(OUT_DIR, `${ev.id}.${e}`)));
      if (exists) { console.log('已存在跳过'); skipped++; continue; }
    }

    try {
      const t0 = Date.now();
      const { ext, data } = await callImageAPI(buildPrompt(ev));
      // 清掉旧的不同扩展名文件，避免重复
      ['jpg', 'png', 'webp'].forEach(e => {
        const f = path.join(OUT_DIR, `${ev.id}.${e}`);
        if (e !== ext && fs.existsSync(f)) fs.unlinkSync(f);
      });
      fs.writeFileSync(path.join(OUT_DIR, `${ev.id}.${ext}`), data);
      console.log(`✓ ${(data.length / 1024).toFixed(0)}KB ${ext} ${((Date.now() - t0) / 1000).toFixed(1)}s`);
      success++;
    } catch (e) {
      console.log(`✗ ${e.message.slice(0, 90)}`);
      failed++;
    }
    if (i < events.length - 1) await new Promise(r => setTimeout(r, 800));
  }

  const endUsage = await getUsage();
  console.log('');
  console.log(`完成。成功 ${success} · 跳过 ${skipped} · 失败 ${failed}`);
  console.log(`yunwu 用量: ${startUsage} → ${endUsage}（差 ${(endUsage - startUsage).toFixed(1)}）`);
  if (success > 0) console.log(`平均每张: ${((endUsage - startUsage) / success).toFixed(2)} units`);
})();
