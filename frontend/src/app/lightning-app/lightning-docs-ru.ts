/** Russian Lightning documentation. API paths and parameter names are unchanged. */
export const russianLightningFaqTitles: Record<string, string> = {
  'lightning-explore': 'Что можно изучить?',
  'lightning-search': 'Как найти узел или канал?',
  'lightning-capacity': 'Что означает ёмкость канала?',
  'lightning-fees': 'Что показывают комиссии за маршрутизацию?',
  'lightning-payments': 'Можно ли увидеть платёж Lightning?',
  'lightning-locations': 'Откуда берётся местоположение узлов?',
  'lightning-status': 'Что означают состояние канала и штрафы?',
  'lightning-freshness': 'Насколько актуальна статистика сети?',
  'lightning-bitcoin': 'Почему транзакции открытия и закрытия ведут в обозреватель Bitcoin?',
};
export const russianLightningFaqCategories: Record<string, string> = {
  Search: 'Поиск', Channels: 'Каналы', Fees: 'Комиссии', Payments: 'Платежи', Maps: 'Карты', Statistics: 'Статистика',
};
export const russianLightningRestDocs: Record<string, [string, string]> = {
  'get-lightning-network-stats': ['Статистика сети', '<p>Возвращает общую статистику сети: число каналов и узлов, общую ёмкость, средние и медианные комиссии.</p><p>Для <code>:interval</code> используйте одно из значений: <code>latest</code>, <code>24h</code>, <code>3d</code>, <code>1w</code>, <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code>, <code>3y</code>.</p>'],
  'get-lightning-nodes-channels': ['Узлы и каналы', '<p>Возвращает узлы и каналы Lightning по текстовому запросу <code>:query</code> без учёта регистра. Поиск выполняется по именам и публичным ключам узлов, а также по полным и коротким идентификаторам каналов.</p>'],
  'get-lightning-nodes-country': ['Узлы по странам', '<p>Возвращает узлы Lightning с публичным IP-адресом, географически определённые в указанной стране <code>:country</code>. Используйте двухбуквенный код страны ISO.</p>'],
  'get-country-node-stats': ['Статистика узлов по странам', '<p>Возвращает общую ёмкость и количество узлов с публичным IP-адресом по странам. Ёмкость указана в сатоши.</p>'],
  'get-isp-nodes': ['Узлы по провайдеру', '<p>Возвращает узлы, размещённые у провайдера <code>:isp</code>, указанного по номеру автономной системы (ASN).</p>'],
  'get-isp-node-stats': ['Статистика узлов по провайдерам', '<p>Возвращает общую ёмкость, количество узлов и каналов по провайдерам. Ёмкость указана в сатоши.</p>'],
  'get-top-100-nodes': ['100 лучших узлов', '<p>Возвращает два списка по 100 узлов: по ликвидности (общей ёмкости каналов) и по связности (количеству открытых каналов).</p>'],
  'get-top-100-nodes-liquidity': ['100 узлов по ликвидности', '<p>Возвращает 100 узлов с наибольшей общей ёмкостью каналов.</p>'],
  'get-top-100-nodes-connectivity': ['100 узлов по связности', '<p>Возвращает 100 узлов с наибольшим числом открытых каналов.</p>'],
  'get-top-100-oldest-nodes': ['100 старейших узлов', '<p>Возвращает 100 старейших узлов.</p>'],
  'get-node-stats': ['Статистика узла', '<p>Возвращает сведения об узле с указанным публичным ключом <code>:pubKey</code>.</p>'],
  'get-historical-node-stats': ['Историческая статистика узла', '<p>Возвращает историческую статистику узла с указанным публичным ключом <code>:pubKey</code>.</p>'],
  'get-channel': ['Канал', '<p>Возвращает сведения о канале Lightning с указанным идентификатором <code>:channelId</code>.</p>'],
  'get-channels-from-txid': ['Каналы по ID транзакции', '<p>Возвращает каналы по указанному <code>:txid</code>; можно указать несколько идентификаторов транзакций.</p>'],
  'get-channels-from-pubkey': ['Каналы по публичному ключу узла', '<p>Возвращает каналы узла с ключом <code>:pubKey</code>. На странице выводится десять каналов; для перехода между страницами используйте <code>:index</code>. Значения <code>:channelStatus</code>: <code>open</code>, <code>active</code> или <code>closed</code>.</p>'],
  'get-channel-geodata': ['Геоданные каналов', '<p>Возвращает список каналов с географическими данными их узлов.</p>'],
  'get-channel-geodata-node': ['Геоданные каналов узла', '<p>Возвращает каналы и их географические данные для узла с указанным публичным ключом <code>:pubKey</code>.</p>'],
};
