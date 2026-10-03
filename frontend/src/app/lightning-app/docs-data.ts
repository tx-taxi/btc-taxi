import { restApiDocsData } from '@app/docs/api-docs/api-docs-data';
export const lightningRestDocs = restApiDocsData.filter(item => item.category === 'lightning');
export const lightningFaq = [
 { type:'category', title:'Lightning network', category:'lightning',showConditions:[''] },
 { type:'faq', title:'What can I explore?', fragment:'lightning-explore', category:'Lightning',showConditions:[''] },
 { type:'faq', title:'How do I find a node or channel?', fragment:'lightning-search', category:'Search',showConditions:[''] },
 { type:'faq', title:'What does channel capacity mean?', fragment:'lightning-capacity', category:'Channels',showConditions:[''] },
 { type:'faq', title:'What do routing fees show?', fragment:'lightning-fees', category:'Fees',showConditions:[''] },
 { type:'faq', title:'Can I see a Lightning payment?', fragment:'lightning-payments', category:'Payments',showConditions:[''] },
 { type:'faq', title:'Where do node locations come from?', fragment:'lightning-locations', category:'Maps',showConditions:[''] },
 { type:'faq', title:'What do channel status and penalties mean?', fragment:'lightning-status', category:'Channels',showConditions:[''] },
 { type:'faq', title:'How current are network statistics?', fragment:'lightning-freshness', category:'Statistics',showConditions:[''] },
 { type:'faq', title:'Why do opening and closing transactions link to Bitcoin?', fragment:'lightning-bitcoin', category:'Bitcoin',showConditions:[''] },
];
