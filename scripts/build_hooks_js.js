// scripts/build_hooks_js.js
// 把 data/hooks.json 转成 hooks.js（浏览器可直接 <script> 引入）
//   window.EVENT_HOOKS = { eventId: "钩子文案", ... }
//
// 用法：node scripts/build_hooks_js.js

const fs = require('fs');
const path = require('path');

const HOOKS_JSON = path.join(__dirname, '..', 'data', 'hooks.json');
const OUT_JS = path.join(__dirname, '..', 'hooks.js');

const hooks = JSON.parse(fs.readFileSync(HOOKS_JSON, 'utf8'));
const count = Object.keys(hooks).length;

const js = `// hooks.js — 自动生成，勿手改
// 事件漫画气泡文案（mimo 生成，≤30 字）
// 重新生成：node scripts/build_hooks_js.js
// 共 ${count} 条
window.EVENT_HOOKS = ${JSON.stringify(hooks, null, 2)};
`;

fs.writeFileSync(OUT_JS, js);
console.log(`✓ 写入 ${OUT_JS}（${count} 条钩子）`);
