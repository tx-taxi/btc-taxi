'use strict';

// Card structure is reused from the BTC fork's og/server.cjs, including actual
// selected taxi branding. Only the Lightning entity semantics are different.
const fs = require('node:fs');
const path = require('node:path');
const ORIGIN = 'https://lightning.btc.tx.taxi';
const PAGE_METADATA = require('./page-metadata.json');
const SPANISH_METADATA = require('./page-metadata.es.json');
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
function spanishRouteMetadata(pathname, data) {
  const output = { ...data, path: '/es' + pathname, noindex: true, language: 'es' };
  output.subtitle = data.subtitle === 'Your taxi to every transaction.' ? 'Tu taxi hacia cada transacción.' : data.subtitle;
  const labels = {Explore:'Explorar', Network:'Red', Maps:'Mapas', Statistics:'Estadísticas', Capacity:'Capacidad', Channels:'Canales', 'Public key':'Clave pública', Status:'Estado', 'Left node':'Nodo izquierdo', 'Right node':'Nodo derecho'};
  const values = {'Public nodes and channels':'Nodos y canales públicos', 'Nodes and channel connections':'Nodos y conexiones', 'Capacity and routing fees':'Capacidad y comisiones', Inactive:'Inactivo', Active:'Activo', Closed:'Cerrado'};
  output.rows = data.rows.map(([label, value]) => [Object.hasOwn(labels, label) ? labels[label] : label, Object.hasOwn(values, value) ? values[value] : value]);
  const known = SPANISH_METADATA[pathname];
  if (known) return {...output, ...known, heading: pathname === '/' ? 'Red Lightning' : known.title.split(' · ')[0]};
  const node = pathname.match(/^\/node\/((?:02|03)[a-f0-9]{64})$/i);
  const channel = pathname.match(/^\/channel\/([\dx]+)$/i);
  const country = pathname.match(/^\/nodes\/country\/([a-z]{2})$/i);
  const isp = pathname.match(/^\/nodes\/isp\/([\d,]+)$/);
  if (node) {
    const name = data.heading === 'Lightning node' ? short(node[1], 32) : data.heading;
    return {...output, title: `Nodo: ${name} · lightning.btc.tx.taxi`, heading: name, description: `Consulta los canales, la capacidad, la ubicación y las comisiones del nodo Lightning ${name}.`};
  }
  if (channel) {
    const id = data.subtitle;
    return {...output, title: `Canal: ${id} · lightning.btc.tx.taxi`, heading: 'Canal Lightning', description: `Consulta la capacidad, los nodos y las transacciones de Bitcoin relacionadas con el canal Lightning ${id}.`};
  }
  if (country) {
    let name = country[1].toUpperCase();
    try { name = new Intl.DisplayNames(['es'], {type:'region'}).of(name) || name; } catch {}
    const heading = `Nodos Lightning en ${name}`;
    return {...output, title: `${heading} · lightning.btc.tx.taxi`, heading, description: `Consulta los nodos Lightning anunciados en ${name} y sus canales y capacidad.`};
  }
  if (isp) {
    const heading = `Nodos Lightning del proveedor AS${isp[1]}`;
    return {...output, title: `${heading} · lightning.btc.tx.taxi`, heading, description: `Consulta los nodos Lightning y la capacidad agregada del proveedor AS${isp[1]}.`};
  }
  return {...output, ...SPANISH_METADATA['/'], heading:'Red Lightning'};
}
function reviewLocaleMetadata(pathname, data, lang) {
  const fr = lang === 'fr';
  const title = lang === 'zh' ? 'Lightning浏览器 | lightning.btc.tx.taxi' : lang === 'ja' ? 'Lightningエクスプローラー | lightning.btc.tx.taxi' : fr ? 'Explorateur Lightning | lightning.btc.tx.taxi' : lang === 'de' ? 'Lightning-Explorer | lightning.btc.tx.taxi' : lang === 'it' ? 'Esploratore Lightning | lightning.btc.tx.taxi' : lang === 'pt' ? 'Explorador Lightning | lightning.btc.tx.taxi' : 'Обозреватель Lightning | lightning.btc.tx.taxi';
  const description = lang === 'zh' ? '查看Lightning节点、通道、路由策略和网络统计。' : lang === 'ja' ? 'Lightningのノード、チャネル、ルーティングポリシー、ネットワーク統計を調べましょう。' : fr ? 'Explorez les nœuds, canaux, politiques de routage et statistiques du réseau Lightning.' : lang === 'de' ? 'Erkunde Lightning-Knoten, Kanäle, Routing-Richtlinien und Netzwerkstatistiken.' : lang === 'it' ? 'Esplora nodi, canali, politiche di instradamento e statistiche della rete Lightning.' : lang === 'pt' ? 'Explore nós, canais, políticas de encaminhamento e estatísticas da rede Lightning.' : 'Изучайте узлы, каналы, правила маршрутизации и статистику сети Lightning.';
  return { ...data, path:'/' + lang + (pathname === '/' ? '/' : pathname), noindex:true, language:lang, title, description,
    heading: lang === 'zh' ? 'Lightning网络' : lang === 'ja' ? 'Lightningネットワーク' : fr ? 'Réseau Lightning' : lang === 'de' ? 'Lightning-Netzwerk' : lang === 'it' ? 'Rete Lightning' : lang === 'pt' ? 'Rede Lightning' : 'Сеть Lightning', subtitle: lang === 'zh' ? '通往每一笔交易的出租车。' : lang === 'ja' ? 'あらゆるトランザクションへのタクシー。' : fr ? 'Votre taxi vers chaque transaction.' : lang === 'de' ? 'Dein Taxi zu jeder Transaktion.' : lang === 'it' ? 'Il tuo taxi per ogni transazione.' : lang === 'pt' ? 'O seu táxi para cada transação.' : 'Ваше такси к каждой транзакции.', rows:[] };
}
function injectMetadata(html, data) {
  const canonical = ORIGIN + data.path;
  const title = escape(data.title);
  const description = escape(data.description);
  const card = socialImage();
  const image = card.url;
  const imageAlt = data.language === 'zh' ? 'tx.taxi的Lightning网络浏览器。' : data.language === 'ja' ? 'tx.taxiのLightningネットワークエクスプローラー。' : data.language === 'es' ? 'Explorador de la red Lightning en tx.taxi.' : data.language === 'fr' ? 'Explorateur du réseau Lightning sur tx.taxi.' : data.language === 'de' ? 'Lightning-Netzwerk-Explorer auf tx.taxi.' : data.language === 'it' ? 'Esploratore della rete Lightning su tx.taxi.' : data.language === 'pt' ? 'Explorador da rede Lightning em tx.taxi.' : data.language === 'ru' ? 'Обозреватель сети Lightning на tx.taxi.' : card.alt;
  const tags = `<title>${title}</title><link id="canonical" rel="canonical" href="${escape(canonical)}"><meta name="description" content="${description}"><meta name="robots" content="${data.noindex || data.status === 404 ? 'noindex, follow' : 'index, follow, max-image-preview:large'}"><meta property="og:site_name" content="lightning.btc.tx.taxi"><meta property="og:locale" content="${data.language === 'es' ? 'es_ES' : data.language === 'fr' ? 'fr_FR' : data.language === 'de' ? 'de_DE' : data.language === 'it' ? 'it_IT' : data.language === 'pt' ? 'pt_PT' : data.language === 'ru' ? 'ru_RU' : data.language === 'ja' ? 'ja_JP' : data.language === 'zh' ? 'zh_CN' : 'en_US'}"><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${escape(canonical)}"><meta property="og:image" content="${escape(image)}"><meta property="og:image:type" content="${escape(card.type)}"><meta property="og:image:width" content="${card.width}"><meta property="og:image:height" content="${card.height}"><meta property="og:image:alt" content="${escape(imageAlt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${escape(image)}"><meta name="twitter:image:alt" content="${escape(imageAlt)}"><meta name="twitter:domain" content="lightning.btc.tx.taxi">`;
  return html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi, '')
    .replace(/<meta\b[^>]*(?:name|property)=["'](?:description|robots|og:[^"']+|twitter:[^"']+)["'][^>]*>/gi, '')
    .replace(/<\/head>/i, `${tags}</head>`)
    .replace(/(<app-root\b[^>]*>)[\s\S]*?(<\/app-root>)/i, (_, open, close) => {
      const rows = data.unavailable ? [] : data.rows.filter(([, value]) => value !== null && value !== undefined);
      const table = rows.length ? `<table class="table table-striped"><tbody>${rows.map(([label, value]) => `<tr><th scope="row">${escape(label)}</th><td style="overflow-wrap:anywhere">${escape(value)}</td></tr>`).join('')}</tbody></table>` : '';
      const description = data.unavailable ? (data.language === 'zh' ? (data.status === 404 ? '未找到Lightning项目。' : 'Lightning数据暂时不可用，请重试。') : data.language === 'ja' ? (data.status === 404 ? 'Lightningの項目が見つかりません。' : 'Lightningデータを一時的に利用できません。もう一度お試しください。') : data.language === 'es' ? (data.status === 404 ? 'No se encontró el elemento de Lightning.' : 'Los datos de Lightning no están disponibles temporalmente. Inténtalo de nuevo.') : data.language === 'fr' ? (data.status === 404 ? 'Élément Lightning introuvable.' : 'Les données Lightning sont temporairement indisponibles. Réessayez.') : data.language === 'de' ? (data.status === 404 ? 'Lightning-Element nicht gefunden.' : 'Lightning-Daten sind vorübergehend nicht verfügbar. Bitte erneut versuchen.') : data.language === 'it' ? (data.status === 404 ? 'Elemento Lightning non trovato.' : 'Dati Lightning temporaneamente non disponibili. Riprova.') : data.language === 'pt' ? (data.status === 404 ? 'Elemento Lightning não encontrado.' : 'Dados Lightning temporariamente indisponíveis. Tente novamente.') : data.language === 'ru' ? (data.status === 404 ? 'Объект Lightning не найден.' : 'Данные Lightning временно недоступны. Попробуйте ещё раз.') : (data.status === 404 ? 'Lightning entity not found.' : 'Lightning data temporarily unavailable. Please retry.')) : data.description;
      return `${open}<main class="container-xl"><h1>${escape(data.heading)}</h1><p style="overflow-wrap:anywhere">${escape(data.subtitle)}</p><p>${escape(description)}</p>${table}</main>${close}`;
    });
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
module.exports = { routeMetadata, spanishRouteMetadata, reviewLocaleMetadata, injectMetadata, cardSvg, createCards, ORIGIN, escape };
