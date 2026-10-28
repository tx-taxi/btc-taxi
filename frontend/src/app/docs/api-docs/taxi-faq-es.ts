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

export function localizedTaxiFaq<T extends {fragment: string; title: string}>(items: T[], locale: string): T[] {
  return locale.startsWith('es') ? items.map(item => ({...item, title: titles[item.fragment] || item.title, categoryLabel: titles[(item as any).category] || (item as any).category})) : items;
}
