#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const parse5 = require('parse5');
const sharp = require('sharp');

const origin = 'https://btc.tx.taxi';
const apiOrigin = (process.env.BTC_OG_API_ORIGIN || 'https://mempool.space').replace(/\/$/, '');
const indexPath = process.env.BTC_OG_INDEX || '/usr/share/nginx/html/en-US/index.html';
const logoPath = path.join(path.dirname(indexPath), '..', 'resources/branding/btc-dark-full.svg');
const html = fs.readFileSync(indexPath, 'utf8');
const logo = fs.existsSync(logoPath) ? `data:image/svg+xml;base64,${fs.readFileSync(logoPath).toString('base64')}` : null;
const cache = new Map();
const pending = new Map();
const imageCache = new Map();
const imagePending = new Map();
let active = 0;
let activeImages = 0;

function escape(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function route(pathname) {
  const match = pathname.match(/^\/(tx|block|address)\/([^/]+?)(?:\.png)?\/?$/);
  if (!match) return null;
  const [, kind, id] = match;
  if (kind === 'tx' && !/^[0-9a-f]{64}$/i.test(id)) return null;
  if (kind === 'block' && !/^(?:[0-9a-f]{64}|\d{1,10})$/i.test(id)) return null;
  if (kind === 'address' && !/^(?:[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[ac-hj-np-z02-9]{11,87})$/i.test(id)) return null;
  return { kind, id };
}

async function api(pathname) {
  const response = await fetch(`${apiOrigin}${pathname}`, {
    signal: AbortSignal.timeout(3500),
    headers: { accept: 'application/json' },
  });
  if (!response.ok || !response.body) throw new Error(`Bitcoin API returned ${response.status}`);
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2_000_000) throw new Error('Bitcoin API response too large');
      chunks.push(value);
    }
  } finally {
    reader.cancel().catch(() => {});
  }
  const body = Buffer.concat(chunks).toString('utf8');
  if (pathname.startsWith('/api/block-height/') && /^[0-9a-f]{64}$/i.test(body)) return body;
  return JSON.parse(body);
}

function count(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value.toLocaleString('en-US') : null;
}

function bitcoin(sats) {
  if (!Number.isSafeInteger(sats) || sats < 0) return null;
  return `${(sats / 1e8).toFixed(8)} BTC`;
}

function short(value, max = 55) {
  const text = String(value);
  return text.length > max ? `${text.slice(0, Math.ceil((max - 3) / 2))}...${text.slice(-Math.floor((max - 3) / 2))}` : text;
}

function date(seconds) {
  return Number.isSafeInteger(seconds) && seconds > 0
    ? new Date(seconds * 1000).toISOString().replace('T', ' ').slice(0, 16) + ' UTC' : null;
}

async function entity(kind, id) {
  if (kind === 'tx') {
    const tx = await api(`/api/tx/${id}`);
    if (tx.txid?.toLowerCase() !== id.toLowerCase()) throw new Error('Transaction mismatch');
    const coinbase = tx.vin?.[0]?.is_coinbase === true;
    const value = Array.isArray(tx.vout) ? tx.vout.reduce((sum, output) => sum + (Number.isSafeInteger(output.value) ? output.value : 0), 0) : null;
    const state = tx.status?.confirmed ? 'Confirmed' : 'Unconfirmed';
    return {
      heading: 'Transaction', subtitle: tx.txid,
      description: `Bitcoin transaction ${tx.txid}. ${state}${count(tx.status?.block_height) !== null ? ` in block ${count(tx.status.block_height)}` : ''}.`,
      rows: [
        ['Status', state], ['Value', bitcoin(value)],
        ['Fee', coinbase ? 'Coinbase' : bitcoin(tx.fee)],
        ['Inputs', count(tx.vin?.length)], ['Outputs', count(tx.vout?.length)],
        ['Block', count(tx.status?.block_height)], ['Time', date(tx.status?.block_time)],
      ],
      ttl: tx.status?.confirmed ? 300_000 : 15_000,
    };
  }
  if (kind === 'block') {
    const hash = /^\d{1,10}$/.test(id) ? await api(`/api/block-height/${id}`) : id;
    if (!/^[0-9a-f]{64}$/i.test(hash)) throw new Error('Invalid block hash');
    const block = await api(`/api/block/${hash}`);
    if (block.id?.toLowerCase() !== hash.toLowerCase()) throw new Error('Block mismatch');
    return {
      heading: `Block ${count(block.height) || short(id)}`, subtitle: block.id,
      description: `Bitcoin block ${count(block.height) || block.id}. ${count(block.tx_count) || 'Unknown number of'} transaction${block.tx_count === 1 ? '' : 's'}.`,
      rows: [
        ['Transactions', count(block.tx_count)], ['Timestamp', date(block.timestamp)],
        ['Size', Number.isSafeInteger(block.size) ? `${count(block.size)} bytes` : null],
        ['Weight', Number.isSafeInteger(block.weight) ? `${count(block.weight)} WU` : null],
        ['Difficulty', Number.isFinite(block.difficulty) ? count(Math.round(block.difficulty)) : null],
      ],
      ttl: 300_000,
    };
  }
  const address = await api(`/api/address/${id}`);
  if (address.address !== id || !address.chain_stats) throw new Error('Address mismatch');
  const chain = address.chain_stats;
  const mempool = address.mempool_stats || {};
  const balance = chain.funded_txo_sum - chain.spent_txo_sum;
  const pending = mempool.funded_txo_sum - mempool.spent_txo_sum;
  return {
    heading: 'Address', subtitle: id,
    description: `Bitcoin address ${id}. ${count(chain.tx_count) || 'Unknown number of'} confirmed transactions.`,
    rows: [
      ['Confirmed balance', bitcoin(balance)], ['Pending change', pending < 0 ? `-${bitcoin(-pending)}` : bitcoin(pending)],
      ['Received', bitcoin(chain.funded_txo_sum)], ['Sent', bitcoin(chain.spent_txo_sum)],
      ['Confirmed transactions', count(chain.tx_count)], ['Pending transactions', count(mempool.tx_count)],
    ],
    ttl: 30_000,
  };
}

