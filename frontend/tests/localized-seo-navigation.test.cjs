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

test('Arabic Bitcoin and Lightning navigation keeps localized titles and noindex canonicals', () => {
  const btc = fixture('ar'), BitcoinSeo = loadService('services/seo.service.ts', btc.document);
  const titles = [];
  const context = {locale:'ar', baseDomain:'btc.tx.taxi', canonicalLink:btc.canonical, metaService:btc.metaService,
    router:{url:'/docs/faq'}, titleService:{setTitle: title => titles.push(title)},
    currentPage: () => BitcoinSeo.prototype.currentPage.call(context), getTitle: () => BitcoinSeo.prototype.getTitle.call(context)};
  BitcoinSeo.prototype.updateCanonical.call(context, '/docs/faq?source=nav#fees');
  assert.equal(btc.canonical.href, 'https://btc.tx.taxi/ar/docs/faq');
  assert.equal(btc.tags.get('robots'), 'noindex, follow');
  assert.equal(btc.links.length, 0);
  BitcoinSeo.prototype.setTitle.call(context, 'الأسئلة الشائعة');
  assert.equal(titles.at(-1), 'الأسئلة الشائعة - مستكشف Bitcoin | btc.tx.taxi');
  assert.equal(btc.tags.get('og:title'), titles.at(-1));
  assert.match(BitcoinSeo.prototype.getDescription.call(context), /^استكشف/);
  BitcoinSeo.prototype.updateCanonical.call(context, '');
  assert.equal(btc.canonical.href, 'https://btc.tx.taxi/ar/');

  const ln = fixture('ar'), LightningSeo = loadService('lightning-app/seo.service.ts', ln.document);
  const lightningTitles = [];
  const lightning = {baseDomain:'lightning.btc.tx.taxi', canonicalLink:ln.canonical, metaService:ln.metaService,
    titleService:{setTitle: title => lightningTitles.push(title)}, getTitle: () => LightningSeo.prototype.getTitle.call(lightning)};
  LightningSeo.prototype.updateCanonical.call(lightning, '/docs/faq?source=nav#fees');
  assert.equal(ln.canonical.href, 'https://lightning.btc.tx.taxi/ar/docs/faq');
  assert.equal(ln.tags.get('robots'), 'noindex, follow');
  LightningSeo.prototype.setTitle.call(lightning, 'الأسئلة الشائعة');
  assert.equal(lightningTitles.at(-1), 'الأسئلة الشائعة · مستكشف Lightning | lightning.btc.tx.taxi');
  assert.equal(ln.tags.get('og:title'), lightningTitles.at(-1));
  assert.match(LightningSeo.prototype.getDescription.call(lightning), /^استكشف/);
  LightningSeo.prototype.updateCanonical.call(lightning, '');
  assert.equal(ln.canonical.href, 'https://lightning.btc.tx.taxi/ar/');
});

test('Finnish Bitcoin and Lightning navigation keeps localized titles and noindex canonicals', () => {
  const btc = fixture('fi'), BitcoinSeo = loadService('services/seo.service.ts', btc.document);
  const titles = [];
  const context = {locale:'fi', baseDomain:'btc.tx.taxi', canonicalLink:btc.canonical, metaService:btc.metaService,
    router:{url:'/docs/faq'}, titleService:{setTitle: title => titles.push(title)},
    currentPage: () => BitcoinSeo.prototype.currentPage.call(context), getTitle: () => BitcoinSeo.prototype.getTitle.call(context)};
  BitcoinSeo.prototype.updateCanonical.call(context, '/docs/faq?source=nav#fees');
  assert.equal(btc.canonical.href, 'https://btc.tx.taxi/fi/docs/faq');
  assert.equal(btc.tags.get('robots'), 'noindex, follow');
  assert.equal(btc.links.length, 0);
  BitcoinSeo.prototype.setTitle.call(context, 'UKK');
  assert.equal(titles.at(-1), 'UKK - Bitcoin-lohkoselain | btc.tx.taxi');
  assert.equal(btc.tags.get('og:title'), titles.at(-1));
  assert.match(BitcoinSeo.prototype.getDescription.call(context), /^Tutustu/);
  BitcoinSeo.prototype.updateCanonical.call(context, '');
  assert.equal(btc.canonical.href, 'https://btc.tx.taxi/fi/');

  const ln = fixture('fi'), LightningSeo = loadService('lightning-app/seo.service.ts', ln.document);
  const lightningTitles = [];
  const lightning = {baseDomain:'lightning.btc.tx.taxi', canonicalLink:ln.canonical, metaService:ln.metaService,
    titleService:{setTitle: title => lightningTitles.push(title)}, getTitle: () => LightningSeo.prototype.getTitle.call(lightning)};
  LightningSeo.prototype.updateCanonical.call(lightning, '/docs/faq?source=nav#fees');
  assert.equal(ln.canonical.href, 'https://lightning.btc.tx.taxi/fi/docs/faq');
  assert.equal(ln.tags.get('robots'), 'noindex, follow');
  LightningSeo.prototype.setTitle.call(lightning, 'UKK');
  assert.equal(lightningTitles.at(-1), 'UKK · Lightning-selain | lightning.btc.tx.taxi');
  assert.equal(ln.tags.get('og:title'), lightningTitles.at(-1));
  assert.match(LightningSeo.prototype.getDescription.call(lightning), /^Tutustu/);
  LightningSeo.prototype.updateCanonical.call(lightning, '');
  assert.equal(ln.canonical.href, 'https://lightning.btc.tx.taxi/fi/');
});

