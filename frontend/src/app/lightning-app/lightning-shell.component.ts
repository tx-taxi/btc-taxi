import { Component, OnInit, OnDestroy, HostListener, Inject, LOCALE_ID, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationStart } from '@angular/router';
import { StateService } from '@app/services/state.service';
import { readSharedPreference } from '@app/services/shared-preferences';
import { localizedNativeUrl, refreshLocalizedCapabilities } from '@app/services/localized-native-url';
import { ThemeService } from '@app/services/theme.service';
import { SeoService } from '@app/services/seo.service';
import { OpenGraphService } from '@app/services/opengraph.service';
import { Subscription, timer, of } from 'rxjs';
import { switchMap, catchError, timeout } from 'rxjs/operators';
import { LightningStatusService } from './lightning-status.service';
@Component({selector:'app-lightning-shell',standalone:false,templateUrl:'./lightning-shell.component.html',styleUrls:['../components/master-page/master-page.component.scss','./lightning-shell.component.scss']})
export class LightningShellComponent implements OnInit, OnDestroy {
  readonly health$ = this.status.health$;
  get es(): boolean { return this.locale.startsWith('es'); }
  get brandLabel(): string {
    const language = this.locale.toLowerCase().split(/[-_]/)[0];
    const back: Record<string, string> = {es:'Volver a tx.taxi', fr:'Retour à tx.taxi', de:'Zurück zu tx.taxi', it:'Torna a tx.taxi', pt:'Voltar a tx.taxi', ru:'Вернуться на tx.taxi', ja:'tx.taxiに戻る', zh:'返回tx.taxi', tr:'tx.taxi’ye dön', nl:'Terug naar tx.taxi', ko:'tx.taxi로 돌아가기', pl:'Wróć do tx.taxi', uk:'Повернутися до tx.taxi', nb:'Tilbake til tx.taxi', sv:'Tillbaka till tx.taxi', cs:'Zpět na tx.taxi', hi:'tx.taxi पर वापस जाएं', da:'Tilbage til tx.taxi'};
    const dashboard: Record<string, string> = {es:'Panel de Lightning', fr:'Tableau de bord Lightning', de:'Lightning-Übersicht', it:'Panoramica Lightning', pt:'Painel Lightning', ru:'Главная Lightning', ja:'Lightningダッシュボード', zh:'Lightning仪表盘', tr:'Lightning ana sayfası', nl:'Lightning-dashboard', ko:'Lightning 대시보드', pl:'Panel Lightning', uk:'Панель Lightning', nb:'Lightning-oversikt', sv:'Lightning-översikt', cs:'Přehled Lightning', hi:'Lightning डैशबोर्ड', da:'Lightning-oversigt'};
    return this.router.url === '/' ? back[language] || 'Back to tx.taxi' : dashboard[language] || 'Lightning dashboard';
  }
  readonly nav = [ {path:'/',icon:'nav-bolt',label:$localize`:@@taxi.lightning.nav.dashboard:Lightning dashboard`,exact:true}, {path:'/nodes/rankings',icon:'nav-database',label:$localize`:@@taxi.lightning.nav.rankings:Node rankings`,exact:false}, {path:'/graphs',icon:'nav-chart-area',label:$localize`:@@taxi.lightning.nav.graphs:Lightning graphs`,exact:false}, {path:'/docs',icon:'nav-book',label:$localize`:@@taxi.lightning.nav.docs:Documentation`,exact:false}, {path:'/about',icon:'nav-info-circle',label:$localize`:@@taxi.lightning.nav.about:About Lightning`,exact:false} ];
  private subscriptions = new Subscription();
  private linksObserver?: MutationObserver;
  private applyingSharedCurrency = false;
  private navigatingHub = false;
  private get explicitLanguage(): string | null {
    const explicit = location.pathname.match(/^\/(en(?:-US)?|es|fr|de|it|pt|ru|ja|zh|tr|nl|ko|pl|uk|nb|sv|cs|hi|da)(?:\/|$)/i)?.[1].toLowerCase();
    return explicit ? (explicit.startsWith('en') ? 'en' : explicit) : null;
  }
  private get language(): string {
    return this.explicitLanguage || readSharedPreference(document, 'txtaxi_language') || 'en';
  }
  get brandHref(): string {
    if (this.router.url !== '/') return !this.explicitLanguage || this.explicitLanguage === 'en' ? '/' : `/${this.explicitLanguage}/`;
    const hub = (this.state.env.TX_TAXI_ROUTER_URL || 'https://tx.taxi').replace(/\/$/, '');
    return localizedNativeUrl(hub + '/', this.language);
  }
  private readonly availableCurrencies = new Set(['USD', 'EUR', 'GBP', 'CAD', 'CHF', 'AUD', 'JPY']);
  private readSharedCurrency(): string | null {
    const pair = document.cookie.split(';').map(part => part.trim()).find(part => part.startsWith('txtaxi_currency='));
    if (!pair) return null;
    try { return decodeURIComponent(pair.slice('txtaxi_currency='.length)); } catch { return null; }
  }
  private syncSharedCurrency(): void {
    const currency = this.readSharedCurrency();
    if (!currency || !this.availableCurrencies.has(currency) || currency === this.state.fiatCurrency$.value) return;
    this.applyingSharedCurrency = true;
    this.state.fiatCurrency$.next(currency);
    try { localStorage.setItem('fiat-preference', currency); } catch {}
    this.applyingSharedCurrency = false;
  }
  private writeSharedCurrency(currency: string): void {
    if (!this.availableCurrencies.has(currency)) return;
    const sharedDomain = location.protocol === 'https:' && (location.hostname === 'tx.taxi' || location.hostname.endsWith('.tx.taxi'));
    document.cookie = `txtaxi_currency=${encodeURIComponent(currency)}; Max-Age=31536000; Path=/; SameSite=Lax${sharedDomain ? '; Domain=.tx.taxi; Secure' : location.protocol === 'https:' ? '; Secure' : ''}`;
  }
  private onVisibility = () => { if (document.visibilityState === 'visible') this.syncSharedCurrency(); };
  constructor(public router:Router,private http:HttpClient,private state:StateService,private theme:ThemeService,private status:LightningStatusService,private seo:SeoService,private opengraph:OpenGraphService,private cdr:ChangeDetectorRef,@Inject(LOCALE_ID) private locale:string) {}
  ngOnInit(): void {
    void refreshLocalizedCapabilities(this.state.env.TX_TAXI_ROUTER_URL || 'https://tx.taxi').then(() => this.cdr.markForCheck());
    this.syncSharedCurrency();
    let initialCurrency = true;
    this.subscriptions.add(this.state.fiatCurrency$.subscribe(currency => {
      if (initialCurrency) { initialCurrency = false; return; }
      if (!this.applyingSharedCurrency) this.writeSharedCurrency(currency);
    }));
    document.addEventListener('visibilitychange', this.onVisibility);
    this.subscriptions.add(this.status.start());
    this.subscriptions.add(this.router.events.subscribe(event => {if(event instanceof NavigationStart)this.status.clearRequests();}));
    this.state.lightning = true; this.state.lightningChanged$.next(true);
    this.state.isLoadingWebSocket$.next(false);
    this.subscriptions.add(timer(0,60000).pipe(switchMap(() => this.http.get<Record<string,number>>('/api/v1/prices').pipe(timeout(10000),catchError(() => of(null))))).subscribe(prices => {if(prices) this.state.conversions$.next(prices);}));
    // Preserve reused on-chain summaries, with their links visibly targeting the Bitcoin explorer.
    const convert = () => document.querySelectorAll<HTMLAnchorElement>('app-lightning-shell a[href]').forEach(anchor => {
      const raw = anchor.getAttribute('href'); if(!raw || !/^\/(?:tx|block|address)\//.test(raw)) return;
      anchor.href = 'https://btc.tx.taxi' + raw;
      anchor.title = anchor.title || $localize`:@@taxi.lightning.nav.bitcoinLink:View on btc.tx.taxi`;
    });
    this.linksObserver = new MutationObserver(convert); this.linksObserver.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['href']}); convert();
    document.addEventListener('click',this.onBitcoinLink,true);
  }
  private onBitcoinLink = (event:MouseEvent) => {
    const anchor = (event.target as Element)?.closest?.('a');
    if(!anchor || new URL(anchor.href,location.origin).origin !== 'https://btc.tx.taxi') return;
    const explicit = location.pathname.match(/^\/(en(?:-US)?|es|fr|de|it|pt|ru|ja|zh|tr|nl|ko|pl|uk|nb|sv|cs|hi|da)(?:\/|$)/i)?.[1].toLowerCase();
    const language = explicit ? (explicit.startsWith('en') ? 'en' : explicit) : readSharedPreference(document, 'txtaxi_language') || 'en';
    anchor.href = localizedNativeUrl(anchor.href, language);
    if(event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
    event.preventDefault(); event.stopImmediatePropagation(); location.assign(anchor.href);
  };
  async brandClick(event:MouseEvent): Promise<void> {
    if(event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); event.stopImmediatePropagation(); const navigate = (window as any).txTaxiLightningNavigate; if(this.router.url !== '/') {if(navigate) navigate('/', {reverse:true,navigate:()=>this.router.navigateByUrl('/')}); else this.router.navigateByUrl('/');return;} const hub = (this.state.env.TX_TAXI_ROUTER_URL || 'https://tx.taxi').replace(/\/$/, ''); if (this.navigatingHub) return; this.navigatingHub = true; if (this.language !== 'en') await refreshLocalizedCapabilities(hub); const hubUrl = localizedNativeUrl(hub + '/', this.language); if(navigate) navigate(hubUrl, {reverse:true}); else location.assign(hubUrl);
  }
  @HostListener('document:keydown',['$event']) onKey(event:KeyboardEvent):void {if(event.key==='/' && !(event.target instanceof HTMLInputElement)){event.preventDefault();this.state.searchFocus$.next(true);}}
  ngOnDestroy():void {this.subscriptions.unsubscribe();this.linksObserver?.disconnect();document.removeEventListener('visibilitychange',this.onVisibility);document.removeEventListener('click',this.onBitcoinLink,true);}
}
