#!/usr/bin/env node
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const zlib = require('node:zlib');
const { promisify } = require('node:util');
const { LightningProxy, GatewayError, channelId, channelNumeric, PUBKEY } = require('./proxy.cjs');
const { routeMetadata, injectMetadata, createCards, ORIGIN } = require('./social.cjs');
const gzip = promisify(zlib.gzip);
const TYPES = { '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8', '.wasm': 'application/wasm' };
const PAGE_ROUTES = /^\/(?:node\/(?:02|03)[a-f0-9]{64}|channel\/[\dx]+|nodes\/(?:rankings(?:\/(?:liquidity|connectivity))?|oldest|country\/[A-Z]{2}|isp\/[\d,]+)|group\/the-mempool-open-source-project|penalties|graphs\/(?:lightning\/)?(?:capacity|nodes-networks|nodes-per-country|nodes-per-isp|nodes-channels-map|nodes-map)|about|docs(?:\/(?:faq|api\/rest))?|privacy-policy|terms-of-service|trademark-policy|search)?\/?$/i;

async function resolve(value, proxy) {
  if (value.length > 512 || /[\x00-\x1f\x7f]/.test(value)) throw new GatewayError(400, 'Invalid Lightning search');
  if (/^https?:\/\//i.test(value)) {
    let url;
    try { url = new URL(value); } catch { throw new GatewayError(400, 'Invalid Lightning URL'); }
    if (!['lightning.btc.tx.taxi', 'mempool.space'].includes(url.hostname) || url.username || url.password || url.port) throw new GatewayError(400, 'Unsupported Lightning URL');
    const match = url.pathname.match(/^\/(?:lightning\/)?(?:node|channel)\/([^/]+)\/?$/);
    if (!match) throw new GatewayError(400, 'Unsupported Lightning URL');
    value = decodeURIComponent(match[1]);
  }
  if (PUBKEY.test(value)) {
    const response = await proxy.request('/api/v1/lightning/nodes/' + value.toLowerCase());
    if (response.status !== 200) throw new GatewayError(response.status, response.status === 404 ? 'Node not found' : 'Node data unavailable');
    const node = JSON.parse(response.body);
    if (node.public_key?.toLowerCase() !== value.toLowerCase()) throw new GatewayError(502, 'Node identity could not be verified');
    return { type: 'node', id: node.public_key.toLowerCase(), state: response.state, observedAt: response.headers['x-observed-at'] };
  }
  const id = channelId(value);
  if (id) {
    const response = await proxy.request('/api/v1/lightning/channels/' + id);
    if (response.status !== 200) throw new GatewayError(response.status, response.status === 404 ? 'Channel not found' : 'Channel data unavailable');
    const channel = JSON.parse(response.body);
    const actual = channelId(String(channel.short_id || channel.id || ''));
    if (!actual || channelNumeric(actual) !== channelNumeric(id)) throw new GatewayError(502, 'Channel identity could not be verified');
    return { type: 'channel', id: channelNumeric(actual), state: response.state, observedAt: response.headers['x-observed-at'] };
  }
  const response = await proxy.request('/api/v1/lightning/search?searchText=' + encodeURIComponent(value));
  if (response.status !== 200) throw new GatewayError(response.status, 'Lightning search unavailable');
  const data = JSON.parse(response.body);
  if (!Array.isArray(data.nodes) || !Array.isArray(data.channels)) throw new GatewayError(502, 'Invalid Lightning search result');
  const nodes = data.nodes.filter(node => typeof node.alias === 'string' && node.alias.toLocaleLowerCase('en-US') === value.toLocaleLowerCase('en-US') && PUBKEY.test(node.public_key));
  if (nodes.length === 1) return { type: 'node', id: nodes[0].public_key.toLowerCase(), state: response.state, observedAt: response.headers['x-observed-at'] };
  if (nodes.length > 1) throw new GatewayError(409, 'Several nodes use this name');
  throw new GatewayError(404, 'No exact Lightning match');
}

