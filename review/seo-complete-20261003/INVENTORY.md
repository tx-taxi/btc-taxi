# Bitcoin native SEO/GEO candidate

Isolated candidate based on `193709e056425a00f9520880f9ffb8f2a0917739`. This supersedes the earlier deployed homepage-only sitemap; older evidence remains retained. No production state is inferred from local checks.

## Canonical pages

All27 finite URLs use https://btc.tx.taxi. Source route registration: `frontend/src/app/master-page.module.ts`, `graphs/graphs.routing.module.ts`, `app-routing.module.ts`, and documentation routing. StateService defaults and production sample both disable alternative networks, Lightning, audit, Stratum and official upstream-only services. Documentation preserves25 enabled FAQ answers,58 REST entries and10 WebSocket entries from the actual data module; auditOnly/officialOnly/electrsOnly entries are omitted for this deployment.

| Path | Source | Doc entries |
| --- | --- | --- |
| / | frontend/src/app/services/seo.service.ts | 0 |
| /about | components/about/about.component.html | 0 |
| /privacy-policy | components/privacy-policy/privacy-policy.component.html | 0 |
| /terms-of-service | components/terms-of-service/terms-of-service.component.html | 0 |
| /trademark-policy | components/trademark-policy/trademark-policy.component.html | 0 |
| /docs/faq | docs/faq | 25 |
| /docs/api/rest | docs/rest | 58 |
| /docs/api/websocket | docs/websocket | 10 |
| /blocks/1 | components/blocks-list/blocks-list.component.html | 0 |
| /txs | components/recent-transactions-list/recent-transactions-list.component.html | 0 |
| /rbf | components/rbf-list/rbf-list.component.html | 0 |
| /mining | components/mining-dashboard/mining-dashboard.component.html | 0 |
| /tools/calculator | components/calculator/calculator.component.html | 0 |
| /tx/push | components/push-transaction/push-transaction.component.html | 0 |
| /tx/test | components/test-transactions/test-transactions.component.html | 0 |
| /graphs/mempool | components/statistics/statistics.component.html | 0 |
| /graphs/mining/hashrate-difficulty | components/hashrate-chart/hashrate-chart.component.html | 0 |
| /graphs/mining/pools-dominance | components/hashrates-chart-pools/hashrate-chart-pools.component.html | 0 |
| /graphs/mining/pools | components/pool-ranking/pool-ranking.component.html | 0 |
| /graphs/mining/block-fees | components/block-fees-graph/block-fees-graph.component.html | 0 |
| /graphs/mining/block-fees-subsidy | components/block-fees-subsidy-graph/block-fees-subsidy-graph.component.html | 0 |
| /graphs/mining/block-rewards | components/block-rewards-graph/block-rewards-graph.component.html | 0 |
| /graphs/mining/block-fee-rates | components/block-fee-rates-graph/block-fee-rates-graph.component.html | 0 |
| /graphs/mining/block-sizes-weights | components/block-sizes-weights-graph/block-sizes-weights-graph.component.html | 0 |
| /graphs/price | components/price-chart/price-chart.component.html | 0 |
| /mempool-block/0 | components/mempool-block/mempool-block.component.html | 0 |
| /status | components/status-view/status-view.component.html | 0 |

The build creates semantic HTML and Markdown from the actual source documents. Dynamic tools/charts/lists have their real headings, descriptions and labels; live values remain the existing Angular component's responsibility. No invented network observation is inserted. Original about/docs SCSS is scoped to initial app-root content with readability overrides; Angular replaces that root on bootstrap. There is no user-agent-specific response.

## Aliases and other route families

`/docs` ->FAQ, `/docs/api` and `/api` ->REST, `/graphs` ->mempool, `/blocks` and `/mining/blocks` ->blocks/1, `/pushtx` ->tx/push, `/tx` ->root, `/llm.txt` ->llms.txt and `/en-US/...` ->root-language canonical. Known trailing-slash variants redirect308.

Numbered block lists, projected mempool indices0–7 and mining pool slugs preserve direct links with own canonical HTML/Markdown; arbitrary values are not enumerated in static XML. Existing valid tx/block/address IDs keep the provider-backed entity metadata handler. Private wallet input and presentation/widget/preview/clock/view routes remain functional200/noindex. Disabled audit-only stale/block-health pages retain the Angular route with noindex and are omitted XML. Unknown routes404/noindex. Existing API proxies and physical asset resolution remain intact; API responses carry noindex/follow. No provider logic was changed.

## Metadata and GEO

Every finite page has one identified canonical link, unique title/description, matching OG/Twitter and source-appropriate JSON-LD. Client methods use generated metadata from the same registry, stable brand defaults, own-host canonical and clear stale initial schema/Markdown alternates when navigating. Paginated block lists have their own metadata. All server/client social metadata uses the previously approved real full-page Bitcoin transaction JPG (`btc-transaction-eb316e19774e.jpg`,1440×1960), with original honest alt text and provenance. The same product-reference image is used for info pages; it is not described as a page-specific capture. Existing generated image endpoints are preserved, unused by metadata.

`/llms.txt` lists real docs/tools/content and network-data limits. `/llms-full.txt` concatenates the same Markdown. Each finite HTML page links its Markdown alternate and LLM index. `/index.md` and `[route].md` carry canonical HTML Link and noindex/follow. LLM full text is also noindex/follow. Sitemaps list only canonical HTML; no fabricated freshness dates or entity IDs.

The Automatic Routing menu subtext is now “Or go straight to tx.taxi/[your search]”, with inherited subdued color and scoped wrapping/monospace code.

## Observed local verification

The real Node request callback was invoked against the actual localized Angular production index without binding a listener. All27 canonical pages passed200, single own canonical, nonempty app-root, unique titles, JSON-LD parsing, real-image metadata, Markdown representation, HEAD and alias behavior. Supported parameterized/presentation routes, unknown404 and POST405 passed; no provider calls occurred for these checks. Evidence: `crawl-contract.json` and its actual callback harness.

Actual localized Angular production compilation passed using the locked Sass API directly for theme generation; existing npm build's nested npx subprocess is unavailable in the sandbox. Source themes/config, Angular compiler, resource sync and asynchronous native styles were run. Standalone TypeScript and changed-file ESLint passed with inherited warning-level style diagnostics. Docker uses the normal production build with the source-content generator and manifests copied into resources/seo. Full Docker and live crawl verification remain with parent-owned deployment.

## Observed production alias gap and follow-up

The initial rollout was observed live with27 valid sitemap pages, but `/index.html` exposed the inherited nginx welcome page200, and the registered old `/api/faq`, `/api/api/rest`, `/api/api/websocket` documentation aliases returned API404. Raw observations are preserved in the Explorer Kit live BTC capture. Explicit nginx redirects now route these aliases to the real canonical pages before physical-file/API resolution. The source helper records the same aliases. These are observed gaps, not newly invented API products; existing operational API URLs remain proxied normally. The follow-up awaits new deployment verification.
