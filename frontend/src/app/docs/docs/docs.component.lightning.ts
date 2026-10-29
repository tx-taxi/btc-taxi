import { TxTaxiDocsIntroComponent } from '@app/shared/components/tx-taxi-docs-intro/tx-taxi-docs-intro.component';
import { Component, OnInit, HostBinding, Inject, LOCALE_ID } from '@angular/core';
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
    @Inject(LOCALE_ID) readonly locale: string,
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

  get es(): boolean { return this.locale.startsWith('es'); }
  get fr(): boolean { return this.locale.startsWith('fr'); }
  get de(): boolean { return this.locale.startsWith('de'); }
  get it(): boolean { return this.locale.startsWith('it'); }
  get pt(): boolean { return this.locale.startsWith('pt'); }
  get ru(): boolean { return this.locale.startsWith('ru'); }
  get ja(): boolean { return this.locale.startsWith('ja'); }
  get zh(): boolean { return this.locale.startsWith('zh'); }
  get tr(): boolean { return this.locale.startsWith('tr'); }

  ngDoCheck(): void {

    const url = this.route.snapshot.url;

    if (url[0].path === 'faq' ) {
      this.activeTab = 0;
      this.seoService.setTitle($localize`:@@meta.title.docs.faq:FAQ`);
      this.seoService.setDescription(this.tr ? 'Herkese açık Lightning düğümleri, kanalları, yönlendirme ücretleri ve ağ istatistikleri hakkındaki sık sorulan soruların yanıtları.' : this.zh ? '了解关于公开Lightning节点、通道、路由费用和网络统计的常见问题。' : this.ja ? '公開ノード、チャネル、ルーティング手数料、ネットワーク統計など、Lightningについてのよくある質問にお答えします。' : this.pt ? 'Respostas sobre nós e canais públicos, taxas de encaminhamento e estatísticas da rede Lightning.' : this.ru ? 'Ответы о публичных узлах, каналах, комиссиях за маршрутизацию и статистике сети Lightning.' : this.it ? 'Risposte su nodi pubblici, canali, commissioni di instradamento e statistiche della rete Lightning.' : this.es ? 'Respuestas sobre nodos públicos, canales, comisiones de enrutamiento y estadísticas de la red Lightning.' : this.fr ? 'Réponses aux questions sur les nœuds publics, les canaux, les frais de routage et les statistiques Lightning.' : this.de ? 'Antworten zu öffentlichen Knoten, Kanälen, Routing-Gebühren und Statistiken des Lightning-Netzwerks.' : 'Get answers to common Lightning questions about public nodes, channels, routing fees, and network statistics.');
      this.ogService.setManualOgImage('faq.jpg');
    } else if(url[1]?.path === 'rest' ) {
      this.activeTab = 1;
      this.seoService.setTitle($localize`:@@meta.title.docs.rest:REST API`);
      if (this.stateService.network === 'liquid' || this.stateService.network === 'liquidtestnet' ) {
        this.seoService.setDescription($localize`:@@meta.description.docs.rest-liquid:Documentation for the liquid.network REST API service: get info on addresses, transactions, assets, blocks, and more.`);
      } else {
        this.seoService.setDescription(this.tr ? 'lightning.btc.tx.taxi REST API belgeleri: herkese açık Lightning düğümlerini, kanalları, sıralamaları ve istatistikleri sorgulayın.' : this.zh ? 'lightning.btc.tx.taxi REST API文档：查询公开Lightning节点、通道、排名和统计。' : this.ja ? 'lightning.btc.tx.taxi REST APIのドキュメント。公開Lightningノード、チャネル、ランキング、統計を取得できます。' : this.pt ? 'Documentação da API REST de lightning.btc.tx.taxi: consulte nós e canais públicos, classificações e estatísticas Lightning.' : this.ru ? 'Документация REST API lightning.btc.tx.taxi: публичные узлы, каналы, рейтинги и статистика Lightning.' : this.it ? 'Documentazione API REST di lightning.btc.tx.taxi: consulta nodi, canali, classifiche e statistiche pubbliche Lightning.' : this.es ? 'Documentación de la API REST de lightning.btc.tx.taxi: consulta nodos y canales públicos, clasificaciones y estadísticas Lightning.' : this.fr ? 'Documentation de l’API REST de lightning.btc.tx.taxi : consultez les nœuds, canaux, classements et statistiques Lightning publics.' : this.de ? 'REST-API-Dokumentation von lightning.btc.tx.taxi: öffentliche Lightning-Knoten, Kanäle, Ranglisten und Statistiken abfragen.' : 'Documentation for the lightning.btc.tx.taxi REST API: query public Lightning nodes, channels, rankings, and statistics.');
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