function fallback(kind, id) {
  const label = { tx: 'Transaction', block: 'Block', address: 'Address' }[kind];
  return {
    heading: `${label} lookup`, subtitle: id,
    description: `Bitcoin ${label.toLowerCase()} lookup for ${id}. Live details are temporarily unavailable.`,
    rows: [], ttl: 0, unavailable: true,
  };
}

function metadata(kind, id, data) {
  const url = `${origin}/${kind}/${id}`;
  const image = `${origin}/og/${kind}/${id}.png`;
  const title = `Bitcoin ${data.heading}${kind === 'block' ? '' : ` ${short(id, 24)}`} | btc.tx.taxi`;
  const tags = [
    ['name', 'description', data.description],
    ['property', 'og:type', 'website'], ['property', 'og:site_name', 'btc.tx.taxi'],
    ['property', 'og:title', title], ['property', 'og:description', data.description],
    ['property', 'og:url', url], ['property', 'og:image', image],
    ['property', 'og:image:type', 'image/png'], ['property', 'og:image:width', '1200'],
    ['property', 'og:image:height', '630'], ['property', 'og:image:alt', `btc.tx.taxi ${data.heading}`],
    ['name', 'twitter:card', 'summary_large_image'], ['name', 'twitter:title', title],
    ['name', 'twitter:description', data.description], ['name', 'twitter:image', image],
    ['name', 'twitter:image:alt', `btc.tx.taxi ${data.heading}`], ['name', 'twitter:domain', 'btc.tx.taxi'],
  ];
  const replacement = `<title>${escape(title)}</title><link rel="canonical" href="${escape(url)}">` +
    `<meta name="robots" content="${data.unavailable ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}">` +
    tags.map(([attribute, name, content]) => `<meta ${attribute}="${name}" content="${escape(content)}">`).join('');
  const document = parse5.parse(html, { sourceCodeLocationInfo: true });
  const head = document.childNodes.find(node => node.tagName === 'html')?.childNodes.find(node => node.tagName === 'head');
  if (!head?.sourceCodeLocation?.endTag) throw new Error('Missing HTML head');
  const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value?.toLowerCase();
  const locations = head.childNodes.filter(node => {
    if (node.tagName === 'title') return true;
    if (node.tagName === 'link') return attr(node, 'rel')?.split(/\s+/).includes('canonical');
    if (node.tagName !== 'meta') return false;
    return attr(node, 'name') === 'description' || attr(node, 'name') === 'robots' ||
      attr(node, 'name')?.startsWith('twitter:') || attr(node, 'property')?.startsWith('og:');
  }).map(node => node.sourceCodeLocation).filter(Boolean).sort((a, b) => a.startOffset - b.startOffset);
  const insertAt = head.sourceCodeLocation.endTag.startOffset;
  let cursor = 0;
  let output = '';
  for (const location of locations) {
    output += html.slice(cursor, location.startOffset);
    cursor = location.endOffset;
  }
  return output + html.slice(cursor, insertAt) + `\n  ${replacement}\n` + html.slice(insertAt);
}

