const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const root = __dirname;
const original = fs.readFileSync(path.join(root, 'src/resources/mempool-original.css'),'utf8') + '\n:root { --link-color: var(--info); --link-hover-color: #00a6bf; --nav-bg: var(--bg); --navbar-bg: var(--bg); --tooltip-bg: #1b2031; }\n';
fs.writeFileSync(path.join(root,'src/resources/lightning-original.css'),original);
const hash = crypto.createHash('sha256').update(original).digest('hex').slice(0, 12);
const faviconHash = crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'src/resources/branding/btc-favicon.svg'))).digest('hex').slice(0,12);
const navigationHash = crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'src/resources/lightning-navigation.js'))).digest('hex').slice(0,16);
let socialImage = { url:'https://lightning.btc.tx.taxi/og/lightning.png', type:'image/png', width:1200, height:630, alt:'Lightning Network explorer on tx.taxi.' };
for (const filename of [path.join(root,'../lightning/social-image.json'),path.join(root,'src/resources/lightning-social-image.json')]) {
  if (fs.existsSync(filename)) { socialImage = JSON.parse(fs.readFileSync(filename,'utf8')); break; }
}
let pageMetadata = {};
for (const filename of [path.join(root,'../lightning/page-metadata.json'),path.join(root,'src/resources/lightning-page-metadata.json')]) {
  if (fs.existsSync(filename)) { pageMetadata = JSON.parse(fs.readFileSync(filename,'utf8')); break; }
}
const attribute = value => String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const socialImageMeta = [
  ['property','og:image',socialImage.url], ['property','og:image:type',socialImage.type],
  ['property','og:image:width',socialImage.width], ['property','og:image:height',socialImage.height],
  ['property','og:image:alt',socialImage.alt], ['name','twitter:image',socialImage.url],
  ['name','twitter:image:alt',socialImage.alt],
].map(([kind,name,value])=>'<meta '+kind+'="'+name+'" content="'+attribute(value)+'">').join('');
let commitHash = process.env.GIT_COMMIT_HASH || 'local-review';
if (!process.env.GIT_COMMIT_HASH) {
  try { commitHash = execFileSync('git', ['rev-parse', '--short', 'HEAD'], {cwd:root,stdio:['ignore','pipe','ignore']}).toString().trim(); } catch {}
}
const config = { LIGHTNING: true, LIGHTNING_EXPLORER: true, MINING_DASHBOARD: false, MAINNET_ENABLED: true, TESTNET_ENABLED: false, TESTNET4_ENABLED: false, SIGNET_ENABLED: false, LIQUID_ENABLED: false, LIQUID_TESTNET_ENABLED: false, ACCELERATOR: false, ACCELERATOR_BUTTON: false, PUBLIC_ACCELERATIONS: false, SERVICES_API: '', BASE_MODULE: 'mempool', ROOT_NETWORK: '', TX_TAXI_ROUTER_URL: process.env.TX_TAXI_ROUTER_URL || 'https://tx.taxi', LIGHTNING_REVIEW_ORIGIN: process.env.LIGHTNING_REVIEW_ORIGIN || '', ORIGINAL_THEME_FILE: '/resources/lightning-original.css?v=' + hash, GIT_COMMIT_HASH: commitHash, PACKAGE_JSON_VERSION: '3.4-dev' };
config.LIGHTNING_SOCIAL_IMAGE = socialImage;
config.LIGHTNING_PAGE_METADATA = pageMetadata;
const script = 'window.__env=Object.assign(window.__env||{},' + JSON.stringify(config) + ');';
fs.writeFileSync(path.join(root,'src/resources/lightning-config.js'), script);
const template = fs.readFileSync(path.join(root,'src/index.lightning.template.html'),'utf8');
fs.writeFileSync(path.join(root,'src/index.lightning.html'), template.replace('<!--LIGHTNING_CONFIG-->', '<script>' + script + '</script>').replaceAll('<!--BTC_FAVICON_VERSION-->',faviconHash).replaceAll('<!--LIGHTNING_NAVIGATION_VERSION-->',navigationHash).replace('<!--LIGHTNING_SOCIAL_IMAGE_META-->',socialImageMeta));
