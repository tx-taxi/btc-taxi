/** Japanese Lightning FAQ headings and REST reference. */
export const japaneseLightningFaqTitles: Record<string, string> = {
 'lightning-explore':'何を調べられますか？',
 'lightning-search':'ノードやチャネルを検索するには？',
 'lightning-capacity':'チャネル容量とは？',
 'lightning-fees':'ルーティング手数料は何を示しますか？',
 'lightning-payments':'Lightningの支払いは見られますか？',
 'lightning-locations':'ノードの所在地はどのように決まりますか？',
 'lightning-status':'チャネルの状態とペナルティとは？',
 'lightning-freshness':'ネットワーク統計はいつのデータですか？',
 'lightning-bitcoin':'開設・閉鎖トランザクションがBitcoinにリンクするのはなぜですか？',
};
export const japaneseLightningFaqCategories: Record<string, string> = { Search:'検索', Channels:'チャネル', Fees:'手数料', Payments:'支払い', Maps:'地図', Statistics:'統計' };
export const japaneseLightningRestDocs: Record<string, [string, string]> = {
 'get-lightning-network-stats':['ネットワーク統計','<p>チャネル数、ノード数、総容量、手数料の平均値と中央値など、ネットワーク全体の統計を返します。</p><p><code>:interval</code>には<code>latest</code>、<code>24h</code>、<code>3d</code>、<code>1w</code>、<code>1m</code>、<code>3m</code>、<code>6m</code>、<code>1y</code>、<code>2y</code>、<code>3y</code>を指定できます。</p>'],
 'get-lightning-nodes-channels':['ノードとチャネル','<p><code>:query</code>に一致するLightningノードとチャネルを返します。ノードのエイリアスと公開鍵、完全・短縮チャネルIDを大文字と小文字を区別せず検索します。</p>'],
 'get-lightning-nodes-country':['国別ノード','<p>公開IPアドレス（clearnet）から、指定された<code>:country</code>に位置すると推定されるLightningノードを返します。国はISOアルファ2コードで指定します。</p>'],
 'get-country-node-stats':['国別ノード統計','<p>公開IPアドレス（clearnet）から位置を推定したノードの、国ごとの合計容量とノード数を返します。容量の単位はsatoshiです。</p>'],
 'get-isp-nodes':['プロバイダー別ノード','<p>ASNで指定されたプロバイダー<code>:isp</code>上のノードを返します。</p>'],
 'get-isp-node-stats':['プロバイダー別ノード統計','<p>プロバイダーごとの合計容量、ノード数、チャネル数を返します。容量の単位はsatoshiです。</p>'],
 'get-top-100-nodes':['上位100ノード','<p>流動性（チャネル容量の合計）順と接続性（開いているチャネル数）順の上位100ノードをそれぞれ返します。</p>'],
 'get-top-100-nodes-liquidity':['流動性上位100ノード','<p>チャネル容量の合計で測った流動性の上位100ノードを返します。</p>'],
 'get-top-100-nodes-connectivity':['接続性上位100ノード','<p>開いているチャネル数で測った接続性の上位100ノードを返します。</p>'],
 'get-top-100-oldest-nodes':['最も古い100ノード','<p>最も古い100ノードを返します。</p>'],
 'get-node-stats':['ノード統計','<p>公開鍵<code>:pubKey</code>で指定されたノードの詳細を返します。</p>'],
 'get-historical-node-stats':['ノードの統計履歴','<p>公開鍵<code>:pubKey</code>で指定されたノードの過去の統計を返します。</p>'],
 'get-channel':['チャネル','<p>識別子<code>:channelId</code>で指定されたLightningチャネルの情報を返します。</p>'],
 'get-channels-from-txid':['トランザクションIDからチャネルを取得','<p>指定された<code>:txid</code>に対応するチャネルを返します。複数のトランザクションIDを指定できます。</p>'],
 'get-channels-from-pubkey':['ノードの公開鍵からチャネルを取得','<p><code>:pubKey</code>で指定されたノードのチャネルを1ページ10件で返します。ページの指定には<code>:index</code>を使用します。<code>:channelStatus</code>には<code>open</code>、<code>active</code>、<code>closed</code>を指定できます。</p>'],
 'get-channel-geodata':['チャネルの位置情報','<p>チャネルとそのノードの位置情報の一覧を返します。</p>'],
 'get-channel-geodata-node':['ノードのチャネル位置情報','<p>公開鍵<code>:pubKey</code>で指定されたノードのチャネルと位置情報を返します。</p>'],
};
