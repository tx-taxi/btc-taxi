import { koreanFaqTitles } from './taxi-faq-ko';
import { dutchFaqTitles } from './taxi-faq-nl';
import { turkishFaqTitles } from './taxi-faq-tr';
import { chineseFaqTitles } from './taxi-faq-zh';
import { japaneseFaqTitles } from './taxi-faq-ja';
import { russianFaqTitles } from './taxi-faq-ru';
import { portugueseFaqTitles } from './taxi-faq-pt';
import { italianFaqTitles } from './taxi-faq-it';
import { frenchFaqTitles } from './taxi-faq-fr';

/** Spanish labels for the Bitcoin FAQ; fragments remain stable for deep links. */
const titles: Record<string, string> = {
  'basics': 'Conceptos básicos',
  'what-is-a-mempool': '¿Qué es un mempool?',
  'what-is-a-mempool-explorer': '¿Qué es un explorador de mempool?',
  'what-is-a-blockchain': '¿Qué es una cadena de bloques?',
  'what-is-a-block-explorer': '¿Qué es un explorador de bloques?',
  'what-is-mining': '¿Qué es la minería?',
  'what-are-mining-pools': '¿Qué son los grupos de minería?',
  'what-are-vb-wu': '¿Qué son los bytes virtuales (vB) y las unidades de peso (WU)?',
  'what-is-svb': '¿Qué significa sat/vB?',
  'help-stuck-transaction': 'Ayuda con una transacción pendiente',
  'help': 'Ayuda',
  'how-to': 'Cómo usar este sitio',
  'using': 'Cómo usar este sitio',
  'why-is-transaction-stuck-in-mempool': '¿Por qué no se confirma mi transacción?',
  'how-to-get-transaction-confirmed-quickly': '¿Cómo puedo acelerar la confirmación de mi transacción?',
  'how-prevent-stuck-transaction': '¿Cómo puedo evitar que una transacción quede pendiente?',
  'using-this-website': 'Cómo usar este sitio',
  'looking-up-transactions': '¿Cómo busco una transacción?',
  'looking-up-addresses': '¿Cómo busco una dirección?',
  'looking-up-blocks': '¿Cómo busco un bloque?',
  'looking-up-fee-estimates': '¿Cómo consulto las estimaciones de comisiones?',
  'looking-up-historical-trends': '¿Cómo consulto las tendencias históricas?',
  'advanced': 'Avanzado',
  'self-hosting': 'Alojamiento propio',
  'address-lookup-issues': '¿Por qué fallan algunas consultas de direcciones en mi instancia de Mempool?',
  'what-is-full-mempool': '¿Qué significa que el mempool esté lleno?',
  'how-big-is-mempool-used-by-mempool-space': '¿Qué tamaño tiene el mempool de mempool.space?',
  'what-is-memory-usage': '¿Qué es el uso de memoria?',
  'why-empty-blocks': '¿Por qué hay bloques vacíos?',
  'why-block-timestamps-dont-always-increase': '¿Por qué no siempre aumentan las marcas de tiempo de los bloques?',
  'why-dont-fee-ranges-match': '¿Por qué no coincide el rango de comisiones de un bloque con las tasas de sus transacciones?',
  'how-do-block-audits-work': '¿Cómo funcionan las auditorías de bloques?',
  'what-is-block-health': '¿Qué es la salud de un bloque?',
  'how-do-mempool-goggles-work': '¿Cómo funcionan los filtros de transacciones pendientes?',
  'what-are-sigops': '¿Qué son las operaciones de firma (sigops)?',
  'what-is-adjusted-vsize': '¿Qué es el tamaño virtual ajustado?',
  'why-do-the-projected-block-fee-ranges-overlap': '¿Por qué se superponen los rangos de comisiones de los bloques previstos?',
};

