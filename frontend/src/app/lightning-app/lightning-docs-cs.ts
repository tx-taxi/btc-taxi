/** Czech Lightning FAQ headings and REST reference. */
export const czechLightningFaqTitles: Record<string, string> = {
 'lightning-explore':'Co mohu prozkoumat?',
 'lightning-search':'Jak najdu uzel nebo kanál?',
 'lightning-capacity':'Co znamená kapacita kanálu?',
 'lightning-fees':'Co ukazují poplatky za směrování?',
 'lightning-payments':'Mohu vidět platbu Lightning?',
 'lightning-locations':'Odkud pocházejí umístění uzlů?',
 'lightning-status':'Co znamenají stav kanálu a penalizace?',
 'lightning-freshness':'Jak aktuální jsou statistiky sítě?',
 'lightning-bitcoin':'Proč transakce otevření a uzavření odkazují na Bitcoin?',
};
export const czechLightningFaqCategories: Record<string, string> = { Search:'Vyhledávání', Channels:'Kanály', Fees:'Poplatky', Payments:'Platby', Maps:'Mapy', Statistics:'Statistiky' };
export const czechLightningRestDocs: Record<string, [string, string]> = {
 'get-lightning-network-stats':['Statistiky sítě','<p>Vrací statistiky celé sítě, včetně počtu kanálů a uzlů, celkové kapacity a průměrných a mediánových poplatků.</p><p>Pro <code>:interval</code> lze zadat <code>latest</code>, <code>24h</code>, <code>3d</code>, <code>1w</code>, <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code> nebo <code>3y</code>.</p>'],
 'get-lightning-nodes-channels':['Uzly a kanály','<p>Vrací uzly a kanály Lightning odpovídající <code>:query</code>. Vyhledává aliasy a veřejné klíče uzlů i úplná a krátká ID kanálů bez rozlišení velikosti písmen.</p>'],
 'get-lightning-nodes-country':['Uzly podle země','<p>Vrací uzly Lightning, jejichž poloha v zadané <code>:country</code> je odhadnuta z veřejné IP adresy (clearnet). Země se zadává dvoupísmenným kódem ISO alfa-2.</p>'],
 'get-country-node-stats':['Statistiky uzlů podle země','<p>Vrací celkovou kapacitu a počet uzlů podle země určené z veřejné IP adresy (clearnet). Kapacita je v satoshi.</p>'],
 'get-isp-nodes':['Uzly podle poskytovatele','<p>Vrací uzly poskytovatele <code>:isp</code>, určeného číslem ASN.</p>'],
 'get-isp-node-stats':['Statistiky uzlů podle poskytovatele','<p>Vrací celkovou kapacitu, počet uzlů a počet kanálů podle poskytovatele. Kapacita je v satoshi.</p>'],
 'get-top-100-nodes':['100 nejlepších uzlů','<p>Vrací samostatné seznamy 100 nejlepších uzlů podle likvidity (celkové kapacity kanálů) a propojenosti (počtu otevřených kanálů).</p>'],
 'get-top-100-nodes-liquidity':['100 uzlů s nejvyšší likviditou','<p>Vrací 100 uzlů s nejvyšší likviditou měřenou celkovou kapacitou kanálů.</p>'],
 'get-top-100-nodes-connectivity':['100 nejpropojenějších uzlů','<p>Vrací 100 nejpropojenějších uzlů podle počtu otevřených kanálů.</p>'],
 'get-top-100-oldest-nodes':['100 nejstarších uzlů','<p>Vrací 100 nejstarších uzlů.</p>'],
 'get-node-stats':['Statistiky uzlu','<p>Vrací podrobnosti o uzlu určeném veřejným klíčem <code>:pubKey</code>.</p>'],
 'get-historical-node-stats':['Historické statistiky uzlu','<p>Vrací historické statistiky uzlu určeného veřejným klíčem <code>:pubKey</code>.</p>'],
 'get-channel':['Kanál','<p>Vrací informace o kanálu Lightning s identifikátorem <code>:channelId</code>.</p>'],
 'get-channels-from-txid':['Kanály podle ID transakce','<p>Vrací kanály odpovídající zadanému <code>:txid</code>. Lze zadat více ID transakcí.</p>'],
 'get-channels-from-pubkey':['Kanály podle veřejného klíče uzlu','<p>Vrací kanály uzlu určeného pomocí <code>:pubKey</code>, po 10 na stránku. Pro stránkování použijte <code>:index</code>. <code>:channelStatus</code> může být <code>open</code>, <code>active</code> nebo <code>closed</code>.</p>'],
 'get-channel-geodata':['Geografická data kanálů','<p>Vrací seznam kanálů s geografickými daty jejich uzlů.</p>'],
 'get-channel-geodata-node':['Geografická data kanálů uzlu','<p>Vrací kanály a jejich geografická data pro uzel s veřejným klíčem <code>:pubKey</code>.</p>'],
};