function createApp(options = {}) {
  const staticDir = path.resolve(options.staticDir || process.env.LIGHTNING_STATIC_DIR || path.join(__dirname, '../frontend/dist/lightning/browser'));
  const dataDir = options.dataDir === false ? null : path.resolve(options.dataDir || process.env.LIGHTNING_DATA_DIR || path.join(__dirname, '.data'));
  let saveTimer = null;
  let saving = Promise.resolve();
  const proxy = options.proxy || new LightningProxy({ ...options.proxyOptions, save: () => {
    if (!dataDir || saveTimer) return;
    saveTimer = setTimeout(() => { saveTimer = null; persist(); }, 500);
    saveTimer.unref();
  } });
  async function persist() {
    if (!dataDir) return;
    const body = JSON.stringify({ version: 1, savedAt: new Date().toISOString(), entries: proxy.snapshot() });
    saving = saving.catch(() => {}).then(async () => {
      await fsp.mkdir(dataDir, { recursive: true, mode: 0o700 });
      const file = path.join(dataDir, 'public-api-cache.json');
      await fsp.writeFile(file + '.tmp', body, { mode: 0o600 });
      await fsp.rename(file + '.tmp', file);
    }).catch(error => console.error('Lightning cache persistence unavailable:', error.code || 'write-failed'));
    return saving;
  }
  if (dataDir) {
    try {
      const file = path.join(dataDir, 'public-api-cache.json');
      if (fs.statSync(file).size <= 48 * 1024 * 1024) proxy.restore(JSON.parse(fs.readFileSync(file, 'utf8')).entries);
    } catch {}
  }
  let cards;
  const getCard = options.getCard || (async pathname => {
    if (!cards) cards = createCards(proxy, { logoPath: options.logoPath || path.join(staticDir, 'resources/branding/btc-dark-navbar.svg') });
    return cards(pathname);
  });
  const startedAt = Date.now();
  let requests = 0;
  async function send(req, res, status, body, headers = {}) {
    if (res.destroyed) return;
    const common = { 'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin', ...headers };
    if (Buffer.byteLength(body) >= 1024 && /\bgzip\b/.test(req.headers['accept-encoding'] || '') && /(?:json|text|javascript|svg)/.test(common['content-type'] || '')) {
      body = await gzip(body);
      common['content-encoding'] = 'gzip';
      common.vary = 'Accept-Encoding';
    }
    common['content-length'] = Buffer.byteLength(body);
    res.writeHead(status, common);
    res.end(req.method === 'HEAD' ? undefined : body);
  }
  function json(req, res, status, value, headers = {}) { return send(req, res, status, Buffer.from(JSON.stringify(value)), { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }); }
  const server = http.createServer({ maxHeaderSize: 16 * 1024 }, async (req, res) => {
    requests++;
    try {
      if (!['GET', 'HEAD'].includes(req.method)) { await json(req, res, 405, { error: 'Method not allowed' }, { allow: 'GET, HEAD' }); return; }
      if (!req.url || req.url.length > 8192 || !req.url.startsWith('/') || req.url.startsWith('//') || /[\\\x00-\x1f]/.test(req.url)) throw new GatewayError(400, 'Invalid request URL');
      const rawPath = req.url.split('?')[0];
      if (/%(?:2e|2f|5c|00)/i.test(rawPath) || /(?:^|\/)\.{1,2}(?:\/|$)/.test(rawPath)) throw new GatewayError(400, 'Invalid request path');
      const url = new URL(req.url, 'http://local.invalid');
      const pathname = decodeURIComponent(url.pathname);
      if (pathname === '/healthz') { await json(req, res, 200, { ok: true, service: 'lightning-taxi', uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000) }); return; }
      if (pathname === '/api/provider-health') {
        const health = await proxy.health();
        await json(req, res, health.state === 'offline' ? 503 : 200, { service: 'lightning', ...health }, { 'x-data-state': health.state === 'online' ? 'fresh' : health.state, ...(health.retryAfter ? { 'retry-after': String(health.retryAfter) } : {}) }); return;
      }
      if (pathname === '/api/lightning/resolve') {
        if ([...url.searchParams.keys()].some(key => key !== 'value') || url.searchParams.getAll('value').length !== 1) throw new GatewayError(400, 'Supply one search value');
        const result = await resolve((url.searchParams.get('value') || '').trim(), proxy);
        await json(req, res, 200, result, { 'x-data-state': result.state, 'x-observed-at': result.observedAt }); return;
      }
      if (pathname.startsWith('/api/')) {
        const response = await proxy.request(req.url);
        await send(req, res, response.status, response.body, response.headers); return;
      }
      if (pathname === '/robots.txt') { await send(req, res, 200, `User-agent: *\nDisallow: /api/\nSitemap: ${ORIGIN}/sitemap.xml\n`, { 'content-type': 'text/plain', 'cache-control': 'public, max-age=3600' }); return; }
      if (pathname === '/sitemap.xml') {
        const pages = ['/', '/nodes/rankings', '/nodes/rankings/liquidity', '/nodes/rankings/connectivity', '/nodes/oldest', '/penalties', '/graphs/capacity', '/graphs/nodes-networks', '/graphs/nodes-per-country', '/graphs/nodes-per-isp', '/graphs/nodes-channels-map', '/graphs/nodes-map', '/about', '/docs'];
        await send(req, res, 200, `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p => `<url><loc>${ORIGIN}${p}</loc></url>`).join('')}</urlset>`, { 'content-type': 'application/xml', 'cache-control': 'public, max-age=3600' }); return;
      }
      if (pathname === '/og/lightning.png' || /^\/og\/(?:node\/(?:02|03)[a-f0-9]{64}|channel\/[\dx]+)\.png$/i.test(pathname)) {
        const buffer = await getCard(pathname);
        await send(req, res, 200, buffer, { 'content-type': 'image/png', 'cache-control': 'public, max-age=300' }); return;
      }
      if (pathname === '/lightning' || pathname.startsWith('/lightning/')) {
        const target = pathname.slice(10) || '/';
        if (PAGE_ROUTES.test(target)) { await send(req, res, 308, '', { location: target + url.search, 'cache-control': 'no-store' }); return; }
      }
      if (pathname.startsWith('/graphs/lightning/')) {
        const target = pathname.replace('/graphs/lightning/', '/graphs/');
        if (PAGE_ROUTES.test(target)) { await send(req, res, 308, '', { location: target + url.search, 'cache-control': 'no-store' }); return; }
      }
      const aliases = {'/graphs':'/graphs/capacity', '/docs':'/docs/faq', '/docs/':'/docs/faq', '/docs/api':'/docs/api/rest', '/docs/api/':'/docs/api/rest', '/docs/api/websocket':'/docs/api/rest'};
      let canonicalPath = pathname.replace(/\/$/, '') || '/';
      const nodePage = canonicalPath.match(/^\/node\/((?:02|03)[a-f0-9]{64})$/i);
      const channelPage = canonicalPath.match(/^\/channel\/([^/]+)$/i);
      if (nodePage) canonicalPath = '/node/' + nodePage[1].toLowerCase();
      if (channelPage) {
        const numeric = channelNumeric(channelPage[1]);
        if (!numeric) throw new GatewayError(404, 'Channel not found');
        canonicalPath = '/channel/' + numeric;
      }
      if (/^\/nodes\/country\/[a-z]{2}$/i.test(canonicalPath)) canonicalPath = canonicalPath.slice(0,-2) + canonicalPath.slice(-2).toUpperCase();
      if (aliases[pathname] || (PAGE_ROUTES.test(pathname) && canonicalPath !== pathname)) {
        await send(req, res, 308, '', {location: (aliases[pathname] || canonicalPath) + url.search, 'cache-control':'no-store'}); return;
      }
      if (PAGE_ROUTES.test(pathname)) {
        let pageStatus = 200;
        const metadataPath = /^\/(node|channel)\//.test(canonicalPath)
          ? canonicalPath.replace(/^\/node\//, '/api/v1/lightning/nodes/').replace(/^\/channel\//, '/api/v1/lightning/channels/')
          : /^\/nodes\/(country|isp)\//.test(canonicalPath) ? '/api/v1/lightning' + canonicalPath : null;
        if (metadataPath) {
          try {
            const lookup = proxy.request(metadataPath).catch(error => ({status: error.status === 404 ? 404 : 503}));
            let deadline;
            const response = await Promise.race([lookup, new Promise(resolve => {deadline = setTimeout(() => resolve(null), 750);})]);
            clearTimeout(deadline);
            if (response && response.status !== 200) pageStatus = response.status === 404 ? 404 : 503;
          } catch (error) { pageStatus = error.status === 404 ? 404 : 503; }
        }
        let html;
        try {
          try { html = await fsp.readFile(path.join(staticDir, 'index.html'), 'utf8'); }
          catch { html = await fsp.readFile(path.join(staticDir, 'index.lightning.html'), 'utf8'); }
        } catch { throw new GatewayError(503, 'The local Lightning build is not ready'); }
        const metadata = routeMetadata(canonicalPath, proxy);
        if (pageStatus !== 200) metadata.unavailable = true;
        await send(req, res, pageStatus, injectMetadata(html, metadata), { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }); return;
      }
      if (!TYPES[path.extname(pathname)] || pathname.startsWith('/.') || /(?:^|\/)\.[^/]+/.test(pathname)) throw new GatewayError(404, 'Not found');
      const file = path.resolve(staticDir, '.' + pathname);
      if (!file.startsWith(staticDir + path.sep)) throw new GatewayError(400, 'Invalid asset path');
      let stat;
      try { stat = await fsp.stat(file); } catch { throw new GatewayError(404, 'Not found'); }
      if (!stat.isFile() || stat.size > 20 * 1024 * 1024) throw new GatewayError(404, 'Not found');
      await send(req, res, 200, await fsp.readFile(file), { 'content-type': TYPES[path.extname(pathname)], 'cache-control': /\.[a-f0-9]{8,}\./.test(pathname) ? 'public, max-age=31536000, immutable' : 'public, max-age=300' });
    } catch (error) {
      if (error instanceof URIError) error = new GatewayError(400, 'Invalid request encoding');
      const status = error.status || 503;
      await json(req, res, status, { error: error instanceof GatewayError ? error.message : 'Service temporarily unavailable' }, { 'x-data-state': status === 404 ? 'not-found' : 'unavailable', ...(error.retryAfter ? { 'retry-after': String(error.retryAfter) } : {}) }).catch(() => res.destroy());
    }
  });
  server.requestTimeout = 20_000;
  server.headersTimeout = 10_000;
  server.keepAliveTimeout = 5_000;
  server.on('clientError', (_, socket) => { if (socket.writable) socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n'); });
  return { server, proxy, persist, stats: () => ({ requests, upstreamRequests: proxy.upstreamRequests, cacheEntries: proxy.cache.size, cacheBytes: proxy.cacheBytes, active: proxy.active, queued: proxy.queue.length }), close: async () => { clearTimeout(saveTimer); proxy.close(); await persist(); await new Promise(resolveClose => server.close(resolveClose)); server.closeAllConnections(); } };
}

if (require.main === module) {
  const app = createApp();
  const port = Number(process.env.LIGHTNING_PORT || 4581);
  const host = process.env.LIGHTNING_HOST || '127.0.0.1';
  app.server.listen(port, host, () => console.log(`Lightning explorer: http://${host}:${port}`));
  let stopping = false;
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, async () => { if (stopping) return; stopping = true; const forced = setTimeout(() => process.exit(1), 8000); forced.unref(); await app.close(); process.exit(0); });
}
module.exports = { createApp, resolve };