const germanTitles: Record<string, string> = {
  'basics': 'Grundlagen',
  'what-is-a-mempool': 'Was ist ein Mempool?',
  'what-is-a-mempool-explorer': 'Was ist ein Mempool-Explorer?',
  'what-is-a-blockchain': 'Was ist eine Blockchain?',
  'what-is-a-block-explorer': 'Was ist ein Block-Explorer?',
  'what-is-mining': 'Was ist Mining?',
  'what-are-mining-pools': 'Was sind Mining-Pools?',
  'what-are-vb-wu': 'Was sind virtuelle Bytes (vB) und Gewichtseinheiten (WU)?',
  'what-is-svb': 'Was bedeutet sat/vB?',
  'help-stuck-transaction': 'Hilfe bei einer ausstehenden Transaktion',
  'help': 'Hilfe',
  'how-to': 'Diese Website verwenden',
  'using': 'Diese Website verwenden',
  'why-is-transaction-stuck-in-mempool': 'Warum wird meine Transaktion nicht bestätigt?',
  'how-to-get-transaction-confirmed-quickly': 'Wie kann meine Transaktion schneller bestätigt werden?',
  'how-prevent-stuck-transaction': 'Wie verhindere ich künftig eine ausstehende Transaktion?',
  'using-this-website': 'Diese Website verwenden',
  'looking-up-transactions': 'Wie suche ich eine Transaktion?',
  'looking-up-addresses': 'Wie suche ich eine Adresse?',
  'looking-up-blocks': 'Wie suche ich einen Block?',
  'looking-up-fee-estimates': 'Wie finde ich Gebührenschätzungen?',
  'looking-up-historical-trends': 'Wie erkunde ich historische Entwicklungen?',
  'advanced': 'Fortgeschritten',
  'self-hosting': 'Selbst hosten',
  'address-lookup-issues': 'Warum schlagen manche Adressabfragen auf meiner Mempool-Instanz fehl?',
  'what-is-full-mempool': 'Was bedeutet ein voller Mempool?',
  'how-big-is-mempool-used-by-mempool-space': 'Wie groß ist der Mempool von mempool.space?',
  'what-is-memory-usage': 'Was bedeutet Speichernutzung?',
  'why-empty-blocks': 'Warum gibt es leere Blöcke?',
  'why-block-timestamps-dont-always-increase': 'Warum steigen Blockzeitstempel nicht immer?',
  'why-dont-fee-ranges-match': 'Warum stimmt der Gebührenbereich eines Blocks nicht mit den Gebührensätzen seiner Transaktionen überein?',
  'how-do-block-audits-work': 'Wie funktionieren Block-Audits?',
  'what-is-block-health': 'Was ist Blockgesundheit?',
  'how-do-mempool-goggles-work': 'Wie funktionieren Filter für ausstehende Transaktionen?',
  'what-are-sigops': 'Was sind Sigops?',
  'what-is-adjusted-vsize': 'Was ist die angepasste virtuelle Größe?',
  'why-do-the-projected-block-fee-ranges-overlap': 'Warum überlappen die Gebührenbereiche der prognostizierten Blöcke?',
};

export function localizedTaxiFaq<T extends {fragment: string; title: string}>(items: T[], locale: string): T[] {
  const labels = locale.startsWith('ko') ? koreanFaqTitles : locale.startsWith('es') ? titles : locale.startsWith('de') ? germanTitles : locale.startsWith('fr') ? frenchFaqTitles : locale.startsWith('it') ? italianFaqTitles : locale.startsWith('pt') ? portugueseFaqTitles : locale.startsWith('ru') ? russianFaqTitles : locale.startsWith('ja') ? japaneseFaqTitles : locale.startsWith('zh') ? chineseFaqTitles : locale.startsWith('tr') ? turkishFaqTitles : locale.startsWith('nl') ? dutchFaqTitles : null;
  return labels ? items.map(item => ({...item, title: labels[item.fragment] || item.title, categoryLabel: labels[(item as any).category] || (item as any).category})) : items;
}
