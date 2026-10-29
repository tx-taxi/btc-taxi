const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function loadTs(file, imports = {}) {
  const source = fs.readFileSync(path.join(__dirname, '../src/app', file), 'utf8');
  const code = ts.transpile(source, {module: ts.ModuleKind.CommonJS, experimentalDecorators:true});
  const module = {exports:{}};
  vm.runInNewContext(code, {module, exports:module.exports, require:id => imports[id] || {}, URL, console}, {filename:file});
  return module.exports;
}
const copy = loadTs('services/explorer-registry-copy.ts');
const core = {Injectable:() => () => {}, Inject:() => () => {}};

test('localized status and icon descriptions retain latency, brand names and unknown text', () => {
  assert.equal(copy.explorerStatusCopy('es', 'live', ', 12 ms').title, 'Activo, 12 ms');
  assert.equal(copy.explorerStatusCopy('fr-FR', 'checking').title, 'Vérification de l’état en cours');
  assert.equal(copy.explorerStatusCopy('de', 'unavailable').label, 'Nicht verfügbar');
  assert.equal(copy.lightningStatusCopy('fr').title, 'L’état de Lightning est vérifié indépendamment de celui de Bitcoin');
  assert.equal(copy.explorerIconAlt('en', 'Bitcoin logo'), 'Bitcoin logo');
  assert.equal(copy.explorerIconAlt('es', 'Bitcoin logo'), 'Logo de Bitcoin');
  assert.equal(copy.explorerIconAlt('fr', 'Bitcoin explorer'), 'Explorateur Bitcoin');
  assert.equal(copy.explorerIconAlt('de', 'Bitcoin logo'), 'Bitcoin-Logo');
  assert.equal(copy.explorerIconAlt('fr', 'Lightning Network'), 'Lightning Network');
  assert.equal(copy.explorerSearchPlaceholder('de', 'A custom upstream label'), 'A custom upstream label');
  assert.equal(copy.genericSearchPlaceholder('fr', 'Bitcoin · Lightning'), 'Rechercher Bitcoin · Lightning');
});

for (const file of ['services/tx-taxi-explorer-registry.service.ts', 'lightning-app/explorer-registry.service.ts']) {
  test(`${file}: localized explorer data preserves destinations and health semantics`, () => {
    const Registry = loadTs(file, {'@angular/core':core, '@app/services/explorer-registry-copy':copy}).TxTaxiExplorerRegistryService;
    const service = Object.create(Registry.prototype);
    service.locale = 'de'; service.routerOrigin = 'https://tx.taxi';
    const chains = [{id:'bitcoin',name:'Bitcoin',nativeSymbol:'BTC',displayOrder:1,brand:{accentColor:'#f7931a'},site:{origin:'https://btc.tx.taxi',host:'btc.tx.taxi',aliasOrigins:['https://lightning.btc.tx.taxi'],switcherLogo:{url:'/bitcoin.svg',alt:'Bitcoin logo'},searchPlaceholder:'Search a Bitcoin block, transaction, or address',destinations:[{id:'lightning',name:'Lightning',origin:'https://lightning.btc.tx.taxi',icon:{url:'/lightning.svg',alt:'Lightning Network'},search:{kind:'lightning'}}]}}];
    const [explorer] = service.toExplorers(chains, [{chainId:'bitcoin',baseUrl:'https://btc.tx.taxi',status:'healthy',latencyMs:42}]);
    assert.equal(explorer.status, 'live'); assert.equal(explorer.statusTitle, 'Online, 42 ms');
    assert.equal(explorer.iconAlt, 'Bitcoin-Logo');
    assert.equal(explorer.searchPlaceholder, 'Bitcoin-Block, -Transaktion oder -Adresse suchen');
    assert.equal(explorer.destinations[0].status, 'checking');
    assert.equal(explorer.destinations[0].statusTitle, 'Der Lightning-Status wird unabhängig von Bitcoin geprüft');
    assert.equal(explorer.destinations[0].iconAlt, 'Lightning Network');
    assert.equal(explorer.destinations[0].origin, 'https://lightning.btc.tx.taxi');
  });
}
