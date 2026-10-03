// Generate crawlable representations from this explorer's existing source content.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const parse5 = require('parse5');
const { escapeHtml: esc, loadData, renderTemplate, htmlToMarkdown, styleBlock } = require('./static-content.cjs');
const root = __dirname;
const src = path.join(root, 'src/app');
const output = path.resolve(process.argv[2] || path.join(root, 'dist/mempool/browser/resources/seo'));
const origin = 'https://btc.tx.taxi';
const read = file => fs.readFileSync(path.join(src, file), 'utf8');
const data = loadData(path.join(src, 'docs/api-docs/api-docs-data.ts'));
const image = {"url": "https://tx.taxi/assets/screenshots/btc-transaction-eb316e19774e.jpg", "width": 1440, "height": 1960, "alt": "A Bitcoin transaction page in btc.tx.taxi, showing confirmation status, fee, inputs and outputs.", "source": "https://btc.tx.taxi/tx/d214365aaba56709539e379074870857a8c0f5b5208deff9619f724e9b8ab537", "capturedAt": "2026-09-27T22:28:21.227Z", "fullPage": true, "sha256": "eb316e19774ef51a05743ab3fda8231bda1d26053a9482d6736dc5e6d8e9684c"};
const pages = [];
const registry = [
  ['/', 'Bitcoin Explorer', 'Explore Bitcoin blocks, transactions, fees, and mempool activity with btc.tx.taxi.', null],
  ['/about', 'About btc.tx.taxi', 'Learn about btc.tx.taxi, a Bitcoin block and mempool explorer in the tx.taxi multi-chain family.', 'components/about/about.component.html'],
  ['/privacy-policy', 'Privacy Policy', 'Privacy information for Bitcoin explorer lookups, request data and browser preferences on btc.tx.taxi.', 'components/privacy-policy/privacy-policy.component.html'],
  ['/terms-of-service', 'Terms of Service', 'Terms for the btc.tx.taxi Bitcoin explorer and its informational network data.', 'components/terms-of-service/terms-of-service.component.html'],
  ['/trademark-policy', 'Trademark and Attribution', 'tx.taxi identity, Mempool open-source attribution and applicable license information.', 'components/trademark-policy/trademark-policy.component.html'],
  ['/docs/faq', 'Bitcoin Explorer FAQ', 'Answers about Bitcoin transactions, confirmations, mempool activity, fees and block explorer data.', 'docs/faq'],
  ['/docs/api/rest', 'Bitcoin REST API', 'Bitcoin API documentation for addresses, transactions, blocks, fees, mining and network data.', 'docs/rest'],
  ['/docs/api/websocket', 'Bitcoin WebSocket API', 'Documented live Bitcoin block, mempool, transaction and address subscriptions.', 'docs/websocket'],
  ['/blocks/1', 'Bitcoin Blocks', 'Browse recent Bitcoin blocks and their heights, timestamps, rewards, fees, transaction counts and sizes.', 'components/blocks-list/blocks-list.component.html'],
  ['/txs', 'Recent Bitcoin Transactions', 'Browse recent Bitcoin transactions and inspect public transaction records.', 'components/recent-transactions-list/recent-transactions-list.component.html'],
  ['/rbf', 'Bitcoin Transaction Replacements', 'Inspect Bitcoin replace-by-fee transaction replacements observed by the configured mempool backend.', 'components/rbf-list/rbf-list.component.html'],
  ['/mining', 'Bitcoin Mining Dashboard', 'Bitcoin mining pool activity, hashrate, difficulty, rewards and fee data.', 'components/mining-dashboard/mining-dashboard.component.html'],
  ['/tools/calculator', 'Bitcoin Calculator', 'Convert between BTC, satoshis and fiat using the Bitcoin price selected by the calculator.', 'components/calculator/calculator.component.html'],
  ['/tx/push', 'Broadcast a Bitcoin Transaction', 'Submit an already signed raw Bitcoin transaction through the configured public backend.', 'components/push-transaction/push-transaction.component.html'],
  ['/tx/test', 'Test a Bitcoin Transaction', 'Check a raw Bitcoin transaction using the existing transaction testing tool.', 'components/test-transactions/test-transactions.component.html'],
  ['/graphs/mempool', 'Bitcoin Mempool Graph', 'View Bitcoin mempool size and fee history across the available chart intervals.', 'components/statistics/statistics.component.html'],
  ['/graphs/mining/hashrate-difficulty', 'Bitcoin Hashrate and Difficulty', 'View Bitcoin network hashrate estimates and mining difficulty over time.', 'components/hashrate-chart/hashrate-chart.component.html'],
  ['/graphs/mining/pools-dominance', 'Bitcoin Mining Pool Dominance', 'Compare observed Bitcoin mining pool shares over the available history.', 'components/hashrates-chart-pools/hashrate-chart-pools.component.html'],
  ['/graphs/mining/pools', 'Bitcoin Mining Pool Rankings', 'Compare Bitcoin mining pool rankings from the configured public data backend.', 'components/pool-ranking/pool-ranking.component.html'],
  ['/graphs/mining/block-fees', 'Bitcoin Block Fees', 'View the Bitcoin transaction fees collected in blocks over time.', 'components/block-fees-graph/block-fees-graph.component.html'],
  ['/graphs/mining/block-fees-subsidy', 'Bitcoin Fees and Block Subsidy', 'Compare Bitcoin transaction fees with the block subsidy over time.', 'components/block-fees-subsidy-graph/block-fees-subsidy-graph.component.html'],
  ['/graphs/mining/block-rewards', 'Bitcoin Block Rewards', 'View Bitcoin block reward history from the configured explorer data backend.', 'components/block-rewards-graph/block-rewards-graph.component.html'],
  ['/graphs/mining/block-fee-rates', 'Bitcoin Block Fee Rates', 'Compare Bitcoin fee rate history in satoshis per virtual byte.', 'components/block-fee-rates-graph/block-fee-rates-graph.component.html'],
  ['/graphs/mining/block-sizes-weights', 'Bitcoin Block Sizes and Weights', 'View Bitcoin block size and weight history with the explorer charts.', 'components/block-sizes-weights-graph/block-sizes-weights-graph.component.html'],
  ['/graphs/price', 'Bitcoin Price History', 'View Bitcoin price history in the selected fiat currency.', 'components/price-chart/price-chart.component.html'],
  ['/mempool-block/0', 'Projected Bitcoin Mempool Block', 'Inspect the first projected Bitcoin mempool block and its fee range. This is an estimate, not a confirmed block.', 'components/mempool-block/mempool-block.component.html'],
  ['/status', 'Bitcoin Network Status', 'Inspect the public Bitcoin network status view supplied by the configured explorer backend.', 'components/status-view/status-view.component.html'],
];
const aliases = { '/docs': '/docs/faq', '/docs/api': '/docs/api/rest', '/api': '/docs/api/rest', '/graphs': '/graphs/mempool', '/blocks': '/blocks/1', '/mining/blocks': '/blocks/1', '/pushtx': '/tx/push', '/tx': '/', '/index.html': '/', '/api/faq': '/docs/faq', '/api/api': '/docs/api/rest', '/api/api/rest': '/docs/api/rest', '/api/api/websocket': '/docs/api/websocket' };
const excluded = [
  { route: '/lightning/*', reason: 'LIGHTNING=false; no native Lightning service is enabled.' },
  { route: '/testnet/*,/testnet4/*,/signet/*,/regtest/*,/liquid/*', reason: 'Corresponding production network flags are disabled.' },
  { route: '/monitoring,/nodes,/faucet,/treasuries', reason: 'OFFICIAL_MEMPOOL_SPACE-only routes are not registered in this fork.' },
  { route: '/stratum', reason: 'STRATUM_ENABLED=false.' },
  { route: '/blocks/stale,/graphs/mining/block-health', reason: 'Block auditing is disabled with AUDIT=false; omit audit-only content.' },
  { route: '/view/*,/widget/*,/clock/*,/preview/*', reason: 'Embedded and presentation variants are not primary search documents.' },
  { route: '/wallet/:wallet', reason: 'Wallet descriptor input is user-specific, not a public content index.' },
  { route: '/tx/:id,/block/:id,/address/:id,/mining/pool/:slug,/blocks/:page,/mempool-block/:id', reason: 'Valid records remain crawlable through their own URLs; unbounded entity/pagination combinations are not enumerated in the static sitemap.' },
];
function enabled(item) {
  return (!item.showConditions || item.showConditions.includes('')) && !item.options?.officialOnly && !item.options?.electrsOnly && !item.options?.auditOnly;
}
function faqTemplates() {
  const tree = parse5.parseFragment(read('docs/api-docs/api-docs.component.html'));
  const result = new Map();
  function visit(node) {
    const type = node.attrs?.find(a => a.name === 'type')?.value;
    if (node.tagName === 'ng-template' && type) result.set(type, parse5.serialize(node));
    for (const child of node.childNodes || []) visit(child);
  }
  visit(tree);return result;
}
const answers = faqTemplates();
function docContent(kind) {
  const items = (kind === 'faq' ? data.taxiFaqData : kind === 'rest' ? data.taxiRestApiDocsData : data.wsApiDocsData).filter(enabled);
  let count = 0;
  const body = items.map(item => {
    if (item.type === 'category') return `<h2 id="${esc(item.fragment)}">${esc(item.title)}</h2>`;
    count++;
    let detail = kind === 'faq' ? answers.get(item.fragment) : item.description?.default || '';
    if (detail === undefined) throw new Error(`Missing source FAQ answer: ${item.fragment}`);
    if (kind === 'faq') detail = renderTemplate(detail);
    const endpoint = kind === 'rest' ? `<p><code>${esc(item.httpRequestMethod)} /api${esc(item.urlString)}</code></p>` : '';
    const payload = item.payload ? `<h4>Payload</h4><pre><code>${esc(item.payload)}</code></pre>` : '';
    const sample = item.codeExample?.default?.codeSampleMainnet?.response;
    const example = sample ? `<h4>Example response</h4><pre><code>${esc(sample)}</code></pre>` : '';
    return `<section class="doc-item-container" id="${esc(item.fragment)}"><h3>${esc(item.title)}</h3><div class="endpoint-content">${endpoint}${detail}${payload}${example}</div></section>`;
  }).join('\n');
  const intro = renderTemplate(read('shared/components/tx-taxi-docs-intro/tx-taxi-docs-intro.component.html'), { chainName: 'Bitcoin', chainHost: 'btc.tx.taxi', context: 'documentation' });
  return { body: `<div class="container-xl">${intro}<nav class="nav-tabs" aria-label="Bitcoin documentation"><a href="/docs/faq">FAQ</a><a href="/docs/api/rest">API - REST</a><a href="/docs/api/websocket">API - WebSocket</a></nav><main class="doc-content">${body}</main></div>`, count };
}
function staticLabels(source) {
  const tree = parse5.parseFragment(source);const labels = [];
  function text(node) { return node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join(''); }
  function visit(node) {
    if (/^h[1-4]$/.test(node.tagName || '') || node.tagName === 'th') {
      const label = text(node).replace(/{{[\s\S]*?}}/g, '').replace(/\s+/g, ' ').trim();
      if (label && !labels.includes(label)) labels.push(label);
    }
    for (const child of node.childNodes || []) visit(child);
  }
  visit(tree);return labels;
}
for (const [route, title, description, source] of registry) {
  let content, sectionCount = 0;
  if (source?.startsWith('docs/')) { const doc = docContent(source.slice(5));content = doc.body;sectionCount = doc.count; }
  else if (source && ['/about', '/privacy-policy', '/terms-of-service', '/trademark-policy'].includes(route)) {
    content = renderTemplate(read(source));
    content = content.replace(/<app-tx-taxi-docs-intro\b[^>]*><\/app-tx-taxi-docs-intro>/, renderTemplate(read('shared/components/tx-taxi-docs-intro/tx-taxi-docs-intro.component.html'), { chainName: 'Bitcoin', chainHost: 'btc.tx.taxi', context: 'explorer' }));
  } else {
    // Dynamic values remain client-rendered; never substitute invented live data.
    const labels = source ? staticLabels(read(source)) : [];
    content = `<main class="container-xl"><h1>${esc(title)}</h1><p>${esc(description)}</p>${labels.length ? `<ul>${labels.map(label => `<li>${esc(label)}</li>`).join('')}</ul>` : ''}</main>`;
  }
  const type = route.startsWith('/docs/') ? 'TechArticle' : route === '/about' ? 'AboutPage' : 'WebPage';
  if (route === '/about') content = `<app-about>${content}</app-about>`;
  if (route.startsWith('/docs/')) content = `<app-api-docs>${content}</app-api-docs>`;
  const markdown = `# ${title}\n\n> ${description}\n\nCanonical: ${origin}${route}\n\n${htmlToMarkdown(content)}`;
  const schema = { '@context': 'https://schema.org', '@type': type, name: title, description, url: origin + route, inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: 'btc.tx.taxi', url: origin + '/' } };
  pages.push({ route, title: `${title} | btc.tx.taxi`, description, content, markdown, schema, source: source || 'frontend/src/app/services/seo.service.ts', sectionCount });
}
const css = styleBlock(path.join(src, 'components/about/about.component.scss'), '.btc-readable app-about') + styleBlock(path.join(src, 'shared/components/tx-taxi-docs-intro/tx-taxi-docs-intro.component.scss'), '.btc-readable') + styleBlock(path.join(src, 'docs/api-docs/api-docs.component.scss'), '.btc-readable app-api-docs') + '.btc-readable app-api-docs h3{display:block}.btc-readable app-api-docs .doc-content{width:100%;float:none}.btc-readable pre{max-width:100%;overflow:auto}.btc-readable app-api-docs .endpoint-content{position:static;opacity:1;top:auto}';
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'pages.json'), JSON.stringify({ origin, pages, aliases, excluded, css, image, chain: 'Bitcoin' }));
const clientPages = Object.fromEntries(pages.map(p => [p.route, { title: p.title, description: p.description, schema: p.schema }]));
fs.writeFileSync(path.join(output, 'routes.json'), JSON.stringify(clientPages));
fs.writeFileSync(path.join(src, 'services/native-seo-data.ts'), `// Generated from build-indexable-pages.cjs; do not edit.\nexport const nativeSeoPages: Record<string, { title: string; description: string; schema: Record<string, unknown> }> = ${JSON.stringify(clientPages, null, 2)};\n`);
console.log(`Generated ${pages.length} Bitcoin canonical pages, source-backed docs and Markdown.`);
