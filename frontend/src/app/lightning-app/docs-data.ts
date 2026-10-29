import { hebrewLightningRestDocs } from './lightning-api-he';
import { hebrewLightningFaqTitles, hebrewLightningFaqCategories } from './lightning-faq-he';
import { slovenianLightningRestDocs } from './lightning-api-sl';
import { slovenianLightningFaqTitles, slovenianLightningFaqCategories } from './lightning-faq-sl';
import { lithuanianLightningFaqTitles, lithuanianLightningFaqCategories } from './lightning-faq-lt';
import { lithuanianLightningRestDocs } from './lightning-api-lt';
import { croatianLightningFaqTitles, croatianLightningFaqCategories, croatianLightningRestDocs } from './lightning-docs-hr';
import { arabicLightningFaqTitles, arabicLightningFaqCategories, arabicLightningRestDocs } from './lightning-docs-ar';
import { finnishLightningFaqTitles, finnishLightningFaqCategories } from './lightning-faq-fi';
import { finnishLightningRestDocs } from './lightning-api-fi';
import { persianLightningFaqTitles, persianLightningFaqCategories, persianLightningRestDocs } from './lightning-docs-fa';
import { danishLightningFaqTitles, danishLightningFaqCategories, danishLightningRestDocs } from './lightning-docs-da';
import { catalanLightningFaqTitles, catalanLightningFaqCategories } from './lightning-faq-ca';
import { catalanLightningRestDocs } from './lightning-api-ca';
import { hindiLightningFaqTitles, hindiLightningFaqCategories, hindiLightningRestDocs } from './lightning-docs-hi';
import { czechLightningFaqTitles, czechLightningFaqCategories, czechLightningRestDocs } from './lightning-docs-cs';
import { swedishLightningFaqTitles, swedishLightningFaqCategories, swedishLightningRestDocs } from './lightning-docs-sv';
import { norwegianLightningFaqTitles, norwegianLightningFaqCategories, norwegianLightningRestDocs } from './lightning-docs-nb';
import { ukrainianLightningFaqTitles, ukrainianLightningFaqCategories, ukrainianLightningRestDocs } from './lightning-docs-uk';
import { polishLightningFaqTitles, polishLightningFaqCategories, polishLightningRestDocs } from './lightning-docs-pl';
import { koreanLightningFaqTitles, koreanLightningFaqCategories, koreanLightningRestDocs } from './lightning-docs-ko';
import { dutchLightningFaqTitles, dutchLightningFaqCategories, dutchLightningRestDocs } from './lightning-docs-nl';
import { turkishLightningFaqTitles, turkishLightningFaqCategories, turkishLightningRestDocs } from './lightning-docs-tr';
import { chineseLightningFaqTitles, chineseLightningFaqCategories, chineseLightningRestDocs } from './lightning-docs-zh';
import { japaneseLightningFaqTitles, japaneseLightningFaqCategories, japaneseLightningRestDocs } from './lightning-docs-ja';
import { russianLightningFaqTitles, russianLightningFaqCategories, russianLightningRestDocs } from './lightning-docs-ru';
import { portugueseLightningFaqTitles, portugueseLightningFaqCategories, portugueseLightningRestDocs } from './lightning-docs-pt';
import { italianLightningFaqTitles, italianLightningFaqCategories, italianLightningRestDocs } from './lightning-docs-it';
import { frenchLightningFaqTitles, frenchLightningFaqCategories, frenchLightningRestDocs } from './lightning-docs-fr';
import { germanLightningFaqTitles, germanLightningFaqCategories, germanLightningRestDocs } from './lightning-docs-de';
import { restApiDocsData } from '@app/docs/api-docs/api-docs-data';
export const lightningRestDocs = restApiDocsData.filter(item => item.category === 'lightning');
export const lightningFaq = [
 { type:'category', title:'Lightning network', category:'lightning',showConditions:[''] },
 { type:'faq', title:'What can I explore?', fragment:'lightning-explore', category:'Lightning',showConditions:[''] },
 { type:'faq', title:'How do I find a node or channel?', fragment:'lightning-search', category:'Search',showConditions:[''] },
 { type:'faq', title:'What does channel capacity mean?', fragment:'lightning-capacity', category:'Channels',showConditions:[''] },
 { type:'faq', title:'What do routing fees show?', fragment:'lightning-fees', category:'Fees',showConditions:[''] },
 { type:'faq', title:'Can I see a Lightning payment?', fragment:'lightning-payments', category:'Payments',showConditions:[''] },
 { type:'faq', title:'Where do node locations come from?', fragment:'lightning-locations', category:'Maps',showConditions:[''] },
 { type:'faq', title:'What do channel status and penalties mean?', fragment:'lightning-status', category:'Channels',showConditions:[''] },
 { type:'faq', title:'How current are network statistics?', fragment:'lightning-freshness', category:'Statistics',showConditions:[''] },
 { type:'faq', title:'Why do opening and closing transactions link to Bitcoin?', fragment:'lightning-bitcoin', category:'Bitcoin',showConditions:[''] },
];

