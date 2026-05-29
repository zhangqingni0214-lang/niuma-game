// scripts/gen_hooks_mimo.js
// 用小米 mimo-v2-omni 给每个事件生成 ≤30 字的对话气泡钩子文案
// 输出到 data/hooks.json
//
// 用法：
//   node scripts/gen_hooks_mimo.js              # 跑全量（已有则跳过）
//   node scripts/gen_hooks_mimo.js --limit 10   # 只跑前 10 个
//   node scripts/gen_hooks_mimo.js --force      # 全量重跑（覆盖已有）

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_HOST = 'token-plan-sgp.xiaomimimo.com';
const API_PATH = '/v1/chat/completions';
const API_KEY = process.env.MIMO_KEY || 'tp-sz1yq87fkogiqz8mlgokobdm025nkiiajbr4l7ydg10zhngm';
const MODEL = 'mimo-v2-omni';

const HOOKS_FILE = path.join(__dirname, '..', 'data', 'hooks.json');

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const LIMIT = (() => { const i = args.indexOf('--limit'); return i >= 0 ? parseInt(args[i + 1], 10) : null; })();

// system prompt：让 mimo 模仿游戏文风（嘴硬牛马、刻薄、不绕弯）
const SYSTEM = `你是一个游戏文案编辑。这是一款叫"牛马公司"的打工人轮回模拟器，
文风是【嘴硬、刻薄、精准、不绕弯】，第二人称视角。

我会给你一个事件的标题和正文。你需要生成一句【漫画对话气泡里的话】，
要求：
- ≤30 个汉字（含标点符号、emoji 计入）
- 第二人称或第一人称都可，要符合"打工人内心独白"或"现场对白"语感
- 抓住事件最戏剧性的一句话，可以是别人对你说的，也可以是你心里的吐槽
- 不要直接抄事件原文，要凝练、要锋利
- 不要解释，直接输出气泡里的那句话，不要带引号

输出严格 JSON：{ "bubble": "..." }，不要其他内容。`;

function callMimo(ev) {
  return new Promise((resolve, reject) => {
    const userMsg = `事件标题：${ev.title}\n事件正文：${ev.text}`;
    const body = JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: userMsg }
      ]
    });
    const req = https.request({
      hostname: API_HOST, path: API_PATH, method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      timeout: 30000
    }, res => {
      let chunks = '';
      res.on('data', c => chunks += c);
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error(`HTTP ${res.statusCode}: ${chunks.slice(0, 200)}`));
        try {
          const json = JSON.parse(chunks);
          const content = json.choices?.[0]?.message?.content || '';
          // 解析 JSON，容错处理（mimo 有时输出带 markdown code block）
          const cleaned = content.replace(/```json|```/g, '').trim();
          const data = JSON.parse(cleaned);
          if (!data.bubble) return reject(new Error('No bubble field: ' + content.slice(0, 200)));
          // 硬截断 30 字（mimo 偶尔超限）
          let bubble = data.bubble.trim();
          if (bubble.length > 30) bubble = bubble.slice(0, 29) + '…';
          resolve({ bubble, usage: json.usage });
        } catch (e) { reject(new Error('Parse fail: ' + chunks.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  global.window = {};
  require(path.join(__dirname, '..', 'events.js'));
  let events = global.window.EVENTS;
  if (LIMIT) events = events.slice(0, LIMIT);

  // 加载已有 hooks
  fs.mkdirSync(path.dirname(HOOKS_FILE), { recursive: true });
  let hooks = {};
  if (fs.existsSync(HOOKS_FILE) && !FORCE) {
    hooks = JSON.parse(fs.readFileSync(HOOKS_FILE, 'utf8'));
    console.log('已加载', Object.keys(hooks).length, '条现有钩子');
  }

  console.log(`待生成 ${events.length} 个事件钩子（model=${MODEL}）`);
  console.log('');

  let success = 0, skipped = 0, failed = 0;
  let totalTokens = 0;
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    process.stdout.write(`[${i + 1}/${events.length}] ${ev.id.padEnd(36)} `);
    if (hooks[ev.id] && !FORCE) {
      console.log(`⊘ 已存在："${hooks[ev.id]}"`);
      skipped++;
      continue;
    }
    try {
      const { bubble, usage } = await callMimo(ev);
      hooks[ev.id] = bubble;
      totalTokens += usage.total_tokens;
      const lenWarn = bubble.length > 30 ? ` ⚠️ ${bubble.length}字` : '';
      console.log(`✓ "${bubble}"${lenWarn}`);
      success++;
      // 每 5 个保存一次（避免半途崩溃丢数据）
      if (i % 5 === 0) fs.writeFileSync(HOOKS_FILE, JSON.stringify(hooks, null, 2));
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.log(`✗ ${e.message.slice(0, 100)}`);
      failed++;
    }
  }

  fs.writeFileSync(HOOKS_FILE, JSON.stringify(hooks, null, 2));
  console.log('');
  console.log(`完成。新生成 ${success} · 跳过 ${skipped} · 失败 ${failed}`);
  console.log(`累计 tokens: ${totalTokens}`);
  console.log(`输出：${HOOKS_FILE}`);
})();
