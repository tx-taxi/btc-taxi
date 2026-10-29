/** Hindi Lightning FAQ headings and REST reference. */
export const hindiLightningFaqTitles: Record<string, string> = {
 'lightning-explore':'मैं क्या एक्सप्लोर कर सकता हूं?',
 'lightning-search':'नोड या चैनल कैसे खोजूं?',
 'lightning-capacity':'चैनल क्षमता का क्या अर्थ है?',
 'lightning-fees':'रूटिंग शुल्क क्या दिखाते हैं?',
 'lightning-payments':'क्या मैं Lightning भुगतान देख सकता हूं?',
 'lightning-locations':'नोड के स्थान कहां से आते हैं?',
 'lightning-status':'चैनल की स्थिति और दंड का क्या मतलब है?',
 'lightning-freshness':'नेटवर्क आंकड़े कितने ताज़ा हैं?',
 'lightning-bitcoin':'चैनल खोलने और बंद करने के लेनदेन Bitcoin से क्यों जुड़ते हैं?',
};
export const hindiLightningFaqCategories: Record<string, string> = { Search:'खोज', Channels:'चैनल', Fees:'शुल्क', Payments:'भुगतान', Maps:'मानचित्र', Statistics:'आंकड़े' };
export const hindiLightningRestDocs: Record<string, [string, string]> = {
 'get-lightning-network-stats':['नेटवर्क आंकड़े','<p>पूरे नेटवर्क के आंकड़े लौटाता है, जिनमें चैनल और नोड की संख्या, कुल क्षमता और औसत तथा माध्यिका शुल्क शामिल हैं।</p><p><code>:interval</code> के लिए <code>latest</code>, <code>24h</code>, <code>3d</code>, <code>1w</code>, <code>1m</code>, <code>3m</code>, <code>6m</code>, <code>1y</code>, <code>2y</code> या <code>3y</code> दें।</p>'],
 'get-lightning-nodes-channels':['नोड और चैनल','<p><code>:query</code> से मेल खाने वाले Lightning नोड और चैनल लौटाता है। नोड के उपनाम और सार्वजनिक कुंजियां तथा चैनल की पूरी और छोटी IDs खोजता है; बड़े-छोटे अक्षरों का भेद नहीं करता।</p>'],
 'get-lightning-nodes-country':['देश के अनुसार नोड','<p>वे Lightning नोड लौटाता है जिनका दिए गए <code>:country</code> में स्थान सार्वजनिक IP पते (clearnet) से अनुमानित है। देश दो अक्षरों के ISO alpha-2 कोड से दें।</p>'],
 'get-country-node-stats':['देश के अनुसार नोड आंकड़े','<p>सार्वजनिक IP पते (clearnet) से निर्धारित देश के अनुसार कुल क्षमता और नोड संख्या लौटाता है। क्षमता satoshi में है।</p>'],
 'get-isp-nodes':['प्रदाता के अनुसार नोड','<p>ASN संख्या से पहचाने गए प्रदाता <code>:isp</code> के नोड लौटाता है।</p>'],
 'get-isp-node-stats':['प्रदाता के अनुसार नोड आंकड़े','<p>प्रदाता के अनुसार कुल क्षमता, नोड और चैनल की संख्या लौटाता है। क्षमता satoshi में है।</p>'],
 'get-top-100-nodes':['शीर्ष 100 नोड','<p>लिक्विडिटी (कुल चैनल क्षमता) और कनेक्टिविटी (खुले चैनल की संख्या) के अनुसार शीर्ष 100 नोड की अलग सूचियां लौटाता है।</p>'],
 'get-top-100-nodes-liquidity':['सर्वाधिक लिक्विडिटी वाले 100 नोड','<p>कुल चैनल क्षमता से मापी गई सर्वाधिक लिक्विडिटी वाले 100 नोड लौटाता है।</p>'],
 'get-top-100-nodes-connectivity':['सबसे अधिक जुड़े 100 नोड','<p>खुले चैनलों की संख्या के अनुसार सबसे अधिक जुड़े 100 नोड लौटाता है।</p>'],
 'get-top-100-oldest-nodes':['सबसे पुराने 100 नोड','<p>सबसे पुराने 100 नोड लौटाता है।</p>'],
 'get-node-stats':['नोड आंकड़े','<p>सार्वजनिक कुंजी <code>:pubKey</code> से पहचाने गए नोड का विवरण लौटाता है।</p>'],
 'get-historical-node-stats':['नोड के ऐतिहासिक आंकड़े','<p>सार्वजनिक कुंजी <code>:pubKey</code> से पहचाने गए नोड के ऐतिहासिक आंकड़े लौटाता है।</p>'],
 'get-channel':['चैनल','<p>पहचानकर्ता <code>:channelId</code> वाले Lightning चैनल की जानकारी लौटाता है।</p>'],
 'get-channels-from-txid':['लेनदेन ID से चैनल','<p>दिए गए <code>:txid</code> से मेल खाने वाले चैनल लौटाता है। एक से अधिक लेनदेन IDs दी जा सकती हैं।</p>'],
 'get-channels-from-pubkey':['नोड की सार्वजनिक कुंजी से चैनल','<p><code>:pubKey</code> से पहचाने गए नोड के चैनल प्रति पृष्ठ 10 लौटाता है। पृष्ठांकन के लिए <code>:index</code> दें। <code>:channelStatus</code> का मान <code>open</code>, <code>active</code> या <code>closed</code> हो सकता है।</p>'],
 'get-channel-geodata':['चैनलों का भौगोलिक डेटा','<p>चैनलों की सूची उनके नोड के भौगोलिक डेटा सहित लौटाता है।</p>'],
 'get-channel-geodata-node':['नोड के चैनलों का भौगोलिक डेटा','<p>सार्वजनिक कुंजी <code>:pubKey</code> वाले नोड के चैनल और उनका भौगोलिक डेटा लौटाता है।</p>'],
};
