import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { StateService } from '@app/services/state.service';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  network = '';
  baseTitle = 'lightning.btc.tx.taxi';
  baseDescription = 'Get stats on the Lightning network (aggregate capacity, connectivity, etc), Lightning nodes (channels, liquidity, etc) and Lightning channels (status, fees, etc).';
  baseDomain = 'lightning.btc.tx.taxi';

  canonicalLink: HTMLLinkElement = document.getElementById('canonical') as HTMLLinkElement;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private stateService: StateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
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
      const path = this.router.url.split('?')[0].split('#')[0];
      this.updateCanonical(path);
      const metadata = window['__env']?.LIGHTNING_PAGE_METADATA?.[path];
      if (metadata?.title && metadata?.description) {
        this.titleService.setTitle(metadata.title);
        this.metaService.updateTag({ property: 'og:title', content: metadata.title });
        this.metaService.updateTag({ name: 'twitter:title', content: metadata.title });
        this.setDescription(metadata.description);
        this.metaService.updateTag({ property: 'og:meta:ready', content: 'ready' });
      }
    });
  }

  setTitle(newTitle: string): void {
    const fullTitle = !newTitle || newTitle === 'Lightning Explorer' || newTitle === this.getTitle() ? this.getTitle() : newTitle + ' · ' + this.getTitle();
    this.titleService.setTitle(fullTitle);
    this.metaService.updateTag({ property: 'og:title', content: fullTitle});
    this.metaService.updateTag({ name: 'twitter:title', content: fullTitle});
    this.metaService.updateTag({ property: 'og:meta:ready', content: 'ready'});
  }

  resetTitle(): void {
    this.titleService.setTitle(this.getTitle());
    this.metaService.updateTag({ property: 'og:title', content: this.getTitle()});
    this.metaService.updateTag({ name: 'twitter:title', content: this.getTitle()});
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
    this.metaService.updateTag({ name: 'description', content: newDescription});
    this.metaService.updateTag({ name: 'twitter:description', content: newDescription});
    this.metaService.updateTag({ property: 'og:description', content: newDescription});
  }

  resetDescription(): void {
    this.metaService.updateTag({ name: 'description', content: this.getDescription()});
    this.metaService.updateTag({ name: 'twitter:description', content: this.getDescription()});
    this.metaService.updateTag({ property: 'og:description', content: this.getDescription()});
  }

  updateCanonical(path) {
    const canonicalUrl = 'https://' + this.baseDomain + path;
    this.canonicalLink.setAttribute('href', canonicalUrl);
    this.metaService.updateTag({ property: 'og:url', content: canonicalUrl });
  }

  getTitle(): string { return 'lightning.btc.tx.taxi - Lightning Explorer'; }

  getDescription(): string {
    return this.baseDescription;
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
