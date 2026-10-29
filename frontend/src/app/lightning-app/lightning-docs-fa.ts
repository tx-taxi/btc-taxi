/** Persian Lightning FAQ headings and REST reference. */
export const persianLightningFaqTitles: Record<string, string> = {
 'lightning-explore':'چه چیزهایی را می‌توانم بررسی کنم؟', 'lightning-search':'چگونه گره یا کانال را جست‌وجو کنم؟', 'lightning-capacity':'ظرفیت کانال به چه معناست؟', 'lightning-fees':'کارمزدهای مسیریابی چه چیزی نشان می‌دهند؟', 'lightning-payments':'آیا می‌توانم پرداخت‌های Lightning را ببینم؟', 'lightning-locations':'موقعیت گره‌ها از کجا می‌آید؟', 'lightning-status':'وضعیت کانال و جریمه‌ها به چه معنا هستند؟', 'lightning-freshness':'آمار شبکه چقدر به‌روز است؟', 'lightning-bitcoin':'چرا تراکنش‌های باز و بسته‌کردن کانال به Bitcoin پیوند دارند؟',
};
export const persianLightningFaqCategories: Record<string, string> = { Search:'جست‌وجو', Channels:'کانال‌ها', Fees:'کارمزدها', Payments:'پرداخت‌ها', Maps:'نقشه‌ها', Statistics:'آمار' };
export const persianLightningRestDocs: Record<string, [string, string]> = {
 'get-lightning-network-stats':['آمار شبکه','<p>آمار شبکه، شامل تعداد کانال‌ها و گره‌ها، ظرفیت کل، میانگین و میانهٔ کارمزدها را برمی‌گرداند.</p><p>برای <code>:interval</code> از <code>latest</code>، <code>24h</code>، <code>3d</code>، <code>1w</code>، <code>1m</code>، <code>3m</code>، <code>6m</code>، <code>1y</code>، <code>2y</code> یا <code>3y</code> استفاده کنید.</p>'],
 'get-lightning-nodes-channels':['گره‌ها و کانال‌ها','<p>گره‌ها و کانال‌های Lightning مطابق با <code>:query</code> را برمی‌گرداند. جست‌وجوی تمام‌متن نام مستعار و کلید عمومی گره و شناسهٔ کامل و کوتاه کانال را بدون حساسیت به بزرگی و کوچکی حروف بررسی می‌کند.</p>'],
 'get-lightning-nodes-country':['گره‌ها بر اساس کشور','<p>گره‌های Lightning را برمی‌گرداند که موقعیت تخمینی آن‌ها از نشانی IP عمومی (clearnet) در <code>:country</code> قرار دارد. از کد دوحرفی کشور ISO alpha-2 استفاده کنید.</p>'],
 'get-country-node-stats':['آمار گره بر اساس کشور','<p>ظرفیت کل و تعداد گره‌ها را بر اساس کشور تعیین‌شده از نشانی IP عمومی (clearnet) برمی‌گرداند. ظرفیت بر حسب ساتوشی است.</p>'],
 'get-isp-nodes':['گره‌ها بر اساس ارائه‌دهنده','<p>گره‌های ارائه‌دهندهٔ <code>:isp</code> شناسایی‌شده با شمارهٔ ASN را برمی‌گرداند.</p>'],
 'get-isp-node-stats':['آمار گره بر اساس ارائه‌دهنده','<p>ظرفیت کل و تعداد گره‌ها و کانال‌ها را بر اساس ارائه‌دهنده برمی‌گرداند. ظرفیت بر حسب ساتوشی است.</p>'],
 'get-top-100-nodes':['۱۰۰ گرهٔ برتر','<p>فهرست‌های جداگانهٔ ۱۰۰ گرهٔ برتر بر اساس نقدینگی (ظرفیت کل کانال‌ها) و اتصال (تعداد کانال‌های باز) را برمی‌گرداند.</p>'],
 'get-top-100-nodes-liquidity':['۱۰۰ گرهٔ برتر از نظر نقدینگی','<p>۱۰۰ گره با بیشترین نقدینگی، اندازه‌گیری‌شده با ظرفیت کل کانال‌ها، را برمی‌گرداند.</p>'],
 'get-top-100-nodes-connectivity':['۱۰۰ گرهٔ برتر از نظر اتصال','<p>۱۰۰ گره با بیشترین اتصال بر اساس تعداد کانال‌های باز را برمی‌گرداند.</p>'],
 'get-top-100-oldest-nodes':['۱۰۰ گرهٔ قدیمی‌تر','<p>۱۰۰ گرهٔ قدیمی‌تر را برمی‌گرداند.</p>'],
 'get-node-stats':['آمار گره','<p>جزئیات گرهٔ شناسایی‌شده با کلید عمومی <code>:pubKey</code> را برمی‌گرداند.</p>'],
 'get-historical-node-stats':['آمار تاریخی گره','<p>آمار تاریخی گرهٔ شناسایی‌شده با کلید عمومی <code>:pubKey</code> را برمی‌گرداند.</p>'],
 'get-channel':['کانال','<p>جزئیات کانال Lightning با شناسهٔ <code>:channelId</code> را برمی‌گرداند.</p>'],
 'get-channels-from-txid':['کانال‌ها بر اساس شناسهٔ تراکنش','<p>کانال‌های مطابق با <code>:txid</code> را برمی‌گرداند. می‌توان بیش از یک شناسهٔ تراکنش ارائه کرد.</p>'],
 'get-channels-from-pubkey':['کانال‌ها بر اساس کلید عمومی گره','<p>کانال‌های گرهٔ شناسایی‌شده با <code>:pubKey</code> را با ۱۰ کانال در هر صفحه برمی‌گرداند. برای صفحه‌بندی از <code>:index</code> استفاده کنید. مقدار <code>:channelStatus</code> می‌تواند <code>open</code>، <code>active</code> یا <code>closed</code> باشد.</p>'],
 'get-channel-geodata':['داده‌های جغرافیایی کانال‌ها','<p>فهرست کانال‌ها را همراه داده‌های جغرافیایی گره‌هایشان برمی‌گرداند.</p>'],
 'get-channel-geodata-node':['داده‌های جغرافیایی کانال‌های گره','<p>کانال‌های گره با کلید عمومی <code>:pubKey</code> و داده‌های جغرافیایی آن‌ها را برمی‌گرداند.</p>'],
};
