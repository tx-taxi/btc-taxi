const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function loadTs(filename, imports) {
  const source = fs.readFileSync(path.join(__dirname, '../src/app', filename), 'utf8');
  const code = ts.transpile(source, { module: ts.ModuleKind.CommonJS, experimentalDecorators: true });
  const module = { exports: {} };
  const sandbox = { module, exports: module.exports, require: id => imports[id] || {}, console };
  vm.runInNewContext(code, sandbox, { filename });
  return module.exports;
}
const core = { Injectable: () => () => {}, Component: () => () => {}, Inject: () => () => {}, ChangeDetectionStrategy: { OnPush: 0 } };
const languages = [{code:'en'}, {code:'es'}, {code:'fr'}, {code:'de'}];
const LanguageService = loadTs('services/language.service.ts', {
  '@angular/core': core,
  '@angular/common': { getLocaleId: locale => locale },
  '@app/app.constants': { languages },
  '@app/services/shared-preferences': { writeSharedPreference: (doc, key, value) => { doc.shared = [key, value]; } },
}).LanguageService;

test('language switching strips the actual locale path without stripping similar routes', () => {
  const document = { location: { pathname: '/fr/node/abc' } };
  const service = new LanguageService(document, 'fr');
  assert.equal(service.stripLanguageFromUrl(null), '/node/abc');
  assert.equal(service.stripLanguageFromUrl('/de/channel/42'), '/channel/42');
  assert.equal(service.stripLanguageFromUrl('/fr'), '/');
  assert.equal(service.stripLanguageFromUrl('/fresh'), '/fresh');
});

test('Lightning switches from a review locale to Spanish, preserving query and fragment', () => {
  const document = { location: { pathname:'/fr/channel/42', search:'?tab=info', hash:'#fees', href:'' } };
  const service = new LanguageService(document, 'fr');
  const Selector = loadTs('components/language-selector/language-selector.component.lightning.ts', {
    '@angular/core': core, '@angular/common': {}, '@app/app.constants': { languages },
  }).LanguageSelectorComponent;
  const selector = new Selector(document, {}, service);
  selector.languageForm = {get: () => ({value:'es'})};
  selector.changeLanguage();
  assert.equal(document.location.href, '/es/channel/42?tab=info#fees');
  assert.equal(document.shared[0], 'txtaxi_language');
  assert.equal(document.shared[1], 'es');
  assert.deepEqual(Array.from(selector.languages, lang => lang.code), ['en','es']);
});

async function hubResolver(file, locales, pathname, cookie) {
  const source = fs.readFileSync(path.join(__dirname, '../src', file), 'utf8');
  const start = source.indexOf('  // The hub must explicitly advertise a locale before links target it.');
  const end = source.indexOf('  const dashboardPath =', start);
  assert.ok(start >= 0 && end > start);
  const script = `(async () => { ${source.slice(start, end)} await new Promise(resolve => setTimeout(resolve, 0)); return localizedHubPath(); })()`;
  return vm.runInNewContext(script, {
    hubOrigin:'https://tx.taxi', location:{pathname}, document:{cookie},
    AbortController, setTimeout, clearTimeout, Event,
    fetch:async () => ({ok:true, json:async () => ({version:1,hosts:{'tx.taxi':locales}})}),
    window:{dispatchEvent() {}},
  });
}
for (const file of ['index.mempool.html', 'resources/branding/chain-transition.js']) {
  test(`${file}: logo targets the selected hub locale only when advertised`, async () => {
    assert.equal(await hubResolver(file, ['es','fr'], '/fr/block/42', ''), '/fr/');
    assert.equal(await hubResolver(file, ['es'], '/fr/block/42', 'txtaxi_language=es'), '/');
    assert.equal(await hubResolver(file, ['es','de'], '/block/42', 'txtaxi_language=de'), '/de/');
    assert.equal(await hubResolver(file, ['es','fr'], '/en/block/42', 'txtaxi_language=fr'), '/');
    assert.equal(await hubResolver(file, ['es','fr','../../evil'], '/block/42', 'txtaxi_language=../../evil'), '/');
  });
}

test('Lightning wordmark keeps an explicit French or German view over an older shared preference', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/app/lightning-app/lightning-shell.component.ts'), 'utf8');
  const code = ts.transpile(source, { module:ts.ModuleKind.CommonJS, experimentalDecorators:true });
  const module = {exports:{}};
  let visited = '';
  const location = {pathname:'/fr/', assign:url => {visited = url;}};
  const imports = {
    '@angular/core': {...core, HostListener:() => () => {}},
    '@app/services/shared-preferences': {readSharedPreference:() => 'es'},
    '@app/services/localized-native-url': {localizedNativeUrl:(url, language) => `${url}#${language}`},
  };
  vm.runInNewContext(code, {module,exports:module.exports,require:id => imports[id] || {},location,document:{},window:{},console});
  const shell = Object.create(module.exports.LightningShellComponent.prototype);
  shell.router = {url:'/'};
  shell.state = {env:{TX_TAXI_ROUTER_URL:'https://tx.taxi'}};
  const event = {button:0, preventDefault(){}, stopImmediatePropagation(){}};
  shell.brandClick(event);
  assert.equal(visited, 'https://tx.taxi/#fr');
  location.pathname = '/de/';
  shell.brandClick(event);
  assert.equal(visited, 'https://tx.taxi/#de');
});
