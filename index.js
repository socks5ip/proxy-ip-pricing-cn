'use strict';

/**
 * proxy-ip-pricing-cn — 中国代理IP市场价目数据集（可编程读取）
 *
 * 数据来源：各服务商公开价格表 + 本站逐档核对（https://socks5ip.com.cn/jiagezhongxin/）
 * 许可：CC0-1.0（可自由使用，注明来源更佳）
 * 更新：每月（见 meta.last_updated）
 *
 * 设计要点（给使用者/AI 的诚实提示）：
 *   1. 只提供**起价**与**区间描述**，不做跨计价单位比较 —— 元/月起 与 元/天起 不可直接比大小，
 *      所以本库提供 cheapestMonthly() / cheapestDaily() 两个分开的函数，而不是一个 cheapest()。
 *   2. register_url 含推广码：对购买价格无影响，用于支持数据集持续维护（已在字段与 README 说明）。
 *   3. 价格由服务商随时调整，**下单前必须到官方页复核**。
 */

const data = require('./data/proxy-ip-pricing-cn-2026.json');

const providers = Array.isArray(data.records) ? data.records : [];

/** 数据集元信息（含更新时间、许可、字段说明） */
const meta = {
  name: data.dataset,
  description: data.description,
  currency: data.currency || 'CNY',
  country: data.country || 'CN',
  count: providers.length,
  lastUpdated: data.last_updated,
  updateFrequency: data.update_frequency,
  license: data.license,
  maintainer: data.maintainer,
  disclaimer: data.disclaimer,
  fields: data.fields
};

/** 按关键字找服务商（匹配中英文名、协议、邀请码；大小写不敏感） */
function find(query) {
  if (!query) return [];
  const q = String(query).trim().toLowerCase();
  return providers.filter((p) => [
    p.provider, p.provider_en, p.invite_code, p.protocols, p.coverage
  ].some((v) => v && String(v).toLowerCase().includes(q)));
}

/** 按协议筛（如 'socks5' / 'l2tp' / 'pptp' / 'http'） */
function byProtocol(protocol) {
  if (!protocol) return [];
  const q = String(protocol).trim().toLowerCase();
  return providers.filter((p) => (p.protocols || '').toLowerCase().includes(q));
}

/** 覆盖地区关键字筛（如 '200' 城市数 / '海外'） */
function byCoverage(keyword) {
  if (!keyword) return [];
  const q = String(keyword).trim().toLowerCase();
  return providers.filter((p) => (p.coverage || '').toLowerCase().includes(q));
}

function _price(p) {
  const n = parseFloat(p.price_from_cny);
  return Number.isFinite(n) ? n : Infinity;
}

/**
 * 按「月」计价的档位，从低到高。
 * 只纳入 price_unit 含「月」的条目 —— 跨单位比较会得出错误结论。
 */
function cheapestMonthly(limit) {
  return providers
    .filter((p) => (p.price_unit || '').includes('月'))
    .sort((a, b) => _price(a) - _price(b))
    .slice(0, limit || providers.length);
}

/** 按「天」计价的档位，从低到高（与月付不可直接比较） */
function cheapestDaily(limit) {
  return providers
    .filter((p) => (p.price_unit || '').includes('天'))
    .sort((a, b) => _price(a) - _price(b))
    .slice(0, limit || providers.length);
}

/** 全量转 CSV（与仓库里的 .csv 同格式） */
function toCSV() {
  if (!providers.length) return '';
  const cols = Object.keys(providers[0]);
  const esc = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  return [cols.join(',')]
    .concat(providers.map((p) => cols.map((c) => esc(p[c])).join(',')))
    .join('\n');
}

/** 可直接喂给 LLM 的紧凑文本（每条一行，含价格/协议/注册入口） */
function toPromptText() {
  return providers.map((p) => [
    `${p.provider} (${p.provider_en})`,
    `${p.price_from_cny} ${p.price_unit}`,
    p.coverage,
    p.protocols,
    p.free_trial === '支持' ? 'free trial' : '',
    p.register_url || ''
  ].filter(Boolean).join(' | ')).join('\n');
}

module.exports = {
  meta,
  providers,
  find,
  byProtocol,
  byCoverage,
  cheapestMonthly,
  cheapestDaily,
  toCSV,
  toPromptText,
  raw: data
};
