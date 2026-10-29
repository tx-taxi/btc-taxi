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
      const lang = document.documentElement.lang.toLowerCase();
      const metadata = /^(fr|de|it|pt|ru|ja|zh|tr|nl|ko)/.test(lang) ? undefined : lang.startsWith('es') ? window['__env']?.LIGHTNING_PAGE_METADATA_ES?.[path] : window['__env']?.LIGHTNING_PAGE_METADATA?.[path];
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
    const lang = document.documentElement.lang.toLowerCase();
    if (/^(es|fr|de|it|pt|ru|ja|zh|tr|nl|ko)(-|$)/.test(lang)) path = (path || '/').split(/[?#]/, 1)[0] || '/';
    const reviewLocale = /^(fr|de|it|pt|ru|ja|zh|tr|nl|ko)/.test(lang) ? lang.slice(0, 2) : null;
    const prefix = lang.startsWith('es') ? '/es' : reviewLocale ? '/' + reviewLocale : '';
    const canonicalUrl = 'https://' + this.baseDomain + prefix + (path || '/');
    if (reviewLocale) {
      this.metaService.updateTag({name:'robots', content:'noindex, follow'});
      document.querySelectorAll('link[rel=alternate][hreflang]').forEach(node => node.remove());
    }
    this.canonicalLink.setAttribute('href', canonicalUrl);
    this.metaService.updateTag({ property: 'og:url', content: canonicalUrl });
  }

  getTitle(): string { const lang = document.documentElement.lang.toLowerCase(); return lang.startsWith('ko') ? 'Lightning 탐색기 | lightning.btc.tx.taxi' : lang.startsWith('nl') ? 'Lightning-verkenner | lightning.btc.tx.taxi' : lang.startsWith('tr') ? 'Lightning Gezgini | lightning.btc.tx.taxi' : lang.startsWith('zh') ? 'Lightning浏览器 | lightning.btc.tx.taxi' : lang.startsWith('ja') ? 'Lightningエクスプローラー | lightning.btc.tx.taxi' : lang.startsWith('fr') ? 'Explorateur Lightning | lightning.btc.tx.taxi' : lang.startsWith('de') ? 'Lightning-Explorer | lightning.btc.tx.taxi' : lang.startsWith('it') ? 'Esploratore Lightning | lightning.btc.tx.taxi' : lang.startsWith('pt') ? 'Explorador Lightning | lightning.btc.tx.taxi' : lang.startsWith('ru') ? 'Обозреватель Lightning | lightning.btc.tx.taxi' : 'lightning.btc.tx.taxi - Lightning Explorer'; }

  getDescription(): string {
    const lang = document.documentElement.lang.toLowerCase();
    return lang.startsWith('ko') ? 'Lightning 노드, 채널, 라우팅 정책과 네트워크 통계를 살펴보세요.' : lang.startsWith('nl') ? 'Verken Lightning-nodes, kanalen, routeringsbeleid en netwerkstatistieken.' : lang.startsWith('tr') ? 'Lightning düğümlerini, kanallarını, yönlendirme politikalarını ve ağ istatistiklerini keşfedin.' : lang.startsWith('zh') ? '查看Lightning节点、通道、路由策略和网络统计。' : lang.startsWith('ja') ? 'Lightningのノード、チャネル、ルーティングポリシー、ネットワーク統計を調べましょう。' : lang.startsWith('fr') ? 'Explorez les nœuds, canaux, politiques de routage et statistiques du réseau Lightning.' : lang.startsWith('de') ? 'Erkunde Lightning-Knoten, Kanäle, Routing-Richtlinien und Netzwerkstatistiken.' : lang.startsWith('it') ? 'Esplora nodi, canali, politiche di instradamento e statistiche della rete Lightning.' : lang.startsWith('pt') ? 'Explore nós, canais, políticas de encaminhamento e estatísticas da rede Lightning.' : lang.startsWith('ru') ? 'Изучайте узлы, каналы, правила маршрутизации и статистику сети Lightning.' : this.baseDescription;
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
