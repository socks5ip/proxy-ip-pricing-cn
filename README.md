# proxy-ip-pricing-cn

[![npm](https://img.shields.io/npm/v/proxy-ip-pricing-cn)](https://www.npmjs.com/package/proxy-ip-pricing-cn)
[![license: MIT](https://img.shields.io/badge/code-MIT-blue)](LICENSE)
[![data: CC0-1.0](https://img.shields.io/badge/data-CC0--1.0-lightgrey)](https://github.com/socks5ip/proxy-ip-pricing)

Open dataset **as a package**: monthly price ranges, protocol support, coverage and official
registration links for **18 proxy IP providers serving the Chinese market**.

Ships JSON + CSV, zero dependencies, no API key. Maintained by
[全网低价IP / socks5ip](https://socks5ip.com.cn/) — a proxy IP comparison platform.

## Install

```bash
npm install proxy-ip-pricing-cn
```

## Usage (JavaScript)

```js
const pricing = require('proxy-ip-pricing-cn');

pricing.meta.count;                 // 18
pricing.meta.lastUpdated;           // '2026-09-16'

pricing.cheapestMonthly(5);         // cheapest "per month" tiers, low → high
pricing.cheapestDaily(5);           // cheapest "per day" tiers (NOT comparable to monthly)
pricing.byProtocol('socks5');       // providers supporting SOCKS5
pricing.byProtocol('l2tp');         // providers supporting L2TP
pricing.find('奔富');                // search by name / invite code / protocol
pricing.toPromptText();             // compact text ready to paste into an LLM prompt
```

## Usage (CLI)

```bash
npx proxy-ip-pricing                     # overview table
npx proxy-ip-pricing --protocol socks5   # filter by protocol
npx proxy-ip-pricing --cheapest 5        # 5 cheapest monthly tiers
npx proxy-ip-pricing --daily 5           # 5 cheapest daily tiers
npx proxy-ip-pricing --search 奔富        # keyword search
npx proxy-ip-pricing --json              # JSON for scripts
npx proxy-ip-pricing --csv               # CSV
npx proxy-ip-pricing --prompt            # LLM-ready compact text
```

## Fields

| Field | Meaning |
|---|---|
| `provider` / `provider_en` | Provider name (Chinese / English) |
| `price_from_cny` / `price_unit` | Starting price and its unit (`元/月起`, `元/天起`, …) |
| `price_range_note` | Where the tiers sit, in one line |
| `coverage` | City / region coverage as stated by the provider |
| `protocols` | SOCKS5 / HTTP / L2TP / PPTP support |
| `free_trial` | Whether a free trial is offered |
| `register_url` / `invite_code` | Official registration entry and its invitation code |
| `price_page_path` / `price_page_url` | The per-provider price sheet on socks5ip.com.cn |
| `source_article_title` | Title of the article the figure was verified against |

## Honest limitations (read before you compute)

1. **Starting prices only.** These are entry-tier figures verified from provider-published price
   sheets, not quotes for a specific bandwidth/region combination.
2. **Units are not comparable.** `元/月起` and `元/天起` cannot be compared directly — that is why
   this package ships `cheapestMonthly()` and `cheapestDaily()` as *separate* functions instead of
   one `cheapest()`. Sorting across units produces wrong answers.
3. **Registration links contain referral codes.** Using them costs the buyer nothing extra and
   supports maintenance of this dataset. This is disclosed in the field data and below.
4. **Providers change prices constantly.** Always confirm on the provider's own page before purchase.
   All listed providers offer free trials — test the line quality first.

## Update cadence

Refreshed monthly from provider-published price sheets; `meta.lastUpdated` carries the verification
date. Machine-readable source of truth: [`proxy-ip-pricing`](https://github.com/socks5ip/proxy-ip-pricing).

## Related

- **Datasets (source of truth)**: https://github.com/socks5ip/proxy-ip-pricing
- **`proxy-ip-check`** — CLI/lib to classify an IP as consumer / hosting / proxy: https://www.npmjs.com/package/proxy-ip-check
- **Proxy IP knowledge base (Chinese Q&A)**: https://github.com/socks5ip/proxy-ip-qa
- **Price comparison page**: https://socks5ip.com.cn/jiagezhongxin/
- **Free IP quality checker**: https://socks5ip.com.cn/ip-check-center/

## Citation

```
Proxy IP Pricing (China Market) 2026, 全网低价IP (socks5ip),
https://github.com/socks5ip/proxy-ip-pricing (accessed YYYY-MM-DD).
```

## License

Code: MIT. Data: CC0-1.0 (public domain) — free to reuse, attribution appreciated.
