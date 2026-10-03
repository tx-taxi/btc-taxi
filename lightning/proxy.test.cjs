'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { LightningProxy, ORIGINS, GatewayError } = require('./proxy.cjs');
const { resolve, createApp } = require('./server.cjs');
const { injectMetadata, routeMetadata } = require('./social.cjs');
const PUBKEY = '03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f';
const FACTS = { latest: { added: '2026-10-03T00:00:00.000Z', channel_count: 30440 } };
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...headers } });

// The upstream component's observable replay cache only coalesces requests from
// one visitor. This verifies the missing cross-visitor resource boundary.
test('simultaneous visitors and health checks share one bounded observation', async () => {
  let complete;
  let calls = 0;
  const proxy = new LightningProxy({ fetch: () => { calls++; return new Promise(resolve => complete = resolve); }, now: () => Date.parse('2026-10-03T12:00:00Z') });
  const requests = [...Array(30)].map(() => proxy.request('/api/v1/lightning/statistics/latest'));
  const health = proxy.health();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls, 1);
  complete(json(FACTS));
  const results = await Promise.all(requests);
  assert.ok(results.every(r => JSON.parse(r.body).latest.channel_count === 30440));
  assert.equal((await health).state, 'online');
  await proxy.request('/api/v1/lightning/statistics/latest');
  assert.equal(calls, 1);
  proxy.close();
});

test('current source outage falls back; both outages retain original facts and then recover', async () => {
  let now = Date.parse('2026-10-03T12:00:00Z');
  let mode = 'primary-failed';
  const calls = [];
  const proxy = new LightningProxy({ now: () => now, fetch: async url => {
    calls.push(url);
    if (mode === 'both-failed' || mode === 'primary-failed' && url.startsWith(ORIGINS[0])) return json({ error: 'unavailable' }, 503);
    return json({ latest: { ...FACTS.latest, channel_count: mode === 'recovered' ? 30441 : 30440 } });
  } });
  const first = await proxy.request('/api/v1/lightning/statistics/latest');
  assert.equal(first.headers['x-data-provider'], ORIGINS[1]);
  const observedAt = first.headers['x-observed-at'];
  now += 301_000;
  mode = 'both-failed';
  const stale = await proxy.request('/api/v1/lightning/statistics/latest');
  assert.equal(stale.state, 'stale');
  assert.equal(stale.headers['x-observed-at'], observedAt);
  assert.equal(JSON.parse(stale.body).latest.channel_count, 30440);
  assert.equal(stale.headers['x-source-updated-at'], FACTS.latest.added);
  const previousCalls = calls.length;
  await proxy.request('/api/v1/lightning/statistics/latest');
  assert.equal(calls.length, previousCalls, 'cooldown must avoid repeated visitor retries');
  now += 121_000;
  mode = 'recovered';
  const recovered = await proxy.request('/api/v1/lightning/statistics/latest');
  assert.equal(recovered.state, 'fresh');
  assert.equal(JSON.parse(recovered.body).latest.channel_count, 30441);
  assert.notEqual(recovered.headers['x-observed-at'], observedAt);
  proxy.close();
});

test('old source dates stay stale after a fresh HTTP observation or durable cache restore', async () => {
  const now = Date.parse('2026-10-03T12:00:00Z');
  const proxy = new LightningProxy({ now: () => now, fetch: async () => json({ latest: { added: '2026-05-21T00:00:00.000Z' } }) });
  const old = await proxy.request('/api/v1/lightning/statistics/latest');
  assert.equal(old.state, 'stale');
  assert.equal(old.headers['x-observed-at'], new Date(now).toISOString());
  const restored = new LightningProxy({ now: () => now + 60_000, fetch: () => { throw new Error('must use persisted observation'); } });
  restored.restore(proxy.snapshot());
  const response = await restored.request('/api/v1/lightning/statistics/latest');
  assert.equal(response.headers['x-source-updated-at'], '2026-05-21T00:00:00.000Z');
  assert.equal(response.headers['x-observed-at'], old.headers['x-observed-at']);
  assert.equal(response.state, 'stale');
  proxy.close(); restored.close();
});

