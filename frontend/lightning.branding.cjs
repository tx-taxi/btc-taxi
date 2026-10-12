const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('../lightning/node_modules/sharp');

const resources = path.join(__dirname, 'src/resources');
const branding = path.join(resources, 'branding');
const icons = path.join(resources, 'lightning-purple-favicons');

// Retain the approved taxi paths, lettering and adaptive neutral body. Only
// this separate Lightning application's accent palette changes.
for (const name of ['dark-navbar', 'dark-full', 'favicon']) {
  const original = fs.readFileSync(path.join(branding, `btc-${name}.svg`), 'utf8');
  const recolored = original.replaceAll('btc.tx.taxi', 'lightning.btc.tx.taxi')
    .replaceAll('#f7931a', '#7B1AF7');
  fs.writeFileSync(path.join(branding, `lightning-${name}.svg`), recolored);
}

async function main() {
  fs.mkdirSync(icons, { recursive: true });
  // Raster icons use the same dark-neutral body as the rendered taxi header;
  // the SVG favicon remains adaptive for a light or dark browser tab.
  const adaptive = fs.readFileSync(path.join(branding, 'lightning-favicon.svg'), 'utf8');
  const version = crypto.createHash('sha256').update(adaptive).digest('hex').slice(0, 12);
  const raster = adaptive.replace(/<style>[\s\S]*?<\/style>/, '')
    .replace(/<g class="light">[\s\S]*?<\/g><g class="dark">/, '<g class="dark">');
  const sizes = [
    ['favicon-16x16.png', 16], ['favicon-32x32.png', 32],
    ['apple-touch-icon.png', 180], ['android-chrome-192x192.png', 192],
    ['android-chrome-512x512.png', 512], ['mstile-150x150.png', 150],
  ];
  const pngs = new Map();
  for (const [filename, size] of sizes) {
    const png = await sharp(Buffer.from(raster)).resize(size, size).png().toBuffer();
    fs.writeFileSync(path.join(icons, filename), png);
    pngs.set(size, png);
  }
  const header = Buffer.alloc(6 + 2 * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(2, 4);
  let offset = header.length;
  for (const [index, size] of [16, 32].entries()) {
    const start = 6 + index * 16;
    header[start] = size;
    header[start + 1] = size;
    header.writeUInt16LE(1, start + 4);
    header.writeUInt16LE(32, start + 6);
    header.writeUInt32LE(pngs.get(size).length, start + 8);
    header.writeUInt32LE(offset, start + 12);
    offset += pngs.get(size).length;
  }
  fs.writeFileSync(path.join(icons, 'favicon.ico'), Buffer.concat([header, pngs.get(16), pngs.get(32)]));
  const manifest = JSON.parse(fs.readFileSync(path.join(resources, 'lightning-favicons/site.webmanifest'), 'utf8'));
  manifest.theme_color = '#7B1AF7';
  for (const icon of manifest.icons) icon.src = icon.src.replace('/lightning-favicons/', '/lightning-purple-favicons/') + '?v=' + version;
  fs.writeFileSync(path.join(icons, 'site.webmanifest'), JSON.stringify(manifest, null, 2) + '\n');
  const xml = fs.readFileSync(path.join(resources, 'lightning-favicons/browserconfig.xml'), 'utf8')
    .replaceAll('/lightning-favicons/', '/lightning-purple-favicons/').replaceAll('#f7931a', '#7B1AF7')
    .replace(/(src="[^"]+)(")/g, '$1?v=' + version + '$2');
  fs.writeFileSync(path.join(icons, 'browserconfig.xml'), xml);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
