'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const parse5 = require('parse5');
const { createSpanishPages } = require('./spanish-pages.cjs');

test('Spanish server pages include a localized sharing card without changing indexing', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'btc-spanish-seo-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'es'));
  fs.writeFileSync(path.join(dir, 'es', 'index.html'), '<!doctype html><html lang="es"><head><title>Shell</title></head><body><app-root></app-root></body></html>');
  const image = { url: 'https://tx.taxi/assets/bitcoin.jpg', width: 1440, height: 1960 };
  const renderer = createSpanishPages(path.join(dir, 'en-US', 'index.html'), [{ route: '/docs/faq' }], {}, image);
  const render = route => {
    const response = { writeHead(status, headers) { this.status = status; this.headers = headers; }, end(body) { this.body = body; } };
    renderer.write({ method: 'GET' }, response, 200, route);
    const document = parse5.parse(response.body);
    const html = document.childNodes.find(node => node.tagName === 'html');
    const head = html.childNodes.find(node => node.tagName === 'head');
    const nodes = head.childNodes.filter(node => node.tagName === 'meta' || node.tagName === 'link');
    const attrs = node => Object.fromEntries(node.attrs.map(a => [a.name, a.value]));
    return { response, html, tags: nodes.map(attrs) };
  };
  const root = render('/');
  const meta = (page, key) => page.tags.find(tag => tag.name === key || tag.property === key)?.content;
  assert.equal(root.html.attrs.find(a => a.name === 'lang').value, 'es');
  assert.equal(root.response.headers['Content-Language'], 'es');
  assert.equal(meta(root, 'robots'), 'index, follow, max-image-preview:large');
  assert.equal(root.tags.find(tag => tag.rel === 'canonical').href, 'https://btc.tx.taxi/es/');
  assert.deepEqual(root.tags.filter(tag => tag.hreflang).map(tag => [tag.hreflang, tag.href]), [
    ['en', 'https://btc.tx.taxi/'], ['es', 'https://btc.tx.taxi/es/'], ['x-default', 'https://btc.tx.taxi/'],
  ]);
  assert.equal(meta(root, 'og:image'), image.url);
  assert.equal(meta(root, 'twitter:image'), image.url);
  assert.equal(meta(root, 'twitter:card'), 'summary_large_image');
  assert.match(meta(root, 'og:image:alt'), /^Una página de transacción de Bitcoin/);
  assert.equal(meta(root, 'twitter:image:alt'), meta(root, 'og:image:alt'));
  const deep = render('/docs/faq');
  assert.equal(deep.response.headers['X-Robots-Tag'], 'noindex, follow');
  assert.equal(meta(deep, 'robots'), 'noindex, follow');
  assert.equal(deep.tags.find(tag => tag.rel === 'canonical').href, 'https://btc.tx.taxi/es/docs/faq');
  assert.equal(deep.tags.filter(tag => tag.hreflang).length, 0);
});