test('Persian Bitcoin and Lightning navigation keeps localized titles and noindex canonicals', () => {
  const btc = fixture('fa'), BitcoinSeo = loadService('services/seo.service.ts', btc.document);
  const titles = [];
  const context = {locale:'fa', baseDomain:'btc.tx.taxi', canonicalLink:btc.canonical, metaService:btc.metaService,
    router:{url:'/docs/faq'}, titleService:{setTitle: title => titles.push(title)},
    currentPage: () => BitcoinSeo.prototype.currentPage.call(context), getTitle: () => BitcoinSeo.prototype.getTitle.call(context)};
  BitcoinSeo.prototype.updateCanonical.call(context, '/docs/faq?source=nav#fees');
  assert.equal(btc.canonical.href, 'https://btc.tx.taxi/fa/docs/faq');
  assert.equal(btc.tags.get('robots'), 'noindex, follow');
  assert.equal(btc.links.length, 0);
  BitcoinSeo.prototype.setTitle.call(context, 'پرسش‌های متداول');
  assert.equal(titles.at(-1), 'پرسش‌های متداول - کاوشگر بیت‌کوین | btc.tx.taxi');
  assert.equal(btc.tags.get('og:title'), titles.at(-1));
  assert.match(BitcoinSeo.prototype.getDescription.call(context), /^بلوک‌ها/);
  BitcoinSeo.prototype.updateCanonical.call(context, '');
  assert.equal(btc.canonical.href, 'https://btc.tx.taxi/fa/');

  const ln = fixture('fa'), LightningSeo = loadService('lightning-app/seo.service.ts', ln.document);
  const lightningTitles = [];
  const lightning = {baseDomain:'lightning.btc.tx.taxi', canonicalLink:ln.canonical, metaService:ln.metaService,
    titleService:{setTitle: title => lightningTitles.push(title)}, getTitle: () => LightningSeo.prototype.getTitle.call(lightning)};
  LightningSeo.prototype.updateCanonical.call(lightning, '/docs/faq?source=nav#fees');
  assert.equal(ln.canonical.href, 'https://lightning.btc.tx.taxi/fa/docs/faq');
  assert.equal(ln.tags.get('robots'), 'noindex, follow');
  LightningSeo.prototype.setTitle.call(lightning, 'پرسش‌های متداول');
  assert.equal(lightningTitles.at(-1), 'پرسش‌های متداول · کاوشگر لایتنینگ | lightning.btc.tx.taxi');
  assert.equal(ln.tags.get('og:title'), lightningTitles.at(-1));
  assert.match(LightningSeo.prototype.getDescription.call(lightning), /^گره‌ها/);
  LightningSeo.prototype.updateCanonical.call(lightning, '');
  assert.equal(ln.canonical.href, 'https://lightning.btc.tx.taxi/fa/');
});