test('pending funding or closing transactions can confirm without a Bitcoin socket', async () => {
  let now = Date.parse('2026-10-03T12:00:00Z');
  let confirmed = false;
  let calls = 0;
  const txid = 'a'.repeat(64);
  const proxy = new LightningProxy({ now: () => now, fetch: async () => { calls++; return json({ txid, status: { confirmed } }); } });
  assert.equal(JSON.parse((await proxy.request('/api/tx/' + txid)).body).status.confirmed, false);
  now += 16_000;
  confirmed = true;
  assert.equal(JSON.parse((await proxy.request('/api/tx/' + txid)).body).status.confirmed, true);
  now += 16_000;
  await proxy.request('/api/tx/' + txid);
  assert.equal(calls, 2, 'the now confirmed immutable transaction can use the longer cache');
  proxy.close();
});

test('isolated fee histogram failure leaves rankings working; unavailable never becomes not found', async () => {
  const proxy = new LightningProxy({ fetch: async url => url.includes('/fees/histogram') ? json({}, 502) : json({ topByCapacity: [{ publicKey: PUBKEY }] }) });
  await assert.rejects(proxy.request(`/api/v1/lightning/nodes/${PUBKEY}/fees/histogram`), error => error.status === 502);
  const rankings = await proxy.request('/api/v1/lightning/nodes/rankings');
  assert.equal(rankings.status, 200);
  assert.equal(JSON.parse(rankings.body).topByCapacity[0].publicKey, PUBKEY);
  proxy.close();
});

test('historical channel absence is checked on both sources; outage plus one absence is unavailable', async () => {
  let mode = 'history';
  const proxy = new LightningProxy({ fetch: async url => {
    if (mode === 'mixed') return json({}, url.startsWith(ORIGINS[0]) ? 404 : 503);
    if (mode === 'both-missing') return json({}, 404);
    return url.startsWith(ORIGINS[0]) ? json({}, 404) : json({ short_id: '811984x2037x0', capacity: 500000000 });
  } });
  const historical = await proxy.request('/api/v1/lightning/channels/811984x2037x0');
  assert.equal(historical.status, 200);
  assert.equal(historical.headers['x-data-provider'], ORIGINS[1]);
  mode = 'mixed';
  await assert.rejects(proxy.request('/api/v1/lightning/channels/100x2x0'), e => e.status === 503);
  mode = 'both-missing';
  const absent = await proxy.request('/api/v1/lightning/channels/101x2x0');
  assert.equal(absent.status, 404);
  proxy.close();
});

test('fallback attempts consume the same shared upstream budget', async () => {
  const calls = [];
  const proxy = new LightningProxy({ burst: 1, budgetPerMinute: 600, fetch: async url => {
    calls.push({ url, at: Date.now() });
    return url.startsWith(ORIGINS[0]) ? json({}, 503) : json({ topByCapacity: [] });
  } });
  const pending = proxy.request('/api/v1/lightning/nodes/rankings');
  await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(calls.length, 1, 'failover cannot bypass the exhausted request budget');
  const response = await pending;
  assert.equal(response.status, 200);
  assert.equal(calls.length, 2);
  assert.ok(calls[1].at - calls[0].at >= 80);
  proxy.close();
});

test('path/query allowlist blocks arbitrary provider access before any fetch', async () => {
  let calls = 0;
  const proxy = new LightningProxy({ fetch: async () => { calls++; return json({}); } });
  for (const request of ['https://evil.invalid/', '//evil.invalid/api/v1/lightning/nodes/world', '/api/v1/lightning/../../private', '/api/v1/lightning/%2e%2e/private', '/api/v1/lightning/nodes/world?url=https://evil.invalid', `/api/v1/lightning/channels?public_key=${PUBKEY}&status=open&index=-2`, '/api/v1/lightning/search?searchText=one&searchText=two', '/api/v1/mining/pools', '/api/txs/outspends?txids=oops']) await assert.rejects(proxy.request(request), error => [400, 404].includes(error.status));
  assert.equal(calls, 0);
  proxy.close();
});

