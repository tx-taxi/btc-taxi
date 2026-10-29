/** Portuguese Lightning documentation; API paths and parameter names remain unchanged. */
export const portugueseLightningFaqTitles: Record<string, string> = {
  'lightning-explore': 'O que posso explorar?',
  'lightning-search': 'Como encontro um nó ou canal?',
  'lightning-capacity': 'O que significa a capacidade de um canal?',
  'lightning-fees': 'O que mostram as taxas de encaminhamento?',
  'lightning-payments': 'Posso ver um pagamento Lightning?',
  'lightning-locations': 'De onde vêm as localizações dos nós?',
  'lightning-status': 'O que significam o estado de um canal e as penalizações?',
  'lightning-freshness': 'Quão atuais são as estatísticas da rede?',
  'lightning-bitcoin': 'Porque ligam as transações de abertura e encerramento ao Bitcoin?',
};
export const portugueseLightningFaqCategories: Record<string, string> = {
  Search: 'Pesquisa', Channels: 'Canais', Fees: 'Taxas', Payments: 'Pagamentos', Maps: 'Mapas', Statistics: 'Estatísticas',
};
export const portugueseLightningRestDocs: Record<string, [string, string]> = {
  'get-lightning-network-stats': ['Estatísticas da rede', '<p>Devolve estatísticas de toda a rede, como o número total de canais e nós, a capacidade total e as taxas médias e medianas.</p><p>Para <code>:interval</code>, use um dos seguintes valores: <code>latest</code>, <code>24h</code>, <code>3d</code>, <code>1w</code>, <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code>, <code>3y</code>.</p>'],
  'get-lightning-nodes-channels': ['Nós e canais', '<p>Devolve nós e canais Lightning correspondentes à pesquisa textual <code>:query</code>, sem distinguir maiúsculas, em aliases e chaves públicas de nós e em IDs de canal completos e curtos.</p>'],
  'get-lightning-nodes-country': ['Nós por país', '<p>Devolve os nós Lightning geolocalizados a partir de um endereço IP público (clearnet) no <code>:country</code> solicitado, indicado por um código de país ISO alfa-2.</p>'],
  'get-country-node-stats': ['Estatísticas de nós por país', '<p>Devolve a capacidade agregada e o número de nós geolocalizados a partir de um endereço IP público (clearnet) por país. As capacidades são expressas em satoshis.</p>'],
  'get-isp-nodes': ['Nós por fornecedor', '<p>Devolve os nós alojados pelo fornecedor <code>:isp</code>, indicado pelo respetivo ASN.</p>'],
  'get-isp-node-stats': ['Estatísticas de nós por fornecedor', '<p>Devolve a capacidade agregada e o número de nós e canais por fornecedor. As capacidades são expressas em satoshis.</p>'],
  'get-top-100-nodes': ['100 principais nós', '<p>Devolve duas listas dos 100 principais nós: uma ordenada por liquidez (capacidade agregada dos canais) e outra por conectividade (número de canais abertos).</p>'],
  'get-top-100-nodes-liquidity': ['100 nós com maior liquidez', '<p>Devolve os 100 nós com maior liquidez, medida pela capacidade agregada dos seus canais.</p>'],
  'get-top-100-nodes-connectivity': ['100 nós com maior conectividade', '<p>Devolve os 100 nós com maior conectividade, medida pelo número de canais abertos.</p>'],
  'get-top-100-oldest-nodes': ['100 nós mais antigos', '<p>Devolve os 100 nós mais antigos.</p>'],
  'get-node-stats': ['Estatísticas de um nó', '<p>Devolve os detalhes do nó com a chave pública <code>:pubKey</code> indicada.</p>'],
  'get-historical-node-stats': ['Histórico de estatísticas de um nó', '<p>Devolve as estatísticas históricas do nó com a chave pública <code>:pubKey</code> indicada.</p>'],
  'get-channel': ['Canal', '<p>Devolve informações sobre o canal Lightning com o identificador <code>:channelId</code> indicado.</p>'],
  'get-channels-from-txid': ['Canais por ID de transação', '<p>Devolve os canais correspondentes ao <code>:txid</code> indicado; podem ser especificados vários IDs de transação.</p>'],
  'get-channels-from-pubkey': ['Canais por chave pública do nó', '<p>Devolve os canais do nó identificado por <code>:pubKey</code>. São devolvidos dez canais por página; use <code>:index</code> para paginar. <code>:channelStatus</code> pode ser <code>open</code>, <code>active</code> ou <code>closed</code>.</p>'],
  'get-channel-geodata': ['Dados geográficos de canais', '<p>Devolve uma lista de canais com os dados geográficos dos respetivos nós.</p>'],
  'get-channel-geodata-node': ['Dados geográficos dos canais de um nó', '<p>Devolve os canais e os respetivos dados geográficos para o nó com a chave pública <code>:pubKey</code> indicada.</p>'],
};
