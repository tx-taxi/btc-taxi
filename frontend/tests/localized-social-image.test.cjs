'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

test('Bitcoin social image alt follows the application locale while preserving English', () => {
  const filename = path.join(__dirname, '../src/app/services/opengraph.service.ts');
  const source = fs.readFileSync(filename, 'utf8');
  const code = ts.transpile(source, { module: ts.ModuleKind.CommonJS, experimentalDecorators: true });
  const angular = { Injectable: () => () => {}, Inject: () => () => {}, LOCALE_ID: Symbol('locale') };
  const sandbox = { exports: {}, require: name => name === '@angular/core' ? angular : {} };
  vm.runInNewContext(code, sandbox, { filename });
  const Service = sandbox.exports.OpenGraphService;
  function metadata(locale) {
    const tags = new Map();
    const service = { locale, defaultImageUrl: 'https://tx.taxi/bitcoin.jpg', metaService: { updateTag: tag => tags.set(tag.name || tag.property, tag.content) } };
    Service.prototype.clearOgImage.call(service);
    return tags;
  }
  const arabic = metadata('ar'), persian = metadata('fa'), catalan = metadata('ca'), croatian = metadata('hr'), lithuanian = metadata('lt'), finnish = metadata('fi'), spanish = metadata('es'), english = metadata('en-US');
  assert.match(arabic.get('og:image:alt'), /^صفحة معاملة Bitcoin/);
  assert.equal(arabic.get('twitter:image:alt'), arabic.get('og:image:alt'));
  assert.match(persian.get('og:image:alt'), /^صفحه تراکنش بیت‌کوین/);
  assert.equal(persian.get('twitter:image:alt'), persian.get('og:image:alt'));
  assert.match(catalan.get('og:image:alt'), /^Una pàgina de transacció de Bitcoin/);
  assert.equal(catalan.get('twitter:image:alt'), catalan.get('og:image:alt'));
  assert.match(croatian.get('og:image:alt'), /^Stranica Bitcoin transakcije/);
  assert.equal(croatian.get('twitter:image:alt'), croatian.get('og:image:alt'));
  assert.match(lithuanian.get('og:image:alt'), /^Bitcoin sandorio puslapyje/);
  assert.equal(lithuanian.get('twitter:image:alt'), lithuanian.get('og:image:alt'));
  assert.match(finnish.get('og:image:alt'), /^Bitcoin-transaktiosivu/);
  assert.equal(finnish.get('twitter:image:alt'), finnish.get('og:image:alt'));
  assert.match(spanish.get('og:image:alt'), /^Una página de transacción de Bitcoin/);
  assert.equal(spanish.get('twitter:image:alt'), spanish.get('og:image:alt'));
  assert.equal(english.get('og:image:alt'), 'A Bitcoin transaction page in btc.tx.taxi, showing confirmation status, fee, inputs and outputs.');
  assert.equal(english.get('twitter:image:alt'), english.get('og:image:alt'));
});

test('Lightning social image alt follows Arabic without changing English', () => {
  const filename = path.join(__dirname, '../src/app/lightning-app/opengraph.service.ts');
  const code = ts.transpile(fs.readFileSync(filename, 'utf8'), {module:ts.ModuleKind.CommonJS, experimentalDecorators:true});
  const angular = { Injectable: () => () => {} };
  const document = { documentElement: { lang:'ar' } };
  const sandbox = {exports:{}, require:name => name === '@angular/core' ? angular : {}, document, window:{}};
  vm.runInNewContext(code, sandbox, {filename});
  const Service = sandbox.exports.OpenGraphService;
  function metadata(locale) {
    document.documentElement.lang = locale;
    const tags = new Map();
    Service.prototype.clearOgImage.call({defaultImageUrl:'https://tx.taxi/lightning.png', metaService:{updateTag: tag => tags.set(tag.name || tag.property, tag.content)}});
    return tags;
  }
  const arabic = metadata('ar'), persian = metadata('fa'), catalan = metadata('ca'), croatian = metadata('hr'), lithuanian = metadata('lt'), english = metadata('en-US');
  assert.equal(arabic.get('og:image:alt'), 'مستكشف شبكة Lightning على tx.taxi.');
  assert.equal(arabic.get('twitter:image:alt'), arabic.get('og:image:alt'));
  assert.equal(persian.get('og:image:alt'), 'کاوشگر شبکه لایتنینگ در tx.taxi.');
  assert.equal(persian.get('twitter:image:alt'), persian.get('og:image:alt'));
  assert.equal(catalan.get('og:image:alt'), 'Explorador de la xarxa Lightning a tx.taxi.');
  assert.equal(catalan.get('twitter:image:alt'), catalan.get('og:image:alt'));
  assert.equal(croatian.get('og:image:alt'), 'Preglednik Lightning mreže na tx.taxi.');
  assert.equal(croatian.get('twitter:image:alt'), croatian.get('og:image:alt'));
  assert.equal(lithuanian.get('og:image:alt'), 'Lightning tinklo naršyklė svetainėje tx.taxi.');
  assert.equal(lithuanian.get('twitter:image:alt'), lithuanian.get('og:image:alt'));
  assert.equal(english.get('og:image:alt'), 'Lightning Network explorer on tx.taxi.');
});

test('Lightning social image alt follows Finnish without changing English', () => {
  const filename = path.join(__dirname, '../src/app/lightning-app/opengraph.service.ts');
  const code = ts.transpile(fs.readFileSync(filename, 'utf8'), {module:ts.ModuleKind.CommonJS, experimentalDecorators:true});
  const angular = { Injectable: () => () => {} };
  const document = { documentElement: { lang:'fi' } };
  const sandbox = {exports:{}, require:name => name === '@angular/core' ? angular : {}, document, window:{}};
  vm.runInNewContext(code, sandbox, {filename});
  const Service = sandbox.exports.OpenGraphService;
  function metadata(locale) {
    document.documentElement.lang = locale;
    const tags = new Map();
    Service.prototype.clearOgImage.call({defaultImageUrl:'https://tx.taxi/lightning.png', metaService:{updateTag: tag => tags.set(tag.name || tag.property, tag.content)}});
    return tags;
  }
  const finnish = metadata('fi'), english = metadata('en-US');
  assert.equal(finnish.get('og:image:alt'), 'Lightning-verkon selain tx.taxi-palvelussa.');
  assert.equal(finnish.get('twitter:image:alt'), finnish.get('og:image:alt'));
  assert.equal(english.get('og:image:alt'), 'Lightning Network explorer on tx.taxi.');
});
