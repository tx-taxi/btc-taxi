/** Arabic Lightning FAQ headings and REST reference. */
export const arabicLightningFaqTitles: Record<string, string> = {
 'lightning-explore':'ما الذي يمكنني استكشافه؟', 'lightning-search':'كيف أبحث عن عقدة أو قناة؟',
 'lightning-capacity':'ماذا تعني سعة القناة؟', 'lightning-fees':'ماذا تُظهر رسوم التوجيه؟',
 'lightning-payments':'هل يمكنني رؤية مدفوعات Lightning؟', 'lightning-locations':'من أين تأتي مواقع العقد؟',
 'lightning-status':'ماذا تعني حالة القناة والعقوبات؟', 'lightning-freshness':'ما مدى حداثة إحصاءات الشبكة؟',
 'lightning-bitcoin':'لماذا ترتبط معاملات فتح القنوات وإغلاقها بـ Bitcoin؟',
};
export const arabicLightningFaqCategories: Record<string, string> = { Search:'البحث', Channels:'القنوات', Fees:'الرسوم', Payments:'المدفوعات', Maps:'الخرائط', Statistics:'الإحصاءات' };
export const arabicLightningRestDocs: Record<string, [string, string]> = {
 'get-lightning-network-stats':['إحصاءات الشبكة','<p>يعيد إحصاءات الشبكة، بما فيها أعداد القنوات والعقد والسعة الإجمالية ومتوسط الرسوم ووسيطها.</p><p>يمكن أن تكون قيمة <code>:interval</code> هي <code>latest</code> أو <code>24h</code> أو <code>3d</code> أو <code>1w</code> أو <code>1m</code> أو <code>3m</code> أو <code>6m</code> أو <code>1y</code> أو <code>2y</code> أو <code>3y</code>.</p>'],
 'get-lightning-nodes-channels':['العقد والقنوات','<p>يعيد عقد وقنوات Lightning المطابقة لـ <code>:query</code>. يبحث في أسماء العقد المستعارة ومفاتيحها العامة ومعرّفات القنوات الكاملة والقصيرة دون التمييز بين الأحرف الكبيرة والصغيرة.</p>'],
 'get-lightning-nodes-country':['العقد حسب البلد','<p>يعيد عقد Lightning التي يقع موقعها المستنتج من عنوان IP عام (clearnet) في <code>:country</code>. استخدم رمز البلد المكوّن من حرفين وفق ISO alpha-2.</p>'],
 'get-country-node-stats':['إحصاءات العقد حسب البلد','<p>يعيد السعة الإجمالية وعدد العقد حسب البلد المحدد من عنوان IP عام (clearnet). السعة بوحدة الساتوشي.</p>'],
 'get-isp-nodes':['العقد حسب مزود الخدمة','<p>يعيد عقد مزود الخدمة <code>:isp</code> المحدد برقم ASN.</p>'],
 'get-isp-node-stats':['إحصاءات العقد حسب مزود الخدمة','<p>يعيد السعة الإجمالية وأعداد العقد والقنوات حسب مزود الخدمة. السعة بوحدة الساتوشي.</p>'],
 'get-top-100-nodes':['أفضل 100 عقدة','<p>يعيد قائمتين لأفضل 100 عقدة حسب السيولة (إجمالي سعة القنوات) والاتصال (عدد القنوات المفتوحة).</p>'],
 'get-top-100-nodes-liquidity':['أعلى 100 عقدة سيولة','<p>يعيد أعلى 100 عقدة سيولة، مقاسة بإجمالي سعة القنوات.</p>'],
 'get-top-100-nodes-connectivity':['أكثر 100 عقدة اتصالًا','<p>يعيد أكثر 100 عقدة اتصالًا حسب عدد القنوات المفتوحة.</p>'],
 'get-top-100-oldest-nodes':['أقدم 100 عقدة','<p>يعيد أقدم 100 عقدة.</p>'],
 'get-node-stats':['إحصاءات العقدة','<p>يعيد تفاصيل العقدة المحددة بالمفتاح العام <code>:pubKey</code>.</p>'],
 'get-historical-node-stats':['إحصاءات العقدة التاريخية','<p>يعيد الإحصاءات التاريخية للعقدة المحددة بالمفتاح العام <code>:pubKey</code>.</p>'],
 'get-channel':['القناة','<p>يعيد تفاصيل قناة Lightning المحددة بالمعرّف <code>:channelId</code>.</p>'],
 'get-channels-from-txid':['القنوات حسب معرّف المعاملة','<p>يعيد القنوات المطابقة لـ <code>:txid</code>. يمكن تقديم أكثر من معرّف معاملة.</p>'],
 'get-channels-from-pubkey':['القنوات حسب المفتاح العام للعقدة','<p>يعيد قنوات العقدة المحددة بـ <code>:pubKey</code> بواقع 10 قنوات في الصفحة. استخدم <code>:index</code> لترقيم الصفحات. يمكن أن تكون قيمة <code>:channelStatus</code> هي <code>open</code> أو <code>active</code> أو <code>closed</code>.</p>'],
 'get-channel-geodata':['البيانات الجغرافية للقنوات','<p>يعيد قائمة القنوات مع البيانات الجغرافية لعقدها.</p>'],
 'get-channel-geodata-node':['البيانات الجغرافية لقنوات العقدة','<p>يعيد قنوات العقدة المحددة بالمفتاح العام <code>:pubKey</code> وبياناتها الجغرافية.</p>'],
};
