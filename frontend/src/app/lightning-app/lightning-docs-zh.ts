/** Simplified Chinese Lightning FAQ headings and REST reference. */
export const chineseLightningFaqTitles: Record<string, string> = {
 'lightning-explore':'可以查看哪些信息？','lightning-search':'如何查找节点或通道？','lightning-capacity':'通道容量是什么意思？',
 'lightning-fees':'路由费用显示什么？','lightning-payments':'能看到Lightning支付吗？','lightning-locations':'节点位置从何而来？',
 'lightning-status':'通道状态和惩罚是什么意思？','lightning-freshness':'网络统计数据有多新？','lightning-bitcoin':'为什么开启和关闭交易链接到Bitcoin？',
};
export const chineseLightningFaqCategories: Record<string, string> = { Search:'搜索', Channels:'通道', Fees:'费用', Payments:'支付', Maps:'地图', Statistics:'统计' };
export const chineseLightningRestDocs: Record<string, [string, string]> = {
 'get-lightning-network-stats':['网络统计','<p>返回整个网络的统计数据，包括通道和节点总数、总容量、费用平均值和中位数。</p><p><code>:interval</code>可使用<code>latest</code>、<code>24h</code>、<code>3d</code>、<code>1w</code>、<code>1m</code>、<code>3m</code>、<code>6m</code>、<code>1y</code>、<code>2y</code>或<code>3y</code>。</p>'],
 'get-lightning-nodes-channels':['节点与通道','<p>返回匹配文本查询<code>:query</code>的Lightning节点和通道。搜索节点别名、公钥，以及完整和短通道ID，不区分大小写。</p>'],
 'get-lightning-nodes-country':['按国家查询节点','<p>返回通过公共IP地址（clearnet）定位到指定<code>:country</code>的Lightning节点。国家使用ISO alpha-2代码指定。</p>'],
 'get-country-node-stats':['按国家查询节点统计','<p>返回通过公共IP地址（clearnet）定位的节点按国家汇总的容量和节点数。容量单位为satoshi。</p>'],
 'get-isp-nodes':['按提供商查询节点','<p>返回托管于指定提供商<code>:isp</code>的节点；提供商通过ASN指定。</p>'],
 'get-isp-node-stats':['按提供商查询节点统计','<p>返回各提供商的总容量、节点数和通道数。容量单位为satoshi。</p>'],
 'get-top-100-nodes':['前100个节点','<p>返回两份前100个节点列表，分别按流动性（通道总容量）和连接度（开放通道数量）排序。</p>'],
 'get-top-100-nodes-liquidity':['流动性前100个节点','<p>返回按通道总容量衡量的流动性排名前100的节点。</p>'],
 'get-top-100-nodes-connectivity':['连接度前100个节点','<p>返回按开放通道数量衡量的连接度排名前100的节点。</p>'],
 'get-top-100-oldest-nodes':['最早的100个节点','<p>返回最早的100个节点。</p>'],
 'get-node-stats':['节点统计','<p>返回指定公钥<code>:pubKey</code>的节点详情。</p>'],
 'get-historical-node-stats':['节点历史统计','<p>返回指定公钥<code>:pubKey</code>的节点历史统计数据。</p>'],
 'get-channel':['通道','<p>返回指定标识符<code>:channelId</code>的Lightning通道信息。</p>'],
 'get-channels-from-txid':['按交易ID查询通道','<p>返回与指定<code>:txid</code>对应的通道；可以指定多个交易ID。</p>'],
 'get-channels-from-pubkey':['按节点公钥查询通道','<p>返回由<code>:pubKey</code>指定的节点的通道，每页10个，使用<code>:index</code>分页。<code>:channelStatus</code>可为<code>open</code>、<code>active</code>或<code>closed</code>。</p>'],
 'get-channel-geodata':['通道地理数据','<p>返回通道及其节点地理信息的列表。</p>'],
 'get-channel-geodata-node':['节点通道地理数据','<p>返回指定公钥<code>:pubKey</code>的节点的通道及其地理信息。</p>'],
};