test('Catalan Bitcoin and Lightning navigation keeps localized titles and noindex canonicals', () => {
  const btc = fixture('ca'), BitcoinSeo = loadService('services/seo.service.ts', btc.document);
  const titles = [];
  const context = {locale:'ca', baseDomain:'btc.tx.taxi', canonicalLink:btc.canonical, metaService:btc.metaService,
    router:{url:'/docs/faq'}, titleService:{setTitle: title => titles.push(title)},
    currentPage: () => BitcoinSeo.prototype.currentPage.call(context), getTitle: () => BitcoinSeo.prototype.getTitle.call(context)};
  BitcoinSeo.prototype.updateCanonical.call(context, '/docs/faq?source=nav#fees');
  assert.equal(btc.canonical.href, 'https://btc.tx.taxi/ca/docs/faq');
  assert.equal(btc.tags.get('robots'), 'noindex, follow');
  assert.equal(btc.links.length, 0);
  BitcoinSeo.prototype.setTitle.call(context, 'Preguntes freqüents');
  assert.equal(titles.at(-1), 'Preguntes freqüents - Explorador de Bitcoin | btc.tx.taxi');
  assert.equal(btc.tags.get('og:title'), titles.at(-1));
  assert.match(BitcoinSeo.prototype.getDescription.call(context), /^Explora/);
  BitcoinSeo.prototype.updateCanonical.call(context, '');
  assert.equal(btc.canonical.href, 'https://btc.tx.taxi/ca/');

  const ln = fixture('ca'), LightningSeo = loadService('lightning-app/seo.service.ts', ln.document);
  const lightningTitles = [];
  const lightning = {baseDomain:'lightning.btc.tx.taxi', canonicalLink:ln.canonical, metaService:ln.metaService,
    titleService:{setTitle: title => lightningTitles.push(title)}, getTitle: () => LightningSeo.prototype.getTitle.call(lightning)};
  LightningSeo.prototype.updateCanonical.call(lightning, '/docs/faq?source=nav#fees');
  assert.equal(ln.canonical.href, 'https://lightning.btc.tx.taxi/ca/docs/faq');
  assert.equal(ln.tags.get('robots'), 'noindex, follow');
  LightningSeo.prototype.setTitle.call(lightning, 'Preguntes freqüents');
  assert.equal(lightningTitles.at(-1), 'Preguntes freqüents · Explorador de Lightning | lightning.btc.tx.taxi');
  assert.equal(ln.tags.get('og:title'), lightningTitles.at(-1));
  assert.match(LightningSeo.prototype.getDescription.call(lightning), /^Explora/);
  LightningSeo.prototype.updateCanonical.call(lightning, '');
  assert.equal(ln.canonical.href, 'https://lightning.btc.tx.taxi/ca/');
});

test('Croatian Bitcoin and Lightning navigation keeps localized titles and noindex canonicals', () => {
  const btc = fixture('hr'), BitcoinSeo = loadService('services/seo.service.ts', btc.document);
  const titles = [];
  const context = {locale:'hr', baseDomain:'btc.tx.taxi', canonicalLink:btc.canonical, metaService:btc.metaService,
    router:{url:'/docs/faq'}, titleService:{setTitle: title => titles.push(title)},
    currentPage: () => BitcoinSeo.prototype.currentPage.call(context), getTitle: () => BitcoinSeo.prototype.getTitle.call(context)};
  BitcoinSeo.prototype.updateCanonical.call(context, '/docs/faq?source=nav#fees');
  assert.equal(btc.canonical.href, 'https://btc.tx.taxi/hr/docs/faq');
  assert.equal(btc.tags.get('robots'), 'noindex, follow');
  assert.equal(btc.links.length, 0);
  BitcoinSeo.prototype.setTitle.call(context, 'Česta pitanja');
  assert.equal(titles.at(-1), 'Česta pitanja - Bitcoin preglednik | btc.tx.taxi');
  assert.equal(btc.tags.get('og:title'), titles.at(-1));
  assert.match(BitcoinSeo.prototype.getDescription.call(context), /^Istražite/);
  BitcoinSeo.prototype.updateCanonical.call(context, '');
  assert.equal(btc.canonical.href, 'https://btc.tx.taxi/hr/');

  const ln = fixture('hr'), LightningSeo = loadService('lightning-app/seo.service.ts', ln.document);
  const lightningTitles = [];
  const lightning = {baseDomain:'lightning.btc.tx.taxi', canonicalLink:ln.canonical, metaService:ln.metaService,
    titleService:{setTitle: title => lightningTitles.push(title)}, getTitle: () => LightningSeo.prototype.getTitle.call(lightning)};
  LightningSeo.prototype.updateCanonical.call(lightning, '/docs/faq?source=nav#fees');
  assert.equal(ln.canonical.href, 'https://lightning.btc.tx.taxi/hr/docs/faq');
  assert.equal(ln.tags.get('robots'), 'noindex, follow');
  LightningSeo.prototype.setTitle.call(lightning, 'Česta pitanja');
  assert.equal(lightningTitles.at(-1), 'Česta pitanja · Lightning preglednik | lightning.btc.tx.taxi');
  assert.equal(ln.tags.get('og:title'), lightningTitles.at(-1));
  assert.match(LightningSeo.prototype.getDescription.call(lightning), /^Istražite/);
  LightningSeo.prototype.updateCanonical.call(lightning, '');
  assert.equal(ln.canonical.href, 'https://lightning.btc.tx.taxi/hr/');
});

