'use strict';

// Card structure is reused from the BTC fork's og/server.cjs, including actual
// selected taxi branding. Only the Lightning entity semantics are different.
const fs = require('node:fs');
const path = require('node:path');
const ORIGIN = 'https://lightning.btc.tx.taxi';
const PAGE_METADATA = require('./page-metadata.json');
const SPANISH_METADATA = require('./page-metadata.es.json');
const DEFAULT_DESCRIPTION = PAGE_METADATA['/'].description;
const BASE_TITLE = PAGE_METADATA['/'].title;
function socialImage() {
  for (const file of [path.join(__dirname, 'social-image.json'), path.join(__dirname, '../frontend/src/resources/lightning-social-image.json')]) {
    try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
  }
  return {url: ORIGIN + '/og/lightning.png', type: 'image/png', width: 1200, height: 630, alt: 'The Lightning network explorer in lightning.btc.tx.taxi.'};
}
function escape(value) { return String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]); }
function short(value, max = 55) { const s = String(value); return s.length <= max ? s : `${s.slice(0, Math.ceil((max - 3) / 2))}...${s.slice(-Math.floor((max - 3) / 2))}`; }
function number(value) { return Number.isSafeInteger(value) && value >= 0 ? value.toLocaleString('en-US') : null; }
function btc(value) { return Number.isSafeInteger(value) && value >= 0 ? `${(value / 1e8).toFixed(8)} BTC` : null; }
function routeMetadata(pathname, proxy) {
  const node = pathname.match(/^\/node\/((?:02|03)[a-f0-9]{64})$/i);
  const channel = pathname.match(/^\/channel\/([\dx]+)$/i);
  const base = { title: BASE_TITLE, heading: 'Lightning Network', subtitle: 'Your taxi to every transaction.', description: DEFAULT_DESCRIPTION, rows: [['Explore', 'Public nodes and channels'], ['Network', 'Bitcoin Lightning'], ['Maps', 'Nodes and channel connections'], ['Statistics', 'Capacity and routing fees']], path: pathname, card: '/og/lightning.png' };
  if (node) {
    const data = proxy?.cache.get(`/api/v1/lightning/nodes/${node[1]}`);
    let entity; try { entity = JSON.parse(data?.body); } catch {}
    const name = entity?.alias || short(node[1], 32);
    return { ...base, title: `Node: ${name} · ${BASE_TITLE}`, heading: entity?.alias || 'Lightning node', subtitle: node[1], description: `Overview for the Lightning network node named ${name}. See channels, capacity, location, fee stats, and more.`, rows: [['Capacity', btc(entity?.capacity)], ['Channels', number(entity?.active_channel_count ?? entity?.channels)], ['Public key', short(node[1], 32)], ['Network', 'Bitcoin Lightning']], card: `/og/node/${node[1]}.png` };
  }
  if (channel) {
    const data = proxy?.cache.get(`/api/v1/lightning/channels/${channel[1]}`);
    let entity; try { entity = JSON.parse(data?.body); } catch {}
    return { ...base, title: `Channel: ${entity?.short_id || channel[1]} · ${BASE_TITLE}`, heading: 'Lightning channel', subtitle: entity?.short_id || channel[1], description: `Overview for Lightning channel ${entity?.short_id || channel[1]}. See channel capacity, the Lightning nodes involved, related on-chain transactions, and more.`, rows: [['Capacity', btc(entity?.capacity)], ['Status', entity ? ['Inactive', 'Active', 'Closed'][entity.status] || null : null], ['Left node', entity?.node_left?.alias], ['Right node', entity?.node_right?.alias]], card: `/og/channel/${channel[1]}.png` };
  }
  const country = pathname.match(/^\/nodes\/country\/([a-z]{2})$/i);
  const isp = pathname.match(/^\/nodes\/isp\/([\d,]+)$/);
  if (country || isp) {
    let entity;
    const apiPath = country ? `/api/v1/lightning/nodes/country/${country[1].toUpperCase()}` : `/api/v1/lightning/nodes/isp/${isp[1]}`;
    try { entity = JSON.parse(proxy?.cache.get(apiPath)?.body); } catch {}
    const name = country ? entity?.country?.en || country[1].toUpperCase() : entity?.isp || `AS${isp[1]}`;
    const label = country ? `Lightning nodes in ${name}` : `Lightning nodes on ISP: ${name} [AS${isp[1]}]`;
    const description = country ? `Explore all the Lightning nodes hosted in ${name} and see an overview of each node's capacity, number of open channels, and more.` : `Browse all Bitcoin Lightning nodes using the ${name} [AS${isp[1]}] ISP and see aggregate stats like total number of nodes, total capacity, and more for the ISP.`;
    return {...base, title: label + ' · ' + BASE_TITLE, heading: label, description};
  }
  const known = PAGE_METADATA[pathname];
  if (known) return {...base, ...known, heading: pathname === '/' ? base.heading : known.title.split(' · ')[0]};
  return base;
}
function spanishRouteMetadata(pathname, data) {
  const output = { ...data, path: '/es' + pathname, noindex: true, language: 'es' };
  output.subtitle = data.subtitle === 'Your taxi to every transaction.' ? 'Tu taxi hacia cada transacción.' : data.subtitle;
  const labels = {Explore:'Explorar', Network:'Red', Maps:'Mapas', Statistics:'Estadísticas', Capacity:'Capacidad', Channels:'Canales', 'Public key':'Clave pública', Status:'Estado', 'Left node':'Nodo izquierdo', 'Right node':'Nodo derecho'};
  const values = {'Public nodes and channels':'Nodos y canales públicos', 'Nodes and channel connections':'Nodos y conexiones', 'Capacity and routing fees':'Capacidad y comisiones', Inactive:'Inactivo', Active:'Activo', Closed:'Cerrado'};
  output.rows = data.rows.map(([label, value]) => [Object.hasOwn(labels, label) ? labels[label] : label, Object.hasOwn(values, value) ? values[value] : value]);
  const known = SPANISH_METADATA[pathname];
  if (known) return {...output, ...known, heading: pathname === '/' ? 'Red Lightning' : known.title.split(' · ')[0]};
  const node = pathname.match(/^\/node\/((?:02|03)[a-f0-9]{64})$/i);
  const channel = pathname.match(/^\/channel\/([\dx]+)$/i);
  const country = pathname.match(/^\/nodes\/country\/([a-z]{2})$/i);
  const isp = pathname.match(/^\/nodes\/isp\/([\d,]+)$/);
  if (node) {
    const name = data.heading === 'Lightning node' ? short(node[1], 32) : data.heading;
    return {...output, title: `Nodo: ${name} · lightning.btc.tx.taxi`, heading: name, description: `Consulta los canales, la capacidad, la ubicación y las comisiones del nodo Lightning ${name}.`};
  }
  if (channel) {
    const id = data.subtitle;
    return {...output, title: `Canal: ${id} · lightning.btc.tx.taxi`, heading: 'Canal Lightning', description: `Consulta la capacidad, los nodos y las transacciones de Bitcoin relacionadas con el canal Lightning ${id}.`};
  }
  if (country) {
    let name = country[1].toUpperCase();
    try { name = new Intl.DisplayNames(['es'], {type:'region'}).of(name) || name; } catch {}
    const heading = `Nodos Lightning en ${name}`;
    return {...output, title: `${heading} · lightning.btc.tx.taxi`, heading, description: `Consulta los nodos Lightning anunciados en ${name} y sus canales y capacidad.`};
  }
  if (isp) {
    const heading = `Nodos Lightning del proveedor AS${isp[1]}`;
    return {...output, title: `${heading} · lightning.btc.tx.taxi`, heading, description: `Consulta los nodos Lightning y la capacidad agregada del proveedor AS${isp[1]}.`};
  }
  return {...output, ...SPANISH_METADATA['/'], heading:'Red Lightning'};
}
function reviewLocaleMetadata(pathname, data, lang) {
  if (lang === 'he') return { ...data, path:'/he' + (pathname === '/' ? '/' : pathname), noindex:true, language:'he', title:'סייר Lightning | lightning.btc.tx.taxi', description:'גלו צומתי Lightning, ערוצים, מדיניות ניתוב וסטטיסטיקות רשת.', heading:'רשת Lightning', subtitle:'המונית שלך לכל עסקה.', rows:[] };
  if (lang === 'ca') return { ...data, path:'/ca' + (pathname === '/' ? '/' : pathname), noindex:true, language:'ca', title:'Explorador de Lightning | lightning.btc.tx.taxi', description:'Explora els nodes, els canals, les polítiques d’encaminament i les estadístiques de la xarxa Lightning.', heading:'Xarxa Lightning', subtitle:'El teu taxi cap a cada transacció.', rows:[] };
  if (lang === 'hu') return { ...data, path:'/hu' + (pathname === '/' ? '/' : pathname), noindex:true, language:'hu', title:'Lightning-böngésző | lightning.btc.tx.taxi', description:'Fedezd fel a Lightning-hálózat csomópontjait, csatornáit, útválasztási szabályait és statisztikáit.', heading:'Lightning-hálózat', subtitle:'Taxi minden tranzakcióhoz.', rows:[] };
  if (lang === 'ro') return { ...data, path:'/ro' + (pathname === '/' ? '/' : pathname), noindex:true, language:'ro', title:'Explorator Lightning | lightning.btc.tx.taxi', description:'Explorați noduri, canale, politici de rutare și statistici ale rețelei Lightning.', heading:'Rețeaua Lightning', subtitle:'Taxi către fiecare tranzacție.', rows:[] };
  if (lang === 'sl') return { ...data, path:'/sl' + (pathname === '/' ? '/' : pathname), noindex:true, language:'sl', title:'Raziskovalec Lightning | lightning.btc.tx.taxi', description:'Raziščite vozlišča, kanale, pravila usmerjanja in statistiko omrežja Lightning.', heading:'Omrežje Lightning', subtitle:'Vaš taksi do vsake transakcije.', rows:[] };
  if (lang === 'lt') return { ...data, path:'/lt' + (pathname === '/' ? '/' : pathname), noindex:true, language:'lt', title:'Lightning naršyklė | lightning.btc.tx.taxi', description:'Naršykite Lightning mazgus, kanalus, maršrutų parinkimo taisykles ir tinklo statistiką.', heading:'Lightning tinklas', subtitle:'Jūsų taksi į kiekvieną sandorį.', rows:[] };
  if (lang === 'hr') return { ...data, path:'/hr' + (pathname === '/' ? '/' : pathname), noindex:true, language:'hr', title:'Lightning preglednik | lightning.btc.tx.taxi', description:'Istražite Lightning čvorove, kanale, pravila usmjeravanja i statistiku mreže.', heading:'Lightning mreža', subtitle:'Vaš taksi do svake transakcije.', rows:[] };
  if (lang === 'fa') return { ...data, path:'/fa' + (pathname === '/' ? '/' : pathname), noindex:true, language:'fa', title:'کاوشگر لایتنینگ | lightning.btc.tx.taxi', description:'گره‌ها، کانال‌ها، سیاست‌های مسیریابی و آمار شبکه لایتنینگ را بررسی کنید.', heading:'شبکه لایتنینگ', subtitle:'تاکسی شما به هر تراکنش.', rows:[] };
  if (lang === 'ar') return { ...data, path:'/ar' + (pathname === '/' ? '/' : pathname), noindex:true, language:'ar', title:'مستكشف Lightning | lightning.btc.tx.taxi', description:'استكشف عقد Lightning وقنواتها وسياسات التوجيه وإحصاءات الشبكة.', heading:'شبكة Lightning', subtitle:'سيارتك إلى كل معاملة.', rows:[] };
  if (lang === 'fi') return { ...data, path:'/fi' + (pathname === '/' ? '/' : pathname), noindex:true, language:'fi', title:'Lightning-selain | lightning.btc.tx.taxi', description:'Tutustu Lightning-verkon solmuihin, kanaviin, reitityskäytäntöihin ja tilastoihin.', heading:'Lightning-verkko', subtitle:'Taksisi jokaiseen transaktioon.', rows:[] };
  const fr = lang === 'fr';
  const title = lang === 'da' ? 'Lightning-udforsker | lightning.btc.tx.taxi' : lang === 'hi' ? 'Lightning एक्सप्लोरर | lightning.btc.tx.taxi' : lang === 'cs' ? 'Průzkumník Lightning | lightning.btc.tx.taxi' : lang === 'sv' ? 'Lightning-utforskare | lightning.btc.tx.taxi' : lang === 'nb' ? 'Lightning-utforsker | lightning.btc.tx.taxi' : lang === 'uk' ? 'Оглядач Lightning | lightning.btc.tx.taxi' : lang === 'pl' ? 'Eksplorator Lightning | lightning.btc.tx.taxi' : lang === 'ko' ? 'Lightning 탐색기 | lightning.btc.tx.taxi' : lang === 'nl' ? 'Lightning-verkenner | lightning.btc.tx.taxi' : lang === 'tr' ? 'Lightning Gezgini | lightning.btc.tx.taxi' : lang === 'zh' ? 'Lightning浏览器 | lightning.btc.tx.taxi' : lang === 'ja' ? 'Lightningエクスプローラー | lightning.btc.tx.taxi' : fr ? 'Explorateur Lightning | lightning.btc.tx.taxi' : lang === 'de' ? 'Lightning-Explorer | lightning.btc.tx.taxi' : lang === 'it' ? 'Esploratore Lightning | lightning.btc.tx.taxi' : lang === 'pt' ? 'Explorador Lightning | lightning.btc.tx.taxi' : 'Обозреватель Lightning | lightning.btc.tx.taxi';
  const description = lang === 'da' ? 'Udforsk Lightning-noder, kanaler, routingpolitikker og netværksstatistik.' : lang === 'hi' ? 'Lightning नोड, चैनल, रूटिंग नीतियां और नेटवर्क आंकड़े देखें।' : lang === 'cs' ? 'Prozkoumejte uzly, kanály, pravidla směrování a statistiky sítě Lightning.' : lang === 'sv' ? 'Utforska Lightning-noder, kanaler, routningsregler och nätverksstatistik.' : lang === 'nb' ? 'Utforsk Lightning-noder, kanaler, rutingsregler og nettverksstatistikk.' : lang === 'uk' ? 'Переглядайте вузли, канали, правила маршрутизації та статистику мережі Lightning.' : lang === 'pl' ? 'Przeglądaj węzły, kanały, zasady routingu i statystyki sieci Lightning.' : lang === 'ko' ? 'Lightning 노드, 채널, 라우팅 정책과 네트워크 통계를 살펴보세요.' : lang === 'nl' ? 'Verken Lightning-nodes, kanalen, routeringsbeleid en netwerkstatistieken.' : lang === 'tr' ? 'Lightning düğümlerini, kanallarını, yönlendirme politikalarını ve ağ istatistiklerini keşfedin.' : lang === 'zh' ? '查看Lightning节点、通道、路由策略和网络统计。' : lang === 'ja' ? 'Lightningのノード、チャネル、ルーティングポリシー、ネットワーク統計を調べましょう。' : fr ? 'Explorez les nœuds, canaux, politiques de routage et statistiques du réseau Lightning.' : lang === 'de' ? 'Erkunde Lightning-Knoten, Kanäle, Routing-Richtlinien und Netzwerkstatistiken.' : lang === 'it' ? 'Esplora nodi, canali, politiche di instradamento e statistiche della rete Lightning.' : lang === 'pt' ? 'Explore nós, canais, políticas de encaminhamento e estatísticas da rede Lightning.' : 'Изучайте узлы, каналы, правила маршрутизации и статистику сети Lightning.';
  return { ...data, path:'/' + lang + (pathname === '/' ? '/' : pathname), noindex:true, language:lang, title, description,
    heading: lang === 'da' ? 'Lightning-netværket' : lang === 'hi' ? 'Lightning नेटवर्क' : lang === 'cs' ? 'Síť Lightning' : lang === 'sv' ? 'Lightning-nätverket' : lang === 'nb' ? 'Lightning-nettverket' : lang === 'uk' ? 'Мережа Lightning' : lang === 'pl' ? 'Sieć Lightning' : lang === 'ko' ? 'Lightning 네트워크' : lang === 'nl' ? 'Lightning-netwerk' : lang === 'tr' ? 'Lightning ağı' : lang === 'zh' ? 'Lightning网络' : lang === 'ja' ? 'Lightningネットワーク' : fr ? 'Réseau Lightning' : lang === 'de' ? 'Lightning-Netzwerk' : lang === 'it' ? 'Rete Lightning' : lang === 'pt' ? 'Rede Lightning' : 'Сеть Lightning', subtitle: lang === 'da' ? 'Din taxi til hver transaktion.' : lang === 'hi' ? 'हर लेनदेन के लिए आपकी टैक्सी।' : lang === 'cs' ? 'Vaše taxi ke každé transakci.' : lang === 'sv' ? 'Din taxi till varje transaktion.' : lang === 'nb' ? 'Din taxi til hver transaksjon.' : lang === 'uk' ? 'Ваше таксі до кожної транзакції.' : lang === 'pl' ? 'Twoja taksówka do każdej transakcji.' : lang === 'ko' ? '모든 거래로 가는 택시.' : lang === 'nl' ? 'Je taxi naar elke transactie.' : lang === 'tr' ? 'Her işleme giden taksiniz.' : lang === 'zh' ? '通往每一笔交易的出租车。' : lang === 'ja' ? 'あらゆるトランザクションへのタクシー。' : fr ? 'Votre taxi vers chaque transaction.' : lang === 'de' ? 'Dein Taxi zu jeder Transaktion.' : lang === 'it' ? 'Il tuo taxi per ogni transazione.' : lang === 'pt' ? 'O seu táxi para cada transação.' : 'Ваше такси к каждой транзакции.', rows:[] };
}
function injectMetadata(html, data) {
  const canonical = ORIGIN + data.path;
  const title = escape(data.title);
  const description = escape(data.description);
  const card = socialImage();
  const image = card.url;
  const imageAlt = data.language === 'ar' ? 'مستكشف شبكة Lightning على tx.taxi.' : data.language === 'he' ? 'סייר רשת Lightning ב־tx.taxi.' : data.language === 'fa' ? 'کاوشگر شبکه لایتنینگ در tx.taxi.' : data.language === 'hu' ? 'Lightning-hálózati böngésző a tx.taxi oldalon.' : data.language === 'ro' ? 'Exploratorul rețelei Lightning pe tx.taxi.' : data.language === 'sl' ? 'Raziskovalec omrežja Lightning na tx.taxi.' : data.language === 'lt' ? 'Lightning tinklo naršyklė svetainėje tx.taxi.' : data.language === 'hr' ? 'Preglednik Lightning mreže na tx.taxi.' : data.language === 'ca' ? 'Explorador de la xarxa Lightning a tx.taxi.' : data.language === 'fi' ? 'Lightning-verkon selain tx.taxi-palvelussa.' : data.language === 'da' ? 'Lightning-netværksudforskeren på tx.taxi.' : data.language === 'hi' ? 'tx.taxi का Lightning नेटवर्क एक्सप्लोरर।' : data.language === 'zh' ? 'tx.taxi的Lightning网络浏览器。' : data.language === 'ja' ? 'tx.taxiのLightningネットワークエクスプローラー。' : data.language === 'es' ? 'Explorador de la red Lightning en tx.taxi.' : data.language === 'fr' ? 'Explorateur du réseau Lightning sur tx.taxi.' : data.language === 'de' ? 'Lightning-Netzwerk-Explorer auf tx.taxi.' : data.language === 'it' ? 'Esploratore della rete Lightning su tx.taxi.' : data.language === 'pt' ? 'Explorador da rede Lightning em tx.taxi.' : data.language === 'ru' ? 'Обозреватель сети Lightning на tx.taxi.' : card.alt;
  const tags = `<title>${title}</title><link id="canonical" rel="canonical" href="${escape(canonical)}"><meta name="description" content="${description}"><meta name="robots" content="${data.noindex || data.status === 404 ? 'noindex, follow' : 'index, follow, max-image-preview:large'}"><meta property="og:site_name" content="lightning.btc.tx.taxi"><meta property="og:locale" content="${data.language === 'ar' ? 'ar_AR' : data.language === 'he' ? 'he_IL' : data.language === 'fa' ? 'fa_IR' : data.language === 'hu' ? 'hu_HU' : data.language === 'ro' ? 'ro_RO' : data.language === 'sl' ? 'sl_SI' : data.language === 'lt' ? 'lt_LT' : data.language === 'hr' ? 'hr_HR' : data.language === 'ca' ? 'ca_ES' : data.language === 'fi' ? 'fi_FI' : data.language === 'da' ? 'da_DK' : data.language === 'es' ? 'es_ES' : data.language === 'fr' ? 'fr_FR' : data.language === 'de' ? 'de_DE' : data.language === 'it' ? 'it_IT' : data.language === 'pt' ? 'pt_PT' : data.language === 'ru' ? 'ru_RU' : data.language === 'ja' ? 'ja_JP' : data.language === 'zh' ? 'zh_CN' : data.language === 'tr' ? 'tr_TR' : data.language === 'hi' ? 'hi_IN' : data.language === 'cs' ? 'cs_CZ' : data.language === 'sv' ? 'sv_SE' : data.language === 'nb' ? 'nb_NO' : data.language === 'uk' ? 'uk_UA' : data.language === 'pl' ? 'pl_PL' : data.language === 'ko' ? 'ko_KR' : data.language === 'nl' ? 'nl_NL' : 'en_US'}"><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${escape(canonical)}"><meta property="og:image" content="${escape(image)}"><meta property="og:image:type" content="${escape(card.type)}"><meta property="og:image:width" content="${card.width}"><meta property="og:image:height" content="${card.height}"><meta property="og:image:alt" content="${escape(imageAlt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${escape(image)}"><meta name="twitter:image:alt" content="${escape(imageAlt)}"><meta name="twitter:domain" content="lightning.btc.tx.taxi">`;
  return html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi, '')
    .replace(/<meta\b[^>]*(?:name|property)=["'](?:description|robots|og:[^"']+|twitter:[^"']+)["'][^>]*>/gi, '')
    .replace(/<\/head>/i, `${tags}</head>`)
    .replace(/(<app-root\b[^>]*>)[\s\S]*?(<\/app-root>)/i, (_, open, close) => {
      const rows = data.unavailable ? [] : data.rows.filter(([, value]) => value !== null && value !== undefined);
      const table = rows.length ? `<table class="table table-striped"><tbody>${rows.map(([label, value]) => `<tr><th scope="row">${escape(label)}</th><td style="overflow-wrap:anywhere">${escape(value)}</td></tr>`).join('')}</tbody></table>` : '';
      const description = data.unavailable ? (data.language === 'ar' ? (data.status === 404 ? 'تعذّر العثور على عنصر Lightning.' : 'بيانات Lightning غير متاحة مؤقتًا. حاول مجددًا.') : data.language === 'he' ? (data.status === 404 ? 'פריט Lightning לא נמצא.' : 'נתוני Lightning אינם זמינים זמנית. נסו שוב.') : data.language === 'fa' ? (data.status === 404 ? 'مورد لایتنینگ پیدا نشد.' : 'داده‌های لایتنینگ موقتاً در دسترس نیستند. دوباره تلاش کنید.') : data.language === 'hu' ? (data.status === 404 ? 'A Lightning-elem nem található.' : 'A Lightning-adatok átmenetileg nem érhetők el. Próbáld újra.') : data.language === 'ro' ? (data.status === 404 ? 'Elementul Lightning nu a fost găsit.' : 'Datele Lightning sunt temporar indisponibile. Încercați din nou.') : data.language === 'sl' ? (data.status === 404 ? 'Zapis Lightning ni bil najden.' : 'Podatki Lightning začasno niso na voljo. Poskusite znova.') : data.language === 'lt' ? (data.status === 404 ? 'Lightning įrašas nerastas.' : 'Lightning duomenys laikinai neprieinami. Bandykite dar kartą.') : data.language === 'hr' ? (data.status === 404 ? 'Lightning stavka nije pronađena.' : 'Lightning podaci privremeno nisu dostupni. Pokušajte ponovno.') : data.language === 'ca' ? (data.status === 404 ? 'No s’ha trobat l’element de Lightning.' : 'Les dades de Lightning no estan disponibles temporalment. Torna-ho a provar.') : data.language === 'fi' ? (data.status === 404 ? 'Lightning-kohdetta ei löytynyt.' : 'Lightning-tiedot eivät ole tilapäisesti saatavilla. Yritä uudelleen.') : data.language === 'da' ? (data.status === 404 ? 'Lightning-elementet blev ikke fundet.' : 'Lightning-data er midlertidigt utilgængelige. Prøv igen.') : data.language === 'hi' ? (data.status === 404 ? 'Lightning जानकारी नहीं मिली।' : 'Lightning डेटा अस्थायी रूप से उपलब्ध नहीं है। फिर कोशिश करें।') : data.language === 'cs' ? (data.status === 404 ? 'Položka Lightning nebyla nalezena.' : 'Data Lightning jsou dočasně nedostupná. Zkuste to znovu.') : data.language === 'sv' ? (data.status === 404 ? 'Lightning-objektet hittades inte.' : 'Lightning-data är tillfälligt otillgängliga. Försök igen.') : data.language === 'nb' ? (data.status === 404 ? 'Lightning-objektet ble ikke funnet.' : 'Lightning-data er midlertidig utilgjengelige. Prøv igjen.') : data.language === 'uk' ? (data.status === 404 ? 'Об’єкт Lightning не знайдено.' : 'Дані Lightning тимчасово недоступні. Спробуйте ще раз.') : data.language === 'pl' ? (data.status === 404 ? 'Nie znaleziono elementu Lightning.' : 'Dane Lightning są chwilowo niedostępne. Spróbuj ponownie.') : data.language === 'ko' ? (data.status === 404 ? 'Lightning 항목을 찾을 수 없습니다.' : 'Lightning 데이터를 일시적으로 사용할 수 없습니다. 다시 시도하세요.') : data.language === 'nl' ? (data.status === 404 ? 'Lightning-item niet gevonden.' : 'Lightning-gegevens zijn tijdelijk niet beschikbaar. Probeer het opnieuw.') : data.language === 'tr' ? (data.status === 404 ? 'Lightning kaydı bulunamadı.' : 'Lightning verileri geçici olarak kullanılamıyor. Yeniden deneyin.') : data.language === 'zh' ? (data.status === 404 ? '未找到Lightning项目。' : 'Lightning数据暂时不可用，请重试。') : data.language === 'ja' ? (data.status === 404 ? 'Lightningの項目が見つかりません。' : 'Lightningデータを一時的に利用できません。もう一度お試しください。') : data.language === 'es' ? (data.status === 404 ? 'No se encontró el elemento de Lightning.' : 'Los datos de Lightning no están disponibles temporalmente. Inténtalo de nuevo.') : data.language === 'fr' ? (data.status === 404 ? 'Élément Lightning introuvable.' : 'Les données Lightning sont temporairement indisponibles. Réessayez.') : data.language === 'de' ? (data.status === 404 ? 'Lightning-Element nicht gefunden.' : 'Lightning-Daten sind vorübergehend nicht verfügbar. Bitte erneut versuchen.') : data.language === 'it' ? (data.status === 404 ? 'Elemento Lightning non trovato.' : 'Dati Lightning temporaneamente non disponibili. Riprova.') : data.language === 'pt' ? (data.status === 404 ? 'Elemento Lightning não encontrado.' : 'Dados Lightning temporariamente indisponíveis. Tente novamente.') : data.language === 'ru' ? (data.status === 404 ? 'Объект Lightning не найден.' : 'Данные Lightning временно недоступны. Попробуйте ещё раз.') : (data.status === 404 ? 'Lightning entity not found.' : 'Lightning data temporarily unavailable. Please retry.')) : data.description;
      return `${open}<main class="container-xl"><h1>${escape(data.heading)}</h1><p style="overflow-wrap:anywhere">${escape(data.subtitle)}</p><p>${escape(description)}</p>${table}</main>${close}`;
    });
}
function cardSvg(data, logoPath) {
  let logo = null;
  try { logo = `data:image/svg+xml;base64,${fs.readFileSync(logoPath).toString('base64')}`; } catch {}
  const rows = data.rows.filter(([, value]) => value !== null && value !== undefined).slice(0, 6);
  const logoMarkup = logo ? `<image href="${logo}" x="64" y="24" width="290" height="80" preserveAspectRatio="xMinYMid meet"/>` : '';
  const cells = rows.map(([label, value], index) => {
    const x = 64 + (index % 2) * 544;
    const y = 316 + Math.floor(index / 2) * 75;
    return `<rect x="${x}" y="${y - 29}" width="518" height="65" fill="${Math.floor(index / 2) % 2 ? '#252525' : '#1c1c1c'}"/><text x="${x + 15}" y="${y - 4}" fill="#a8aebc" font-size="17">${escape(label)}</text><text x="${x + 15}" y="${y + 23}" fill="#f8f9fc" font-size="21" font-weight="600">${escape(short(value, 34))}</text>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#111111"/><rect width="1200" height="8" fill="#7B1AF7"/>${logoMarkup}<text x="${logo ? 420 : 64}" y="69" fill="#b99af7" font-family="DejaVu Sans, sans-serif" font-size="22" font-weight="700">LIGHTNING / EXPLORER</text><path d="M64 108H1136" stroke="#383838"/><text x="64" y="188" fill="#f8f9fc" font-family="DejaVu Sans, sans-serif" font-size="51" font-weight="700">${escape(short(data.heading, 30))}</text><text x="64" y="241" fill="#F7931A" font-family="DejaVu Sans Mono, monospace" font-size="24">${escape(short(data.subtitle, 67))}</text><g font-family="DejaVu Sans, sans-serif">${cells}</g><path d="M64 574H1136" stroke="#383838"/><text x="64" y="605" fill="#9ca4b2" font-family="DejaVu Sans, sans-serif" font-size="17">Bitcoin Lightning Network</text><text x="1136" y="605" text-anchor="end" fill="#9ca4b2" font-family="DejaVu Sans, sans-serif" font-size="17">lightning.btc.tx.taxi</text></svg>`;
}
function createCards(proxy, options = {}) {
  const sharp = options.sharp || require('sharp');
  const logoPath = options.logoPath || path.resolve(__dirname, '../frontend/src/resources/branding/lightning-dark-navbar.svg');
  const cache = new Map();
  const pending = new Map();
  let active = 0;
  return async pathname => {
    const route = pathname === '/og/lightning.png' ? '/' : pathname.replace(/^\/og/, '').replace(/\.png$/, '');
    const data = routeMetadata(route, proxy);
    const key = JSON.stringify(data);
    const prior = cache.get(key);
    if (prior) return prior;
    if (pending.has(key)) return pending.get(key);
    if (active >= 2) throw new Error('Image renderer busy');
    active++;
    const work = sharp(Buffer.from(cardSvg(data, logoPath))).png().toBuffer().then(buffer => {
      cache.set(key, buffer);
      while (cache.size > 64) cache.delete(cache.keys().next().value);
      return buffer;
    }).finally(() => { active--; pending.delete(key); });
    pending.set(key, work);
    return work;
  };
}
module.exports = { routeMetadata, spanishRouteMetadata, reviewLocaleMetadata, injectMetadata, cardSvg, createCards, ORIGIN, escape };
