import { nativeSeoPages } from './native-seo-data';
import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { StateService } from '@app/services/state.service';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  network = '';
  baseTitle = 'btc.tx.taxi';
  baseDescription = 'Explore Bitcoin blocks, transactions, fees, and mempool activity with btc.tx.taxi.';
  baseDomain = 'btc.tx.taxi';

  canonicalLink: HTMLLinkElement = document.getElementById('canonical') as HTMLLinkElement;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private stateService: StateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    // save original meta tags
    try {
      const canonicalUrl = new URL(this.canonicalLink?.href || '');
      this.baseDomain = canonicalUrl?.host;
    } catch (e) {
      // leave as default
    }

    this.stateService.networkChanged$.subscribe((network) => this.network = network);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {route = route.firstChild;}
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      switchMap(route => route.data),
    ).subscribe((data) => {
      this.clearSoft404();
      this.updateCanonical(this.router.url.split('?')[0].split('#')[0]);
    });
  }

  setTitle(newTitle: string): void {
    const fullTitle = this.currentPage()?.title || newTitle + ' - ' + this.getTitle();
    this.titleService.setTitle(fullTitle);
    this.metaService.updateTag({ property: 'og:title', content: fullTitle});
    this.metaService.updateTag({ name: 'twitter:title', content: fullTitle});
    this.metaService.updateTag({ property: 'og:meta:ready', content: 'ready'});
  }

  resetTitle(): void {
    const title = this.currentPage()?.title || this.getTitle();
    this.titleService.setTitle(title);
    this.metaService.updateTag({ property: 'og:title', content: title});
    this.metaService.updateTag({ name: 'twitter:title', content: title});
    this.metaService.updateTag({ property: 'og:meta:ready', content: 'ready'});
  }

  setEnterpriseTitle(title: string, override: boolean = false) {
    if (override) {
      this.baseTitle = title;
    } else {
      this.baseTitle = title + ' - ' + this.baseTitle;
    }
    this.resetTitle();
  }

  setDescription(newDescription: string): void {
    newDescription = this.currentPage()?.description || newDescription;
    this.metaService.updateTag({ name: 'description', content: newDescription});
    this.metaService.updateTag({ name: 'twitter:description', content: newDescription});
    this.metaService.updateTag({ property: 'og:description', content: newDescription});
  }

  resetDescription(): void {
    this.setDescription(this.getDescription());
  }

  updateCanonical(path) {
    // Angular can report an empty URL when returning to a localized root.
    path = path || '/';
    // Location.path() may include query parameters; translated canonicals must identify the page only.
    if (/^(ar|fa|he|fi|da|ca|hr|lt|sl|es|fr|de|it|pt|ru|ja|zh|tr|nl|ko|pl|uk|nb|sv|cs|hi)(-|$)/i.test(this.locale)) path = path.split(/[?#]/, 1)[0] || '/';
    const spanish = this.locale.startsWith('es');
    const reviewLocale = this.locale.startsWith('ar') ? 'ar' : this.locale.startsWith('he') ? 'he' : this.locale.startsWith('fa') ? 'fa' : this.locale.startsWith('sl') ? 'sl' : this.locale.startsWith('lt') ? 'lt' : this.locale.startsWith('hr') ? 'hr' : this.locale.startsWith('ca') ? 'ca' : this.locale.startsWith('fi') ? 'fi' : this.locale.startsWith('da') ? 'da' : this.locale.startsWith('fr') ? 'fr' : this.locale.startsWith('de') ? 'de' : this.locale.startsWith('it') ? 'it' : this.locale.startsWith('pt') ? 'pt' : this.locale.startsWith('ru') ? 'ru' : this.locale.startsWith('ja') ? 'ja' : this.locale.startsWith('zh') ? 'zh' : this.locale.startsWith('tr') ? 'tr' : this.locale.startsWith('nl') ? 'nl' : this.locale.startsWith('ko') ? 'ko' : this.locale.startsWith('pl') ? 'pl' : this.locale.startsWith('uk') ? 'uk' : this.locale.startsWith('nb') ? 'nb' : this.locale.startsWith('sv') ? 'sv' : this.locale.startsWith('cs') ? 'cs' : this.locale.startsWith('hi') ? 'hi' : null;
    const prefix = spanish ? 'es' : reviewLocale;
    const localizedPath = prefix ? (path === '/' ? '/' + prefix + '/' : '/' + prefix + path) : path;
    const canonicalUrl = 'https://' + this.baseDomain + localizedPath;
    if (spanish) this.metaService.updateTag({ name: 'robots', content: path === '/' ? 'index, follow, max-image-preview:large' : 'noindex, follow' });
    if (reviewLocale) this.metaService.updateTag({ name: 'robots', content: 'noindex, follow' });
    document.querySelectorAll('link[rel=alternate][hreflang]').forEach(node => node.remove());
    if (!reviewLocale && path === '/' && this.metaService.getTag('name=tx-taxi-es-available')?.content === 'true') {
      [['en', '/'], ['es', '/es/'], ['x-default', '/']].forEach(([language, url]) => {
        const link = document.createElement('link');
        link.rel = 'alternate'; link.hreflang = language; link.href = 'https://' + this.baseDomain + url;
        document.head.appendChild(link);
      });
    }
    this.canonicalLink.setAttribute('href', canonicalUrl);
    this.metaService.updateTag({ property: 'og:url', content: canonicalUrl });
    document.querySelectorAll('script[type="application/ld+json"], link[rel="alternate"][type="text/markdown"]').forEach(node => node.remove());
    const page = this.currentPage(path);
    if (page) {
      this.titleService.setTitle(page.title);
      this.metaService.updateTag({ property: 'og:title', content: page.title });
      this.metaService.updateTag({ name: 'twitter:title', content: page.title });
      this.setDescription(page.description);
      const schema = document.createElement('script');
      schema.type = 'application/ld+json';
      schema.textContent = JSON.stringify(page.schema);
      document.head.appendChild(schema);
      const alternate = document.createElement('link');
      alternate.rel = 'alternate';
      alternate.type = 'text/markdown';
      alternate.href = 'https://' + this.baseDomain + (path === '/' ? '/index.md' : path + '.md');
      document.head.appendChild(alternate);
    }
  }

  private currentPage(path = this.router.url.split('?')[0].split('#')[0]) {
    if (/^(ar|fa|he|fi|da|ca|hr|lt|sl|es|fr|de|it|pt|ru|ja|zh|tr|nl|ko|pl|uk|nb|sv|cs|hi)/.test(this.locale)) return undefined;
    const page = nativeSeoPages[path];
    if (page) return page;
    const match = path.match(/^\/blocks\/([1-9]\d*)$/);
    if (!match) return undefined;
    const first = nativeSeoPages['/blocks/1'];
    const name = `Bitcoin Blocks — Page ${match[1]}`;
    return { ...first, title: `${name} | btc.tx.taxi`, schema: { ...first.schema, name, url: 'https://' + this.baseDomain + path } };
  }

  getTitle(): string {
    if (this.locale.startsWith('ar')) return 'مستكشف Bitcoin | btc.tx.taxi';
    if (this.locale.startsWith('he')) return 'סייר Bitcoin | btc.tx.taxi';
    if (this.locale.startsWith('fa')) return 'کاوشگر بیت‌کوین | btc.tx.taxi';
    if (this.locale.startsWith('sl')) return 'Raziskovalec Bitcoin | btc.tx.taxi';
    if (this.locale.startsWith('lt')) return 'Bitcoin naršyklė | btc.tx.taxi';
    if (this.locale.startsWith('hr')) return 'Bitcoin preglednik | btc.tx.taxi';
    if (this.locale.startsWith('ca')) return 'Explorador de Bitcoin | btc.tx.taxi';
    if (this.locale.startsWith('fi')) return 'Bitcoin-lohkoselain | btc.tx.taxi';
    if (this.locale.startsWith('es')) return 'Explorador de Bitcoin | btc.tx.taxi';
    if (this.locale.startsWith('fr')) return 'Explorateur Bitcoin | btc.tx.taxi';
    if (this.locale.startsWith('de')) return 'Bitcoin-Explorer | btc.tx.taxi';
    if (this.locale.startsWith('it')) return 'Esploratore Bitcoin | btc.tx.taxi';
    if (this.locale.startsWith('pt')) return 'Explorador Bitcoin | btc.tx.taxi';
    if (this.locale.startsWith('da')) return 'Bitcoin-udforsker | btc.tx.taxi';
    if (this.locale.startsWith('hi')) return 'Bitcoin एक्सप्लोरर | btc.tx.taxi';
    if (this.locale.startsWith('cs')) return 'Průzkumník Bitcoin | btc.tx.taxi';
    if (this.locale.startsWith('sv')) return 'Bitcoin-utforskare | btc.tx.taxi';
    if (this.locale.startsWith('nb')) return 'Bitcoin-utforsker | btc.tx.taxi';
    if (this.locale.startsWith('uk')) return 'Оглядач Bitcoin | btc.tx.taxi';
    if (this.locale.startsWith('pl')) return 'Eksplorator Bitcoin | btc.tx.taxi';
    if (this.locale.startsWith('ko')) return 'Bitcoin 탐색기 | btc.tx.taxi';
    if (this.locale.startsWith('nl')) return 'Bitcoin-verkenner | btc.tx.taxi';
    if (this.locale.startsWith('tr')) return 'Bitcoin Gezgini | btc.tx.taxi';
    if (this.locale.startsWith('zh')) return 'Bitcoin浏览器 | btc.tx.taxi';
    if (this.locale.startsWith('ja')) return 'Bitcoinエクスプローラー | btc.tx.taxi';
    if (this.locale.startsWith('ru')) return 'Обозреватель Bitcoin | btc.tx.taxi';
    if (this.network === 'testnet')
      {return this.baseTitle + ' - Bitcoin Testnet3';}
    if (this.network === 'testnet4')
      {return this.baseTitle + ' - Bitcoin Testnet4';}
    if (this.network === 'signet')
      {return this.baseTitle + ' - Bitcoin Signet';}
    if (this.network === 'liquid')
      {return this.baseTitle + ' - Liquid Network';}
    if (this.network === 'liquidtestnet')
      {return this.baseTitle + ' - Liquid Testnet';}
    return this.baseTitle + ' - ' + (this.network ? this.ucfirst(this.network) : 'Bitcoin') + ' Explorer';
  }

  getDescription(): string {
    if (this.locale.startsWith('ar')) return 'استكشف كتل Bitcoin ومعاملاتها ورسومها ونشاط مجمع المعاملات على btc.tx.taxi.';
    if (this.locale.startsWith('he')) return 'גלו בלוקים, עסקאות, עמלות ופעילות במאגר העסקאות הממתינות של Bitcoin ב־btc.tx.taxi.';
    if (this.locale.startsWith('fa')) return 'بلوک‌ها، تراکنش‌ها، کارمزدها و فعالیت ممپول بیت‌کوین را در btc.tx.taxi بررسی کنید.';
    if (this.locale.startsWith('sl')) return 'Raziščite bloke, transakcije, pristojbine in dejavnost mempoola Bitcoin na btc.tx.taxi.';
    if (this.locale.startsWith('lt')) return 'Naršykite Bitcoin blokus, sandorius, mokesčius ir mempool veiklą svetainėje btc.tx.taxi.';
    if (this.locale.startsWith('hr')) return 'Istražite Bitcoin blokove, transakcije, naknade i aktivnost mempoola na btc.tx.taxi.';
    if (this.locale.startsWith('ca')) return 'Explora blocs, transaccions, comissions i l’activitat del mempool de Bitcoin a btc.tx.taxi.';
    if (this.locale.startsWith('fi')) return 'Tutustu Bitcoin-lohkoihin, transaktioihin, maksuihin ja mempoolin toimintaan osoitteessa btc.tx.taxi.';
    return this.locale.startsWith('da') ? 'Udforsk Bitcoin-blokke, transaktioner, gebyrer og mempoolaktivitet på btc.tx.taxi.' : this.locale.startsWith('hi') ? 'btc.tx.taxi पर Bitcoin ब्लॉक, लेनदेन, शुल्क और मेमपूल गतिविधि देखें।' : this.locale.startsWith('cs') ? 'Prozkoumejte bloky, transakce, poplatky a aktivitu mempoolu Bitcoinu na btc.tx.taxi.' : this.locale.startsWith('sv') ? 'Utforska Bitcoin-block, transaktioner, avgifter och mempoolaktivitet med btc.tx.taxi.' : this.locale.startsWith('nb') ? 'Utforsk Bitcoin-blokker, transaksjoner, gebyrer og mempoolaktivitet med btc.tx.taxi.' : this.locale.startsWith('uk') ? 'Переглядайте блоки, транзакції, комісії та активність мемпулу Bitcoin на btc.tx.taxi.' : this.locale.startsWith('pl') ? 'Przeglądaj bloki, transakcje, opłaty i aktywność mempoola Bitcoin w btc.tx.taxi.' : this.locale.startsWith('ko') ? 'btc.tx.taxi에서 Bitcoin 블록, 거래, 수수료와 멤풀 활동을 살펴보세요.' : this.locale.startsWith('es') ? 'Explora bloques, transacciones, comisiones y la actividad del mempool de Bitcoin con btc.tx.taxi.' : this.locale.startsWith('fr') ? 'Explorez les blocs, transactions, frais et activités du mempool Bitcoin avec btc.tx.taxi.' : this.locale.startsWith('de') ? 'Erkunde Bitcoin-Blöcke, Transaktionen, Gebühren und die Mempool-Aktivität mit btc.tx.taxi.' : this.locale.startsWith('it') ? 'Esplora blocchi, transazioni, commissioni e attività del mempool Bitcoin con btc.tx.taxi.' : this.locale.startsWith('pt') ? 'Explore blocos, transações, taxas e a atividade da mempool Bitcoin com btc.tx.taxi.' : this.locale.startsWith('nl') ? 'Verken Bitcoin-blokken, transacties, kosten en mempoolactiviteit met btc.tx.taxi.' : this.locale.startsWith('tr') ? 'btc.tx.taxi ile Bitcoin bloklarını, işlemleri, ücretleri ve mempool etkinliğini keşfedin.' : this.locale.startsWith('zh') ? '通过btc.tx.taxi查看Bitcoin区块、交易、费用和内存池动态。' : this.locale.startsWith('ja') ? 'btc.tx.taxiでBitcoinのブロック、トランザクション、手数料、メンプールの動きを調べましょう。' : this.locale.startsWith('ru') ? 'Изучайте блоки, транзакции, комиссии и активность мемпула Bitcoin на btc.tx.taxi.' : this.baseDescription;
  }

  ucfirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  clearSoft404() {
    window['soft404'] = false;
  }

  logSoft404() {
    window['soft404'] = true;
  }
}
