#!/usr/bin/env node
'use strict';

/**
 * CLI：proxy-ip-pricing
 *
 *   proxy-ip-pricing                      # 全部服务商概览
 *   proxy-ip-pricing --protocol socks5     # 只看支持 socks5 的
 *   proxy-ip-pricing --cheapest 5          # 月付最便宜的 5 家
 *   proxy-ip-pricing --daily 5             # 按天计价最便宜的 5 家（与月付不可比）
 *   proxy-ip-pricing --search 奔富         # 关键字搜（中英文名 / 邀请码 / 协议）
 *   proxy-ip-pricing --json                # 输出 JSON（喂程序/AI）
 *   proxy-ip-pricing --csv                 # 输出 CSV
 *   proxy-ip-pricing --prompt              # 输出适合喂给 LLM 的紧凑文本
 */

const lib = require('./index.js');

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f) => {
  const i = argv.indexOf(f);
  return i >= 0 ? argv[i + 1] : undefined;
};

function pad(s, n) {
  const w = [...String(s)].reduce((a, c) => a + (c.charCodeAt(0) > 255 ? 2 : 1), 0);
  return String(s) + ' '.repeat(Math.max(0, n - w));
}

if (has('--help') || has('-h')) {
  console.log(require('fs').readFileSync(__filename, 'utf8')
    .split('\n').slice(3, 15).map((l) => l.replace(/^ \*\/?/, '')).join('\n'));
  process.exit(0);
}

let rows = lib.providers;
if (val('--protocol')) rows = lib.byProtocol(val('--protocol'));
if (val('--search')) rows = lib.find(val('--search'));
if (val('--cheapest')) rows = lib.cheapestMonthly(parseInt(val('--cheapest'), 10) || 5);
if (val('--daily')) rows = lib.cheapestDaily(parseInt(val('--daily'), 10) || 5);

if (has('--json')) {
  console.log(JSON.stringify({ meta: lib.meta, providers: rows }, null, 2));
  process.exit(0);
}
if (has('--csv')) {
  console.log(lib.toCSV());
  process.exit(0);
}
if (has('--prompt')) {
  console.log(lib.toPromptText());
  process.exit(0);
}

const m = lib.meta;
console.log('');
console.log(`Proxy IP pricing (China market) — ${m.count} providers | updated ${m.lastUpdated} | data ${m.license}`);
console.log('Source: https://socks5ip.com.cn/jiagezhongxin/');
console.log('');
console.log(pad('Provider', 14) + pad('From', 14) + pad('Coverage', 34) + 'Protocols');
console.log('-'.repeat(96));
for (const p of rows) {
  console.log(pad(p.provider, 14) +
    pad(p.price_from_cny + ' ' + p.price_unit, 14) +
    pad(String(p.coverage || '').slice(0, 24), 34) +
    String(p.protocols || ''));
}
console.log('');
console.log('Note: "Yuan/month" and "Yuan/day" tiers are NOT directly comparable.');
console.log('Registration links include referral codes (no extra cost to you).');
console.log('Always confirm the current price on the provider page before purchase.');