const spanishFaqTitles: Record<string, string> = {
  'lightning-explore': '¿Qué puedo explorar?',
  'lightning-search': '¿Cómo encuentro un nodo o canal?',
  'lightning-capacity': '¿Qué significa la capacidad de un canal?',
  'lightning-fees': '¿Qué muestran las comisiones de enrutamiento?',
  'lightning-payments': '¿Puedo ver un pago Lightning?',
  'lightning-locations': '¿De dónde proceden las ubicaciones de los nodos?',
  'lightning-status': '¿Qué significan el estado de un canal y las penalizaciones?',
  'lightning-freshness': '¿Qué tan actuales son las estadísticas de la red?',
  'lightning-bitcoin': '¿Por qué las transacciones de apertura y cierre enlazan a Bitcoin?',
};
const spanishFaqCategories: Record<string, string> = { Search: 'Búsqueda', Channels: 'Canales', Fees: 'Comisiones', Payments: 'Pagos', Maps: 'Mapas', Statistics: 'Estadísticas' };
export function localizedLightningFaq(locale: string) {
  const he = locale.startsWith('he'), sl = locale.startsWith('sl'), lt = locale.startsWith('lt'), hr = locale.startsWith('hr'), ar = locale.startsWith('ar'), ca = locale.startsWith('ca'), da = locale.startsWith('da'), fa = locale.startsWith('fa'), fi = locale.startsWith('fi'), hi = locale.startsWith('hi'), cs = locale.startsWith('cs'), sv = locale.startsWith('sv'), nb = locale.startsWith('nb'), uk = locale.startsWith('uk'), pl = locale.startsWith('pl'), ko = locale.startsWith('ko'), es = locale.startsWith('es'), fr = locale.startsWith('fr'), de = locale.startsWith('de'), it = locale.startsWith('it'), pt = locale.startsWith('pt'), ru = locale.startsWith('ru'), ja = locale.startsWith('ja'), zh = locale.startsWith('zh'), tr = locale.startsWith('tr'), nl = locale.startsWith('nl');
  if (!he && !sl && !lt && !hr && !ar && !ca && !da && !fa && !fi && !hi && !cs && !sv && !nb && !uk && !pl && !ko && !es && !fr && !de && !it && !pt && !ru && !ja && !zh && !tr && !nl) return lightningFaq;
  const titles = he ? hebrewLightningFaqTitles : sl ? slovenianLightningFaqTitles : lt ? lithuanianLightningFaqTitles : hr ? croatianLightningFaqTitles : ar ? arabicLightningFaqTitles : fi ? finnishLightningFaqTitles : fa ? persianLightningFaqTitles : da ? danishLightningFaqTitles : ca ? catalanLightningFaqTitles : hi ? hindiLightningFaqTitles : cs ? czechLightningFaqTitles : sv ? swedishLightningFaqTitles : nb ? norwegianLightningFaqTitles : uk ? ukrainianLightningFaqTitles : pl ? polishLightningFaqTitles : ko ? koreanLightningFaqTitles : es ? spanishFaqTitles : fr ? frenchLightningFaqTitles : de ? germanLightningFaqTitles : it ? italianLightningFaqTitles : pt ? portugueseLightningFaqTitles : ru ? russianLightningFaqTitles : ja ? japaneseLightningFaqTitles : zh ? chineseLightningFaqTitles : tr ? turkishLightningFaqTitles : dutchLightningFaqTitles;
  const categories = he ? hebrewLightningFaqCategories : sl ? slovenianLightningFaqCategories : lt ? lithuanianLightningFaqCategories : hr ? croatianLightningFaqCategories : ar ? arabicLightningFaqCategories : fi ? finnishLightningFaqCategories : fa ? persianLightningFaqCategories : da ? danishLightningFaqCategories : ca ? catalanLightningFaqCategories : hi ? hindiLightningFaqCategories : cs ? czechLightningFaqCategories : sv ? swedishLightningFaqCategories : nb ? norwegianLightningFaqCategories : uk ? ukrainianLightningFaqCategories : pl ? polishLightningFaqCategories : ko ? koreanLightningFaqCategories : es ? spanishFaqCategories : fr ? frenchLightningFaqCategories : de ? germanLightningFaqCategories : it ? italianLightningFaqCategories : pt ? portugueseLightningFaqCategories : ru ? russianLightningFaqCategories : ja ? japaneseLightningFaqCategories : zh ? chineseLightningFaqCategories : tr ? turkishLightningFaqCategories : dutchLightningFaqCategories;
  return lightningFaq.map(item => ({ ...item,
    title: item.type === 'category' ? (he ? 'רשת Lightning' : sl ? 'Omrežje Lightning' : lt ? 'Lightning tinklas' : hr ? 'Lightning mreža' : ar ? 'شبكة Lightning' : fi ? 'Lightning-verkko' : fa ? 'شبکهٔ Lightning' : da ? 'Lightning-netværket' : ca ? 'Xarxa Lightning' : hi ? 'Lightning नेटवर्क' : cs ? 'Síť Lightning' : sv ? 'Lightning-nätverket' : nb ? 'Lightning-nettverket' : uk ? 'Мережа Lightning' : pl ? 'Sieć Lightning' : ko ? '라이트닝 네트워크' : es ? 'Red Lightning' : fr ? 'Réseau Lightning' : de ? 'Lightning-Netzwerk' : it ? 'Rete Lightning' : pt ? 'Rede Lightning' : ru ? 'Сеть Lightning' : ja ? 'Lightningネットワーク' : zh ? 'Lightning网络' : tr ? 'Lightning ağı' : 'Lightning-netwerk') : titles[item.fragment] || item.title,
    category: categories[item.category] || item.category,
  }));
}
const spanishRestDocs: Record<string, [string, string]> = {
  'get-lightning-network-stats': ['Estadísticas de la red', '<p>Devuelve estadísticas de toda la red, como el número total de canales y nodos, la capacidad total y las comisiones medias y medianas.</p><p>Para <code>:interval</code>, usa uno de estos valores: <code>latest</code>, <code>24h</code>, <code>3d</code>, <code>1w</code>, <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code>, <code>3y</code>.</p>'],
  'get-lightning-nodes-channels': ['Nodos y canales', '<p>Devuelve nodos y canales Lightning que coinciden con la búsqueda de texto <code>:query</code>, sin distinguir mayúsculas, en alias y claves públicas de nodos e ID de canal completos y cortos.</p>'],
  'get-lightning-nodes-country': ['Nodos por país', '<p>Devuelve los nodos Lightning geolocalizados a partir de una dirección IP pública (clearnet) en el <code>:country</code> solicitado, indicado mediante un código de país ISO alfa-2.</p>'],
  'get-country-node-stats': ['Estadísticas de nodos por país', '<p>Devuelve la capacidad agregada y el número de nodos geolocalizados a partir de una dirección IP pública (clearnet) por país. Las capacidades se expresan en satoshis.</p>'],
  'get-isp-nodes': ['Nodos por proveedor', '<p>Devuelve los nodos alojados por el proveedor <code>:isp</code>, indicado mediante su ASN.</p>'],
  'get-isp-node-stats': ['Estadísticas de nodos por proveedor', '<p>Devuelve la capacidad agregada y los números de nodos y canales por proveedor. Las capacidades se expresan en satoshis.</p>'],
  'get-top-100-nodes': ['100 principales nodos', '<p>Devuelve dos listas de los 100 principales nodos: una ordenada por liquidez (capacidad agregada de canales) y otra por conectividad (número de canales abiertos).</p>'],
  'get-top-100-nodes-liquidity': ['100 nodos con mayor liquidez', '<p>Devuelve los 100 nodos con mayor liquidez, medida como la capacidad agregada de sus canales.</p>'],
  'get-top-100-nodes-connectivity': ['100 nodos con mayor conectividad', '<p>Devuelve los 100 nodos con mayor conectividad, medida por su número de canales abiertos.</p>'],
  'get-top-100-oldest-nodes': ['100 nodos más antiguos', '<p>Devuelve los 100 nodos más antiguos.</p>'],
  'get-node-stats': ['Estadísticas de un nodo', '<p>Devuelve los detalles del nodo con la clave pública <code>:pubKey</code> indicada.</p>'],
  'get-historical-node-stats': ['Historial de estadísticas de un nodo', '<p>Devuelve estadísticas históricas del nodo con la clave pública <code>:pubKey</code> indicada.</p>'],
  'get-channel': ['Canal', '<p>Devuelve información sobre el canal Lightning con el identificador <code>:channelId</code> indicado.</p>'],
  'get-channels-from-txid': ['Canales por ID de transacción', '<p>Devuelve los canales correspondientes al <code>:txid</code> indicado; se pueden especificar varios ID de transacción.</p>'],
  'get-channels-from-pubkey': ['Canales por clave pública del nodo', '<p>Devuelve los canales del nodo identificado por <code>:pubKey</code>. Se devuelven diez canales por página; usa <code>:index</code> para paginar. <code>:channelStatus</code> puede ser <code>open</code>, <code>active</code> o <code>closed</code>.</p>'],
  'get-channel-geodata': ['Datos geográficos de canales', '<p>Devuelve una lista de canales con los datos geográficos de sus nodos.</p>'],
  'get-channel-geodata-node': ['Datos geográficos de canales de un nodo', '<p>Devuelve los canales y sus datos geográficos para el nodo con la clave pública <code>:pubKey</code> indicada.</p>'],
};
export function localizedLightningRestDocs(locale: string) {
  const localized = locale.startsWith('he') ? hebrewLightningRestDocs : locale.startsWith('sl') ? slovenianLightningRestDocs : locale.startsWith('lt') ? lithuanianLightningRestDocs : locale.startsWith('hr') ? croatianLightningRestDocs : locale.startsWith('ar') ? arabicLightningRestDocs : locale.startsWith('fi') ? finnishLightningRestDocs : locale.startsWith('fa') ? persianLightningRestDocs : locale.startsWith('da') ? danishLightningRestDocs : locale.startsWith('ca') ? catalanLightningRestDocs : locale.startsWith('hi') ? hindiLightningRestDocs : locale.startsWith('cs') ? czechLightningRestDocs : locale.startsWith('sv') ? swedishLightningRestDocs : locale.startsWith('nb') ? norwegianLightningRestDocs : locale.startsWith('uk') ? ukrainianLightningRestDocs : locale.startsWith('pl') ? polishLightningRestDocs : locale.startsWith('ko') ? koreanLightningRestDocs : locale.startsWith('es') ? spanishRestDocs : locale.startsWith('fr') ? frenchLightningRestDocs : locale.startsWith('de') ? germanLightningRestDocs : locale.startsWith('it') ? italianLightningRestDocs : locale.startsWith('pt') ? portugueseLightningRestDocs : locale.startsWith('ru') ? russianLightningRestDocs : locale.startsWith('ja') ? japaneseLightningRestDocs : locale.startsWith('zh') ? chineseLightningRestDocs : locale.startsWith('tr') ? turkishLightningRestDocs : locale.startsWith('nl') ? dutchLightningRestDocs : null;
  if (!localized) return lightningRestDocs;
  return lightningRestDocs.map(item => {
    const translated = localized[item.fragment];
    if (!translated) return item;
    return { ...item, title: `GET ${translated[0]}`, description: { ...item.description, default: translated[1] } };
  });
}
