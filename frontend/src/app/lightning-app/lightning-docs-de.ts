/** German Lightning reference: wire fields and URL parameters remain unchanged. */
export const germanLightningFaqTitles: Record<string, string> = {
  'lightning-explore': 'Was kann ich erkunden?',
  'lightning-search': 'Wie finde ich einen Knoten oder Kanal?',
  'lightning-capacity': 'Was bedeutet die Kapazität eines Kanals?',
  'lightning-fees': 'Was zeigen die Routing-Gebühren?',
  'lightning-payments': 'Kann ich eine Lightning-Zahlung sehen?',
  'lightning-locations': 'Woher stammen Knotenstandorte?',
  'lightning-status': 'Was bedeuten Kanalstatus und Straftransaktionen?',
  'lightning-freshness': 'Wie aktuell sind die Netzwerkstatistiken?',
  'lightning-bitcoin': 'Warum verweisen Eröffnungs- und Schließungstransaktionen auf Bitcoin?',
};
export const germanLightningFaqCategories: Record<string, string> = { Search:'Suche', Channels:'Kanäle', Fees:'Gebühren', Payments:'Zahlungen', Maps:'Karten', Statistics:'Statistiken' };
export const germanLightningRestDocs: Record<string, [string, string]> = {
  'get-lightning-network-stats':['Netzwerkstatistiken','<p>Gibt netzwerkweite Statistiken zurück, darunter die Gesamtzahl der Kanäle und Knoten, die Gesamtkapazität sowie durchschnittliche und mediane Gebühren.</p><p>Verwende für <code>:interval</code> einen dieser Werte: <code>latest</code>, <code>24h</code>, <code>3d</code>, <code>1w</code>, <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code>, <code>3y</code>.</p>'],
  'get-lightning-nodes-channels':['Knoten und Kanäle','<p>Gibt Lightning-Knoten und -Kanäle zurück, die der Textsuche <code>:query</code> ohne Beachtung der Groß- und Kleinschreibung in Knotenaliasen, öffentlichen Knotenschlüsseln sowie vollständigen und kurzen Kanal-IDs entsprechen.</p>'],
  'get-lightning-nodes-country':['Knoten nach Land','<p>Gibt über eine öffentliche IP-Adresse (Clearnet) geolokalisierte Lightning-Knoten im angeforderten <code>:country</code> zurück, angegeben als ISO-Alpha-2-Ländercode.</p>'],
  'get-country-node-stats':['Knotenstatistiken nach Land','<p>Gibt die aggregierte Kapazität und Anzahl der über eine öffentliche IP-Adresse (Clearnet) geolokalisierten Knoten je Land zurück. Kapazitäten werden in Satoshis angegeben.</p>'],
  'get-isp-nodes':['Knoten nach Anbieter','<p>Gibt die vom Anbieter <code>:isp</code> gehosteten Knoten zurück; der Anbieter wird durch seine ASN angegeben.</p>'],
  'get-isp-node-stats':['Knotenstatistiken nach Anbieter','<p>Gibt die aggregierte Kapazität sowie die Knoten- und Kanalanzahl je Anbieter zurück. Kapazitäten werden in Satoshis angegeben.</p>'],
  'get-top-100-nodes':['Top 100 Knoten','<p>Gibt zwei Listen der 100 führenden Knoten zurück: eine nach Liquidität (aggregierte Kanalkapazität), die andere nach Konnektivität (Anzahl offener Kanäle) sortiert.</p>'],
  'get-top-100-nodes-liquidity':['100 Knoten mit höchster Liquidität','<p>Gibt die 100 Knoten mit der höchsten Liquidität zurück, gemessen an ihrer aggregierten Kanalkapazität.</p>'],
  'get-top-100-nodes-connectivity':['100 Knoten mit höchster Konnektivität','<p>Gibt die 100 Knoten mit der höchsten Konnektivität zurück, gemessen an ihrer Zahl offener Kanäle.</p>'],
  'get-top-100-oldest-nodes':['100 älteste Knoten','<p>Gibt die 100 ältesten Knoten zurück.</p>'],
  'get-node-stats':['Knotenstatistiken','<p>Gibt Details des Knotens mit dem angegebenen öffentlichen Schlüssel <code>:pubKey</code> zurück.</p>'],
  'get-historical-node-stats':['Historische Knotenstatistiken','<p>Gibt historische Statistiken des Knotens mit dem angegebenen öffentlichen Schlüssel <code>:pubKey</code> zurück.</p>'],
  'get-channel':['Kanal','<p>Gibt Informationen zum Lightning-Kanal mit der angegebenen Kennung <code>:channelId</code> zurück.</p>'],
  'get-channels-from-txid':['Kanäle nach Transaktions-ID','<p>Gibt die Kanäle zur angegebenen <code>:txid</code> zurück; mehrere Transaktions-IDs können angegeben werden.</p>'],
  'get-channels-from-pubkey':['Kanäle nach öffentlichem Knotenschlüssel','<p>Gibt die Kanäle des durch <code>:pubKey</code> bezeichneten Knotens zurück. Pro Seite werden zehn Kanäle zurückgegeben; verwende <code>:index</code> zur Paginierung. <code>:channelStatus</code> kann <code>open</code>, <code>active</code> oder <code>closed</code> sein.</p>'],
  'get-channel-geodata':['Kanal-Geodaten','<p>Gibt eine Liste von Kanälen mit den Geodaten ihrer Knoten zurück.</p>'],
  'get-channel-geodata-node':['Kanal-Geodaten eines Knotens','<p>Gibt die Kanäle und ihre Geodaten für den Knoten mit dem angegebenen öffentlichen Schlüssel <code>:pubKey</code> zurück.</p>'],
};
