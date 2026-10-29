'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function loadService(relative, document) {
  const filename = path.join(__dirname, '..', 'src/app', relative);
  const source = fs.readFileSync(filename, 'utf8');
  const code = ts.transpile(source, { module: ts.ModuleKind.CommonJS, experimentalDecorators: true });
  const angular = {Injectable: () => () => {}, Inject: () => () => {}, LOCALE_ID: Symbol('locale')};
  const imports = {'@angular/core':angular, './native-seo-data':{nativeSeoPages:{}}, '@angular/platform-browser':{}, '@angular/router':{}, rxjs:{}, 'rxjs/operators':{}, '@app/services/state.service':{}};
  const sandbox = {exports:{}, require: name => imports[name] || {}, document, window:{}, URL};
  vm.runInNewContext(code, sandbox, {filename});
  return sandbox.exports.SeoService;
}
function fixture(lang) {
  const tags = new Map(), links = [];
  const document = {
    documentElement:{lang},
    querySelectorAll: selector => selector === 'link[rel=alternate][hreflang]' ? links.filter(link => link.hreflang) : [],
    createElement: () => ({remove() {const i = links.indexOf(this); if (i >= 0) links.splice(i, 1);}}),
    head:{appendChild: link => links.push(link)},
  };
  const metaService = {updateTag: tag => tags.set(tag.name || tag.property, tag.content), getTag: key => key === 'name=tx-taxi-es-available' ? {content:'true'} : undefined};
  const canonical = {setAttribute: (name, value) => {if(name === 'href') canonical.href = value;}};
  return {document, tags, links, metaService, canonical};
}

test('Bitcoin Spanish SPA navigation restores root canonical, indexing and alternates', () => {
  const f = fixture('es'), Seo = loadService('services/seo.service.ts', f.document);
  const context = {locale:'es', baseDomain:'btc.tx.taxi', canonicalLink:f.canonical, metaService:f.metaService, currentPage:() => undefined};
  Seo.prototype.updateCanonical.call(context, '/docs/faq');
  assert.equal(f.canonical.href, 'https://btc.tx.taxi/es/docs/faq');
  assert.equal(f.tags.get('robots'), 'noindex, follow');
  Seo.prototype.updateCanonical.call(context, '');
  assert.equal(f.canonical.href, 'https://btc.tx.taxi/es/');
  assert.equal(f.tags.get('robots'), 'index, follow, max-image-preview:large');
  assert.deepEqual(f.links.map(x => [x.hreflang, x.href]), [['en','https://btc.tx.taxi/'], ['es','https://btc.tx.taxi/es/'], ['x-default','https://btc.tx.taxi/']]);
});

test('Bitcoin French and German SPA routes remain self-canonical and noindex', () => {
  for (const lang of ['fr','de']) {
    const f = fixture(lang), Seo = loadService('services/seo.service.ts', f.document);
    const context = {locale:lang, baseDomain:'btc.tx.taxi', canonicalLink:f.canonical, metaService:f.metaService, currentPage:() => undefined};
    Seo.prototype.updateCanonical.call(context, '');
    assert.equal(f.canonical.href, `https://btc.tx.taxi/${lang}/`);
    assert.equal(f.tags.get('robots'), 'noindex, follow');
    assert.equal(f.links.length, 0);
    Seo.prototype.updateCanonical.call(context, '/docs/faq');
    assert.equal(f.canonical.href, `https://btc.tx.taxi/${lang}/docs/faq`);
    assert.equal(f.tags.get('robots'), 'noindex, follow');
  }
});

test('Lightning French and German navigation retains the locale canonical and noindex', () => {
  for (const lang of ['fr','de']) {
    const f = fixture(lang), Seo = loadService('lightning-app/seo.service.ts', f.document);
    const context = {baseDomain:'lightning.btc.tx.taxi', canonicalLink:f.canonical, metaService:f.metaService};
    Seo.prototype.updateCanonical.call(context, '');
    assert.equal(f.canonical.href, `https://lightning.btc.tx.taxi/${lang}/`);
    assert.equal(f.tags.get('robots'), 'noindex, follow');
    Seo.prototype.updateCanonical.call(context, '/docs/faq');
    assert.equal(f.canonical.href, `https://lightning.btc.tx.taxi/${lang}/docs/faq`);
  }
});
