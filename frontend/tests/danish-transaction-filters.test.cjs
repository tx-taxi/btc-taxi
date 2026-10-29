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

test('Danish filter labels retain the English filter semantics', () => {
  const en = filters('en-US'), da = filters('da');
  assert.equal(da.TransactionFilters.rbf.label, 'RBF aktiveret');
  assert.equal(da.TransactionFilters.no_rbf.label, 'RBF deaktiveret');
  assert.equal(da.TransactionFilters.cpfp_child.label, 'Betaler for forælder');
  assert.equal(da.TransactionFilters.p2ms.label, 'Uindpakket multisig');
  assert.equal(da.filterLabel('menu', 'Transaction filters'), 'Transaktionsfiltre');
  assert.equal(en.TransactionFilters.rbf.label, 'RBF enabled');
  assert.equal(en.filterLabel('menu', 'Transaction filters'), 'Transaction filters');
  for (const key of Object.keys(en.TransactionFilters)) {
    const {label: _english, ...english} = en.TransactionFilters[key];
    const {label: _danish, ...danish} = da.TransactionFilters[key];
    assert.deepEqual(danish, english, key);
  }
  const combined = da.TransactionFlags.rbf | da.TransactionFlags.cpfp_child;
  assert.equal(da.toFlags(['rbf', 'cpfp_child']), combined);
  assert.deepEqual(Array.from(da.toFilters(combined), filter => filter.label), ['RBF aktiveret', 'Betaler for forælder']);
});
