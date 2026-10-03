'use strict';

// The Lightning application consumes only the public Mempool graph and the
// on-chain facts required by the original channel/justice components.
// No URL supplied by a visitor is ever used as an upstream origin.
const ORIGIN = 'https://mempool.emzy.de';
const ORIGINS = Object.freeze([ORIGIN, 'https://mempool.space']);
const PUBKEY = /^(?:02|03)[a-f0-9]{64}$/i;
const TXID = /^[a-f0-9]{64}$/i;
const U64_MAX = (1n << 64n) - 1n;
const INTERVALS = new Set(['24h', '3d', '1w', '1m', '3m', '6m', '1y', '2y', '3y', '4y', 'all']);

class GatewayError extends Error {
  constructor(status, message, retryAfter = 0) {
    super(message);
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

function channelId(value) {
  if (/^\d{1,20}$/.test(value)) {
    const n = BigInt(value);
    return n > 0n && n <= U64_MAX ? n.toString() : null;
  }
  const match = value.match(/^(\d{1,8})x(\d{1,8})x(\d{1,5})$/i);
  if (!match) return null;
  const [height, index, output] = match.slice(1).map(BigInt);
  return height <= 0xffffffn && index <= 0xffffffn && output <= 0xffffn
    ? `${height}x${index}x${output}` : null;
}

function channelNumeric(value) {
  const valid = channelId(String(value));
  if (!valid) return null;
  if (!valid.includes('x')) return valid;
  const [height, index, output] = valid.split('x').map(BigInt);
  return ((height << 40n) | (index << 16n) | output).toString();
}

function query(params, validators, required = []) {
  const normalized = new URLSearchParams();
  for (const key of params.keys()) {
    if (!validators[key]) throw new GatewayError(400, 'Unsupported query parameter');
  }
  for (const [key, check] of Object.entries(validators)) {
    const values = params.getAll(key);
    if (required.includes(key) && !values.length) throw new GatewayError(400, 'Missing query parameter');
    if (!key.endsWith('[]') && values.length > 1) throw new GatewayError(400, 'Duplicate query parameter');
    if (values.length > 50) throw new GatewayError(400, 'Too many identifiers');
    for (const value of values) {
      if (!check(value)) throw new GatewayError(400, 'Invalid query parameter');
      normalized.append(key, value);
    }
  }
  normalized.sort();
  const suffix = normalized.toString();
  return suffix ? `?${suffix}` : '';
}

function routeFor(raw) {
  if (typeof raw !== 'string' || raw.length > 8192 || !raw.startsWith('/') || raw.startsWith('//')) {
    throw new GatewayError(400, 'Invalid request path');
  }
  const rawPath = raw.split('?')[0];
  if (/[\\\x00-\x20]/.test(rawPath) || /%(?:2e|2f|5c|00)/i.test(rawPath) || /(?:^|\/)\.{1,2}(?:\/|$)/.test(rawPath)) {
    throw new GatewayError(400, 'Invalid request path');
  }
  let url;
  try { url = new URL(raw, 'http://local.invalid'); } catch { throw new GatewayError(400, 'Invalid request path'); }
  let p = url.pathname.replace(/\/$/, '');
  let ttl = 60_000;
  let maxBytes = 10 * 1024 * 1024;
  let suffix = '';
  let valid = false;
  if (p.startsWith('/api/v1/lightning/')) {
    let rest = p.slice('/api/v1/lightning/'.length);
    // Mempool recognizes 24h. Its unrecognized 1d route silently returns all
    // history, so normalize this compatibility input before cache or fetch.
    if (rest === 'statistics/1d') { rest = 'statistics/24h'; p = '/api/v1/lightning/statistics/24h'; }
    if (/^nodes\/country\/[a-z]{2}$/i.test(rest)) {
      rest = 'nodes/country/' + rest.slice(-2).toUpperCase(); p = '/api/v1/lightning/' + rest;
    }
    if (rest === 'search') {
      suffix = query(url.searchParams, { searchText: v => v.length >= 1 && v.length <= 128 && !/[\x00-\x1f\x7f]/.test(v) }, ['searchText']);
      ttl = 15_000;
      valid = true;
    } else if (rest === 'channels') {
      suffix = query(url.searchParams, {
        public_key: v => PUBKEY.test(v), index: v => /^-?\d{1,7}$/.test(v) && Number(v) >= -1 && Number(v) <= 1_000_000,
        status: v => ['open', 'active', 'closed'].includes(v),
      }, ['public_key', 'status']);
      valid = true;
    } else if (rest === 'channels/txids') {
      suffix = query(url.searchParams, { 'txId[]': v => TXID.test(v) }, ['txId[]']);
      ttl = 300_000;
      valid = true;
    } else if (/^channels\//.test(rest) && channelId(rest.slice(9))) {
      p = '/api/v1/lightning/channels/' + channelNumeric(rest.slice(9));
      valid = true;
    } else if (rest === 'channels-geo' || /^channels-geo\//.test(rest) && PUBKEY.test(rest.slice(13))) {
      suffix = query(url.searchParams, { style: v => ['graph', 'nodepage', 'widget', 'channelpage'].includes(v) });
      ttl = 300_000;
      valid = true;
    } else if (rest === 'statistics/latest') {
      ttl = 300_000;
      valid = true;
    } else if (rest.startsWith('statistics/') && INTERVALS.has(rest.slice(11))) {
      ttl = 900_000;
      valid = true;
    } else if (['nodes/rankings', 'nodes/rankings/liquidity', 'nodes/rankings/connectivity', 'nodes/rankings/age', 'nodes/countries', 'nodes/isp-ranking', 'nodes/world', 'penalties'].includes(rest)) {
      ttl = ['nodes/world', 'nodes/countries', 'nodes/isp-ranking'].includes(rest) ? 600_000 : 300_000;
      valid = true;
    } else if (/^nodes\/country\/[A-Z]{2}$/.test(rest) || /^nodes\/isp\/\d{1,10}(?:,\d{1,10}){0,11}$/.test(rest) || rest === 'nodes/group/mempool.space') {
      ttl = 300_000;
      valid = true;
    } else {
      const m = rest.match(/^nodes\/([^/]+)(?:\/(statistics|fees\/histogram))?$/);
      if (m && PUBKEY.test(m[1])) {
        ttl = m[2] ? 300_000 : 60_000;
        valid = true;
      }
    }
  } else if (p === '/api/v1/prices') {
    ttl = 60_000;
    valid = true;
  } else if (p === '/api/v1/historical-price') {
    suffix = query(url.searchParams, {
      timestamp: v => /^\d{1,11}$/.test(v) && Number(v) > 0,
      currency: v => /^[A-Z]{3}$/.test(v),
    });
    ttl = 3_600_000;
    valid = true;
  } else if (p === '/api/blocks/tip/height') {
    ttl = 30_000;
    valid = true;
  } else if (/^\/api\/tx\/[a-f0-9]{64}(?:\/outspends|\/outspend\/\d{1,5})?$/i.test(p) || /^\/api\/block\/[a-f0-9]{64}$/i.test(p) || /^\/api\/block-height\/\d{1,10}$/.test(p) || /^\/api\/v1\/(?:tx\/[a-f0-9]{64}\/cpfp|cpfp\/[a-f0-9]{64})$/i.test(p)) {
    ttl = /outspend|cpfp/.test(p) ? 60_000 : 3_600_000;
    valid = true;
  } else if (p === '/api/txs/outspends') {
    suffix = query(url.searchParams, { txids: v => v.split(',').length <= 50 && v.split(',').every(id => TXID.test(id)) }, ['txids']);
    ttl = 60_000;
    valid = true;
  } else if (/^\/api\/v1\/validate-address\/(?:[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[ac-hj-np-z02-9]{11,87})$/.test(p)) {
    ttl = 3_600_000;
    valid = true;
  }
  if (!valid) throw new GatewayError(404, 'API endpoint not available');
  if (!suffix) suffix = query(url.searchParams, {});
  return { path: p + suffix, ttl, maxBytes };
}

class LightningProxy {
  constructor(options = {}) {
    this.fetch = options.fetch || globalThis.fetch;
    this.now = options.now || Date.now;
    this.timeoutMs = options.timeoutMs ?? 12_000;
    this.providerCooldowns = new Map();
    this.maxConcurrency = options.maxConcurrency ?? 4;
    this.maxQueue = options.maxQueue ?? 48;
    this.budgetPerMinute = options.budgetPerMinute ?? 90;
    this.burst = options.burst ?? 16;
    this.maxCacheBytes = options.maxCacheBytes ?? 32 * 1024 * 1024;
    this.maxCacheEntries = options.maxCacheEntries ?? 512;
    this.maxStaleMs = options.maxStaleMs ?? 24 * 3_600_000;
    this.cache = new Map();
    this.cacheBytes = 0;
    this.inflight = new Map();
    this.failures = new Map();
    this.active = 0;
    this.queue = [];
    this.closed = false;
    this.tokens = this.burst;
    this.tokenAt = this.now();
    this.cooldownUntil = 0;
    this.cooldownTimer = null;
    this.lastSuccessAt = null;
    this.lastFailureAt = null;
    this.upstreamRequests = 0;
    this.save = options.save || (() => {});
  }

  restore(entries) {
    if (!Array.isArray(entries)) return;
    for (const entry of entries.slice(-this.maxCacheEntries)) {
      try {
        const route = routeFor(entry.path);
        if (route.path !== entry.path || entry.status !== 200 || !Number.isFinite(entry.observedAt) || entry.observedAt > this.now() || this.now() - entry.observedAt > this.maxStaleMs || typeof entry.body !== 'string' || entry.body.length > route.maxBytes * 1.5) continue;
        const body = Buffer.from(entry.body, 'base64');
        if (body.length > route.maxBytes) continue;
        if (entry.contentType !== 'application/json' && entry.contentType !== 'text/plain') continue;
        if (entry.contentType === 'application/json') JSON.parse(body);
        let restoreTtl = route.ttl;
        if (/^\/api\/tx\/[a-f0-9]{64}$/i.test(route.path) && JSON.parse(body)?.status?.confirmed !== true) restoreTtl = 15_000;
        this.put({ path: entry.path, status: 200, body, observedAt: entry.observedAt, sourceUpdatedAt: typeof entry.sourceUpdatedAt === 'string' && Number.isFinite(Date.parse(entry.sourceUpdatedAt)) ? new Date(entry.sourceUpdatedAt).toISOString() : null, headers: { 'content-type': entry.contentType, ...(ORIGINS.includes(entry.provider) ? { 'x-data-provider': entry.provider } : {}), ...(typeof entry.totalCount === 'string' && /^\d+$/.test(entry.totalCount) ? { 'x-total-count': entry.totalCount } : {}) } }, restoreTtl);
      } catch {}
    }
  }

  snapshot() {
    return [...this.cache.values()].filter(e => this.now() - e.observedAt <= this.maxStaleMs).map(e => ({ path: e.path, status: e.status, body: e.body.toString('base64'), observedAt: e.observedAt, sourceUpdatedAt: e.sourceUpdatedAt, contentType: e.headers['content-type'], provider: e.headers['x-data-provider'], totalCount: e.headers['x-total-count'] }));
  }

  put(entry, ttl) {
    const previous = this.cache.get(entry.path);
    if (previous) this.cacheBytes -= previous.body.length;
    this.cache.delete(entry.path);
    entry.expires = entry.observedAt + ttl;
    this.cache.set(entry.path, entry);
    this.cacheBytes += entry.body.length;
    while (this.cache.size > this.maxCacheEntries || this.cacheBytes > this.maxCacheBytes) {
      const oldest = this.cache.keys().next().value;
      this.cacheBytes -= this.cache.get(oldest).body.length;
      this.cache.delete(oldest);
    }
    this.save();
  }

  touch(path) {
    const entry = this.cache.get(path);
    if (entry) { this.cache.delete(path); this.cache.set(path, entry); }
    return entry;
  }

  headers(entry, state, error) {
    const sourceOld = entry.sourceUpdatedAt && this.now() - Date.parse(entry.sourceUpdatedAt) > 3 * 24 * 3_600_000;
    return {
      ...entry,
      state: sourceOld && state === 'fresh' ? 'stale' : state,
      headers: {
        ...entry.headers,
        'cache-control': 'no-store',
        'x-data-state': sourceOld && state === 'fresh' ? 'stale' : state,
        'x-observed-at': new Date(entry.observedAt).toISOString(),
        'age': String(Math.max(0, Math.floor((this.now() - entry.observedAt) / 1000))),
        ...(entry.sourceUpdatedAt ? { 'x-source-updated-at': entry.sourceUpdatedAt } : {}),
        ...(state === 'stale' || sourceOld ? { warning: '110 lightning.btc.tx.taxi "Response is stale"' } : {}),
        ...(error?.retryAfter ? { 'retry-after': String(error.retryAfter) } : {}),
      },
    };
  }

  request(raw) {
    let route;
    try { route = routeFor(raw); } catch (error) { return Promise.reject(error); }
    const cached = this.touch(route.path);
    if (cached && cached.expires > this.now()) return Promise.resolve(this.headers(cached, 'fresh'));
    if (this.inflight.has(route.path)) return this.inflight.get(route.path);
    const stale = () => this.touch(route.path);
    const work = this.load(route).catch(error => {
      const old = stale();
      // Only outages and rate limits may use prior facts. An authoritative 404
      // must never be replaced by an older entity that the provider removed.
      if (old && this.now() - old.observedAt <= this.maxStaleMs && (error.status === 429 || error.status >= 500)) return this.headers(old, 'stale', error);
      throw error;
    }).finally(() => this.inflight.delete(route.path));
    this.inflight.set(route.path, work);
    return work;
  }

  enqueue(task) {
    if (this.closed) return Promise.reject(new GatewayError(503, 'Service is stopping', 5));
    if (this.queue.length >= this.maxQueue) return Promise.reject(new GatewayError(503, 'Service is busy. Retry shortly.', 5));
    return new Promise((resolve, reject) => {
      const item = { task, resolve, reject, queuedAt: this.now(), timer: null };
      item.timer = setTimeout(() => {
        const index = this.queue.indexOf(item);
        if (index >= 0) { this.queue.splice(index, 1); reject(new GatewayError(503, 'Request queue expired', 5)); }
      }, 15_000);
      item.timer.unref?.();
      this.queue.push(item);
      this.drain();
    });
  }

  drain() {
    if (this.closed) return;
    const now = this.now();
    this.tokens = Math.min(this.burst, this.tokens + (now - this.tokenAt) * this.budgetPerMinute / 60_000);
    this.tokenAt = now;
    if (this.cooldownUntil > now || this.tokens < 1) {
      if (!this.cooldownTimer && this.queue.length) {
        const delay = Math.max(this.cooldownUntil - now, (1 - this.tokens) * 60_000 / this.budgetPerMinute, 1);
        this.cooldownTimer = setTimeout(() => { this.cooldownTimer = null; this.drain(); }, Math.min(delay, 30_000));
        this.cooldownTimer.unref?.();
      }
      return;
    }
    while (this.active < this.maxConcurrency && this.queue.length && this.tokens >= 1) {
      const item = this.queue.shift();
      clearTimeout(item.timer);
      if (now - item.queuedAt > 15_000) { item.reject(new GatewayError(503, 'Request queue expired', 5)); continue; }
      this.tokens--;
      this.active++;
      Promise.resolve().then(item.task).then(item.resolve, item.reject).finally(() => { this.active--; this.drain(); });
    }
    if (this.queue.length && this.active < this.maxConcurrency) this.drain();
  }

  async reserveFallback(deadline) {
    while (!this.closed) {
      const now = this.now();
      this.tokens = Math.min(this.burst, this.tokens + (now - this.tokenAt) * this.budgetPerMinute / 60_000);
      this.tokenAt = now;
      if (this.tokens >= 1) { this.tokens--; return; }
      const wait = Math.ceil((1 - this.tokens) * 60_000 / this.budgetPerMinute);
      if (now + wait >= deadline) throw new GatewayError(503, 'Request budget is busy. Retry shortly.', 5);
      await new Promise(resolve => setTimeout(resolve, wait));
    }
    throw new GatewayError(503, 'Service is stopping', 5);
  }

  async load(route) {
    const previousFailure = this.failures.get(route.path);
    if (previousFailure && previousFailure.retryAt > this.now()) throw new GatewayError(previousFailure.status, 'Data temporarily unavailable', Math.ceil((previousFailure.retryAt - this.now()) / 1000));
    if (this.cooldownUntil > this.now()) throw new GatewayError(429, 'Data source is busy. Retry shortly.', Math.ceil((this.cooldownUntil - this.now()) / 1000));
    return this.enqueue(async () => {
      let response;
      let body;
      try {
        const deadline = this.now() + this.timeoutMs;
        let selectedOrigin;
        let lastFailure;
        let notFoundCount = 0;
        let attempted = false;
        for (const origin of ORIGINS) {
          const cooldown = this.providerCooldowns.get(origin) || 0;
          if (cooldown > this.now()) {
            lastFailure = new GatewayError(429, 'Data source is busy. Retry shortly.', Math.ceil((cooldown - this.now()) / 1000));
            continue;
          }
          const remaining = deadline - this.now();
          if (remaining <= 0) { lastFailure = new GatewayError(504, 'Data temporarily unavailable', 15); break; }
          try {
            if (attempted) await this.reserveFallback(deadline);
            attempted = true;
            const attemptRemaining = deadline - this.now();
            if (attemptRemaining <= 0) throw new GatewayError(504, 'Data temporarily unavailable', 15);
            this.upstreamRequests++;
            response = await this.fetch(origin + route.path, { signal: AbortSignal.timeout(Math.max(1, Math.min(Math.floor(this.timeoutMs / 2), attemptRemaining))), redirect: 'manual', headers: { accept: 'application/json, text/plain;q=0.8', 'user-agent': 'tx.taxi-lightning/1.0 (+https://lightning.btc.tx.taxi)' } });
            if (response.ok) { selectedOrigin = origin; this.providerCooldowns.delete(origin); break; }
            await response.body?.cancel();
            if (response.status === 404) { notFoundCount++; continue; }
            if (response.status >= 300 && response.status < 400) { lastFailure = new GatewayError(502, 'Unexpected data source redirect'); continue; }
            if (response.status === 429 || response.status >= 500) {
              const retryHeader = response.headers.get('retry-after');
              const retry = /^\d+$/.test(retryHeader || '') ? Math.min(120, Math.max(5, Number(retryHeader))) : 15;
              if (response.status === 429) this.providerCooldowns.set(origin, this.now() + retry * 1000);
              lastFailure = new GatewayError(response.status, response.status === 429 ? 'Data source is busy. Retry shortly.' : 'Data temporarily unavailable', retry);
              continue;
            }
            return { status: response.status, state: 'unavailable', body: Buffer.from(JSON.stringify({ error: 'Data source rejected the request' })), headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'x-data-state': 'unavailable' } };
          } catch (error) {
            lastFailure = error instanceof GatewayError ? error : new GatewayError(error.name === 'TimeoutError' || error.name === 'AbortError' ? 504 : 503, 'Data temporarily unavailable', 15);
            this.providerCooldowns.set(origin, this.now() + 15_000);
          }
        }
        if (!selectedOrigin) {
          if (notFoundCount === ORIGINS.length) {
            if (this.cache.has(route.path)) { this.cacheBytes -= this.cache.get(route.path).body.length; this.cache.delete(route.path); this.save(); }
            return { status: 404, state: 'not-found', body: Buffer.from(JSON.stringify({ error: 'Not found' })), headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'x-data-state': 'not-found' } };
          }
          throw lastFailure || new GatewayError(503, 'Data temporarily unavailable', 15);
        }
        const announcedSize = Number(response.headers.get('content-length'));
        if (announcedSize > route.maxBytes) { await response.body?.cancel(); throw new GatewayError(502, 'Data response exceeds the size limit'); }
        const reader = response.body?.getReader();
        if (!reader) throw new GatewayError(502, 'Data source returned no body');
        const chunks = [];
        let size = 0;
        try {
          while (true) {
            const part = await reader.read();
            if (part.done) break;
            size += part.value.byteLength;
            if (size > route.maxBytes) throw new GatewayError(502, 'Data response exceeds the size limit');
            chunks.push(part.value);
          }
        } finally { await reader.cancel().catch(() => {}); }
        body = Buffer.concat(chunks);
        const textEndpoint = /^\/api\/block-height\/|^\/api\/blocks\/tip\/height/.test(route.path);
        let parsed;
        if (textEndpoint) {
          if (!/^(?:\d{1,10}|[a-f0-9]{64})$/i.test(body.toString().trim())) throw new GatewayError(502, 'Invalid data response');
        } else {
          try { parsed = JSON.parse(body); } catch { throw new GatewayError(502, 'Invalid data response'); }
          if (parsed === null || typeof parsed !== 'object') throw new GatewayError(502, 'Invalid data response');
        }
        const sourceUpdatedAt = route.path === '/api/v1/lightning/statistics/latest' && parsed?.latest?.added && Number.isFinite(Date.parse(parsed.latest.added)) ? new Date(parsed.latest.added).toISOString() : null;
        const entry = { path: route.path, status: response.status, body, observedAt: this.now(), sourceUpdatedAt, headers: { 'content-type': textEndpoint ? 'text/plain' : 'application/json', 'x-data-provider': selectedOrigin, ...(response.headers.get('x-total-count') && /^\d+$/.test(response.headers.get('x-total-count')) ? { 'x-total-count': response.headers.get('x-total-count') } : {}) } };
        this.lastSuccessAt = entry.observedAt;
        this.failures.delete(route.path);
        const effectiveTtl = /^\/api\/tx\/[a-f0-9]{64}$/i.test(route.path) && parsed?.status?.confirmed !== true ? 15_000 : route.ttl;
        this.put(entry, effectiveTtl);
        return this.headers(entry, 'fresh');
      } catch (error) {
        this.lastFailureAt = this.now();
        const failure = error instanceof GatewayError ? error : new GatewayError(error.name === 'TimeoutError' || error.name === 'AbortError' ? 504 : 503, 'Data temporarily unavailable', 15);
        const count = Math.min(4, (previousFailure?.count || 0) + 1);
        const wait = failure.retryAfter || Math.min(120, 15 * 2 ** (count - 1));
        this.failures.delete(route.path);
        this.failures.set(route.path, { count, status: failure.status, retryAt: this.now() + wait * 1000 });
        while (this.failures.size > this.maxCacheEntries) this.failures.delete(this.failures.keys().next().value);
        throw failure;
      }
    });
  }

  async health() {
    try {
      const response = await this.request('/api/v1/lightning/statistics/latest');
      if (response.status !== 200) return { state: 'offline', status: response.status, observedAt: null, sourceUpdatedAt: null };
      return { state: response.state === 'stale' ? 'stale' : 'online', observedAt: response.headers['x-observed-at'], sourceUpdatedAt: response.headers['x-source-updated-at'] || null, age: Number(response.headers.age), provider: response.headers['x-data-provider'], retryAfter: Number(response.headers['retry-after'] || 0) };
    } catch (error) {
      return { state: 'offline', status: error.status || 503, observedAt: this.lastSuccessAt ? new Date(this.lastSuccessAt).toISOString() : null, sourceUpdatedAt: null, retryAfter: error.retryAfter || 15 };
    }
  }

  close() {
    this.closed = true;
    clearTimeout(this.cooldownTimer);
    for (const item of this.queue.splice(0)) { clearTimeout(item.timer); item.reject(new GatewayError(503, 'Service is stopping', 5)); }
  }
}

module.exports = { LightningProxy, GatewayError, routeFor, channelId, channelNumeric, PUBKEY, TXID, ORIGIN, ORIGINS };
