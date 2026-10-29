/** Italian Lightning FAQ labels and REST descriptions; protocol fields remain unchanged. */
export const italianLightningFaqTitles: Record<string, string> = {
  'lightning-explore': 'Che cosa posso esplorare?',
  'lightning-search': 'Come trovo un nodo o un canale?',
  'lightning-capacity': 'Che cosa significa la capacità di un canale?',
  'lightning-fees': 'Che cosa indicano le commissioni di instradamento?',
  'lightning-payments': 'Posso vedere un pagamento Lightning?',
  'lightning-locations': 'Da dove provengono le posizioni dei nodi?',
  'lightning-status': 'Che cosa significano lo stato di un canale e le penalità?',
  'lightning-freshness': 'Quanto sono aggiornate le statistiche della rete?',
  'lightning-bitcoin': 'Perché le transazioni di apertura e chiusura rimandano a Bitcoin?',
};
export const italianLightningFaqCategories: Record<string, string> = {
  lightning: 'Rete Lightning', Lightning: 'Lightning', Search: 'Ricerca', Channels: 'Canali', Fees: 'Commissioni',
  Payments: 'Pagamenti', Maps: 'Mappe', Statistics: 'Statistiche', Bitcoin: 'Bitcoin',
};
export const italianLightningRestDocs: Record<string, [string, string]> = {
  'get-lightning-network-stats': ['Statistiche della rete', '<p>Restituisce le statistiche dell’intera rete, tra cui il numero totale di canali e nodi, la capacità totale e le commissioni medie e mediane.</p><p>Per <code>:interval</code>, usa uno dei seguenti valori: <code>latest</code>, <code>24h</code>, <code>3d</code>, <code>1w</code>, <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code>, <code>3y</code>.</p>'],
  'get-lightning-nodes-channels': ['Nodi e canali', '<p>Restituisce nodi e canali Lightning corrispondenti alla ricerca testuale <code>:query</code>, senza distinzione tra maiuscole e minuscole, negli alias e nelle chiavi pubbliche dei nodi e negli identificatori completi e brevi dei canali.</p>'],
  'get-lightning-nodes-country': ['Nodi per paese', '<p>Restituisce i nodi Lightning geolocalizzati da un indirizzo IP pubblico (clearnet) nel paese richiesto da <code>:country</code>, indicato come codice ISO alfa-2.</p>'],
  'get-country-node-stats': ['Statistiche dei nodi per paese', '<p>Restituisce la capacità aggregata e il numero di nodi geolocalizzati da un indirizzo IP pubblico (clearnet), per paese. Le capacità sono espresse in satoshi.</p>'],
  'get-isp-nodes': ['Nodi per provider', '<p>Restituisce i nodi ospitati dal provider <code>:isp</code>, indicato tramite il suo ASN.</p>'],
  'get-isp-node-stats': ['Statistiche dei nodi per provider', '<p>Restituisce la capacità aggregata e il numero di nodi e canali per provider. Le capacità sono espresse in satoshi.</p>'],
  'get-top-100-nodes': ['100 nodi principali', '<p>Restituisce due elenchi dei 100 nodi principali: uno ordinato per liquidità (capacità aggregata dei canali) e l’altro per connettività (numero di canali aperti).</p>'],
  'get-top-100-nodes-liquidity': ['100 nodi con maggiore liquidità', '<p>Restituisce i 100 nodi con maggiore liquidità, misurata come capacità aggregata dei canali.</p>'],
  'get-top-100-nodes-connectivity': ['100 nodi più connessi', '<p>Restituisce i 100 nodi più connessi, misurati in base al numero di canali aperti.</p>'],
  'get-top-100-oldest-nodes': ['100 nodi più vecchi', '<p>Restituisce i 100 nodi più vecchi.</p>'],
  'get-node-stats': ['Statistiche di un nodo', '<p>Restituisce i dettagli del nodo con la chiave pubblica <code>:pubKey</code> indicata.</p>'],
  'get-historical-node-stats': ['Storico delle statistiche di un nodo', '<p>Restituisce le statistiche storiche del nodo con la chiave pubblica <code>:pubKey</code> indicata.</p>'],
  'get-channel': ['Canale', '<p>Restituisce informazioni sul canale Lightning con l’identificatore <code>:channelId</code> indicato.</p>'],
  'get-channels-from-txid': ['Canali per ID della transazione', '<p>Restituisce i canali corrispondenti al <code>:txid</code> indicato; è possibile specificare più ID di transazione.</p>'],
  'get-channels-from-pubkey': ['Canali per chiave pubblica del nodo', '<p>Restituisce i canali del nodo identificato da <code>:pubKey</code>. Sono restituiti dieci canali per pagina; usa <code>:index</code> per scorrere le pagine. <code>:channelStatus</code> può essere <code>open</code>, <code>active</code> o <code>closed</code>.</p>'],
  'get-channel-geodata': ['Dati geografici dei canali', '<p>Restituisce un elenco di canali con i dati geografici dei rispettivi nodi.</p>'],
  'get-channel-geodata-node': ['Dati geografici dei canali di un nodo', '<p>Restituisce i canali e i loro dati geografici per il nodo con la chiave pubblica <code>:pubKey</code> indicata.</p>'],
};
