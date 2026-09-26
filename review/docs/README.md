# Bitcoin documentation evidence

Reviewed 2026-09-26 against the checked-out Docker and nginx configuration, backend route registration, and paced public requests to `https://btc.tx.taxi`.

## Published interface

The deployment nginx config sends `/api/` to `https://mempool.space`, preserves upgrade headers, and serves the Angular explorer at the Bitcoin host. This makes the following public interfaces appropriate to document at the tx.taxi origin:

| Interface | Evidence | Availability |
| --- | --- | --- |
| Native explorer pages | `docker/nginx.conf` proxies `/tx/:id`, `/block/:id`, and `/address/:id` to the local renderer | Documented as browser routes |
| Esplora REST | `/api/blocks/tip/height`, `/api/block-height/968724`, `/api/address/bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`, and `/api/mempool/recent` returned HTTP 200 | Documented in REST sections |
| Mempool REST | `/api/v1/blocks`, `/api/v1/fees/recommended`, `/api/v1/fees/precise`, and `/api/v1/mining/pools/1w` returned HTTP 200 JSON | Documented in REST sections |
| WebSocket | An HTTP/1.1 upgrade request to `/api/v1/ws` returned `101 Switching Protocols` | Documented with subscription payloads |

The backend source independently registers the fee, block, transaction, mempool, and mining routes, and its WebSocket handler accepts `blocks`, `mempool-blocks`, `live-2h-chart`, and `stats` `want` subscriptions. It limits a connection to 100 tracked transaction IDs.

## Intentionally absent from the Bitcoin docs

Electrum RPC is not exposed by this nginx deployment, so its tab and route are removed. Lightning and accelerator-service sections are omitted because they are outside this explorer's Bitcoin data interface. Self-hosting instructions, paid-tier calls to action, and the upstream JavaScript SDK tabs are also omitted.

## Remaining limits

This verification establishes routing and representative live availability; it does not freeze every upstream response schema. The proxy currently depends on the public upstream service configured in `docker/nginx.conf`, so a provider change or outage can affect the documented REST and WebSocket interfaces. Pending-transaction and fee responses are node observations, not network-wide facts or confirmation guarantees.

Bitcoin protocol explanations link to the primary [Bitcoin Developer Guide mempool reference](https://developer.bitcoin.org/devguide/p2p_network.html#memory-pool).