// The live provider accepted 1d but returned all history, while our gateway
// rejected the 24h interval advertised in the reused REST documentation.
test('documented daily statistics do not silently become all-history data', async () => {
  const today = { added: 1790985600, total_capacity: 369197324588 };
  let calls = 0;
  const proxy = new LightningProxy({ fetch: async url => {
    calls++;
    return json(url.endsWith('/statistics/24h') ? [today] : [{ added: 1609459200 }, today]);
  } });
  const daily = await proxy.request('/api/v1/lightning/statistics/24h');
  assert.deepEqual(JSON.parse(daily.body), [today]);
  const compatible = await proxy.request('/api/v1/lightning/statistics/1d');
  assert.deepEqual(JSON.parse(compatible.body), [today]);
  assert.equal(calls, 1, 'daily aliases must share the same bounded observation');
  proxy.close();
});

test('documented lower-case country codes resolve the same ISO entity', async () => {
  let calls = 0;
  const proxy = new LightningProxy({ fetch: async url => {
    calls++;
    return url.endsWith('/country/CH') ? json({ country: { en: 'Switzerland' }, nodes: [{ public_key: PUBKEY }] }) : json({}, 404);
  } });
  const documented = await proxy.request('/api/v1/lightning/nodes/country/ch');
  assert.equal(JSON.parse(documented.body).country.en, 'Switzerland');
  const sameCountry = await proxy.request('/api/v1/lightning/nodes/country/CH');
  assert.equal(JSON.parse(sameCountry.body).nodes[0].public_key, PUBKEY);
  assert.equal(calls, 1);
  proxy.close();
});

test('large provider payloads and unexpected redirects are rejected', async () => {
  for (const response of [() => new Response('{}', { status: 200, headers: { 'content-length': String(11 * 1024 * 1024) } }), () => new Response('', { status: 302, headers: { location: 'https://evil.invalid/' } })]) {
    const proxy = new LightningProxy({ fetch: async () => response() });
    await assert.rejects(proxy.request('/api/v1/lightning/nodes/world'), e => e.status === 502);
    proxy.close();
  }
});

test('resolver verifies entity identities and refuses ambiguous aliases or untrusted URLs', async () => {
  let mode = 'correct';
  const proxy = new LightningProxy({ fetch: async url => {
    if (url.includes('/channels/')) return json({ short_id: mode === 'mismatch' ? '811986x2037x0' : '811984x2037x0' });
    if (url.includes('/search?')) return json({ nodes: [{ public_key: PUBKEY, alias: 'ACINQ' }, { public_key: '02' + '1'.repeat(64), alias: 'Acinq' }], channels: [] });
    return json({ public_key: mode === 'mismatch' ? '02' + '1'.repeat(64) : PUBKEY });
  } });
  assert.equal((await resolve('811984x2037x0', proxy)).id, '892785849701564416');
  assert.equal((await resolve(PUBKEY, proxy)).id, PUBKEY);
  await assert.rejects(resolve('ACINQ', proxy), e => e.status === 409);
  await assert.rejects(resolve('https://evil.invalid/node/' + PUBKEY, proxy), e => e.status === 400);
  mode = 'mismatch';
  await assert.rejects(resolve('811985x2037x0', proxy), e => e.status === 502);
  proxy.close();
});

test('runtime process health survives dependency failure and static metadata preserves canonical hook', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'lightning-runtime-test-'));
  await fs.writeFile(path.join(dir, 'index.html'), '<html><head><title>old</title><link rel="canonical" href="https://btc.tx.taxi"></head><body><app-root></app-root></body></html>');
  const app = createApp({ staticDir: dir, dataDir: false, proxyOptions: { fetch: async () => json({}, 503) } });
  await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${app.server.address().port}`;
  assert.equal((await fetch(origin + '/healthz')).status, 200);
  assert.equal((await fetch(origin + '/api/provider-health')).status, 503);
  const html = await (await fetch(origin + '/node/' + PUBKEY)).text();
  assert.match(html, /id="canonical"/);
  assert.match(html, new RegExp(`https://lightning\\.btc\\.tx\\.taxi/node/${PUBKEY}`));
  assert.equal((await fetch(origin + '/.env')).status, 404);
  assert.equal((await fetch(origin + '/graphs/capacity')).status, 200);
  await app.close();
  await fs.rm(dir, { recursive: true, force: true });
});
