import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { LightningStatusService } from './lightning-status.service';

@Directive({selector:'[lightningRequestState]',standalone:false})
export class LightningRequestStateDirective implements OnInit,OnChanges,OnDestroy {
  @Input() lightningRequestState:string[] = [];
  private subscription?:Subscription;
  private badge?:HTMLElement;
  private originalPosition?:string;
  constructor(private host:ElementRef<HTMLElement>,private renderer:Renderer2,private status:LightningStatusService) {}
  ngOnInit():void {
    const element=this.host.nativeElement;
    this.originalPosition=element.style.position;
    if(getComputedStyle(element).position === 'static') this.renderer.setStyle(element,'position','relative');
    this.badge=this.renderer.createElement('span');
    this.renderer.setAttribute(this.badge,'class','badge bg-warning');
    this.renderer.setAttribute(this.badge,'role','status');
    for(const [name,value] of Object.entries({position:'absolute',right:'8px',top:'8px','z-index':'2',color:'#111214','font-size':'15px',padding:'3.75px 6px',display:'none'}))this.renderer.setStyle(this.badge,name,value);
    this.renderer.appendChild(element,this.badge);
    this.subscription=this.status.requests$.subscribe(()=>this.render());
  }
  ngOnChanges():void {this.render();}
  private render():void {
    if(!this.badge)return;
    const states=Object.entries(this.status.requests$.value).filter(([url])=>this.lightningRequestState.some(pattern=>new RegExp(pattern).test(url))).map(([,state])=>state);
    const unavailable=states.find(state=>state.state==='offline');
    const stale=states.find(state=>state.state==='stale');
    const state=unavailable||stale;
    this.renderer.setStyle(this.badge,'display',state?'inline-block':'none');
    this.badge.textContent=unavailable?'Reconnecting…':stale?.sourceUpdatedAt?'Cached data · '+new Date(stale.sourceUpdatedAt).toLocaleDateString('en',{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}):'Cached data';
  }
  ngOnDestroy():void {this.subscription?.unsubscribe();if(this.badge)this.renderer.removeChild(this.host.nativeElement,this.badge);this.host.nativeElement.style.position=this.originalPosition||'';}
}
