// scripts/generate_event_comics.js
//
// 用 AI 生图 API 给每个事件生成漫画图。
//
// 用法：
//   1. 先 dry-run 看 prompt（不调 API，不花钱）：
//      node scripts/generate_event_comics.js --dry-run --limit 5
//
//   2. 测试 API 通不通（生 1 张图）：
//      node scripts/generate_event_comics.js --limit 1
//
//   3. 全量生成（137 个事件，约 $5-15 看模型）：
//      node scripts/generate_event_comics.js
//
//   4. 跳过已生成的（断点续跑）：
//      node scripts/generate_event_comics.js --skip-existing
//
// 输出：
//   - assets/comics/<event_id>.png  每个事件 1 张漫画
//   - EVENT_COMICS.md               markdown 文档，可粘贴到飞书

const fs = require('fs');
const path = require('path');
const https = require('https');

// ============================================================
// 配置
// ============================================================
const API_BASE = 'https://token-plan-sgp.xiaomimimo.com';
const API_TOKEN = process.env.AI_API_TOKEN || 'tp-sz1yq87fkogiqz8mlgokobdm025nkiiajbr4l7ydg10zhngm';
const IMAGE_MODEL = process.env.IMAGE_MODEL || 'dall-e-3';  // 或 'sd-xl' 看 token-plan 支持什么

const OUT_DIR = path.join(__dirname, '..', 'assets', 'comics');
const MD_OUT = path.join(__dirname, '..', 'EVENT_COMICS.md');

// CLI args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const SKIP_EXISTING = args.includes('--skip-existing');
const LIMIT = (() => {
  const i = args.indexOf('--limit');
  return i >= 0 && args[i + 1] ? parseInt(args[i + 1], 10) : null;
})();

// ============================================================
// Prompt 模板
// ============================================================
//
// 风格设定：
//   - 像素风插画 / 复古漫画 / 单格
//   - 主角是【小马/小牛】(人形 + 兽头)，穿格子衬衫或卫衣
//   - 配角全部"猫和老鼠的女主人"风格：只露腿/腰/手，不露脸
//   - 中性色调（米黄/灰褐），有打工人疲惫感

const STYLE_TAG = `pixel art cartoon style, retro comic single panel, muted earth tones,
office worker melancholy mood, NO faces on side characters - show only their
legs, torso, hands or back of head (like the cat-and-mouse housewife),
detailed background, 16:9 aspect ratio`;

const CHARACTER_DESC = {
  horse: 'a horse-headed man wearing a wrinkled beige plaid shirt, '
       + 'tired eyes, slouched posture (the protagonist)',
  ox:    'a cow-headed person wearing a dark green hoodie pulled up, '
       + 'big nose ring, weary eyes (the protagonist)',
  default: 'an office worker (faceless, shown from back or torso only)'
};

// 按事件 tag 推断场景
function inferScene(ev) {
  const tags = ev.tags || [];
  const text = (ev.text || '') + (ev.title || '');
  if (tags.includes('boss') || /老板/.test(text)) return 'tense office scene with boss';
  if (tags.includes('client') || /客户|甲方/.test(text)) return 'meeting room with client across the table';
  if (tags.includes('meeting') || /会议|会场|站会/.test(text)) return 'corporate meeting room with PPT projector';
  if (tags.includes('overtime') || /加班|凌晨/.test(text)) return 'dim office at midnight, computer screen glow';
  if (tags.includes('commute') || /地铁|通勤/.test(text)) return 'crowded subway train at rush hour';
  if (tags.includes('hr') || /HR/.test(text)) return 'HR office with formal posters on wall';
  if (tags.includes('holiday') || /春节|中秋|圣诞|双十一/.test(text)) return 'office break room with holiday decorations';
  if (tags.includes('life') && /家|妈|爸|相亲/.test(text)) return 'cramped Chinese apartment, family gathering vibe';
  if (tags.includes('side') || /副业|滴滴|咸鱼/.test(text)) return 'protagonist hunched over laptop at home doing side hustle';
  if (tags.includes('leisure') || /茶水间|摸鱼|咖啡/.test(text)) return 'office break room with coffee machine';
  return 'generic Chinese office cubicle environment';
}

