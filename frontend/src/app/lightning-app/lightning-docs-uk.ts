/** Ukrainian Lightning FAQ headings and REST reference. */
export const ukrainianLightningFaqTitles: Record<string, string> = {
 'lightning-explore':'Що можна дослідити?',
 'lightning-search':'Як знайти вузол або канал?',
 'lightning-capacity':'Що означає місткість каналу?',
 'lightning-fees':'Що показують комісії маршрутизації?',
 'lightning-payments':'Чи можна побачити платіж Lightning?',
 'lightning-locations':'Звідки беруться розташування вузлів?',
 'lightning-status':'Що означають стан каналу та штрафи?',
 'lightning-freshness':'Наскільки актуальна статистика мережі?',
 'lightning-bitcoin':'Чому транзакції відкриття та закриття ведуть до Bitcoin?',
};
export const ukrainianLightningFaqCategories: Record<string, string> = { Search:'Пошук', Channels:'Канали', Fees:'Комісії', Payments:'Платежі', Maps:'Мапи', Statistics:'Статистика' };
export const ukrainianLightningRestDocs: Record<string, [string, string]> = {
 'get-lightning-network-stats':['Статистика мережі','<p>Повертає статистику всієї мережі, зокрема кількість каналів і вузлів, загальну місткість, середню та медіанну комісії.</p><p>Для <code>:interval</code> можна вказати <code>latest</code>, <code>24h</code>, <code>3d</code>, <code>1w</code>, <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code> або <code>3y</code>.</p>'],
 'get-lightning-nodes-channels':['Вузли й канали','<p>Повертає вузли й канали Lightning, що відповідають <code>:query</code>. Шукає псевдоніми та публічні ключі вузлів, повні й короткі ID каналів без урахування регістру.</p>'],
 'get-lightning-nodes-country':['Вузли за країною','<p>Повертає вузли Lightning, розташування яких у вказаній <code>:country</code> визначено за публічною IP-адресою (clearnet). Країну задають дволітерним кодом ISO alpha-2.</p>'],
 'get-country-node-stats':['Статистика вузлів за країнами','<p>Повертає загальну місткість і кількість вузлів за країнами, визначеними за публічними IP-адресами (clearnet). Місткість виражена в сатоші.</p>'],
 'get-isp-nodes':['Вузли за провайдером','<p>Повертає вузли провайдера <code>:isp</code>, указаного за ASN.</p>'],
 'get-isp-node-stats':['Статистика вузлів за провайдером','<p>Повертає загальну місткість, кількість вузлів і каналів за провайдером. Місткість виражена в сатоші.</p>'],
 'get-top-100-nodes':['100 провідних вузлів','<p>Повертає окремо по 100 провідних вузлів за ліквідністю (сумарна місткість каналів) і зв’язністю (кількість відкритих каналів).</p>'],
 'get-top-100-nodes-liquidity':['100 вузлів за ліквідністю','<p>Повертає 100 вузлів із найбільшою ліквідністю, виміряною сумарною місткістю каналів.</p>'],
 'get-top-100-nodes-connectivity':['100 вузлів за зв’язністю','<p>Повертає 100 вузлів із найбільшою зв’язністю, виміряною кількістю відкритих каналів.</p>'],
 'get-top-100-oldest-nodes':['100 найстаріших вузлів','<p>Повертає 100 найстаріших вузлів.</p>'],
 'get-node-stats':['Статистика вузла','<p>Повертає дані вузла, указаного публічним ключем <code>:pubKey</code>.</p>'],
 'get-historical-node-stats':['Історія статистики вузла','<p>Повертає історичну статистику вузла, указаного публічним ключем <code>:pubKey</code>.</p>'],
 'get-channel':['Канал','<p>Повертає дані каналу Lightning з ідентифікатором <code>:channelId</code>.</p>'],
 'get-channels-from-txid':['Канали за ID транзакції','<p>Повертає канали, що відповідають указаному <code>:txid</code>. Можна вказати кілька ID транзакцій.</p>'],
 'get-channels-from-pubkey':['Канали за публічним ключем вузла','<p>Повертає канали вузла, указаного через <code>:pubKey</code>, по 10 на сторінку. Для переходу між сторінками використовуйте <code>:index</code>. Для <code>:channelStatus</code> можна вказати <code>open</code>, <code>active</code> або <code>closed</code>.</p>'],
 'get-channel-geodata':['Геодані каналів','<p>Повертає список каналів із геоданими їхніх вузлів.</p>'],
 'get-channel-geodata-node':['Геодані каналів вузла','<p>Повертає канали та їхні геодані для вузла з публічним ключем <code>:pubKey</code>.</p>'],
};
