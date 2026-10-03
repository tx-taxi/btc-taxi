import { TxTaxiDocsIntroComponent } from '@app/shared/components/tx-taxi-docs-intro/tx-taxi-docs-intro.component';
import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Env, StateService } from '@app/services/state.service';
import { WebsocketService } from '@app/services/websocket.service';
import { SeoService } from '@app/services/seo.service';
import { OpenGraphService } from '@app/services/opengraph.service';

@Component({
  selector: 'app-docs',
  templateUrl: '../../lightning-app/docs.component.html',
  styleUrls: ['./docs.component.scss'],
  standalone: false,
})
export class DocsComponent implements OnInit {

  activeTab = 0;
  env: Env;
  showWebSocketTab = false;
  showFaqTab = true;

  @HostBinding('attr.dir') dir = 'ltr';

  constructor(
    private route: ActivatedRoute,
    private stateService: StateService,
    private websocket: WebsocketService,
    private seoService: SeoService,
    private ogService: OpenGraphService,
  ) { }

  ngOnInit(): void {
    this.websocket.want(['blocks']);
    this.env = this.stateService.env;
    this.showFaqTab = ( this.env.BASE_MODULE === 'mempool' ) ? true : false;

    document.querySelector<HTMLElement>( 'html' ).style.scrollBehavior = 'smooth';
  }

  ngDoCheck(): void {

    const url = this.route.snapshot.url;

    if (url[0].path === 'faq' ) {
      this.activeTab = 0;
      this.seoService.setTitle($localize`:@@meta.title.docs.faq:FAQ`);
      this.seoService.setDescription($localize`:@@meta.description.docs.faq:Get answers to common Lightning questions about public nodes, channels, routing fees, and network statistics.`);
      this.ogService.setManualOgImage('faq.jpg');
    } else if(url[1]?.path === 'rest' ) {
      this.activeTab = 1;
      this.seoService.setTitle($localize`:@@meta.title.docs.rest:REST API`);
      if (this.stateService.network === 'liquid' || this.stateService.network === 'liquidtestnet' ) {
        this.seoService.setDescription($localize`:@@meta.description.docs.rest-liquid:Documentation for the liquid.network REST API service: get info on addresses, transactions, assets, blocks, and more.`);
      } else {
        this.seoService.setDescription($localize`:@@meta.description.docs.rest-bitcoin:Documentation for the lightning.btc.tx.taxi REST API: query public Lightning nodes, channels, rankings, and statistics.`);
      }
    } else if(url[1]?.path === 'websocket' ) {
      this.activeTab = 2;
      this.seoService.setTitle($localize`:@@meta.title.docs.websocket:WebSocket API`);
      if( this.stateService.network === 'liquid' || this.stateService.network === 'liquidtestnet' ) {
        this.seoService.setDescription($localize`:@@meta.description.docs.websocket-liquid:Documentation for the liquid.network WebSocket API service: get real-time info on blocks, mempools, transactions, addresses, and more.`);
      } else {
        this.seoService.setDescription($localize`:@@meta.description.docs.websocket-bitcoin:Documentation for the btc.tx.taxi WebSocket API: receive real-time Bitcoin block, mempool, transaction, and address updates.`);
      }
    }
  }

  ngOnDestroy(): void {
    document.querySelector<HTMLElement>( 'html' ).style.scrollBehavior = 'auto';
  }
}
