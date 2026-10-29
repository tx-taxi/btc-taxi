'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function filters(lang) {
  const filename = path.join(__dirname, '../src/app/shared/filters.utils.ts');
  const code = ts.transpile(fs.readFileSync(filename, 'utf8'), {module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2020});
  const localize = strings => strings[0].replace(/^:@@[^:]+:/, '');
  const sandbox = {exports:{}, document:{documentElement:{lang}}, $localize:localize};
  vm.runInNewContext(code, sandbox, {filename});
  return sandbox.exports;
}

test('Finnish filter labels retain the English filter semantics', () => {
  const en = filters('en-US'), fi = filters('fi');
  assert.equal(fi.TransactionFilters.rbf.label, 'RBF käytössä');
  assert.equal(fi.TransactionFilters.no_rbf.label, 'RBF pois käytöstä');
  assert.equal(fi.TransactionFilters.cpfp_child.label, 'Maksaa edeltäjän puolesta');
  assert.equal(fi.TransactionFilters.p2ms.label, 'Paljas moniallekirjoitus');
  assert.equal(fi.filterLabel('menu', 'Transaction filters'), 'Transaktiosuodattimet');
  assert.equal(en.TransactionFilters.rbf.label, 'RBF enabled');
  assert.equal(en.filterLabel('menu', 'Transaction filters'), 'Transaction filters');
  for (const key of Object.keys(en.TransactionFilters)) {
    const {label: _english, ...english} = en.TransactionFilters[key];
    const {label: _finnish, ...finnish} = fi.TransactionFilters[key];
    assert.deepEqual(finnish, english, key);
  }
  const combined = fi.TransactionFlags.rbf | fi.TransactionFlags.cpfp_child;
  assert.equal(fi.toFlags(['rbf', 'cpfp_child']), combined);
  assert.deepEqual(Array.from(fi.toFilters(combined), filter => filter.label), ['RBF käytössä', 'Maksaa edeltäjän puolesta']);
});
