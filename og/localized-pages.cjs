'use strict';

// Review-locale shells remain excluded from indexing until their content is reviewed.
const fs = require('node:fs');
const path = require('node:path');
const parse5 = require('parse5');
const origin = 'https://btc.tx.taxi';
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const copy = {
  fr: {title:'Explorateur Bitcoin | btc.tx.taxi', description:'Explorez les blocs, transactions, frais et activités du mempool Bitcoin avec btc.tx.taxi.', heading:'Explorateur Bitcoin'},
  de: {title:'Bitcoin-Explorer | btc.tx.taxi', description:'Erkunde Bitcoin-Blöcke, Transaktionen, Gebühren und die Mempool-Aktivität mit btc.tx.taxi.', heading:'Bitcoin-Explorer'},
  it: {title:'Esploratore Bitcoin | btc.tx.taxi', description:'Esplora blocchi, transazioni, commissioni e attività del mempool Bitcoin con btc.tx.taxi.', heading:'Esploratore Bitcoin'},
  pt: {title:'Explorador Bitcoin | btc.tx.taxi', description:'Explore blocos, transações, taxas e a atividade da mempool Bitcoin com btc.tx.taxi.', heading:'Explorador Bitcoin'},
  zh: {title:'Bitcoin浏览器 | btc.tx.taxi', description:'通过btc.tx.taxi查看Bitcoin区块、交易、费用和内存池动态。', heading:'Bitcoin浏览器'},
  ru: {title:'Обозреватель Bitcoin | btc.tx.taxi', description:'Изучайте блоки, транзакции, комиссии и активность мемпула Bitcoin на btc.tx.taxi.', heading:'Обозреватель Bitcoin'},
};
function createLocalizedPages(indexPath, pages, aliases) {
  const shells = {};
  for (const lang of Object.keys(copy)) {
    const file = path.join(path.dirname(indexPath), '..', lang, 'index.html');
    if (fs.existsSync(file)) shells[lang] = fs.readFileSync(file, 'utf8');
  }
  const known = new Set(pages.map(page => page.route));
  function route(pathname) {
    const match = pathname.match(/^\/(fr|de|it|pt|ru|zh)(?:\/|$)/);
    return match && shells[match[1]] ? { lang: match[1], pathname: pathname.slice(3) || '/' } : null;
  }
  function supports(value) {
    return value === '/' || known.has(value) || !!aliases[value] || /^\/blocks\/[1-9]\d*$/.test(value) || /^\/mempool-block\/[0-7]$/.test(value) || /^\/mining\/pool\/[a-z0-9_-]{1,100}$/i.test(value) || ['/tx/preview', '/blocks/stale', '/graphs/mining/block-health'].includes(value) || /^\/(?:wallet\/[^/]+|widget\/wallet|clock(?:\/(?:mempool|block)(?:\/\d+)?)?|view\/(?:blocks|block\/[a-z0-9]+|mempool-block\/\d+)|preview(?:\/[^/]+){0,3})$/.test(value);
  }
  function render(lang, pathname) {
    const canonical = origin + '/' + lang + (pathname === '/' ? '/' : pathname);
    const doc = parse5.parse(shells[lang]);
    const html = doc.childNodes.find(n => n.tagName === 'html');
    const language = html.attrs.find(a => a.name === 'lang');
    if (language) language.value = lang; else html.attrs.push({name:'lang', value:lang});
    const head = html.childNodes.find(n => n.tagName === 'head');
    const attr = (n, key) => n.attrs?.find(a => a.name === key)?.value || '';
    head.childNodes = head.childNodes.filter(n => n.tagName !== 'title' &&
      !(n.tagName === 'meta' && (['description', 'robots'].includes(attr(n,'name')) || /^og:/.test(attr(n,'property')) || /^twitter:/.test(attr(n,'name')))) &&
      !(n.tagName === 'link' && ['canonical', 'alternate'].includes(attr(n,'rel'))) &&
      !(n.tagName === 'script' && attr(n,'type') === 'application/ld+json'));
    // Never let a reused shell resolve translated bundles under the English asset base.
    const base = head.childNodes.find(n => n.tagName === 'base');
    if (base) { const href = base.attrs.find(a => a.name === 'href'); if (href) href.value = '/' + lang + '/'; else base.attrs.push({name:'href',value:'/' + lang + '/'}); }
    else head.childNodes.unshift(...parse5.parseFragment('<base href="/' + lang + '/">').childNodes);
    const {title, description, heading} = copy[lang];
    head.childNodes.push(...parse5.parseFragment(`<title>${esc(title)}</title><link id="canonical" rel="canonical" href="${esc(canonical)}"><meta name="description" content="${esc(description)}"><meta name="robots" content="noindex, follow"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:locale" content="${lang === 'fr' ? 'fr_FR' : lang === 'de' ? 'de_DE' : lang === 'it' ? 'it_IT' : lang === 'pt' ? 'pt_PT' : lang === 'zh' ? 'zh_CN' : 'ru_RU'}">`).childNodes);
    function fill(node) {
      if (node.tagName === 'app-root') { node.childNodes = parse5.parseFragment(`<main class="container-xl"><h1>${esc(heading)}</h1><p>${esc(description)}</p></main>`).childNodes; return; }
      for (const child of node.childNodes || []) fill(child);
    }
    fill(doc); return parse5.serialize(doc);
  }
  function write(req, res, status, lang, pathname) {
    res.writeHead(status, {'Content-Type':'text/html; charset=utf-8', 'Content-Language':lang, 'Cache-Control':status === 200 ? 'public, max-age=300' : 'no-store', 'X-Content-Type-Options':'nosniff', 'X-Robots-Tag':'noindex, follow', ...(status === 503 ? {'Retry-After':'60'} : {})});
    return res.end(req.method === 'HEAD' ? undefined : render(lang, pathname));
  }
  return {route, supports, write};
}
module.exports = {createLocalizedPages};
