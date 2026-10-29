/** Norwegian Bokmål Lightning FAQ headings and REST reference. */
export const norwegianLightningFaqTitles: Record<string, string> = {
 'lightning-explore':'Hva kan jeg utforske?',
 'lightning-search':'Hvordan finner jeg en node eller kanal?',
 'lightning-capacity':'Hva betyr kanalkapasitet?',
 'lightning-fees':'Hva viser rutingsgebyrene?',
 'lightning-payments':'Kan jeg se en Lightning-betaling?',
 'lightning-locations':'Hvor kommer nodeplasseringene fra?',
 'lightning-status':'Hva betyr kanalstatus og straffetransaksjoner?',
 'lightning-freshness':'Hvor oppdatert er nettverksstatistikken?',
 'lightning-bitcoin':'Hvorfor lenker åpnings- og lukkingstransaksjoner til Bitcoin?',
};
export const norwegianLightningFaqCategories: Record<string, string> = { Search:'Søk', Channels:'Kanaler', Fees:'Gebyrer', Payments:'Betalinger', Maps:'Kart', Statistics:'Statistikk' };
export const norwegianLightningRestDocs: Record<string, [string, string]> = {
 'get-lightning-network-stats':['Nettverksstatistikk','<p>Returnerer statistikk for hele nettverket, blant annet antall kanaler og noder, samlet kapasitet og gjennomsnittlige og mediane gebyrer.</p><p>For <code>:interval</code> kan du angi <code>latest</code>, <code>24h</code>, <code>3d</code>, <code>1w</code>, <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code> eller <code>3y</code>.</p>'],
 'get-lightning-nodes-channels':['Noder og kanaler','<p>Returnerer Lightning-noder og -kanaler som samsvarer med <code>:query</code>. Søket dekker nodealiaser og offentlige nøkler samt fullstendige og korte kanal-ID-er, uten å skille mellom store og små bokstaver.</p>'],
 'get-lightning-nodes-country':['Noder etter land','<p>Returnerer Lightning-noder som anslås å være i angitt <code>:country</code> ut fra offentlig IP-adresse (clearnet). Landet angis med en ISO alfa-2-kode.</p>'],
 'get-country-node-stats':['Nodestatistikk etter land','<p>Returnerer samlet kapasitet og antall noder per land, anslått ut fra offentlig IP-adresse (clearnet). Kapasiteten måles i satoshi.</p>'],
 'get-isp-nodes':['Noder etter leverandør','<p>Returnerer noder hos leverandøren <code>:isp</code>, angitt med ASN.</p>'],
 'get-isp-node-stats':['Nodestatistikk etter leverandør','<p>Returnerer samlet kapasitet, antall noder og antall kanaler per leverandør. Kapasiteten måles i satoshi.</p>'],
 'get-top-100-nodes':['Topp 100 noder','<p>Returnerer hver sin topp 100-liste etter likviditet (samlet kanalkapasitet) og tilkobling (antall åpne kanaler).</p>'],
 'get-top-100-nodes-liquidity':['Topp 100 noder etter likviditet','<p>Returnerer de 100 nodene med høyest likviditet, målt som samlet kanalkapasitet.</p>'],
 'get-top-100-nodes-connectivity':['Topp 100 noder etter tilkobling','<p>Returnerer de 100 nodene med flest forbindelser, målt som antall åpne kanaler.</p>'],
 'get-top-100-oldest-nodes':['100 eldste noder','<p>Returnerer de 100 eldste nodene.</p>'],
 'get-node-stats':['Nodestatistikk','<p>Returnerer detaljer om noden angitt med offentlig nøkkel <code>:pubKey</code>.</p>'],
 'get-historical-node-stats':['Historisk nodestatistikk','<p>Returnerer historisk statistikk for noden angitt med offentlig nøkkel <code>:pubKey</code>.</p>'],
 'get-channel':['Kanal','<p>Returnerer informasjon om Lightning-kanalen med identifikator <code>:channelId</code>.</p>'],
 'get-channels-from-txid':['Kanaler etter transaksjons-ID','<p>Returnerer kanalene som svarer til angitt <code>:txid</code>. Flere transaksjons-ID-er kan angis.</p>'],
 'get-channels-from-pubkey':['Kanaler etter nodens offentlige nøkkel','<p>Returnerer kanalene til noden angitt med <code>:pubKey</code>, 10 per side. Bruk <code>:index</code> for sideinndeling. <code>:channelStatus</code> kan være <code>open</code>, <code>active</code> eller <code>closed</code>.</p>'],
 'get-channel-geodata':['Kanalers geografiske data','<p>Returnerer en liste over kanaler med nodenes geografiske data.</p>'],
 'get-channel-geodata-node':['Geografiske kanaldata for en node','<p>Returnerer kanalene og deres geografiske data for noden med offentlig nøkkel <code>:pubKey</code>.</p>'],
};
