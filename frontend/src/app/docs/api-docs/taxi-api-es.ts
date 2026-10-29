import { turkishApiEntries } from './taxi-api-tr';
import { chineseApiEntries } from './taxi-api-zh';
import { japaneseApiEntries } from './taxi-api-ja';
import { russianApiEntries } from './taxi-api-ru';
import { portugueseApiEntries } from './taxi-api-pt';
import { italianApiEntries } from './taxi-api-it';
import { frenchApiEntries } from './taxi-api-fr';
import { germanApiEntries } from './taxi-api-de';

/** Bitcoin REST and WebSocket documentation. API paths and examples stay unchanged. */
const periods = '<code>24h</code>, <code>3d</code>, <code>1w</code>, <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code>, <code>3y</code>';
const periodNote = `<p><code>:timePeriod</code> admite ${periods}. Para <code>24h</code> y <code>3d</code> se incluyen todos los bloques y los valores son exactos; para <code>1w</code> pueden ser promedios según la velocidad a la que se encontraron los bloques. Para los demás períodos son promedios.</p>`;
const entries: Record<string, [string, string?]> = {
  general:['General'],addresses:['Direcciones'],blocks:['Bloques'],mining:['Minería'],fees:['Comisiones'],mempool:['Mempool'],transactions:['Transacciones'],
  'get-difficulty-adjustment':['GET Ajuste de dificultad','Devuelve detalles sobre el ajuste de dificultad.'],
  'get-price':['GET Precio','Devuelve el precio más reciente de bitcoin en las principales monedas.'],
  'get-historical-price':['GET Precio histórico','Devuelve precios históricos de bitcoin en las principales monedas. Parámetros de consulta: <code>currency</code> y <code>timestamp</code>. Si no se indica ninguno, devuelve todo el historial disponible para todas las monedas.'],
  'get-address':['GET Dirección','Devuelve detalles de una dirección. Campos disponibles: <code>address</code>, <code>chain_stats</code> y <code>mempool_stats</code>. Cada uno de los dos últimos contiene <code>tx_count</code>, <code>funded_txo_count</code>, <code>funded_txo_sum</code>, <code>spent_txo_count</code> y <code>spent_txo_sum</code>.'],
  'get-address-transactions':['GET Transacciones de una dirección','Obtiene el historial de la dirección o scripthash indicada, de más reciente a más antigua. Devuelve hasta 50 transacciones del mempool y las primeras 25 confirmadas. Puedes solicitar más transacciones confirmadas con el parámetro <code>after_txid</code>.'],
  'get-address-transactions-chain':['GET Transacciones confirmadas de una dirección','Obtiene el historial confirmado de la dirección o scripthash, de más reciente a más antiguo. Devuelve 25 transacciones por página. Puedes solicitar más indicando el último txid de la consulta anterior.'],
  'get-address-transactions-mempool':['GET Transacciones pendientes de una dirección','Obtiene el historial sin confirmar de la dirección o scripthash. Devuelve hasta 50 transacciones, sin paginación.'],
  'get-address-utxo':['GET UTXO de una dirección','Obtiene las salidas de transacciones no gastadas asociadas a la dirección o scripthash. Campos: <code>txid</code>, <code>vout</code>, <code>value</code> y <code>status</code> (estado de la transacción que creó la salida).'],
  'get-address-validate':['GET Validación de dirección','Indica si una dirección es válida. Campos: <code>isvalid</code> (booleano), <code>address</code> (cadena), <code>scriptPubKey</code> (cadena), <code>isscript</code> (booleano), <code>iswitness</code> (booleano), <code>witness_version</code> (numérico, opcional) y <code>witness_program</code> (cadena, opcional).'],
  'get-block':['GET Bloque','Devuelve detalles de un bloque.'],
  'get-block-v1':['GET Bloque (v1)','Devuelve detalles de un bloque mediante el servidor Node.js de Mempool.'],
  'get-block-header':['GET Cabecera de bloque','Devuelve la cabecera del bloque codificada en hexadecimal.'],
  'get-block-height':['GET Altura de bloque','Devuelve el hash del bloque que se encuentra actualmente en <code>:height</code>.'],
  'get-block-timestamp':['GET Marca de tiempo de bloque','Devuelve la altura y el hash del bloque más cercano a <code>:timestamp</code>.'],
  'get-block-raw':['GET Bloque sin procesar','Devuelve la representación binaria del bloque.'],
  'get-block-status':['GET Estado de bloque','Devuelve el estado de confirmación del bloque. Campos: <code>in_best_chain</code> (booleano, falso para bloques huérfanos) y <code>next_best</code> (hash del siguiente bloque, disponible solo para bloques de la cadena principal).'],
  'get-block-tip-height':['GET Altura del último bloque','Devuelve la altura del último bloque.'],
  'get-block-tip-hash':['GET Hash del último bloque','Devuelve el hash del último bloque.'],
  'get-block-transaction-id':['GET ID de transacción de bloque','Devuelve el ID de la transacción en el índice <code>:index</code> del bloque indicado.'],
  'get-block-transaction-ids':['GET ID de transacciones de bloque','Devuelve una lista de todos los txids del bloque.'],
  'get-block-transactions':['GET Transacciones de bloque','Devuelve hasta 25 transacciones del bloque a partir de <code>start_index</code>. No incluyen el campo <code>status</code>, pues todas comparten bloque y estado de confirmación.'],
  'get-blocks':['GET Bloques','Devuelve detalles de los últimos 10 bloques. Si se indica <code>:startHeight</code>, devuelve los 10 bloques anteriores a esa altura, incluida.'],
  'get-blocks-v1':['GET Bloques (v1)','Devuelve detalles de los últimos 15 bloques del servidor Node.js de Mempool. Incluye comisiones y detalles de minería en <code>extras</code>. Si se indica <code>:startHeight</code>, devuelve los 15 bloques anteriores a esa altura, incluida.'],
  'get-blocks-bulk':['GET Bloques en lote','<p>Devuelve detalles del intervalo entre <code>:minHeight</code> y <code>:maxHeight</code>, ambos incluidos, hasta un máximo de 10 bloques. Si no se indica <code>:maxHeight</code>, se usa la altura actual.</p><p>Para historiales más largos, solicita intervalos pequeños y respeta la caché de las respuestas.</p>'],
  'get-mining-pools':['GET Grupos de minería',`Devuelve los grupos conocidos ordenados por bloques encontrados en el período <code>:timePeriod</code>. Omítelo para obtener todos los datos disponibles o usa ${periods}.`],
  'get-mining-pool':['GET Grupo de minería','Devuelve detalles del grupo indicado por <code>:slug</code>.'],
  'get-mining-pool-hashrates':['GET Tasas de hash de grupos','<p>Devuelve las tasas de hash medias y su proporción del total para los grupos activos en <code>:timePeriod</code>, ordenadas de mayor a menor.</p><p>Omite <code>:timePeriod</code> para todos los datos disponibles o usa <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code> o <code>3y</code>.</p>'],
  'get-mining-pool-hashrate':['GET Tasa de hash de grupo','Devuelve los datos conocidos de tasa de hash del grupo indicado por <code>:slug</code>. Los valores son promedios semanales.'],
  'get-mining-pool-blocks':['GET Bloques de grupo','Devuelve los 10 bloques minados por el grupo <code>:slug</code> antes de <code>:blockHeight</code>. Si no se indica la altura, devuelve sus 10 bloques más recientes.'],
  'get-hashrate':['GET Tasa de hash','<p>Devuelve datos de tasa de hash y dificultad de toda la red para <code>:timePeriod</code>:</p><ul><li>Tasa de hash actual</li><li>Dificultad actual</li><li>Promedios históricos diarios de tasa de hash</li><li>Dificultad histórica</li></ul><p>Valores admitidos: <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code> y <code>3y</code>. Si se omite el intervalo se devuelven todos los datos disponibles.</p><p>Asegúrate de configurar <code>INDEXING_BLOCKS_AMOUNT</code> correctamente en el servidor para que haya suficientes bloques indexados.</p>'],
  'get-difficulty-adjustments':['GET Ajustes de dificultad','<p>Devuelve el historial de ajustes de dificultad para <code>:interval</code>: marca de tiempo y altura del bloque, dificultad y cambio de dificultad.</p><p>Si se omite el intervalo, se devuelven todos los datos disponibles.</p>'],
  'get-reward-stats':['GET Estadísticas de recompensas','Devuelve la recompensa del bloque y el total de transacciones confirmadas en los últimos <code>:blockCount</code> bloques.'],
  'get-block-fees':['GET Comisiones de bloques',`<p>Devuelve las comisiones totales medias de los bloques en <code>:timePeriod</code>, de más antiguo a más reciente.</p>${periodNote}`],
  'get-block-rewards':['GET Recompensas de bloques',`<p>Devuelve las recompensas medias de los bloques en <code>:timePeriod</code>, de más antiguo a más reciente.</p>${periodNote}`],
  'get-block-feerates':['GET Tasas de comisión de bloques',`<p>Devuelve los percentiles medios de las tasas de comisión de los bloques en <code>:timePeriod</code>, de más antiguo a más reciente.</p>${periodNote}`],
  'get-sizes-weights':['GET Tamaño y peso de bloques',`<p>Devuelve el tamaño medio en bytes y el peso medio en unidades de peso de los bloques en <code>:timePeriod</code>, de más antiguo a más reciente.</p>${periodNote}`],
  'get-block-predictions':['GET Predicciones de bloques',`<p>Devuelve la salud media de los bloques en <code>:timePeriod</code>, de más antiguo a más reciente.</p>${periodNote}`],
  'get-block-audit-score':['GET Puntuación de auditoría de bloque','Devuelve la puntuación de auditoría del bloque <code>:blockHash</code>. Campos: <code>hash</code>, <code>matchRate</code>, <code>expectedFees</code> y <code>expectedWeight</code>.'],
  'get-blocks-audit-scores':['GET Puntuaciones de auditoría de bloques','Devuelve las puntuaciones de auditoría de los últimos 16 bloques. Si se indica <code>:startHeight</code>, devuelve los 15 bloques anteriores a esa altura, incluida. Campos: <code>hash</code>, <code>matchRate</code>, <code>expectedFees</code> y <code>expectedWeight</code>.'],
  'get-block-audit-summary':['GET Resumen de auditoría de bloque','Devuelve el resumen de auditoría del bloque <code>:blockHash</code>. Campos: <code>height</code>, <code>id</code>, <code>timestamp</code>, <code>template</code>, <code>missingTxs</code>, <code>addedTxs</code>, <code>freshTxs</code>, <code>sigopTxs</code>, <code>fullrbfTxs</code>, <code>acceleratedTxs</code>, <code>matchRate</code>, <code>expectedFees</code> y <code>expectedWeight</code>.'],
  'get-mempool-blocks-fees':['GET Comisiones de bloques previstos','Devuelve el mempool actual como bloques previstos.'],
  'get-recommended-fees':['GET Comisiones recomendadas','Devuelve las comisiones que se sugieren actualmente para nuevas transacciones.'],
  'get-recommended-fees-precise':['GET Comisiones recomendadas precisas','Devuelve las tasas de comisión sugeridas con hasta tres decimales, incluidas tasas inferiores a un satoshi hasta 0,1 sat/vB.'],
  'get-mempool':['GET Mempool','Devuelve estadísticas actuales de transacciones pendientes en el mempool.'],
  'get-mempool-transaction-ids':['GET ID de transacciones del mempool','Obtiene la lista completa de txids del mempool como un arreglo. El orden es arbitrario y no coincide con bitcoind.'],
  'get-mempool-recent':['GET Transacciones recientes del mempool','Obtiene las últimas 10 transacciones que entraron al mempool. Cada objeto contiene datos resumidos en <code>txid</code>, <code>fee</code>, <code>vsize</code> y <code>value</code>.'],
  'get-mempool-rbf':['GET Transacciones RBF del mempool','Devuelve las transacciones del mempool que forman parte de una cadena RBF.'],
  'get-mempool-fullrbf':['GET Transacciones Full RBF del mempool','Devuelve las transacciones del mempool que forman parte de una cadena Full RBF.'],
  'get-cpfp':['GET Children Pay for Parent','Devuelve los antecesores y las mejores comisiones de descendientes de una transacción.'],
  'get-transaction':['GET Transacción','Devuelve detalles de una transacción. Campos: <code>txid</code>, <code>version</code>, <code>locktime</code>, <code>size</code>, <code>weight</code>, <code>fee</code>, <code>vin</code>, <code>vout</code> y <code>status</code>.'],
  'get-transaction-hex':['GET Transacción hexadecimal','Devuelve una transacción serializada en hexadecimal.'],
  'get-transaction-merkleblock-proof':['GET Prueba Merkleblock de transacción',"Devuelve una prueba de inclusión de Merkle para la transacción usando el formato <a href='https://bitcoin.org/en/glossary/merkle-block'>merkleblock de bitcoind</a>."],
  'get-transaction-merkle-proof':['GET Prueba de Merkle de transacción',"Devuelve una prueba de inclusión de Merkle para la transacción usando el formato <a href='https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-transaction-get-merkle'>blockchain.transaction.get_merkle de Electrum</a>."],
  'get-transaction-outspend':['GET Estado de gasto de salida','Devuelve el estado de gasto de una salida de transacción. Campos: <code>spent</code> (booleano), <code>txid</code> (opcional), <code>vin</code> (opcional) y <code>status</code> (opcional, estado de la transacción que gasta la salida).'],
  'get-transaction-outspends':['GET Estado de gasto de salidas','Devuelve el estado de gasto de todas las salidas de una transacción.'],
  'get-transaction-raw':['GET Transacción sin procesar','Devuelve una transacción como datos binarios.'],
  'get-transaction-rbf-timeline':['GET Cronología RBF de transacción','Devuelve la cronología del árbol RBF de una transacción.'],
  'get-transaction-status':['GET Estado de transacción','Devuelve el estado de confirmación de una transacción. Campos: <code>confirmed</code> (booleano), <code>block_height</code> (opcional) y <code>block_hash</code> (opcional).'],
  'get-transaction-times':['GET Tiempos de transacciones','Devuelve las marcas de tiempo en que una lista de transacciones no confirmadas se observó por primera vez en el mempool. Si una transacción no está en el mempool o fue minada, su marca será <code>0</code>.'],
  'post-transaction':['POST Transacción','Difunde una transacción sin procesar a la red. Debe enviarse en hexadecimal en el cuerpo de la solicitud. Si tiene éxito, devuelve el <code>txid</code>.'],
  'live-data':['Datos en vivo','Suscríbete a datos de Bitcoin en vivo. Suscripciones: <code>blocks</code>, <code>mempool-blocks</code>, <code>live-2h-chart</code> y <code>stats</code>. Envía una carga <code>want</code> después del establecimiento de la conexión WebSocket.'],
  'track-address':['Seguir dirección','Suscríbete a una dirección para recibir actualizaciones de nuevas transacciones que la incluyan en una entrada o salida. <code>address-transactions</code> contiene nuevas transacciones del mempool y <code>block-transactions</code>, nuevas transacciones confirmadas.'],
  'track-addresses':['Seguir direcciones','Suscríbete a varias direcciones para recibir actualizaciones de nuevas transacciones que las incluyan en entradas o salidas. Limita las suscripciones a las direcciones que la aplicación muestra activamente.'],
  'track-tx':['Seguir transacción','Suscríbete a una transacción para recibir actualizaciones de su estado de confirmación y su posición en el mempool.'],
  'track-txs':['Seguir transacciones','Suscríbete a varias transacciones para recibir actualizaciones de su estado y posición en el mempool. Cada conexión puede seguir hasta 100 identificadores.'],
  'track-mempool':['Seguir mempool','Suscríbete a eventos del mempool, como transacciones que entran o salen del mempool del nodo. Campos: <code>added</code>, <code>removed</code>, <code>mined</code> y <code>replaced</code>. Este flujo puede ser grande; usa <code>track-mempool-txids</code> si solo necesitas identificadores.'],
  'track-mempool-txids':['Seguir txids del mempool','Alternativa de menor consumo de ancho de banda a <code>track-mempool</code>: se suscribe a eventos del mempool, pero solo devuelve identificadores. Campos: <code>added</code>, <code>removed</code>, <code>mined</code> y <code>replaced</code>.'],
  'track-mempool-block':['Seguir bloque previsto','Suscríbete a una plantilla de bloque previsto del mempool; el índice 0 corresponde al primero. Al iniciar se devuelve el conjunto completo de transacciones simplificadas del bloque y después se envían los cambios (transacciones añadidas y eliminadas) cada vez que cambia el mempool.'],
  'track-rbf':['Seguir transacciones RBF','Suscríbete a nuevos eventos RBF.'],
  'track-full-rbf':['Seguir transacciones Full RBF','Suscríbete a nuevos eventos Full RBF.'],
};

export function localizedTaxiApi<T extends {fragment: string; title: string; description?: any}>(items: T[], locale: string): T[] {
  const localized = locale.startsWith('es') ? entries : locale.startsWith('fr') ? frenchApiEntries : locale.startsWith('de') ? germanApiEntries : locale.startsWith('it') ? italianApiEntries : locale.startsWith('pt') ? portugueseApiEntries : locale.startsWith('ru') ? russianApiEntries : locale.startsWith('ja') ? japaneseApiEntries : locale.startsWith('zh') ? chineseApiEntries : locale.startsWith('tr') ? turkishApiEntries : null;
  if (!localized) return items;
  return items.map(item => {
    const translated = localized[item.fragment];
    if (!translated) return item;
    return {...item, title: translated[0], categoryLabel: localized[(item as any).category]?.[0] || (item as any).category, ...(item.description && translated[1] ? {description: {...item.description, default: translated[1]}} : {})};
  });
}
