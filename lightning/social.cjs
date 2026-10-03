'use strict';

// Card structure is reused from the BTC fork's og/server.cjs, including actual
// selected taxi branding. Only the Lightning entity semantics are different.
const fs = require('node:fs');
const path = require('node:path');
const ORIGIN = 'https://lightning.btc.tx.taxi';
const PAGE_METADATA = require('./page-metadata.json');
const DEFAULT_DESCRIPTION = PAGE_METADATA['/'].description;
const BASE_TITLE = PAGE_METADATA['/'].title;
function socialImage() {
  for (const file of [path.join(__dirname, 'social-image.json'), path.join(__dirname, '../frontend/src/resources/lightning-social-image.json')]) {
    try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
  }
  return {url: ORIGIN + '/og/lightning.png', type: 'image/png', width: 1200, height: 630, alt: 'The Lightning network explorer in lightning.btc.tx.taxi.'};
}
function escape(value) { return String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]); }
function short(value, max = 55) { const s = String(value); return s.length <= max ? s : `${s.slice(0, Math.ceil((max - 3) / 2))}...${s.slice(-Math.floor((max - 3) / 2))}`; }
function number(value) { return Number.isSafeInteger(value) && value >= 0 ? value.toLocaleString('en-US') : null; }
function btc(value) { return Number.isSafeInteger(value) && value >= 0 ? `${(value / 1e8).toFixed(8)} BTC` : null; }
function routeMetadata(pathname, proxy) {
  const node = pathname.match(/^\/node\/((?:02|03)[a-f0-9]{64})$/i);
  const channel = pathname.match(/^\/channel\/([\dx]+)$/i);
  const base = { title: BASE_TITLE, heading: 'Lightning Network', subtitle: 'Your taxi to every transaction.', description: DEFAULT_DESCRIPTION, rows: [['Explore', 'Public nodes and channels'], ['Network', 'Bitcoin Lightning'], ['Maps', 'Nodes and channel connections'], ['Statistics', 'Capacity and routing fees']], path: pathname, card: '/og/lightning.png' };
  if (node) {
    const data = proxy?.cache.get(`/api/v1/lightning/nodes/${node[1]}`);
    let entity; try { entity = JSON.parse(data?.body); } catch {}
    const name = entity?.alias || short(node[1], 32);
    return { ...base, title: `Node: ${name} · ${BASE_TITLE}`, heading: entity?.alias || 'Lightning node', subtitle: node[1], description: `Overview for the Lightning network node named ${name}. See channels, capacity, location, fee stats, and more.`, rows: [['Capacity', btc(entity?.capacity)], ['Channels', number(entity?.active_channel_count ?? entity?.channels)], ['Public key', short(node[1], 32)], ['Network', 'Bitcoin Lightning']], card: `/og/node/${node[1]}.png` };
  }
  if (channel) {
    const data = proxy?.cache.get(`/api/v1/lightning/channels/${channel[1]}`);
    let entity; try { entity = JSON.parse(data?.body); } catch {}
    return { ...base, title: `Channel: ${entity?.short_id || channel[1]} · ${BASE_TITLE}`, heading: 'Lightning channel', subtitle: entity?.short_id || channel[1], description: `Overview for Lightning channel ${entity?.short_id || channel[1]}. See channel capacity, the Lightning nodes involved, related on-chain transactions, and more.`, rows: [['Capacity', btc(entity?.capacity)], ['Status', entity ? ['Inactive', 'Active', 'Closed'][entity.status] || null : null], ['Left node', entity?.node_left?.alias], ['Right node', entity?.node_right?.alias]], card: `/og/channel/${channel[1]}.png` };
  }
  const country = pathname.match(/^\/nodes\/country\/([a-z]{2})$/i);
  const isp = pathname.match(/^\/nodes\/isp\/([\d,]+)$/);
  if (country || isp) {
    let entity;
    const apiPath = country ? `/api/v1/lightning/nodes/country/${country[1].toUpperCase()}` : `/api/v1/lightning/nodes/isp/${isp[1]}`;
    try { entity = JSON.parse(proxy?.cache.get(apiPath)?.body); } catch {}
    const name = country ? entity?.country?.en || country[1].toUpperCase() : entity?.isp || `AS${isp[1]}`;
    const label = country ? `Lightning nodes in ${name}` : `Lightning nodes on ISP: ${name} [AS${isp[1]}]`;
    const description = country ? `Explore all the Lightning nodes hosted in ${name} and see an overview of each node's capacity, number of open channels, and more.` : `Browse all Bitcoin Lightning nodes using the ${name} [AS${isp[1]}] ISP and see aggregate stats like total number of nodes, total capacity, and more for the ISP.`;
    return {...base, title: label + ' · ' + BASE_TITLE, heading: label, description};
  }
  const known = PAGE_METADATA[pathname];
  if (known) return {...base, ...known, heading: pathname === '/' ? base.heading : known.title.split(' · ')[0]};
  return base;
}
function injectMetadata(html, data) {
  const canonical = ORIGIN + data.path;
  const title = escape(data.title);
  const description = escape(data.description);
  const card = socialImage();
  const image = card.url;
  const tags = `<title>${title}</title><link id="canonical" rel="canonical" href="${escape(canonical)}"><meta name="description" content="${description}"><meta name="robots" content="${data.unavailable ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}"><meta property="og:site_name" content="lightning.btc.tx.taxi"><meta property="og:locale" content="en_US"><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${escape(canonical)}"><meta property="og:image" content="${escape(image)}"><meta property="og:image:type" content="${escape(card.type)}"><meta property="og:image:width" content="${card.width}"><meta property="og:image:height" content="${card.height}"><meta property="og:image:alt" content="${escape(card.alt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${escape(image)}"><meta name="twitter:image:alt" content="${escape(card.alt)}"><meta name="twitter:domain" content="lightning.btc.tx.taxi">`;
  return html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi, '')
    .replace(/<meta\b[^>]*(?:name|property)=["'](?:description|robots|og:[^"']+|twitter:[^"']+)["'][^>]*>/gi, '')
    .replace(/<\/head>/i, `${tags}</head>`);
}
function cardSvg(data, logoPath) {
  let logo = null;
  try { logo = `data:image/svg+xml;base64,${fs.readFileSync(logoPath).toString('base64')}`; } catch {}
  const rows = data.rows.filter(([, value]) => value !== null && value !== undefined).slice(0, 6);
  const logoMarkup = logo ? `<image href="${logo}" x="64" y="24" width="290" height="80" preserveAspectRatio="xMinYMid meet"/>` : '';
  const cells = rows.map(([label, value], index) => {
    const x = 64 + (index % 2) * 544;
    const y = 316 + Math.floor(index / 2) * 75;
    return `<rect x="${x}" y="${y - 29}" width="518" height="65" fill="${Math.floor(index / 2) % 2 ? '#252525' : '#1c1c1c'}"/><text x="${x + 15}" y="${y - 4}" fill="#a8aebc" font-size="17">${escape(label)}</text><text x="${x + 15}" y="${y + 23}" fill="#f8f9fc" font-size="21" font-weight="600">${escape(short(value, 34))}</text>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#111111"/><rect width="1200" height="8" fill="#7B1AF7"/>${logoMarkup}<text x="${logo ? 420 : 64}" y="69" fill="#b99af7" font-family="DejaVu Sans, sans-serif" font-size="22" font-weight="700">LIGHTNING / EXPLORER</text><path d="M64 108H1136" stroke="#383838"/><text x="64" y="188" fill="#f8f9fc" font-family="DejaVu Sans, sans-serif" font-size="51" font-weight="700">${escape(short(data.heading, 30))}</text><text x="64" y="241" fill="#F7931A" font-family="DejaVu Sans Mono, monospace" font-size="24">${escape(short(data.subtitle, 67))}</text><g font-family="DejaVu Sans, sans-serif">${cells}</g><path d="M64 574H1136" stroke="#383838"/><text x="64" y="605" fill="#9ca4b2" font-family="DejaVu Sans, sans-serif" font-size="17">Bitcoin Lightning Network</text><text x="1136" y="605" text-anchor="end" fill="#9ca4b2" font-family="DejaVu Sans, sans-serif" font-size="17">lightning.btc.tx.taxi</text></svg>`;
}
function createCards(proxy, options = {}) {
  const sharp = options.sharp || require('sharp');
  const logoPath = options.logoPath || path.resolve(__dirname, '../frontend/src/resources/branding/lightning-dark-navbar.svg');
  const cache = new Map();
  const pending = new Map();
  let active = 0;
  return async pathname => {
    const route = pathname === '/og/lightning.png' ? '/' : pathname.replace(/^\/og/, '').replace(/\.png$/, '');
    const data = routeMetadata(route, proxy);
    const key = JSON.stringify(data);
    const prior = cache.get(key);
    if (prior) return prior;
    if (pending.has(key)) return pending.get(key);
    if (active >= 2) throw new Error('Image renderer busy');
    active++;
    const work = sharp(Buffer.from(cardSvg(data, logoPath))).png().toBuffer().then(buffer => {
      cache.set(key, buffer);
      while (cache.size > 64) cache.delete(cache.keys().next().value);
      return buffer;
    }).finally(() => { active--; pending.delete(key); });
    pending.set(key, work);
    return work;
  };
}
module.exports = { routeMetadata, injectMetadata, cardSvg, createCards, ORIGIN, escape };
