/** Croatian Lightning FAQ headings and REST reference. */
export const croatianLightningFaqTitles: Record<string, string> = {
 'lightning-explore':'Što mogu istraživati?',
 'lightning-search':'Kako pronaći čvor ili kanal?',
 'lightning-capacity':'Što znači kapacitet kanala?',
 'lightning-fees':'Što prikazuju naknade za usmjeravanje?',
 'lightning-payments':'Mogu li vidjeti Lightning plaćanja?',
 'lightning-locations':'Odakle dolaze lokacije čvorova?',
 'lightning-status':'Što znače status kanala i kaznene transakcije?',
 'lightning-freshness':'Koliko su aktualni mrežni statistički podaci?',
 'lightning-bitcoin':'Zašto transakcije otvaranja i zatvaranja kanala vode na Bitcoin?',
};
export const croatianLightningFaqCategories: Record<string, string> = { Search:'Pretraživanje', Channels:'Kanali', Fees:'Naknade', Payments:'Plaćanja', Maps:'Karte', Statistics:'Statistika' };
export const croatianLightningRestDocs: Record<string, [string, string]> = {
 'get-lightning-network-stats':['Statistika mreže','<p>Vraća statistiku mreže, uključujući broj kanala i čvorova, ukupni kapacitet te prosječne i medijalne naknade.</p><p>Za <code>:interval</code> upotrijebite <code>latest</code>, <code>24h</code>, <code>3d</code>, <code>1w</code>, <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code> ili <code>3y</code>.</p>'],
 'get-lightning-nodes-channels':['Čvorovi i kanali','<p>Vraća Lightning čvorove i kanale koji odgovaraju upitu <code>:query</code>. Pretraživanje cjelovitog teksta obuhvaća pseudonime i javne ključeve čvorova te pune i kratke ID-ove kanala; velika i mala slova nisu bitna.</p>'],
 'get-lightning-nodes-country':['Čvorovi po državi','<p>Vraća Lightning čvorove čija se lokacija izvedena iz javne IP adrese (clearnet) nalazi u državi <code>:country</code>. Upotrijebite dvoslovni ISO alpha-2 kod države.</p>'],
 'get-country-node-stats':['Statistika čvorova po državi','<p>Vraća ukupni kapacitet i broj čvorova po državi, određenoj iz javne IP adrese (clearnet). Kapacitet je izražen u satoshijima.</p>'],
 'get-isp-nodes':['Čvorovi po pružatelju interneta','<p>Vraća čvorove pružatelja interneta <code>:isp</code>, identificiranog ASN brojem.</p>'],
 'get-isp-node-stats':['Statistika čvorova po pružatelju interneta','<p>Vraća ukupni kapacitet te broj čvorova i kanala po pružatelju interneta. Kapacitet je izražen u satoshijima.</p>'],
 'get-top-100-nodes':['100 vodećih čvorova','<p>Vraća zasebne popise 100 vodećih čvorova prema likvidnosti (ukupnom kapacitetu kanala) i povezanosti (broju otvorenih kanala).</p>'],
 'get-top-100-nodes-liquidity':['100 čvorova s najvećom likvidnošću','<p>Vraća 100 čvorova s najvećom likvidnošću mjerenom ukupnim kapacitetom kanala.</p>'],
 'get-top-100-nodes-connectivity':['100 najpovezanijih čvorova','<p>Vraća 100 najpovezanijih čvorova prema broju otvorenih kanala.</p>'],
 'get-top-100-oldest-nodes':['100 najstarijih čvorova','<p>Vraća 100 najstarijih čvorova.</p>'],
 'get-node-stats':['Statistika čvora','<p>Vraća podatke o čvoru identificiranom javnim ključem <code>:pubKey</code>.</p>'],
 'get-historical-node-stats':['Povijesna statistika čvora','<p>Vraća povijesnu statistiku čvora identificiranog javnim ključem <code>:pubKey</code>.</p>'],
 'get-channel':['Kanal','<p>Vraća podatke o Lightning kanalu s identifikatorom <code>:channelId</code>.</p>'],
 'get-channels-from-txid':['Kanali prema ID-u transakcije','<p>Vraća kanale koji odgovaraju vrijednosti <code>:txid</code>. Može se navesti više ID-ova transakcija.</p>'],
 'get-channels-from-pubkey':['Kanali prema javnom ključu čvora','<p>Vraća kanale čvora identificiranog ključem <code>:pubKey</code>, po 10 na stranici. Za listanje stranica navedite <code>:index</code>. Vrijednost <code>:channelStatus</code> može biti <code>open</code>, <code>active</code> ili <code>closed</code>.</p>'],
 'get-channel-geodata':['Geografski podaci kanala','<p>Vraća popis kanala s geografskim podacima njihovih čvorova.</p>'],
 'get-channel-geodata-node':['Geografski podaci kanala čvora','<p>Vraća kanale i njihove geografske podatke za čvor s javnim ključem <code>:pubKey</code>.</p>'],
};
