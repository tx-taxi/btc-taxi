'use strict';

// Only the homepage has reviewed Spanish crawl content. Other supported routes
// use the translated application but stay out of the index until reviewed.
const fs = require('node:fs');
const path = require('node:path');
const parse5 = require('parse5');
const origin = 'https://btc.tx.taxi';
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const title = 'Explorador de Bitcoin | btc.tx.taxi';
const description = 'Explora bloques, transacciones, comisiones y la actividad del mempool de Bitcoin con btc.tx.taxi.';
const imageAlt = 'Una página de transacción de Bitcoin en btc.tx.taxi que muestra el estado de confirmación, la comisión, las entradas y las salidas.';
const alternatives = `<link rel="alternate" hreflang="en" href="${origin}/"><link rel="alternate" hreflang="es" href="${origin}/es/"><link rel="alternate" hreflang="x-default" href="${origin}/">`;
function createSpanishPages(indexPath, pages, aliases, image) {
  const filename = path.join(path.dirname(indexPath), '..', 'es', 'index.html');
  const shell = fs.existsSync(filename) ? fs.readFileSync(filename, 'utf8') : null;
  const known = new Set(pages.map(p => p.route));
  function render(route) {
    const root = route === '/';
    const canonical = root ? `${origin}/es/` : `${origin}/es${route}`;
    const document = parse5.parse(shell);
    const html = document.childNodes.find(n => n.tagName === 'html');
    const lang = html.attrs.find(a => a.name === 'lang');
    if (lang) lang.value = 'es'; else html.attrs.push({name: 'lang', value: 'es'});
    const head = html.childNodes.find(n => n.tagName === 'head');
    const attr = (n, key) => n.attrs?.find(a => a.name === key)?.value || '';
    head.childNodes = head.childNodes.filter(n => n.tagName !== 'title' &&
      !(n.tagName === 'meta' && (['description', 'robots'].includes(attr(n, 'name')) || /^og:/.test(attr(n, 'property')) || /^twitter:/.test(attr(n, 'name')))) &&
      !(n.tagName === 'link' && ['canonical', 'alternate'].includes(attr(n, 'rel'))) &&
      !(n.tagName === 'script' && attr(n, 'type') === 'application/ld+json'));
    const markup = `<meta name="tx-taxi-es-available" content="true"><title>${esc(title)}</title><link id="canonical" rel="canonical" href="${esc(canonical)}">${root ? alternatives : ''}<meta name="description" content="${esc(description)}"><meta name="robots" content="${root ? 'index, follow, max-image-preview:large' : 'noindex, follow'}"><meta property="og:type" content="website"><meta property="og:site_name" content="btc.tx.taxi"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:locale" content="es_ES"><meta property="og:image" content="${esc(image.url)}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="${esc(image.width)}"><meta property="og:image:height" content="${esc(image.height)}"><meta property="og:image:alt" content="${esc(imageAlt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(image.url)}"><meta name="twitter:image:alt" content="${esc(imageAlt)}">`;
    head.childNodes.push(...parse5.parseFragment(markup).childNodes);
    function fill(node) {
      if (node.tagName === 'app-root') {
        node.childNodes = parse5.parseFragment(`<main class="container-xl"><h1>Explorador de Bitcoin</h1><p>${esc(description)}</p>${root ? '<p>Consulta bloques recientes, transacciones, direcciones y comisiones de la red Bitcoin.</p>' : ''}</main>`).childNodes;
        return;
      }
      for (const c of node.childNodes || []) fill(c);
    }
    fill(document);
    return parse5.serialize(document);
  }
  function write(req, res, status, route) {
    res.writeHead(status, {'Content-Type':'text/html; charset=utf-8','Content-Language':'es','Cache-Control':status === 200 ? 'public, max-age=300' : 'no-store','X-Content-Type-Options':'nosniff', ...(route === '/' && status === 200 ? {} : {'X-Robots-Tag':'noindex, follow'}), ...(status === 503 ? {'Retry-After':'60'} : {})});
    res.end(req.method === 'HEAD' ? undefined : render(route));
  }
  function route(pathname) {
    if (!shell || !(pathname === '/es' || pathname.startsWith('/es/'))) return null;
    return pathname.slice(3) || '/';
  }
  function supports(route) {
    return route === '/' || known.has(route) || !!aliases[route] || /^\/blocks\/[1-9]\d*$/.test(route) || /^\/mempool-block\/[0-7]$/.test(route) || /^\/mining\/pool\/[a-z0-9_-]{1,100}$/i.test(route) || ['/tx/preview', '/blocks/stale', '/graphs/mining/block-health'].includes(route) || /^\/(?:wallet\/[^/]+|widget\/wallet|clock(?:\/(?:mempool|block)(?:\/\d+)?)?|view\/(?:blocks|block\/[a-z0-9]+|mempool-block\/\d+)|preview(?:\/[^/]+){0,3})$/.test(route);
  }
  return { route, supports, write };
}
module.exports = { createSpanishPages, alternatives };
