const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function loadTs(filename, imports, globals = {}) {
  const source = fs.readFileSync(path.join(__dirname, '../src/app', filename), 'utf8');
  const code = ts.transpile(source, { module: ts.ModuleKind.CommonJS, experimentalDecorators: true });
  const module = { exports: {} };
  const sandbox = { module, exports: module.exports, require: id => imports[id] || {}, console, ...globals };
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
  assert.deepEqual(Array.from(selector.languages, lang => lang.code), ['en','es','fr','de']);
});

async function hubResolver(file, locales, pathname, cookie, failing = false) {
  const source = fs.readFileSync(path.join(__dirname, '../src', file), 'utf8');
  const start = source.indexOf('  // The hub must explicitly advertise a locale before links target it.');
  const end = source.indexOf('  const dashboardPath =', start);
  assert.ok(start >= 0 && end > start);
  const script = `(async () => { ${source.slice(start, end)} await hubLocaleLoad; return localizedHubPath(); })()`;
  return vm.runInNewContext(script, {
    hubOrigin:'https://tx.taxi', location:{pathname}, document:{cookie},
    AbortController, setTimeout:(fn, ms) => setTimeout(fn, failing ? 5 : ms), clearTimeout, Event,
    fetch:failing ? (url, options) => new Promise((resolve, reject) => options.signal.addEventListener('abort', () => reject(new Error('aborted')))) : async () => ({ok:true, json:async () => ({version:1,hosts:{'tx.taxi':locales}})}),
    window:{dispatchEvent() {}},
  });
}
for (const file of ['index.mempool.html', 'resources/branding/chain-transition.js']) {
  test(`${file}: logo targets the selected hub locale only when advertised`, async () => {
    assert.equal(await hubResolver(file, ['es','fr'], '/fr/block/42', ''), '/fr/');
    assert.equal(await hubResolver(file, ['es'], '/fr/block/42', 'txtaxi_language=es'), '/');
    assert.equal(await hubResolver(file, ['es','de'], '/block/42', 'txtaxi_language=de'), '/de/');
    assert.equal(await hubResolver(file, ['es','fr'], '/en/block/42', 'txtaxi_language=fr'), '/');
    assert.equal(await hubResolver(file, ['nl'], '/nl/', 'txtaxi_language=nl; txtaxi_currency=EUR'), '/nl/');
    assert.equal(await hubResolver(file, [], '/nl/', 'txtaxi_language=nl', true), '/');
    assert.equal(await hubResolver(file, ['cs','ja'], '/cs/block/42', 'txtaxi_language=ja'), '/cs/');
    assert.equal(await hubResolver(file, ['ja'], '/cs/block/42', 'txtaxi_language=ja'), '/');
    assert.equal(await hubResolver(file, ['es','fr','../../evil'], '/block/42', 'txtaxi_language=../../evil'), '/');
  });
}

test('Lightning wordmark waits for capabilities and preserves an explicit locale over an older preference', async () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/app/lightning-app/lightning-shell.component.ts'), 'utf8');
  const code = ts.transpile(source, { module:ts.ModuleKind.CommonJS, experimentalDecorators:true });
  const module = {exports:{}};
  let visited = '', release;
  const location = {pathname:'/fr/', assign:url => {visited = url;}};
  const imports = {
    '@angular/core': {...core, HostListener:() => () => {}},
    '@app/services/shared-preferences': {readSharedPreference:() => 'es'},
    '@app/services/localized-native-url': {localizedNativeUrl:(url, language) => `${url}#${language}`, refreshLocalizedCapabilities:() => new Promise(resolve => { release = resolve; })},
  };
  vm.runInNewContext(code, {module,exports:module.exports,require:id => imports[id] || {},location,document:{},window:{},console});
  const shell = Object.create(module.exports.LightningShellComponent.prototype);
  shell.router = {url:'/'};
  shell.state = {env:{TX_TAXI_ROUTER_URL:'https://tx.taxi'}};
  const event = {button:0, preventDefault(){}, stopImmediatePropagation(){}};
  const first = shell.brandClick(event);
  assert.equal(visited, '', 'navigation must wait for the capability check');
  release(); await first;
  assert.equal(visited, 'https://tx.taxi/#fr');
  shell.navigatingHub = false;
  location.pathname = '/cs/';
  const second = shell.brandClick(event);
  release(); await second;
  assert.equal(visited, 'https://tx.taxi/#cs');
});

