<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="frontend/src/resources/branding/btc-dark-full.svg">
    <img src="frontend/src/resources/branding/btc-light-full.svg" width="360" alt="btc.tx.taxi banner logo">
  </picture>
</p>

<h1 align="center">Bitcoin Explorer · btc.tx.taxi</h1>

<p align="center">
  A public Bitcoin block explorer, mempool visualizer, and API.<br>
  <a href="https://btc.tx.taxi">Open btc.tx.taxi</a>
</p>

## Overview

[btc.tx.taxi](https://btc.tx.taxi) is an independently operated Bitcoin explorer in the [tx.taxi](https://tx.taxi) network. It presents public Bitcoin network data; it cannot access wallets, retrieve funds, reverse transactions, or change transaction priority.

## Features

- Search Bitcoin transactions, blocks, and addresses.
- Inspect the mempool, fee-rate estimates, and projected blocks.
- Browse block history, mining-pool data, and network charts.
- Use the public API described at [`/docs/api`](https://btc.tx.taxi/docs/api).

## Development

This repository contains separate frontend and backend applications. Use the Node version in [`.nvmrc`](.nvmrc). A working local explorer also needs configured Bitcoin Core, MariaDB, and—when address lookups are required—an Electrum or Esplora service.

Build the frontend:

```bash
cd frontend
npm ci
npm run build
```

For a local frontend development server, run `npm run start` in `frontend`. Its local proxy targets the backend at `http://localhost:8999`.

For backend configuration and startup, begin with [`backend/README.md`](backend/README.md) and [`backend/mempool-config.sample.json`](backend/mempool-config.sample.json). Docker and production reference material is available in [`docker/README.md`](docker/README.md) and [`production/README.md`](production/README.md).

## Attribution and license

btc.tx.taxi is based on [The Mempool Open Source Project](https://github.com/mempool/mempool). The inherited root README is retained in [`UPSTREAM_README.md`](UPSTREAM_README.md) for provenance.

The code is distributed under the terms in [LICENSE](LICENSE) and [COPYING.md](COPYING.md), including the GNU Affero General Public License v3 text and applicable trademark notices.

Original tx.taxi modifications and documentation are credited to tx.taxi contributors (2026). Upstream copyright and license notices are preserved in [`LICENSE`](LICENSE) and [`COPYING.md`](COPYING.md).

The software license does not grant trademark rights to the tx.taxi name or logos. Independent deployments should use their own branding and must not imply they are operated or endorsed by tx.taxi.

## Links

- [Live explorer](https://btc.tx.taxi)
- [tx.taxi hub](https://tx.taxi)
- [Telegram channel](https://t.me/txtaxi)
