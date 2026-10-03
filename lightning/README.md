# Independent Lightning runtime

This is a separate frontend build and a separate cached public-data service at
`lightning.btc.tx.taxi`. It does not start Bitcoin's backend, indexer, WebSocket
server, Lightning node, SQL database, or a block-strip adapter. The existing
Bitcoin build/deployment remains unchanged.

## Theme and branding

The default theme uses Lightning purple (`#7B1AF7`) with Bitcoin orange
(`#F7931A`) for on-chain links and secondary chart highlights. Mempool Original
retains its upstream palette and native chart colors. The Lightning taxi
assets use purple as their only accent and preserve the approved taxi paths; `frontend/lightning.branding.cjs`
regenerates their scoped SVG and touch-icon variants. The advertised social
image is an actual dashboard screenshot, shared through the frontend/runtime
`lightning-social-image.json` and `lightning/social-image.json` manifests.

## Local commands

From this checkout:

```sh
npm ci --prefix lightning --omit=dev
npm run build:lightning --prefix frontend
node lightning/server.cjs
```

Frontend output: `frontend/dist/lightning/browser/`; local review server:
`http://127.0.0.1:4581`. The runtime reads `index.html`, accepting Angular's
`index.lightning.html` filename during incremental development. For Angular's
watch/dev server, use the frontend's separate Lightning target and its proxy
configuration to this same runtime. Stop the runtime with Ctrl+C or SIGTERM.

Environment settings are local paths/listen settings only:

- `LIGHTNING_HOST`: default `127.0.0.1`; container uses `0.0.0.0`.
- `LIGHTNING_PORT`: default `4581`; container uses `8080`.
- `LIGHTNING_STATIC_DIR`: optional absolute build output path.
- `LIGHTNING_DATA_DIR`: durable cache directory; local default `lightning/.data`.

No upstream origin, arbitrary URL, or credential is accepted from requests or
these environment settings. Node 24+ is required. All request handling uses
Node built-ins; the existing social-card composition uses pinned Sharp 0.35.5
for real 1200×630 PNGs. No user-provided images are rasterized.

## Provider and freshness contract

The fixed primary origin is `https://mempool.emzy.de`. The fixed secondary is
`https://mempool.space`. This is deliberate: on 2026-10-03, the official public
API returned network snapshots dated May 21/22 while Emzy returned October 3.
Emzy's endpoint shapes, native current/historical nodes/channels, graph maps,
rankings, countries, ISPs, historical fees/statistics, justice channels, and
on-chain facts were actually probed. Primary/secondary data are public graph
observations; neither can expose private payments, private channel balances,
or every unannounced channel.

The original source API requires **numeric uint64 channel IDs** for its channel
detail path. Inputs such as `811984x2037x0` are validated and converted exactly
using BigInt to `892785849701564416`. A short ID is a presentation/lookup form,
not a directly accepted upstream detail path. This was verified against live
APIs after an initial probe incorrectly interpreted short-path 404s as missing
history.

Every cache entry retains its original successful observation time. A latest
statistics source snapshot retains its original `latest.added` time separately:
HTTP success today does not turn a May statistical snapshot into current data.
Three-day-old daily network snapshots are marked stale. Historical entity
timestamps retain their actual meaning, rather than treating an old creation
or last policy-update date as a failed connection.

Responses preserve native JSON fields/units, source HTTP error status, and
`X-Total-Count` for original component pagination. They add:

- `X-Data-State`: `fresh`, `stale`, `not-found`, or `unavailable`.
- `X-Observed-At`: original successful gateway observation (never renewed by a cache hit).
- `X-Source-Updated-At`: actual source network statistics date where applicable.
- `X-Data-Provider`: fixed origin that supplied the facts.
- `Age` and, during cooldown, `Retry-After`.

These are transport/diagnostic fields, not visible implementation notes.

`/healthz` is fast process liveness and never calls a provider. The shared
`/api/provider-health` observation uses the same five-minute cached, coalesced
latest-statistics request as the dashboard. It returns `online`, `stale`, or
`offline` plus original timestamps. Dependency failure does not restart a
healthy process. A successful isolated endpoint is not taken as proof that
other historical endpoints work.

## Limits and failure handling

