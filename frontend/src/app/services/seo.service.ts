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
    const spanish = this.locale.startsWith('es');
    const localizedPath = spanish ? (path === '/' ? '/es/' : '/es' + path) : path;
    const canonicalUrl = 'https://' + this.baseDomain + localizedPath;
    if (spanish) this.metaService.updateTag({ name: 'robots', content: path === '/' ? 'index, follow, max-image-preview:large' : 'noindex, follow' });
    document.querySelectorAll('link[rel=alternate][hreflang]').forEach(node => node.remove());
    if (path === '/' && this.metaService.getTag('name=tx-taxi-es-available')?.content === 'true') {
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
    if (this.locale.startsWith('es')) return undefined;
    const page = nativeSeoPages[path];
    if (page) return page;
    const match = path.match(/^\/blocks\/([1-9]\d*)$/);
    if (!match) return undefined;
    const first = nativeSeoPages['/blocks/1'];
    const name = `Bitcoin Blocks — Page ${match[1]}`;
    return { ...first, title: `${name} | btc.tx.taxi`, schema: { ...first.schema, name, url: 'https://' + this.baseDomain + path } };
  }

  getTitle(): string {
    if (this.locale.startsWith('es')) return 'Explorador de Bitcoin | btc.tx.taxi';
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
    return this.locale.startsWith('es') ? 'Explora bloques, transacciones, comisiones y la actividad del mempool de Bitcoin con btc.tx.taxi.' : this.baseDescription;
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
