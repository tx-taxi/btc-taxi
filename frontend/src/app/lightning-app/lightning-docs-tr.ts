/** Turkish Lightning FAQ headings and REST reference. */
export const turkishLightningFaqTitles: Record<string, string> = {
 'lightning-explore':'Neleri inceleyebilirim?', 'lightning-search':'Bir düğümü veya kanalı nasıl bulurum?', 'lightning-capacity':'Kanal kapasitesi ne anlama gelir?',
 'lightning-fees':'Yönlendirme ücretleri neyi gösterir?', 'lightning-payments':'Bir Lightning ödemesini görebilir miyim?', 'lightning-locations':'Düğüm konumları nereden gelir?',
 'lightning-status':'Kanal durumu ve cezalar ne anlama gelir?', 'lightning-freshness':'Ağ istatistikleri ne kadar güncel?', 'lightning-bitcoin':'Açılış ve kapanış işlemleri neden Bitcoin’e bağlanır?',
};
export const turkishLightningFaqCategories: Record<string, string> = { Search:'Arama', Channels:'Kanallar', Fees:'Ücretler', Payments:'Ödemeler', Maps:'Haritalar', Statistics:'İstatistikler' };
export const turkishLightningRestDocs: Record<string, [string, string]> = {
 'get-lightning-network-stats':['Ağ istatistikleri','<p>Toplam kanal ve düğüm sayısı, toplam kapasite ve ortalama ile medyan ücretler gibi ağ genelindeki istatistikleri döndürür.</p><p><code>:interval</code> için <code>latest</code>, <code>24h</code>, <code>3d</code>, <code>1w</code>, <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code> veya <code>3y</code> kullanın.</p>'],
 'get-lightning-nodes-channels':['Düğümler ve kanallar','<p>Metin sorgusu <code>:query</code> ile eşleşen Lightning düğümlerini ve kanallarını döndürür. Düğüm takma adları ve açık anahtarları ile tam ve kısa kanal ID’lerinde büyük/küçük harf ayrımı yapılmadan arama yapılır.</p>'],
 'get-lightning-nodes-country':['Ülkeye göre düğümler','<p>Herkese açık IP adresinden (clearnet) istenen <code>:country</code> içinde konumlandırılan Lightning düğümlerini döndürür. Ülke ISO alfa-2 koduyla belirtilir.</p>'],
 'get-country-node-stats':['Ülkeye göre düğüm istatistikleri','<p>Herkese açık IP adresinden (clearnet) konumlandırılan düğümlerin ülkeye göre toplam kapasitesini ve sayısını döndürür. Kapasiteler satoshi cinsindendir.</p>'],
 'get-isp-nodes':['Sağlayıcıya göre düğümler','<p>ASN ile belirtilen <code>:isp</code> sağlayıcısında barındırılan düğümleri döndürür.</p>'],
 'get-isp-node-stats':['Sağlayıcıya göre düğüm istatistikleri','<p>Sağlayıcıya göre toplam kapasite, düğüm ve kanal sayısını döndürür. Kapasiteler satoshi cinsindendir.</p>'],
 'get-top-100-nodes':['İlk 100 düğüm','<p>İlk 100 düğümden oluşan iki liste döndürür: biri likiditeye (toplam kanal kapasitesi), diğeri bağlantılılığa (açık kanal sayısı) göre sıralanır.</p>'],
 'get-top-100-nodes-liquidity':['Likiditeye göre ilk 100 düğüm','<p>Toplam kanal kapasitesiyle ölçülen likiditeye göre ilk 100 düğümü döndürür.</p>'],
 'get-top-100-nodes-connectivity':['Bağlantılılığa göre ilk 100 düğüm','<p>Açık kanal sayısıyla ölçülen bağlantılılığa göre ilk 100 düğümü döndürür.</p>'],
 'get-top-100-oldest-nodes':['En eski 100 düğüm','<p>En eski 100 düğümü döndürür.</p>'],
 'get-node-stats':['Düğüm istatistikleri','<p>Belirtilen <code>:pubKey</code> açık anahtarına sahip düğümün ayrıntılarını döndürür.</p>'],
 'get-historical-node-stats':['Düğümün geçmiş istatistikleri','<p>Belirtilen <code>:pubKey</code> açık anahtarına sahip düğümün geçmiş istatistiklerini döndürür.</p>'],
 'get-channel':['Kanal','<p>Belirtilen <code>:channelId</code> kimliğine sahip Lightning kanalının bilgilerini döndürür.</p>'],
 'get-channels-from-txid':['İşlem ID’sine göre kanallar','<p>Belirtilen <code>:txid</code> ile ilişkili kanalları döndürür; birden fazla işlem ID’si belirtilebilir.</p>'],
 'get-channels-from-pubkey':['Düğüm açık anahtarına göre kanallar','<p><code>:pubKey</code> ile belirtilen düğümün kanallarını sayfa başına on kanal olarak döndürür; sayfalama için <code>:index</code> kullanın. <code>:channelStatus</code> değeri <code>open</code>, <code>active</code> veya <code>closed</code> olabilir.</p>'],
 'get-channel-geodata':['Kanal coğrafi verileri','<p>Kanalların ve düğümlerinin coğrafi bilgilerinin listesini döndürür.</p>'],
 'get-channel-geodata-node':['Düğüm kanallarının coğrafi verileri','<p>Belirtilen <code>:pubKey</code> açık anahtarına sahip düğümün kanallarını ve coğrafi bilgilerini döndürür.</p>'],
};