function cardSvg(data) {
  const rows = data.rows.filter(([, value]) => value !== null && value !== undefined).slice(0, 6);
  const logoMarkup = logo ? `<image href="${logo}" x="60" y="22" width="226" height="76" preserveAspectRatio="xMinYMid meet"/>` : '';
  const cells = rows.map(([label, value], index) => {
    const x = 64 + (index % 2) * 544;
    const y = 316 + Math.floor(index / 2) * 75;
    return `<rect x="${x}" y="${y - 29}" width="518" height="65" fill="${Math.floor(index / 2) % 2 ? '#20232f' : '#181b25'}"/>` +
      `<text x="${x + 15}" y="${y - 4}" fill="#a8aebc" font-size="17">${escape(label)}</text>` +
      `<text x="${x + 15}" y="${y + 23}" fill="#f8f9fc" font-size="21" font-weight="600">${escape(short(value, 34))}</text>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#11141d"/><rect width="1200" height="8" fill="#f7931a"/>
    ${logoMarkup}<text x="${logo ? 315 : 64}" y="69" fill="#f9a94e" font-family="DejaVu Sans, sans-serif" font-size="22" font-weight="700">BITCOIN / EXPLORER</text>
    <text x="1136" y="69" text-anchor="end" fill="#f8f9fc" font-family="DejaVu Sans, sans-serif" font-size="26" font-weight="700">btc.tx.taxi</text>
    <path d="M64 108H1136" stroke="#393e4c"/>
    <text x="64" y="188" fill="#f8f9fc" font-family="DejaVu Sans, sans-serif" font-size="51" font-weight="700">${escape(short(data.heading, 30))}</text>
    <text x="64" y="241" fill="#ffbe72" font-family="DejaVu Sans Mono, monospace" font-size="24">${escape(short(data.subtitle, 67))}</text>
    ${data.unavailable ? '<text x="64" y="346" fill="#c3c8d3" font-family="DejaVu Sans, sans-serif" font-size="28">Live details temporarily unavailable</text>' : `<g font-family="DejaVu Sans, sans-serif">${cells}</g>`}
    <path d="M64 574H1136" stroke="#393e4c"/>
    <text x="64" y="605" fill="#9ca4b2" font-family="DejaVu Sans, sans-serif" font-size="17">Bitcoin mainnet</text>
    <text x="1136" y="605" text-anchor="end" fill="#9ca4b2" font-family="DejaVu Sans, sans-serif" font-size="17">btc.tx.taxi</text>
  </svg>`;
}

async function load(kind, id) {
  const key = `${kind}:${id.toLowerCase()}`;
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) return cached.data;
  if (pending.has(key)) return pending.get(key);
  if (active >= 8) return fallback(kind, id);
  active++;
  const work = entity(kind, id).catch(() => fallback(kind, id)).then(data => {
    cache.delete(key);
    cache.set(key, { data, expires: Date.now() + (data.ttl || 0) });
    while (cache.size > 256) cache.delete(cache.keys().next().value);
    return data;
  }).finally(() => { active--; pending.delete(key); });
  pending.set(key, work);
  return work;
}

async function renderImage(kind, id, data) {
  const key = `${kind}:${id.toLowerCase()}`;
  const cached = imageCache.get(key);
  if (cached && cached.expires > Date.now()) return cached.body;
  if (imagePending.has(key)) return imagePending.get(key);
  if (activeImages >= 4) throw new Error('Card renderer busy');
  activeImages++;
  const work = sharp(Buffer.from(cardSvg(data))).png().toBuffer().then(body => {
    imageCache.delete(key);
    imageCache.set(key, { body, expires: Date.now() + (data.ttl || 5_000) });
    while (imageCache.size > 128) imageCache.delete(imageCache.keys().next().value);
    return body;
  }).finally(() => { activeImages--; imagePending.delete(key); });
  imagePending.set(key, work);
  return work;
}

const server = http.createServer((req, res) => serve(req, res).catch(() => {
  if (!res.headersSent) res.writeHead(503, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' });
  res.end('Metadata temporarily unavailable');
}));

async function serve(req, res) {
  if (req.url === '/healthz') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end('{"ok":true}');
  }
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { allow: 'GET, HEAD' });
    return res.end();
  }
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const image = pathname.startsWith('/og/');
  const match = route(image ? pathname.slice(3).replace(/\.png$/, '') : pathname);
  if (!match || (image && !pathname.endsWith('.png'))) {
    res.writeHead(404);
    return res.end();
  }
  const data = await load(match.kind, match.id);
  if (image) {
    const body = await renderImage(match.kind, match.id, data);
    res.writeHead(200, { 'content-type': 'image/png', 'cache-control': data.unavailable ? 'no-store' : `public, max-age=${Math.floor(data.ttl / 1000)}`,
      'x-content-type-options': 'nosniff' });
    return res.end(req.method === 'HEAD' ? undefined : body);
  }
  const body = metadata(match.kind, match.id, data);
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': data.unavailable ? 'no-store' : `public, max-age=${Math.floor(data.ttl / 1000)}`,
    'x-content-type-options': 'nosniff' });
  res.end(req.method === 'HEAD' ? undefined : body);
}

server.listen(8081, '127.0.0.1');
