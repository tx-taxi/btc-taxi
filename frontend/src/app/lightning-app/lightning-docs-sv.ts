/** Swedish Lightning FAQ headings and REST reference. */
export const swedishLightningFaqTitles: Record<string, string> = {
 'lightning-explore':'Vad kan jag utforska?',
 'lightning-search':'Hur hittar jag en nod eller kanal?',
 'lightning-capacity':'Vad betyder kanalkapacitet?',
 'lightning-fees':'Vad visar routningsavgifterna?',
 'lightning-payments':'Kan jag se en Lightning-betalning?',
 'lightning-locations':'Varifrån kommer nodernas platser?',
 'lightning-status':'Vad betyder kanalstatus och strafftransaktioner?',
 'lightning-freshness':'Hur aktuell är nätverksstatistiken?',
 'lightning-bitcoin':'Varför länkar öppnings- och stängningstransaktioner till Bitcoin?',
};
export const swedishLightningFaqCategories: Record<string, string> = { Search:'Sök', Channels:'Kanaler', Fees:'Avgifter', Payments:'Betalningar', Maps:'Kartor', Statistics:'Statistik' };
export const swedishLightningRestDocs: Record<string, [string, string]> = {
 'get-lightning-network-stats':['Nätverksstatistik','<p>Returnerar statistik för hela nätverket, bland annat antal kanaler och noder, total kapacitet samt genomsnittliga avgifter och medianavgifter.</p><p>För <code>:interval</code> kan du ange <code>latest</code>, <code>24h</code>, <code>3d</code>, <code>1w</code>, <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code> eller <code>3y</code>.</p>'],
 'get-lightning-nodes-channels':['Noder och kanaler','<p>Returnerar Lightning-noder och -kanaler som matchar <code>:query</code>. Sökningen omfattar nodalias och publika nycklar samt fullständiga och korta kanal-ID:n, utan skillnad mellan stora och små bokstäver.</p>'],
 'get-lightning-nodes-country':['Noder per land','<p>Returnerar Lightning-noder som uppskattas finnas i angivet <code>:country</code> utifrån offentlig IP-adress (clearnet). Landet anges med en ISO alfa-2-kod.</p>'],
 'get-country-node-stats':['Nodstatistik per land','<p>Returnerar sammanlagd kapacitet och antal noder per land, uppskattat utifrån offentlig IP-adress (clearnet). Kapaciteten mäts i satoshi.</p>'],
 'get-isp-nodes':['Noder per leverantör','<p>Returnerar noder hos leverantören <code>:isp</code>, angiven med ASN.</p>'],
 'get-isp-node-stats':['Nodstatistik per leverantör','<p>Returnerar sammanlagd kapacitet, antal noder och antal kanaler per leverantör. Kapaciteten mäts i satoshi.</p>'],
 'get-top-100-nodes':['De 100 främsta noderna','<p>Returnerar var sin lista med de 100 främsta noderna efter likviditet (sammanlagd kanalkapacitet) och anslutningar (antal öppna kanaler).</p>'],
 'get-top-100-nodes-liquidity':['100 främsta noder efter likviditet','<p>Returnerar de 100 noderna med högst likviditet, mätt som sammanlagd kanalkapacitet.</p>'],
 'get-top-100-nodes-connectivity':['100 främsta noder efter anslutningar','<p>Returnerar de 100 noderna med flest anslutningar, mätt som antal öppna kanaler.</p>'],
 'get-top-100-oldest-nodes':['100 äldsta noderna','<p>Returnerar de 100 äldsta noderna.</p>'],
 'get-node-stats':['Nodstatistik','<p>Returnerar detaljer om noden med publik nyckel <code>:pubKey</code>.</p>'],
 'get-historical-node-stats':['Historisk nodstatistik','<p>Returnerar historisk statistik för noden med publik nyckel <code>:pubKey</code>.</p>'],
 'get-channel':['Kanal','<p>Returnerar information om Lightning-kanalen med identifieraren <code>:channelId</code>.</p>'],
 'get-channels-from-txid':['Kanaler efter transaktions-ID','<p>Returnerar kanalerna som motsvarar angivet <code>:txid</code>. Flera transaktions-ID:n kan anges.</p>'],
 'get-channels-from-pubkey':['Kanaler efter nodens publika nyckel','<p>Returnerar kanalerna för noden angiven med <code>:pubKey</code>, 10 per sida. Använd <code>:index</code> för sidindelning. <code>:channelStatus</code> kan vara <code>open</code>, <code>active</code> eller <code>closed</code>.</p>'],
 'get-channel-geodata':['Geografiska kanaldata','<p>Returnerar en lista över kanaler med nodernas geografiska data.</p>'],
 'get-channel-geodata-node':['Geografiska kanaldata för en nod','<p>Returnerar kanalerna och deras geografiska data för noden med publik nyckel <code>:pubKey</code>.</p>'],
};
