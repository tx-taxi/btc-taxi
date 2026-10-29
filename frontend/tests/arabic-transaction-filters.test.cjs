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

test('Arabic filter labels retain the English filter semantics', () => {
  const en = filters('en-US'), ar = filters('ar');
  assert.equal(ar.TransactionFilters.rbf.label, 'RBF مفعّل');
  assert.equal(ar.TransactionFilters.no_rbf.label, 'RBF غير مفعّل');
  assert.equal(ar.TransactionFilters.cpfp_child.label, 'تدفع عن معاملة أصل');
  assert.equal(ar.TransactionFilters.p2ms.label, 'توقيع متعدد مجرد');
  assert.equal(ar.filterLabel('menu', 'Transaction filters'), 'مرشحات المعاملات');
  assert.equal(en.TransactionFilters.rbf.label, 'RBF enabled');
  assert.equal(en.filterLabel('menu', 'Transaction filters'), 'Transaction filters');
  for (const key of Object.keys(en.TransactionFilters)) {
    const {label: _english, ...english} = en.TransactionFilters[key];
    const {label: _arabic, ...arabic} = ar.TransactionFilters[key];
    assert.deepEqual(arabic, english, key);
  }
  const combined = ar.TransactionFlags.rbf | ar.TransactionFlags.cpfp_child;
  assert.equal(ar.toFlags(['rbf', 'cpfp_child']), combined);
  assert.deepEqual(Array.from(ar.toFilters(combined), filter => filter.label), ['RBF مفعّل', 'تدفع عن معاملة أصل']);
});
