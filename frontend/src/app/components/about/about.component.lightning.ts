import { TxTaxiDocsIntroComponent } from '@app/shared/components/tx-taxi-docs-intro/tx-taxi-docs-intro.component';
import { ChangeDetectionStrategy, Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { SeoService } from '@app/services/seo.service';

@Component({
  selector: 'app-about',
  templateUrl: '../../lightning-app/about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  constructor(
    private seoService: SeoService,
    @Inject(LOCALE_ID) readonly locale: string,
  ) { }

  get es(): boolean { return this.locale.startsWith('es'); }
  get fr(): boolean { return this.locale.startsWith('fr'); }
  get de(): boolean { return this.locale.startsWith('de'); }
  get it(): boolean { return this.locale.startsWith('it'); }
  get pt(): boolean { return this.locale.startsWith('pt'); }
  get ru(): boolean { return this.locale.startsWith('ru'); }
  get ja(): boolean { return this.locale.startsWith('ja'); }
  get zh(): boolean { return this.locale.startsWith('zh'); }
  get tr(): boolean { return this.locale.startsWith('tr'); }
  get cs(): boolean { return this.locale.startsWith('cs'); }
  get sv(): boolean { return this.locale.startsWith('sv'); }
  get nb(): boolean { return this.locale.startsWith('nb'); }
  get uk(): boolean { return this.locale.startsWith('uk'); }
  get pl(): boolean { return this.locale.startsWith('pl'); }
  get ko(): boolean { return this.locale.startsWith('ko'); }
  get nl(): boolean { return this.locale.startsWith('nl'); }

  ngOnInit(): void {
    this.seoService.setTitle(this.cs ? 'O lightning.btc.tx.taxi' : this.sv ? 'Om lightning.btc.tx.taxi' : this.nb ? 'Om lightning.btc.tx.taxi' : this.uk ? 'Про lightning.btc.tx.taxi' : this.pl ? 'O lightning.btc.tx.taxi' : this.ko ? 'lightning.btc.tx.taxi 소개' : this.nl ? 'Over lightning.btc.tx.taxi' : this.tr ? 'lightning.btc.tx.taxi hakkında' : this.zh ? '关于lightning.btc.tx.taxi' : this.ja ? 'lightning.btc.tx.taxiについて' : this.pt ? 'Sobre lightning.btc.tx.taxi' : this.ru ? 'О lightning.btc.tx.taxi' : this.it ? 'Informazioni su lightning.btc.tx.taxi' : this.es ? 'Acerca de lightning.btc.tx.taxi' : this.fr ? 'À propos de lightning.btc.tx.taxi' : this.de ? 'Über lightning.btc.tx.taxi' : 'About lightning.btc.tx.taxi');
    this.seoService.setDescription(this.cs ? 'Prozkoumejte uzly, kanály, pravidla směrování a historii sítě Lightning na lightning.btc.tx.taxi.' : this.sv ? 'Utforska Lightning-noder, kanaler, routningsregler och nätverkshistorik på lightning.btc.tx.taxi.' : this.nb ? 'Utforsk Lightning-noder, kanaler, rutingsregler og nettverkshistorikk på lightning.btc.tx.taxi.' : this.uk ? 'Переглядайте вузли, канали, правила маршрутизації та історію мережі Lightning на lightning.btc.tx.taxi.' : this.pl ? 'Poznaj węzły, kanały, zasady routingu i historię sieci Lightning w lightning.btc.tx.taxi.' : this.ko ? 'lightning.btc.tx.taxi에서 Lightning 노드, 채널, 라우팅 정책과 네트워크 기록을 살펴보세요.' : this.nl ? 'Verken Lightning-nodes, kanalen, routeringsbeleid en netwerkgeschiedenis met lightning.btc.tx.taxi.' : this.tr ? 'lightning.btc.tx.taxi ile Lightning düğümlerini, kanallarını, yönlendirme politikalarını ve ağ geçmişini keşfedin.' : this.zh ? '通过lightning.btc.tx.taxi查看Lightning节点、通道、路由策略和网络历史。' : this.ja ? 'lightning.btc.tx.taxiでLightningのノード、チャネル、ルーティングポリシー、ネットワーク履歴を調べましょう。' : this.pt ? 'Explore nós, canais, políticas de encaminhamento e o histórico da rede Lightning em lightning.btc.tx.taxi.' : this.ru ? 'Изучайте узлы, каналы, правила маршрутизации и историю сети Lightning на lightning.btc.tx.taxi.' : this.it ? 'Esplora nodi, canali, politiche di instradamento e cronologia della rete Lightning su lightning.btc.tx.taxi.' : this.es ? 'Explora nodos, canales, políticas de enrutamiento e historial de la red Lightning con lightning.btc.tx.taxi.' : this.fr ? 'Explorez les nœuds, canaux, politiques de routage et l’historique du réseau Lightning sur lightning.btc.tx.taxi.' : this.de ? 'Erkunde Lightning-Knoten, Kanäle, Routing-Richtlinien und den Netzwerkverlauf mit lightning.btc.tx.taxi.' : 'Explore Lightning nodes, channels, routing policies, and network history with lightning.btc.tx.taxi.');
  }
}
