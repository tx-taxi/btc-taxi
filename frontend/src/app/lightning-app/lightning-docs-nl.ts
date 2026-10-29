/** Dutch Lightning FAQ headings and REST reference. */
export const dutchLightningFaqTitles: Record<string, string> = {
 'lightning-explore':'Wat kan ik bekijken?', 'lightning-search':'Hoe vind ik een node of kanaal?', 'lightning-capacity':'Wat betekent kanaalcapaciteit?',
 'lightning-fees':'Wat tonen routeringskosten?', 'lightning-payments':'Kan ik een Lightning-betaling zien?', 'lightning-locations':'Waar komen node-locaties vandaan?',
 'lightning-status':'Wat betekenen kanaalstatus en straftransacties?', 'lightning-freshness':'Hoe actueel zijn netwerkstatistieken?', 'lightning-bitcoin':'Waarom verwijzen openings- en sluitingstransacties naar Bitcoin?',
};
export const dutchLightningFaqCategories: Record<string, string> = { Search:'Zoeken', Channels:'Kanalen', Fees:'Kosten', Payments:'Betalingen', Maps:'Kaarten', Statistics:'Statistieken' };
export const dutchLightningRestDocs: Record<string, [string, string]> = {
 'get-lightning-network-stats':['Netwerkstatistieken','<p>Geeft statistieken van het hele netwerk, zoals totaal aantal kanalen en nodes, totale capaciteit en gemiddelde en mediane kosten.</p><p>Gebruik voor <code>:interval</code> een van deze waarden: <code>latest</code>, <code>24h</code>, <code>3d</code>, <code>1w</code>, <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code>, <code>3y</code>.</p>'],
 'get-lightning-nodes-channels':['Nodes en kanalen','<p>Geeft Lightning-nodes en -kanalen die overeenkomen met tekstzoekopdracht <code>:query</code>. Er wordt hoofdletterongevoelig gezocht in node-aliassen en publieke sleutels en volledige en korte kanaal-ID’s.</p>'],
 'get-lightning-nodes-country':['Nodes per land','<p>Geeft Lightning-nodes die via een openbaar IP-adres (clearnet) in het opgegeven <code>:country</code> zijn gelokaliseerd. Gebruik een ISO alpha-2-landcode.</p>'],
 'get-country-node-stats':['Nodestatistieken per land','<p>Geeft de totale capaciteit en aantallen nodes die via een openbaar IP-adres (clearnet) zijn gelokaliseerd, per land. Capaciteiten zijn in satoshi.</p>'],
 'get-isp-nodes':['Nodes per provider','<p>Geeft de nodes bij provider <code>:isp</code>, opgegeven via zijn ASN.</p>'],
 'get-isp-node-stats':['Nodestatistieken per provider','<p>Geeft totale capaciteit en aantallen nodes en kanalen per provider. Capaciteiten zijn in satoshi.</p>'],
 'get-top-100-nodes':['Top 100 nodes','<p>Geeft twee lijsten van de top 100 nodes: een gesorteerd op liquiditeit (totale kanaalcapaciteit) en een op connectiviteit (aantal open kanalen).</p>'],
 'get-top-100-nodes-liquidity':['Top 100 nodes op liquiditeit','<p>Geeft de 100 nodes met de hoogste liquiditeit, gemeten als totale kanaalcapaciteit.</p>'],
 'get-top-100-nodes-connectivity':['Top 100 nodes op connectiviteit','<p>Geeft de 100 nodes met de hoogste connectiviteit, gemeten naar het aantal open kanalen.</p>'],
 'get-top-100-oldest-nodes':['100 oudste nodes','<p>Geeft de 100 oudste nodes.</p>'],
 'get-node-stats':['Nodestatistieken','<p>Geeft de details van de node met de opgegeven publieke sleutel <code>:pubKey</code>.</p>'],
 'get-historical-node-stats':['Historische nodestatistieken','<p>Geeft historische statistieken van de node met de opgegeven publieke sleutel <code>:pubKey</code>.</p>'],
 'get-channel':['Kanaal','<p>Geeft informatie over het Lightning-kanaal met de opgegeven identificatie <code>:channelId</code>.</p>'],
 'get-channels-from-txid':['Kanalen per transactie-ID','<p>Geeft de kanalen die bij de opgegeven <code>:txid</code> horen; meerdere transactie-ID’s kunnen worden opgegeven.</p>'],
 'get-channels-from-pubkey':['Kanalen per publieke nodesleutel','<p>Geeft de kanalen van de node met <code>:pubKey</code>, tien per pagina; gebruik <code>:index</code> voor paginering. <code>:channelStatus</code> kan <code>open</code>, <code>active</code> of <code>closed</code> zijn.</p>'],
 'get-channel-geodata':['Geografische kanaalgegevens','<p>Geeft een lijst met kanalen en de geografische gegevens van hun nodes.</p>'],
 'get-channel-geodata-node':['Geografische kanaalgegevens van node','<p>Geeft kanalen en hun geografische gegevens voor de node met de opgegeven publieke sleutel <code>:pubKey</code>.</p>'],
};
