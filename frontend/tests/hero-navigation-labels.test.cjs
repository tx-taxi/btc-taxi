const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const core = {Component:()=>()=>{}, Inject:()=>()=>{}, Input:()=>()=>{}, HostListener:()=>()=>{}, ChangeDetectionStrategy:{OnPush:0}};
function load(file) {
  const source = fs.readFileSync(path.join(__dirname,'../src/app',file),'utf8');
  const js = ts.transpile(source,{module:ts.ModuleKind.CommonJS,experimentalDecorators:true});
  const module={exports:{}};
  vm.runInNewContext(js,{module,exports:module.exports,require:id=>id==='@angular/core'?core:{},console});
  return module.exports;
}
test('documentation hero names Bitcoin and Lightning in natural local word order', () => {
  const Intro=load('shared/components/tx-taxi-docs-intro/tx-taxi-docs-intro.component.ts').TxTaxiDocsIntroComponent;
  const expected={en:'Bitcoin documentation',es:'Documentación de Bitcoin',fr:'Documentation Bitcoin',de:'Bitcoin-Dokumentation'};
  for (const [locale,label] of Object.entries(expected)) {
    const intro=Object.create(Intro.prototype); intro.locale=locale; intro.chainName='Bitcoin'; intro.context='documentation';
    assert.equal(intro.contextLabel,label);
    intro.chainName='Lightning'; intro.context='explorer';
    assert.equal(intro.contextLabel,{en:'Lightning explorer',es:'Explorador de Lightning',fr:'Explorateur Lightning',de:'Lightning-Explorer'}[locale]);
  }
});
for (const file of ['index.mempool.html','resources/branding/chain-transition.js']) {
  test(`${file}: brand labels describe the real destination in each locale`, () => {
    const source=fs.readFileSync(path.join(__dirname,'../src',file),'utf8');
    const start=source.indexOf('    const updateBrandLinks = () => {');
    const end=source.indexOf('    const observer =',start);
    assert.ok(start>=0 && end>start);
    const labels=[];
    for (const lang of ['en','es','fr','de']) {
      for (const dashboard of [true,false]) {
        const link={setAttribute(name,value){if(name==='aria-label') this.label=value;}};
        const document={documentElement:{lang},querySelectorAll:()=>[link]};
        const js=`let scheduled; ${source.slice(start,end)} updateBrandLinks();`;
        vm.runInNewContext(js,{document,isDashboard:()=>dashboard,dashboardPath:()=>'/fr/',hubOrigin:'https://tx.taxi',localizedHubPath:()=>'/fr/',sourceName:'btc.tx.taxi'});
        labels.push(link.label);
        assert.equal(link.title,link.label);
      }
    }
    assert.deepEqual(labels,['Back to tx.taxi','btc.tx.taxi dashboard','Volver a tx.taxi','Panel de btc.tx.taxi','Retour à tx.taxi','Tableau de bord btc.tx.taxi','Zurück zu tx.taxi','btc.tx.taxi-Übersicht']);
  });
}
test('Lightning brand reports home versus hub for the selected language', () => {
  const Shell=load('lightning-app/lightning-shell.component.ts').LightningShellComponent;
  const shell=Object.create(Shell.prototype);shell.locale='fr';shell.router={url:'/'};
  assert.equal(shell.brandLabel,'Retour à tx.taxi');
  shell.router.url='/node/abc';assert.equal(shell.brandLabel,'Tableau de bord Lightning');
  shell.locale='de';assert.equal(shell.brandLabel,'Lightning-Übersicht');
  shell.locale='en';shell.router.url='/';assert.equal(shell.brandLabel,'Back to tx.taxi');
  shell.router.url='/node/abc';assert.equal(shell.brandLabel,'Lightning dashboard');
});