function buildPrompt(ev) {
  const character = ev.characters && ev.characters.length === 1
    ? CHARACTER_DESC[ev.characters[0]] || CHARACTER_DESC.default
    : `either ${CHARACTER_DESC.horse} OR ${CHARACTER_DESC.ox}`;
  const scene = inferScene(ev);
  return [
    STYLE_TAG,
    `Scene: ${scene}.`,
    `Main character: ${character}.`,
    `Story moment: ${ev.title} — ${ev.text}`,
    'IMPORTANT: side characters must not show their faces - only legs, torso, hands, or shown from behind.',
    'No text or speech bubbles in the image.'
  ].join(' ');
}

// ============================================================
// 调 API（OpenAI-compatible images endpoint）
// ============================================================
function callImageAPI(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: IMAGE_MODEL,
      prompt,
      n: 1,
      size: '1024x1024',  // 部分模型不支持 16:9，先用方形
      response_format: 'b64_json'
    });
    const url = new URL('/v1/images/generations', API_BASE);
    const req = https.request({
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      timeout: 60000
    }, res => {
      let chunks = '';
      res.on('data', c => chunks += c);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          return reject(new Error(`HTTP ${res.statusCode}: ${chunks.slice(0, 500)}`));
        }
        try {
          const json = JSON.parse(chunks);
          const b64 = json.data?.[0]?.b64_json;
          if (!b64) return reject(new Error('No b64_json in response: ' + chunks.slice(0, 500)));
          resolve(Buffer.from(b64, 'base64'));
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ============================================================
// 主流程
// ============================================================
async function main() {
  // 加载 events.js（hack: 模拟 window）
  global.window = {};
  require(path.join(__dirname, '..', 'events.js'));
  let events = global.window.EVENTS;
  if (LIMIT) events = events.slice(0, LIMIT);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`总事件数: ${events.length}`);
  console.log(`模式: ${DRY_RUN ? 'DRY-RUN（不调 API）' : '真实生图'}`);
  if (DRY_RUN) console.log('—— prompt 只打印，不调 API 不写图 ——');
  console.log('');

  const mdLines = ['# 牛马公司 · 事件漫画图鉴', ''];
  mdLines.push(`> 自动生成 ${new Date().toISOString()}，共 ${events.length} 个事件`);
  mdLines.push('');

  let success = 0, skipped = 0, failed = 0;
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    const outFile = path.join(OUT_DIR, `${ev.id}.png`);
    const prompt = buildPrompt(ev);

    process.stdout.write(`[${i + 1}/${events.length}] ${ev.id.padEnd(35)} `);

    if (DRY_RUN) {
      console.log('（dry-run）');
      console.log(`  PROMPT: ${prompt.slice(0, 180)}...`);
      success++;
    } else if (SKIP_EXISTING && fs.existsSync(outFile)) {
      console.log('已存在，跳过');
      skipped++;
    } else {
      try {
        const png = await callImageAPI(prompt);
        fs.writeFileSync(outFile, png);
        console.log(`✓ 写入 ${(png.length / 1024).toFixed(0)}KB`);
        success++;
        // 节流：避免触发频率限制
        await new Promise(r => setTimeout(r, 1500));
      } catch (e) {
        console.log(`✗ ${e.message.slice(0, 100)}`);
        failed++;
      }
    }

    // 累积 markdown
    mdLines.push(`## ${ev.title}`);
    mdLines.push('');
    mdLines.push(`**ID**: \`${ev.id}\` · **Tags**: ${(ev.tags || []).join(', ') || '—'}`);
    mdLines.push('');
    if (!DRY_RUN && fs.existsSync(outFile)) {
      mdLines.push(`![${ev.title}](assets/comics/${ev.id}.png)`);
      mdLines.push('');
    }
    mdLines.push(`> ${ev.text}`);
    mdLines.push('');
    mdLines.push('**选项**：');
    ev.choices.forEach((c, idx) => {
      const text = typeof c.text === 'object' ? c.text.default : c.text;
      mdLines.push(`- ${idx + 1}. ${text}`);
    });
    mdLines.push('');
    mdLines.push('---');
    mdLines.push('');
  }

  fs.writeFileSync(MD_OUT, mdLines.join('\n'));
  console.log('');
  console.log(`完成。成功 ${success} · 跳过 ${skipped} · 失败 ${failed}`);
  console.log(`图片输出：${OUT_DIR}/`);
  console.log(`Markdown：${MD_OUT}`);
}

main().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