for (const file of ['index.mempool.html', 'resources/branding/chain-transition.js']) {
  test(`${file}: Dutch logo click waits for the hub and keeps currency`, async () => {
    const sourceText = fs.readFileSync(path.join(__dirname, '../src', file), 'utf8');
    const resolver = sourceText.slice(sourceText.indexOf('  // The hub must explicitly advertise'), sourceText.indexOf('  const dashboardPath ='));
    const cookieCode = sourceText.slice(sourceText.indexOf('  function cookie(value)'), sourceText.indexOf('  function readHandoff()'));
    const clickStart = sourceText.indexOf('  // Keep the real link target');
    const handler = sourceText.slice(clickStart, sourceText.indexOf('  function requestHubSnapshot()', clickStart));
    const cookies = new Map([['txtaxi_language','nl'], ['txtaxi_currency','EUR']]);
    let click, release, visited = '';
    class Anchor { matches() { return true; } }
    const document = {
      documentElement:{lang:'nl'}, querySelectorAll:() => [],
      addEventListener:(name, fn) => { if (name === 'click') click = fn; },
      get cookie() { return [...cookies].map(([k,v]) => `${k}=${v}`).join('; '); },
      set cookie(value) { const [name,val] = value.split(';')[0].split('='); cookies.set(name,val); },
    };
    const sandbox = {document, hubOrigin:'https://tx.taxi', source:'btc', sourceName:'btc.tx.taxi',
      local:false, cookieName:'tx_taxi_handoff', location:{pathname:'/nl/',assign:url => {visited=url;}},
      AbortController, setTimeout, clearTimeout, Event, HTMLAnchorElement:Anchor,
      MutationObserver:class {observe() {}}, requestAnimationFrame(){}, addEventListener(){},
      window:{dispatchEvent() {}},
      fetch:() => new Promise(resolve => {release = () => resolve({ok:true,json:async () => ({version:1,hosts:{'tx.taxi':['nl']}})});}),
    };
    vm.runInNewContext(`${resolver} const dashboardPath=()=>'/nl/'; const isDashboard=()=>true; let leaving=false; ${cookieCode} ${handler}`, sandbox);
    const event={button:0,composedPath:()=>[new Anchor()],preventDefault(){},stopImmediatePropagation(){}};
    const navigating=click(event);
    assert.equal(visited, '', 'click must wait for the capability response');
    release(); await navigating;
    assert.equal(visited, 'https://tx.taxi/nl/');
    assert.equal(cookies.get('txtaxi_language'), 'nl');
    assert.equal(cookies.get('txtaxi_currency'), 'EUR');
  });
}

test('Lightning Bitcoin links preserve query and fragment and never rewrite foreign origins', async () => {
  const api = loadTs('services/localized-native-url.ts', {}, {
    URL, AbortController, setTimeout, clearTimeout, location:{hostname:'lightning.btc.tx.taxi'},
    fetch: async () => ({ok:true,text:async () => JSON.stringify({version:1,hosts:{'btc.tx.taxi':['nl']}})}),
  });
  await api.refreshLocalizedCapabilities('https://tx.taxi');
  assert.equal(api.localizedNativeUrl('https://btc.tx.taxi/tx/abc?view=details#fees', 'nl'), 'https://btc.tx.taxi/nl/tx/abc?view=details#fees');
  assert.equal(api.localizedNativeUrl('https://other.example/tx/abc?view=details#fees', 'nl'), 'https://other.example/tx/abc?view=details#fees');
  assert.equal(api.localizedNativeUrl('https://btc.tx.taxi/fr/tx/abc?view=details#fees', 'nl'), 'https://btc.tx.taxi/fr/tx/abc?view=details#fees');
});