- Four active upstream tasks, at most 48 waiting tasks; queued requests expire
  after 15 seconds.
- Shared 90-request/minute upstream token budget, burst 16. Cache hits and
  simultaneous visitors do not multiply upstream collection.
- At most two fixed-source attempts; request deadline 12 seconds and each
  origin gets at most six seconds. Redirects are rejected.
- Request validation includes methods, native identities, path traversal,
  parameter keys, duplicate parameters, list sizes, intervals, and page ranges.
- Confirmed on-chain transactions cache for one hour; pending/unknown confirmation state caches for only 15 seconds, including durable restores.
- Response body limit 10 MiB; cache at most 512 entries/32 MiB. No source maps,
  credentials, repository files, or arbitrary filesystem paths are served.
- Short-lived provider 429/network cooldown; route-specific errors do not
  block healthy sibling widgets. Successful recovery removes route failure.
- During provider outage, prior observations may be returned for at most
  24 hours with `stale` and original timestamps. Outage is never cached as
  missing. An entity is reported absent only after both origins confirm 404;
  one 404 plus an outage remains unavailable.
- Atomic bounded cache snapshots persist in the configured data directory and
  restore original observation times after a restart. The Docker profile
  declares a durable `/app/data` volume explicitly.

## Routing and social cards

`/api/lightning/resolve?value=...` returns a confirmed `{type:'node'|'channel',
id,...}` only after verifying the exact identity. The canonical channel ID is
numeric. Compressed public keys, numeric/short channel IDs, and exact trusted
native/Mempool Lightning URLs are supported. Alias routing requires one exact
case-insensitive alias match; duplicate aliases return 409, and fuzzy ranking
is never treated as identity proof. Funding/closing facts stay on Lightning
channel pages; their explicit on-chain links open the native Bitcoin explorer.

Initial HTML has Lightning canonical/title/description/social metadata and
preserves the shared `id="canonical"` client hook. PNG cards at
`/og/lightning.png`, `/og/node/:key.png`, and `/og/channel/:id.png` reuse the
Bitcoin fork's actual OG composition and selected taxi wordmark, with Lightning
semantics and cached entity facts. Card rendering is limited to two tasks and
64 cached images.

## Verification and deployment preparation

```sh
node --test lightning/proxy.test.cjs
node lightning/review/audit-provider.cjs
node lightning/review/audit-live.cjs
```

The provider audit checks exact funding outputs and closing outpoints, units,
pagination count headers, maps/country/ISP/rankings/history, and graph/source
health. The browser audit checks real rendered units against source facts.
`review/provider-emzy.json`, `review/provider-detail.json`,
`review/provider-initial.json`, `review/provider-capabilities-raw.json`, and
`review/browser-data-audit.json` hold bounded observations. The actual social
PNG was opened visually.

The captured-reference comparison is separate from live accuracy. Run
`node lightning/review/capture-fixture-parity.cjs` to replay the exact captured
Mempool responses on both sites at 1440×900 and 390×844. Screenshots and measured
rectangles live in `../review/lightning/fixture-parity.json` and its four
`*fixture-home-*.png` files. That snapshot is dated May 22; it does not prove
current provider freshness. Native dashboard dimensions match at both widths;
the independent taxi header, palette and footer intentionally differ.

`Dockerfile.lightning` and `deployment-profile.json` prepare a separate service,
healthcheck, and persistent volume. Nothing here creates DNS, modifies Coolify,
purchases a provider plan, starts a node, or deploys production. A future
production deployment must explicitly select this Dockerfile and its volume;
the ordinary Bitcoin Dockerfile remains untouched.
Follow the existing nested-host DNS-only preference with valid origin HTTPS;
this profile does not assume a paid Cloudflare certificate add-on.

Primary API references: [Mempool API documentation](https://mempool.space/docs/api/rest),
[channel routes](https://github.com/mempool/mempool/blob/master/backend/src/api/explorer/channels.routes.ts),
[node routes](https://github.com/mempool/mempool/blob/master/backend/src/api/explorer/nodes.routes.ts),
and [statistics/search routes](https://github.com/mempool/mempool/blob/master/backend/src/api/explorer/general.routes.ts).
The checked-out BTC fork supplies the component/API revision for this build;
live observations establish which public origins currently satisfy it.