test('Lithuanian Bitcoin and Lightning navigation keeps localized titles and noindex canonicals', () => {
  const btc = fixture('lt'), BitcoinSeo = loadService('services/seo.service.ts', btc.document);
  const titles = [];
  const context = {locale:'lt', baseDomain:'btc.tx.taxi', canonicalLink:btc.canonical, metaService:btc.metaService,
    router:{url:'/docs/faq'}, titleService:{setTitle: title => titles.push(title)},
    currentPage: () => BitcoinSeo.prototype.currentPage.call(context), getTitle: () => BitcoinSeo.prototype.getTitle.call(context)};
  BitcoinSeo.prototype.updateCanonical.call(context, '/docs/faq?source=nav#fees');
  assert.equal(btc.canonical.href, 'https://btc.tx.taxi/lt/docs/faq');
  assert.equal(btc.tags.get('robots'), 'noindex, follow');
  assert.equal(btc.links.length, 0);
  BitcoinSeo.prototype.setTitle.call(context, 'Dažniausi klausimai');
  assert.equal(titles.at(-1), 'Dažniausi klausimai - Bitcoin naršyklė | btc.tx.taxi');
  assert.equal(btc.tags.get('og:title'), titles.at(-1));
  assert.match(BitcoinSeo.prototype.getDescription.call(context), /^Naršykite/);
  BitcoinSeo.prototype.updateCanonical.call(context, '');
  assert.equal(btc.canonical.href, 'https://btc.tx.taxi/lt/');

  const ln = fixture('lt'), LightningSeo = loadService('lightning-app/seo.service.ts', ln.document);
  const lightningTitles = [];
  const lightning = {baseDomain:'lightning.btc.tx.taxi', canonicalLink:ln.canonical, metaService:ln.metaService,
    titleService:{setTitle: title => lightningTitles.push(title)}, getTitle: () => LightningSeo.prototype.getTitle.call(lightning)};
  LightningSeo.prototype.updateCanonical.call(lightning, '/docs/faq?source=nav#fees');
  assert.equal(ln.canonical.href, 'https://lightning.btc.tx.taxi/lt/docs/faq');
  assert.equal(ln.tags.get('robots'), 'noindex, follow');
  LightningSeo.prototype.setTitle.call(lightning, 'Dažniausi klausimai');
  assert.equal(lightningTitles.at(-1), 'Dažniausi klausimai · Lightning naršyklė | lightning.btc.tx.taxi');
  assert.equal(ln.tags.get('og:title'), lightningTitles.at(-1));
  assert.match(LightningSeo.prototype.getDescription.call(lightning), /^Naršykite/);
  LightningSeo.prototype.updateCanonical.call(lightning, '');
  assert.equal(ln.canonical.href, 'https://lightning.btc.tx.taxi/lt/');
});

