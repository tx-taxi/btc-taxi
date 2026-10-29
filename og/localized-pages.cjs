'use strict';

// Review-locale shells remain excluded from indexing until their content is reviewed.
const fs = require('node:fs');
const path = require('node:path');
const parse5 = require('parse5');
const origin = 'https://btc.tx.taxi';
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const copy = {
  ca: {title:'Explorador de Bitcoin | btc.tx.taxi', description:'Explora blocs, transaccions, comissions i l’activitat del mempool de Bitcoin a btc.tx.taxi.', heading:'Explorador de Bitcoin'},
  hr: {title:'Bitcoin preglednik | btc.tx.taxi', description:'Istražite Bitcoin blokove, transakcije, naknade i aktivnost mempoola na btc.tx.taxi.', heading:'Bitcoin preglednik'},
  fa: {title:'کاوشگر بیت‌کوین | btc.tx.taxi', description:'بلوک‌ها، تراکنش‌ها، کارمزدها و فعالیت ممپول بیت‌کوین را در btc.tx.taxi بررسی کنید.', heading:'کاوشگر بیت‌کوین'},
  ar: {title:'مستكشف Bitcoin | btc.tx.taxi', description:'استكشف كتل Bitcoin ومعاملاتها ورسومها ونشاط مجمع المعاملات على btc.tx.taxi.', heading:'مستكشف Bitcoin'},
  fi: {title:'Bitcoin-lohkoselain | btc.tx.taxi', description:'Tutustu Bitcoin-lohkoihin, transaktioihin, maksuihin ja mempoolin toimintaan osoitteessa btc.tx.taxi.', heading:'Bitcoin-lohkoselain'},
  fr: {title:'Explorateur Bitcoin | btc.tx.taxi', description:'Explorez les blocs, transactions, frais et activités du mempool Bitcoin avec btc.tx.taxi.', heading:'Explorateur Bitcoin'},
  de: {title:'Bitcoin-Explorer | btc.tx.taxi', description:'Erkunde Bitcoin-Blöcke, Transaktionen, Gebühren und die Mempool-Aktivität mit btc.tx.taxi.', heading:'Bitcoin-Explorer'},
  it: {title:'Esploratore Bitcoin | btc.tx.taxi', description:'Esplora blocchi, transazioni, commissioni e attività del mempool Bitcoin con btc.tx.taxi.', heading:'Esploratore Bitcoin'},
  pt: {title:'Explorador Bitcoin | btc.tx.taxi', description:'Explore blocos, transações, taxas e a atividade da mempool Bitcoin com btc.tx.taxi.', heading:'Explorador Bitcoin'},
  da: {title:'Bitcoin-udforsker | btc.tx.taxi', description:'Udforsk Bitcoin-blokke, transaktioner, gebyrer og mempoolaktivitet på btc.tx.taxi.', heading:'Bitcoin-udforsker'},
  hi: {title:'Bitcoin एक्सप्लोरर | btc.tx.taxi', description:'btc.tx.taxi पर Bitcoin ब्लॉक, लेनदेन, शुल्क और मेमपूल गतिविधि देखें।', heading:'Bitcoin एक्सप्लोरर'},
  cs: {title:'Průzkumník Bitcoin | btc.tx.taxi', description:'Prozkoumejte bloky, transakce, poplatky a aktivitu mempoolu Bitcoinu na btc.tx.taxi.', heading:'Průzkumník Bitcoin'},
  sv: {title:'Bitcoin-utforskare | btc.tx.taxi', description:'Utforska Bitcoin-block, transaktioner, avgifter och mempoolaktivitet med btc.tx.taxi.', heading:'Bitcoin-utforskare'},
  nb: {title:'Bitcoin-utforsker | btc.tx.taxi', description:'Utforsk Bitcoin-blokker, transaksjoner, gebyrer og mempoolaktivitet med btc.tx.taxi.', heading:'Bitcoin-utforsker'},
  uk: {title:'Оглядач Bitcoin | btc.tx.taxi', description:'Переглядайте блоки, транзакції, комісії та активність мемпулу Bitcoin на btc.tx.taxi.', heading:'Оглядач Bitcoin'},
  pl: {title:'Eksplorator Bitcoin | btc.tx.taxi', description:'Przeglądaj bloki, transakcje, opłaty i aktywność mempoola Bitcoin w btc.tx.taxi.', heading:'Eksplorator Bitcoin'},
  ko: {title:'Bitcoin 탐색기 | btc.tx.taxi', description:'btc.tx.taxi에서 Bitcoin 블록, 거래, 수수료와 멤풀 활동을 살펴보세요.', heading:'Bitcoin 탐색기'},
  nl: {title:'Bitcoin-verkenner | btc.tx.taxi', description:'Verken Bitcoin-blokken, transacties, kosten en mempoolactiviteit met btc.tx.taxi.', heading:'Bitcoin-verkenner'},
  tr: {title:'Bitcoin Gezgini | btc.tx.taxi', description:'btc.tx.taxi ile Bitcoin bloklarını, işlemleri, ücretleri ve mempool etkinliğini keşfedin.', heading:'Bitcoin Gezgini'},
  zh: {title:'Bitcoin浏览器 | btc.tx.taxi', description:'通过btc.tx.taxi查看Bitcoin区块、交易、费用和内存池动态。', heading:'Bitcoin浏览器'},
  ja: {title:'Bitcoinエクスプローラー | btc.tx.taxi', description:'btc.tx.taxiでBitcoinのブロック、トランザクション、手数料、メンプールの動きを調べましょう。', heading:'Bitcoinエクスプローラー'},
  ru: {title:'Обозреватель Bitcoin | btc.tx.taxi', description:'Изучайте блоки, транзакции, комиссии и активность мемпула Bitcoin на btc.tx.taxi.', heading:'Обозреватель Bitcoin'},
};
function createLocalizedPages(indexPath, pages, aliases, image) {
  const shells = {};
  for (const lang of Object.keys(copy)) {
    const file = path.join(path.dirname(indexPath), '..', lang, 'index.html');
    if (fs.existsSync(file)) shells[lang] = fs.readFileSync(file, 'utf8');
  }
  const known = new Set(pages.map(page => page.route));
  function route(pathname) {
    const match = pathname.match(/^\/(ar|fa|fi|da|ca|hr|fr|de|it|pt|ru|ja|zh|tr|nl|ko|pl|uk|nb|sv|cs|hi)(?:\/|$)/);
    return match && shells[match[1]] ? { lang: match[1], pathname: pathname.slice(3) || '/' } : null;
  }
  function supports(value) {
    return value === '/' || known.has(value) || !!aliases[value] || /^\/blocks\/[1-9]\d*$/.test(value) || /^\/mempool-block\/[0-7]$/.test(value) || /^\/mining\/pool\/[a-z0-9_-]{1,100}$/i.test(value) || ['/tx/preview', '/blocks/stale', '/graphs/mining/block-health'].includes(value) || /^\/(?:wallet\/[^/]+|widget\/wallet|clock(?:\/(?:mempool|block)(?:\/\d+)?)?|view\/(?:blocks|block\/[a-z0-9]+|mempool-block\/\d+)|preview(?:\/[^/]+){0,3})$/.test(value);
  }
  function render(lang, pathname) {
    const canonical = origin + '/' + lang + (pathname === '/' ? '/' : pathname);
    const doc = parse5.parse(shells[lang]);
    const html = doc.childNodes.find(n => n.tagName === 'html');
    const language = html.attrs.find(a => a.name === 'lang');
    if (language) language.value = lang; else html.attrs.push({name:'lang', value:lang});
    if (lang === 'ar' || lang === 'fa') { const direction = html.attrs.find(a => a.name === 'dir'); if (direction) direction.value = 'rtl'; else html.attrs.push({name:'dir', value:'rtl'}); }
    const head = html.childNodes.find(n => n.tagName === 'head');
    const attr = (n, key) => n.attrs?.find(a => a.name === key)?.value || '';
    head.childNodes = head.childNodes.filter(n => n.tagName !== 'title' &&
      !(n.tagName === 'meta' && (['description', 'robots'].includes(attr(n,'name')) || /^og:/.test(attr(n,'property')) || /^twitter:/.test(attr(n,'name')))) &&
      !(n.tagName === 'link' && ['canonical', 'alternate'].includes(attr(n,'rel'))) &&
      !(n.tagName === 'script' && attr(n,'type') === 'application/ld+json'));
    // Never let a reused shell resolve translated bundles under the English asset base.
    const base = head.childNodes.find(n => n.tagName === 'base');
    if (base) { const href = base.attrs.find(a => a.name === 'href'); if (href) href.value = '/' + lang + '/'; else base.attrs.push({name:'href',value:'/' + lang + '/'}); }
    else head.childNodes.unshift(...parse5.parseFragment('<base href="/' + lang + '/">').childNodes);
    const {title, description, heading} = copy[lang];
    if (lang === 'ca' && image) {
      const alt = 'Una pàgina de transacció de Bitcoin a btc.tx.taxi que mostra l’estat de confirmació, la comissió, les entrades i les sortides.';
      head.childNodes.push(...parse5.parseFragment(`<meta property="og:image" content="${esc(image.url)}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="${esc(image.width)}"><meta property="og:image:height" content="${esc(image.height)}"><meta property="og:image:alt" content="${esc(alt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(image.url)}"><meta name="twitter:image:alt" content="${esc(alt)}">`).childNodes);
    }
    if (lang === 'hr' && image) {
      const alt = 'Stranica Bitcoin transakcije na btc.tx.taxi prikazuje stanje potvrde, naknadu, ulaze i izlaze.';
      head.childNodes.push(...parse5.parseFragment(`<meta property="og:image" content="${esc(image.url)}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="${esc(image.width)}"><meta property="og:image:height" content="${esc(image.height)}"><meta property="og:image:alt" content="${esc(alt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(image.url)}"><meta name="twitter:image:alt" content="${esc(alt)}">`).childNodes);
    }
    if (lang === 'fa' && image) {
      const alt = 'صفحه تراکنش بیت‌کوین در btc.tx.taxi، شامل وضعیت تأیید، کارمزد، ورودی‌ها و خروجی‌ها.';
      head.childNodes.push(...parse5.parseFragment(`<meta property="og:image" content="${esc(image.url)}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="${esc(image.width)}"><meta property="og:image:height" content="${esc(image.height)}"><meta property="og:image:alt" content="${esc(alt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(image.url)}"><meta name="twitter:image:alt" content="${esc(alt)}">`).childNodes);
    }
    if (lang === 'ar' && image) {
      const alt = 'صفحة معاملة Bitcoin على btc.tx.taxi تعرض حالة التأكيد والرسوم والمدخلات والمخرجات.';
      head.childNodes.push(...parse5.parseFragment(`<meta property="og:image" content="${esc(image.url)}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="${esc(image.width)}"><meta property="og:image:height" content="${esc(image.height)}"><meta property="og:image:alt" content="${esc(alt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(image.url)}"><meta name="twitter:image:alt" content="${esc(alt)}">`).childNodes);
    }
    if (lang === 'fi' && image) {
      const alt = 'Bitcoin-transaktiosivu btc.tx.taxi-palvelussa näyttää vahvistustilan, maksun, syötteet ja tulosteet.';
      head.childNodes.push(...parse5.parseFragment(`<meta property="og:image" content="${esc(image.url)}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="${esc(image.width)}"><meta property="og:image:height" content="${esc(image.height)}"><meta property="og:image:alt" content="${esc(alt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(image.url)}"><meta name="twitter:image:alt" content="${esc(alt)}">`).childNodes);
    }
    head.childNodes.push(...parse5.parseFragment(`<title>${esc(title)}</title><link id="canonical" rel="canonical" href="${esc(canonical)}"><meta name="description" content="${esc(description)}"><meta name="robots" content="noindex, follow"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:locale" content="${lang === 'ar' ? 'ar_AR' : lang === 'fa' ? 'fa_IR' : lang === 'hr' ? 'hr_HR' : lang === 'ca' ? 'ca_ES' : lang === 'fi' ? 'fi_FI' : lang === 'da' ? 'da_DK' : lang === 'fr' ? 'fr_FR' : lang === 'de' ? 'de_DE' : lang === 'it' ? 'it_IT' : lang === 'pt' ? 'pt_PT' : lang === 'ja' ? 'ja_JP' : lang === 'zh' ? 'zh_CN' : lang === 'tr' ? 'tr_TR' : lang === 'hi' ? 'hi_IN' : lang === 'cs' ? 'cs_CZ' : lang === 'sv' ? 'sv_SE' : lang === 'nb' ? 'nb_NO' : lang === 'uk' ? 'uk_UA' : lang === 'pl' ? 'pl_PL' : lang === 'ko' ? 'ko_KR' : lang === 'nl' ? 'nl_NL' : 'ru_RU'}">`).childNodes);
    function fill(node) {
      if (node.tagName === 'app-root') { node.childNodes = parse5.parseFragment(`<main class="container-xl"><h1>${esc(heading)}</h1><p>${esc(description)}</p></main>`).childNodes; return; }
      for (const child of node.childNodes || []) fill(child);
    }
    fill(doc); return parse5.serialize(doc);
  }
  function write(req, res, status, lang, pathname) {
    res.writeHead(status, {'Content-Type':'text/html; charset=utf-8', 'Content-Language':lang, 'Cache-Control':status === 200 ? 'public, max-age=300' : 'no-store', 'X-Content-Type-Options':'nosniff', 'X-Robots-Tag':'noindex, follow', ...(status === 503 ? {'Retry-After':'60'} : {})});
    return res.end(req.method === 'HEAD' ? undefined : render(lang, pathname));
  }
  return {route, supports, write};
}
module.exports = {createLocalizedPages};
