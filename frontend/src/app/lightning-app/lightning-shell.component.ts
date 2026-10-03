import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationStart } from '@angular/router';
import { StateService } from '@app/services/state.service';
import { ThemeService } from '@app/services/theme.service';
import { Subscription, timer, of } from 'rxjs';
import { switchMap, catchError, timeout } from 'rxjs/operators';
import { LightningStatusService } from './lightning-status.service';
@Component({selector:'app-lightning-shell',standalone:false,templateUrl:'./lightning-shell.component.html',styleUrls:['../components/master-page/master-page.component.scss','./lightning-shell.component.scss']})
export class LightningShellComponent implements OnInit, OnDestroy {
  readonly health$ = this.status.health$;
  readonly nav = [ {path:'/',icon:'nav-bolt',label:'Lightning dashboard',exact:true}, {path:'/nodes/rankings',icon:'nav-database',label:'Node rankings',exact:false}, {path:'/graphs',icon:'nav-chart-area',label:'Lightning graphs',exact:false}, {path:'/docs',icon:'nav-book',label:'Documentation',exact:false}, {path:'/about',icon:'nav-info-circle',label:'About Lightning',exact:false} ];
  private subscriptions = new Subscription();
  private linksObserver?: MutationObserver;
  constructor(public router:Router,private http:HttpClient,private state:StateService,private theme:ThemeService,private status:LightningStatusService) {}
  ngOnInit(): void {
    this.subscriptions.add(this.status.start());
    this.subscriptions.add(this.router.events.subscribe(event => {if(event instanceof NavigationStart)this.status.clearRequests();}));
    this.state.lightning = true; this.state.lightningChanged$.next(true);
    this.state.isLoadingWebSocket$.next(false);
    this.subscriptions.add(timer(0,60000).pipe(switchMap(() => this.http.get<Record<string,number>>('/api/v1/prices').pipe(timeout(10000),catchError(() => of(null))))).subscribe(prices => {if(prices) this.state.conversions$.next(prices);}));
    // Preserve reused on-chain summaries, with their links visibly targeting the Bitcoin explorer.
    const convert = () => document.querySelectorAll<HTMLAnchorElement>('app-lightning-shell a[href]').forEach(anchor => {
      const raw = anchor.getAttribute('href'); if(!raw || !/^\/(?:tx|block|address)\//.test(raw)) return;
      anchor.href = 'https://btc.tx.taxi' + raw;
      anchor.title = anchor.title || 'View on btc.tx.taxi';
    });
    this.linksObserver = new MutationObserver(convert); this.linksObserver.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['href']}); convert();
    document.addEventListener('click',this.onBitcoinLink,true);
  }
  private onBitcoinLink = (event:MouseEvent) => {
    const anchor = (event.target as Element)?.closest?.('a');
    if(!anchor || new URL(anchor.href,location.origin).origin !== 'https://btc.tx.taxi') return;
    if(event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); event.stopImmediatePropagation(); location.assign(anchor.href);
  };
  brandClick(event:MouseEvent): void {
    if(event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); event.stopImmediatePropagation(); const navigate = (window as any).txTaxiLightningNavigate; if(this.router.url !== '/') {if(navigate) navigate('/', {reverse:true,navigate:()=>this.router.navigateByUrl('/')}); else this.router.navigateByUrl('/');return;} const hub = this.state.env.TX_TAXI_ROUTER_URL || 'https://tx.taxi'; if(navigate) navigate(hub + '/', {reverse:true}); else location.assign(hub + '/');
  }
  @HostListener('document:keydown',['$event']) onKey(event:KeyboardEvent):void {if(event.key==='/' && !(event.target instanceof HTMLInputElement)){event.preventDefault();this.state.searchFocus$.next(true);}}
  ngOnDestroy():void {this.subscriptions.unsubscribe();this.linksObserver?.disconnect();document.removeEventListener('click',this.onBitcoinLink,true);}
}