test('Slovenian Bitcoin and Lightning navigation keeps localized titles and noindex canonicals', () => {
  const btc = fixture('sl'), BitcoinSeo = loadService('services/seo.service.ts', btc.document);
  const titles = [];
  const context = {locale:'sl', baseDomain:'btc.tx.taxi', canonicalLink:btc.canonical, metaService:btc.metaService,
    router:{url:'/docs/faq'}, titleService:{setTitle: title => titles.push(title)},
    currentPage: () => BitcoinSeo.prototype.currentPage.call(context), getTitle: () => BitcoinSeo.prototype.getTitle.call(context)};
  BitcoinSeo.prototype.updateCanonical.call(context, '/docs/faq?source=nav#fees');
  assert.equal(btc.canonical.href, 'https://btc.tx.taxi/sl/docs/faq');
  assert.equal(btc.tags.get('robots'), 'noindex, follow');
  assert.equal(btc.links.length, 0);
  BitcoinSeo.prototype.setTitle.call(context, 'Pogosta vprašanja');
  assert.equal(titles.at(-1), 'Pogosta vprašanja - Raziskovalec Bitcoin | btc.tx.taxi');
  assert.equal(btc.tags.get('og:title'), titles.at(-1));
  assert.match(BitcoinSeo.prototype.getDescription.call(context), /^Raziščite/);
  BitcoinSeo.prototype.updateCanonical.call(context, '');
  assert.equal(btc.canonical.href, 'https://btc.tx.taxi/sl/');

  const ln = fixture('sl'), LightningSeo = loadService('lightning-app/seo.service.ts', ln.document);
  const lightningTitles = [];
  const lightning = {baseDomain:'lightning.btc.tx.taxi', canonicalLink:ln.canonical, metaService:ln.metaService,
    titleService:{setTitle: title => lightningTitles.push(title)}, getTitle: () => LightningSeo.prototype.getTitle.call(lightning)};
  LightningSeo.prototype.updateCanonical.call(lightning, '/docs/faq?source=nav#fees');
  assert.equal(ln.canonical.href, 'https://lightning.btc.tx.taxi/sl/docs/faq');
  assert.equal(ln.tags.get('robots'), 'noindex, follow');
  LightningSeo.prototype.setTitle.call(lightning, 'Pogosta vprašanja');
  assert.equal(lightningTitles.at(-1), 'Pogosta vprašanja · Raziskovalec Lightning | lightning.btc.tx.taxi');
  assert.equal(ln.tags.get('og:title'), lightningTitles.at(-1));
  assert.match(LightningSeo.prototype.getDescription.call(lightning), /^Raziščite/);
  LightningSeo.prototype.updateCanonical.call(lightning, '');
  assert.equal(ln.canonical.href, 'https://lightning.btc.tx.taxi/sl/');
});


test('Hebrew Bitcoin and Lightning navigation keeps localized titles and noindex canonicals', () => {
  const btc = fixture('he'), BitcoinSeo = loadService('services/seo.service.ts', btc.document);
  const titles = [];
  const context = {locale:'he', baseDomain:'btc.tx.taxi', canonicalLink:btc.canonical, metaService:btc.metaService,
    router:{url:'/docs/faq'}, titleService:{setTitle: title => titles.push(title)},
    currentPage: () => BitcoinSeo.prototype.currentPage.call(context), getTitle: () => BitcoinSeo.prototype.getTitle.call(context)};
  BitcoinSeo.prototype.updateCanonical.call(context, '/docs/faq?source=nav#fees');
  assert.equal(btc.canonical.href, 'https://btc.tx.taxi/he/docs/faq');
  assert.equal(btc.tags.get('robots'), 'noindex, follow');
  assert.equal(btc.links.length, 0);
  BitcoinSeo.prototype.setTitle.call(context, 'שאלות נפוצות');
  assert.equal(titles.at(-1), 'שאלות נפוצות - סייר Bitcoin | btc.tx.taxi');
  assert.equal(btc.tags.get('og:title'), titles.at(-1));
  assert.match(BitcoinSeo.prototype.getDescription.call(context), /^גלו/);
  BitcoinSeo.prototype.updateCanonical.call(context, '');
  assert.equal(btc.canonical.href, 'https://btc.tx.taxi/he/');

  const ln = fixture('he'), LightningSeo = loadService('lightning-app/seo.service.ts', ln.document);
  const lightningTitles = [];
  const lightning = {baseDomain:'lightning.btc.tx.taxi', canonicalLink:ln.canonical, metaService:ln.metaService,
    titleService:{setTitle: title => lightningTitles.push(title)}, getTitle: () => LightningSeo.prototype.getTitle.call(lightning)};
  LightningSeo.prototype.updateCanonical.call(lightning, '/docs/faq?source=nav#fees');
  assert.equal(ln.canonical.href, 'https://lightning.btc.tx.taxi/he/docs/faq');
  assert.equal(ln.tags.get('robots'), 'noindex, follow');
  LightningSeo.prototype.setTitle.call(lightning, 'שאלות נפוצות');
  assert.equal(lightningTitles.at(-1), 'שאלות נפוצות · סייר Lightning | lightning.btc.tx.taxi');
  assert.equal(ln.tags.get('og:title'), lightningTitles.at(-1));
  assert.match(LightningSeo.prototype.getDescription.call(lightning), /^גלו/);
  LightningSeo.prototype.updateCanonical.call(lightning, '');
  assert.equal(ln.canonical.href, 'https://lightning.btc.tx.taxi/he/');
});
