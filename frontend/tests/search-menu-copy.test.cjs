const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(require('node:path').join(__dirname, '../src/app/components/search-form/search-menu-copy.ts'), 'utf8');
const moduleRef = {exports:{}};
vm.runInNewContext(ts.transpile(source, {module:ts.ModuleKind.CommonJS}), {module:moduleRef,exports:moduleRef.exports});
const {searchMenuCopy} = moduleRef.exports;

test('switcher labels preserve the selected explorer name in every supported locale', () => {
  for (const locale of ['en','es','fr','de']) {
    const copy = searchMenuCopy(locale);
    for (const value of [copy.additional('Bitcoin'), copy.openExplorer('Bitcoin'), copy.openNewTab('Bitcoin'), copy.switchTo('Bitcoin'), copy.additionalOptions('Bitcoin', 2, false)]) {
      assert.match(value, /Bitcoin/);
    }
  }
  assert.equal(searchMenuCopy('en').openNewTab('Bitcoin'), 'Open Bitcoin in a new tab');
  assert.equal(searchMenuCopy('es').additionalOptions('Bitcoin', 1, true), 'Ocultar 1 opción adicional de Bitcoin');
  assert.equal(searchMenuCopy('fr-FR').openNewTab('Bitcoin'), 'Ouvrir Bitcoin dans un nouvel onglet');
  assert.equal(searchMenuCopy('de-DE').additionalOptions('Bitcoin', 2, false), '2 weitere Optionen für Bitcoin anzeigen');
  assert.equal(searchMenuCopy('unknown').choose, 'Choose search chain');
});
