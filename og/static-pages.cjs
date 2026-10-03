'use strict';
const fs = require('node:fs');
const path = require('node:path');
const parse5 = require('parse5');
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
function createStaticPages(indexPath, baseHtml) {
  const filename = process.env.BTC_CRAWL_MANIFEST || path.join(path.dirname(indexPath), '../resources/seo/pages.json');
  const manifest = JSON.parse(fs.readFileSync(filename, 'utf8'));
  const { origin, pages, aliases, css, image } = manifest;
  const lookup = new Map(pages.map(page => [page.route, page]));
  const markdownUrl = route => route === '/' ? '/index.md' : `${route}.md`;
  const linkHeaders = page => `<${origin}${page.route}>; rel="canonical", <${origin}/llms.txt>; rel="describedby"`;
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(page => `  <url><loc>${escape(origin + page.route)}</loc></url>`).join('\n')}\n</urlset>\n`;
  const llms = `# btc.tx.taxi\n\n> The Bitcoin explorer in the tx.taxi multi-chain family. Inspect public Bitcoin blocks, transactions, addresses, mining, fees and mempool data.\n\nThis service is informational, not a wallet, custodian or transaction-priority service. Mempool observations and fee estimates can differ between nodes and do not guarantee a confirmation time. Transaction, block and address links represent public network data; use a wallet or your own node for independent payment verification.\n\n## Documentation\n${pages.filter(page => page.route.startsWith('/docs/')).map(page => `- [${page.title}](${origin}${markdownUrl(page.route)}): ${page.description}`).join('\n')}\n\n## Explorer pages and tools\n${pages.filter(page => !page.route.startsWith('/docs/') && !['/privacy-policy', '/terms-of-service', '/trademark-policy'].includes(page.route)).map(page => `- [${page.title}](${origin}${markdownUrl(page.route)}): ${page.description}`).join('\n')}\n\n## API and live data\n- [REST documentation](${origin}/docs/api/rest.md): Documented request methods, endpoint patterns and examples; values in examples are not current observations.\n- [WebSocket documentation](${origin}/docs/api/websocket.md): Live subscriptions over wss://btc.tx.taxi/api/v1/ws.\n- [All readable content](${origin}/llms-full.txt): Source-backed text for the indexed pages. Use individual Markdown documents for smaller context.\n\n## Optional\n${pages.filter(page => ['/privacy-policy', '/terms-of-service', '/trademark-policy'].includes(page.route)).map(page => `- [${page.title}](${origin}${markdownUrl(page.route)}): ${page.description}`).join('\n')}\n- [tx.taxi hub](https://tx.taxi/llms.txt): Other native explorers and multi-chain routing.\n- [Canonical sitemap](${origin}/sitemap.xml): Public, indexable page URLs.\n`;
  function render(page, noindex = false) {
    const document = parse5.parse(baseHtml);
    const walk = node => { if (node.tagName === 'head') return node;for (const child of node.childNodes || []) { const found = walk(child);if (found) return found; } };
    const head = walk(document);
    const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value || '';
    head.childNodes = head.childNodes.filter(node => node.tagName !== 'title' &&
      !(node.tagName === 'meta' && ['description', 'robots'].includes(attr(node, 'name'))) &&
      !(node.tagName === 'meta' && (/^og:/.test(attr(node, 'property')) || /^twitter:/.test(attr(node, 'name')))) &&
      !(node.tagName === 'link' && ['canonical', 'alternate', 'describedby'].includes(attr(node, 'rel'))) &&
      !(node.tagName === 'script' && attr(node, 'type') === 'application/ld+json'));
    const canonical = origin + page.route;
    const tags = [['name', 'description', page.description], ['name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'],
      ['property', 'og:type', 'website'], ['property', 'og:site_name', 'btc.tx.taxi'], ['property', 'og:title', page.title], ['property', 'og:description', page.description], ['property', 'og:url', canonical],
      ['property', 'og:image', image.url], ['property', 'og:image:type', 'image/jpeg'], ['property', 'og:image:width', image.width], ['property', 'og:image:height', image.height], ['property', 'og:image:alt', image.alt],
      ['name', 'twitter:card', 'summary_large_image'], ['name', 'twitter:title', page.title], ['name', 'twitter:description', page.description], ['name', 'twitter:image', image.url], ['name', 'twitter:image:alt', image.alt]];
    const breadcrumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Bitcoin explorer', item: origin + '/' }, ...(page.route === '/' ? [] : [{ '@type': 'ListItem', position: 2, name: page.title, item: canonical }])] };
    const markup = `<title>${escape(page.title)}</title><link id="canonical" rel="canonical" href="${escape(canonical)}"><link rel="describedby" href="${origin}/llms.txt" type="text/plain">${noindex ? '' : `<link rel="alternate" type="text/markdown" href="${origin}${markdownUrl(page.route)}">`}${tags.map(([a, k, v]) => `<meta ${a}="${k}" content="${escape(v)}">`).join('')}<script type="application/ld+json">${JSON.stringify(page.schema).replace(/</g, '\\u003c')}</script><script type="application/ld+json">${JSON.stringify(breadcrumbs).replace(/</g, '\\u003c')}</script><style>${css}</style>`;
    head.childNodes.push(...parse5.parseFragment(markup).childNodes);
    function body(node) {
      if (node.tagName === 'app-root') {
        const nav = `<nav class="container-xl" aria-label="Bitcoin explorer pages">${pages.filter(p => ['/', '/about', '/docs/faq', '/docs/api/rest', '/docs/api/websocket'].includes(p.route)).map(p => `<a href="${p.route}">${escape(p.title.replace(' | btc.tx.taxi', ''))}</a> `).join('')}</nav>`;
        node.childNodes = parse5.parseFragment(`<div class="btc-readable">${page.content}${nav}</div>`).childNodes;
        return;
      }
      for (const child of node.childNodes || []) body(child);
    }
    body(document);return parse5.serialize(document);
  }
  function write(res, method, status, type, body, headers = {}) {
    res.writeHead(status, { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': status === 200 ? 'public, max-age=300' : 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers });
    res.end(method === 'HEAD' ? undefined : body);
  }
  function findPage(route) {
    const known = lookup.get(route);
    if (known) return known;
    const match = route.match(/^\/blocks\/([1-9]\d*)$/);
    if (!match) {
      const projected = route.match(/^\/mempool-block\/([0-7])$/);
      const pool = route.match(/^\/mining\/pool\/([a-z0-9_-]{1,100})$/i);
      if (projected || pool) {
        const first = lookup.get(projected ? '/mempool-block/0' : '/mining');
        const title = projected ? `Projected Bitcoin Mempool Block ${Number(projected[1]) + 1}` : `Bitcoin Mining Pool ${pool[1]}`;
        return { ...first, route, title: `${title} | btc.tx.taxi`, content: first.content.replace(/<h1>[^<]+<\/h1>/, `<h1>${escape(title)}</h1>`), markdown: first.markdown.replace(/^# [^\n]+/, `# ${title}`).replace(origin + first.route, origin + route), schema: { ...first.schema, name: title, url: origin + route } };
      }
      // Preserve registered presentation and private-input routes without indexing duplicates.
      if (['/tx/preview', '/blocks/stale', '/graphs/mining/block-health'].includes(route) || /^\/(?:wallet\/[^/]+|widget\/wallet|clock(?:\/(?:mempool|block)(?:\/\d+)?)?|view\/(?:blocks|block\/[a-z0-9]+|mempool-block\/\d+)|preview(?:\/[^/]+){0,3})$/.test(route)) {
        const first = lookup.get('/');
        return { ...first, route, noindex: true, title: 'Bitcoin Explorer View | btc.tx.taxi', schema: { ...first.schema, url: origin + route } };
      }
      return undefined;
    }
    const first = lookup.get('/blocks/1');
    const name = `Bitcoin Blocks — Page ${match[1]}`;
    return { ...first, route, title: `${name} | btc.tx.taxi`, markdown: first.markdown.replace('# Bitcoin Blocks\n', `# ${name}\n`).replace(`${origin}/blocks/1`, origin + route), schema: { ...first.schema, name, url: origin + route } };
  }
  function serve(req, res, pathname) {
    if (/^\/en-US(?:\/|$)/.test(pathname)) { write(res, req.method, 308, 'text/plain', '', { Location: pathname.replace(/^\/en-US/, '') || '/' });return true; }
    if (pathname === '/llm.txt') { write(res, req.method, 308, 'text/plain', '', { Location: '/llms.txt' });return true; }
    if (aliases[pathname] || (pathname !== '/' && pathname.endsWith('/') && lookup.has(pathname.slice(0, -1)))) {
      write(res, req.method, 308, 'text/plain', '', { Location: aliases[pathname] || pathname.slice(0, -1) });return true;
    }
    if (pathname === '/sitemap.xml') { write(res, req.method, 200, 'application/xml', sitemap);return true; }
    if (pathname === '/robots.txt') { write(res, req.method, 200, 'text/plain', `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);return true; }
    if (pathname === '/llms.txt') { write(res, req.method, 200, 'text/plain', llms, { Link: `<${origin}/llms.txt>; rel="describedby"` });return true; }
    if (pathname === '/llms-full.txt') { write(res, req.method, 200, 'text/plain', llms + '\n---\n\n' + pages.map(p => p.markdown).join('\n---\n\n'), { 'X-Robots-Tag': 'noindex, follow', Link: `<${origin}/llms.txt>; rel="describedby"` });return true; }
    if (pathname.endsWith('.md')) {
      const route = pathname === '/index.md' ? '/' : pathname.slice(0, -3);
      const page = findPage(route);
      if (!page) return false;
      write(res, req.method, 200, 'text/markdown', page.markdown, { 'X-Robots-Tag': 'noindex, follow', Link: linkHeaders(page) });return true;
    }
    const page = findPage(pathname);
    if (!page) return false;
    write(res, req.method, 200, 'text/html', render(page, page.noindex), { ...(page.noindex ? { 'X-Robots-Tag': 'noindex, follow' } : {}), Link: `<${origin}${markdownUrl(page.route)}>; rel="alternate"; type="text/markdown", <${origin}/llms.txt>; rel="describedby"` });return true;
  }
  function notFound(req, res) {
    const page = { route: '/', title: 'Page not found | btc.tx.taxi', description: 'The requested Bitcoin explorer page is unavailable.', content: '<main class="container-xl"><h1>Page not found</h1><p>Open the Bitcoin explorer or its documentation.</p></main>', schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Page not found' } };
    write(res, req.method, 404, 'text/html', render(page, true), { 'X-Robots-Tag': 'noindex, follow' });
  }
  return { serve, notFound, sitemap, llms, pages, manifest };
}
module.exports = { createStaticPages };
