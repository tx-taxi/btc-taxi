/** Danish Lightning FAQ headings and REST reference. */
export const danishLightningFaqTitles: Record<string, string> = {
 'lightning-explore':'Hvad kan jeg udforske?', 'lightning-search':'Hvordan søger jeg efter en node eller kanal?', 'lightning-capacity':'Hvad betyder en kanals kapacitet?', 'lightning-fees':'Hvad viser routinggebyrer?', 'lightning-payments':'Kan jeg se Lightning-betalinger?', 'lightning-locations':'Hvor kommer nodernes placeringer fra?', 'lightning-status':'Hvad betyder kanalstatus og straftransaktioner?', 'lightning-freshness':'Hvor aktuelle er netværksstatistikkerne?', 'lightning-bitcoin':'Hvorfor linker kanalåbnings- og lukningstransaktioner til Bitcoin?',
};
export const danishLightningFaqCategories: Record<string, string> = { Search:'Søgning', Channels:'Kanaler', Fees:'Gebyrer', Payments:'Betalinger', Maps:'Kort', Statistics:'Statistik' };
export const danishLightningRestDocs: Record<string, [string, string]> = {
 'get-lightning-network-stats':['Netværksstatistik','<p>Returnerer netværksstatistik, herunder antal kanaler og noder, samlet kapacitet samt gennemsnitlige gebyrer og mediangebyrer.</p><p>For <code>:interval</code> bruges <code>latest</code>, <code>24h</code>, <code>3d</code>, <code>1w</code>, <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code> eller <code>3y</code>.</p>'],
 'get-lightning-nodes-channels':['Noder og kanaler','<p>Returnerer Lightning-noder og -kanaler, som matcher <code>:query</code>. Fuldtekstsøgningen omfatter nodealiaser og offentlige nøgler samt hele og korte kanal-id’er og skelner ikke mellem store og små bogstaver.</p>'],
 'get-lightning-nodes-country':['Noder efter land','<p>Returnerer Lightning-noder, hvis placering udledt af en offentlig IP-adresse (clearnet) er i <code>:country</code>. Brug en ISO alpha-2-landekode på to bogstaver.</p>'],
 'get-country-node-stats':['Nodestatistik efter land','<p>Returnerer samlet kapacitet og antal noder efter land fastlagt ud fra offentlig IP-adresse (clearnet). Kapaciteten er i satoshier.</p>'],
 'get-isp-nodes':['Noder efter udbyder','<p>Returnerer noder for udbyderen <code>:isp</code>, identificeret ved ASN-nummer.</p>'],
 'get-isp-node-stats':['Nodestatistik efter udbyder','<p>Returnerer samlet kapacitet samt antal noder og kanaler efter udbyder. Kapaciteten er i satoshier.</p>'],
 'get-top-100-nodes':['Top 100 noder','<p>Returnerer separate top 100-lister efter likviditet (samlet kanalkapacitet) og forbindelse (antal åbne kanaler).</p>'],
 'get-top-100-nodes-liquidity':['Top 100 noder efter likviditet','<p>Returnerer de 100 noder med størst likviditet målt som samlet kanalkapacitet.</p>'],
 'get-top-100-nodes-connectivity':['Top 100 noder efter forbindelse','<p>Returnerer de 100 mest forbundne noder efter antal åbne kanaler.</p>'],
 'get-top-100-oldest-nodes':['De 100 ældste noder','<p>Returnerer de 100 ældste noder.</p>'],
 'get-node-stats':['Nodestatistik','<p>Returnerer oplysninger om noden identificeret ved den offentlige nøgle <code>:pubKey</code>.</p>'],
 'get-historical-node-stats':['Historisk nodestatistik','<p>Returnerer historisk statistik for noden identificeret ved den offentlige nøgle <code>:pubKey</code>.</p>'],
 'get-channel':['Kanal','<p>Returnerer oplysninger om Lightning-kanalen med identifikatoren <code>:channelId</code>.</p>'],
 'get-channels-from-txid':['Kanaler efter transaktions-id','<p>Returnerer kanaler, der matcher <code>:txid</code>. Flere transaktions-id’er kan angives.</p>'],
 'get-channels-from-pubkey':['Kanaler efter nodens offentlige nøgle','<p>Returnerer kanaler for noden identificeret ved <code>:pubKey</code>, 10 pr. side. Angiv <code>:index</code> til sideinddeling. <code>:channelStatus</code> kan være <code>open</code>, <code>active</code> eller <code>closed</code>.</p>'],
 'get-channel-geodata':['Geodata for kanaler','<p>Returnerer en liste over kanaler med deres noders geodata.</p>'],
 'get-channel-geodata-node':['Geodata for en nodes kanaler','<p>Returnerer kanaler og deres geodata for noden med den offentlige nøgle <code>:pubKey</code>.</p>'],
};
