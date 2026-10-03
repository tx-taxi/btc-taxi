const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict'),Module=require('module');
const root='/tmp/tx-taxi-native-seo-complete-20261003/btc';
process.env.BTC_CRAWL_MANIFEST='/tmp/tx-taxi-native-seo-complete-20261003/btc-generated-check/pages.json';
process.env.BTC_OG_INDEX=path.join(root,'frontend/dist/mempool/browser/en-US/index.html');
let callback,providerCalls=0;
const realRequire=Module.createRequire(path.join(root,'og/server.cjs'));
const fakeRequire=name=>name==='node:http'?{createServer:cb=>{callback=cb;return{listen(){}}}}:realRequire(name);
vm.runInNewContext(fs.readFileSync(path.join(root,'og/server.cjs'),'utf8'),{require:fakeRequire,process,Buffer,URL,Map,Promise,console,fetch:async()=>{providerCalls++;throw Error('unexpected provider');},AbortSignal,setTimeout,clearTimeout});
const manifest=JSON.parse(fs.readFileSync(process.env.BTC_CRAWL_MANIFEST));
const parse5=realRequire('parse5');
function elements(html){const all=[];function walk(n){all.push(n);for(const c of n.childNodes||[])walk(c);}walk(parse5.parse(html));return all;}
const attr=(node,key)=>node.attrs?.find(x=>x.name===key)?.value;
async function request(url,method='GET'){let status,headers={},body;const res={headersSent:false,writeHead(s,h){status=s;headers=h;this.headersSent=true;},end(b){body=b||'';}};await callback({url,method},res);return{url,method,status,headers,body};}
(async()=>{
 const results=[];const titles=new Set();
 for(const p of manifest.pages){const r=await request(p.route);assert.equal(r.status,200,p.route);const nodes=elements(r.body);const canonical=nodes.filter(n=>n.tagName==='link'&&attr(n,'rel')==='canonical');assert.equal(canonical.length,1);assert.equal(attr(canonical[0],'id'),'canonical');assert.equal(attr(canonical[0],'href'),manifest.origin+p.route);const title=nodes.find(n=>n.tagName==='title')?.childNodes[0]?.value;assert.ok(!titles.has(title),title);titles.add(title);assert.ok(nodes.find(n=>n.tagName==='app-root')?.childNodes.length);for(const s of nodes.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json'))JSON.parse(s.childNodes[0].value);assert.equal(attr(nodes.find(n=>attr(n,'property')==='og:image'),'content'),manifest.image.url);assert.equal(attr(nodes.find(n=>attr(n,'property')==='og:image:width'),'content'),'1440');assert.match(attr(nodes.find(n=>attr(n,'name')==='robots'),'content'),/^index/);const md=await request(p.route==='/'?'/index.md':p.route+'.md');assert.equal(md.status,200);assert.match(md.headers['X-Robots-Tag'],/noindex/);assert.ok(md.body.includes('Canonical: '+manifest.origin+p.route));if(p.route.startsWith('/docs/'))assert.ok(md.body.length>1000,p.route);const head=await request(p.route,'HEAD');assert.equal(head.status,200);assert.equal(head.body,'');results.push({route:p.route,status:r.status,title,htmlBytes:Buffer.byteLength(r.body),markdownBytes:Buffer.byteLength(md.body),source:p.source,sectionCount:p.sectionCount});}
 for(const [route,target]of Object.entries(manifest.aliases)){const r=await request(route);assert.equal(r.status,308);assert.equal(r.headers.Location,target);}
 for(const route of ['/blocks/2','/blocks/2.md','/mempool-block/3','/mining/pool/foundryusa','/wallet/example','/clock/mempool/0','/view/blocks','/widget/wallet','/tx/preview']){const r=await request(route);assert.equal(r.status,200,route);}
 for(const route of ['/llms.txt','/llms-full.txt','/sitemap.xml','/robots.txt']){const r=await request(route);assert.equal(r.status,200,route);assert.ok(r.body.length>0,route);}
 const alias=await request('/llm.txt');assert.equal(alias.status,308);assert.equal(alias.headers.Location,'/llms.txt');
 const bad=await request('/there-is-no-such-route');assert.equal(bad.status,404);assert.match(bad.headers['X-Robots-Tag'],/noindex/);
 assert.equal((await request('/about','POST')).status,405);assert.equal(providerCalls,0);
 console.log(JSON.stringify({verified:true,pages:manifest.pages.length,providerCalls,results},null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
