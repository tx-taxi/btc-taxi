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

  get ne(): boolean { return this.locale.startsWith('ne'); }
  get ka(): boolean { return this.locale.startsWith('ka'); }
  get vi(): boolean { return this.locale.startsWith('vi'); }
  get th(): boolean { return this.locale.startsWith('th'); }
  get hu(): boolean { return this.locale.startsWith('hu'); }
  get ro(): boolean { return this.locale.startsWith('ro'); }
  get he(): boolean { return this.locale.startsWith('he'); }
  get sl(): boolean { return this.locale.startsWith('sl'); }
  get lt(): boolean { return this.locale.startsWith('lt'); }
  get es(): boolean { return this.locale.startsWith('es'); }
  get fr(): boolean { return this.locale.startsWith('fr'); }
  get de(): boolean { return this.locale.startsWith('de'); }
  get it(): boolean { return this.locale.startsWith('it'); }
  get pt(): boolean { return this.locale.startsWith('pt'); }
  get ru(): boolean { return this.locale.startsWith('ru'); }
  get ja(): boolean { return this.locale.startsWith('ja'); }
  get zh(): boolean { return this.locale.startsWith('zh'); }
  get tr(): boolean { return this.locale.startsWith('tr'); }
  get hi(): boolean { return this.locale.startsWith('hi'); }
  get hr(): boolean { return this.locale.startsWith('hr'); }
  get ca(): boolean { return this.locale.startsWith('ca'); }
  get da(): boolean { return this.locale.startsWith('da'); }
  get fi(): boolean { return this.locale.startsWith('fi'); }
  get fa(): boolean { return this.locale.startsWith('fa'); }
  get ar(): boolean { return this.locale.startsWith('ar'); }
  get cs(): boolean { return this.locale.startsWith('cs'); }
  get sv(): boolean { return this.locale.startsWith('sv'); }
  get nb(): boolean { return this.locale.startsWith('nb'); }
  get uk(): boolean { return this.locale.startsWith('uk'); }
  get pl(): boolean { return this.locale.startsWith('pl'); }
  get ko(): boolean { return this.locale.startsWith('ko'); }
  get nl(): boolean { return this.locale.startsWith('nl'); }

  ngOnInit(): void {
    this.seoService.setTitle(this.ne ? 'lightning.btc.tx.taxi बारे' : this.ka ? 'lightning.btc.tx.taxi-ის შესახებ' : this.vi ? 'Giới thiệu về lightning.btc.tx.taxi' : this.th ? 'เกี่ยวกับ lightning.btc.tx.taxi' : this.hu ? 'A lightning.btc.tx.taxi névjegye' : this.ro ? 'Despre lightning.btc.tx.taxi' : this.he ? 'על lightning.btc.tx.taxi' : this.sl ? 'O lightning.btc.tx.taxi' : this.lt ? 'Apie lightning.btc.tx.taxi' : this.hr ? 'O lightning.btc.tx.taxi' : this.ca ? 'Sobre lightning.btc.tx.taxi' : this.da ? 'Om lightning.btc.tx.taxi' : this.fi ? 'Tietoa lightning.btc.tx.taxista' : this.fa ? 'دربارهٔ lightning.btc.tx.taxi' : this.ar ? 'حول lightning.btc.tx.taxi' : this.hi ? 'lightning.btc.tx.taxi के बारे में' : this.cs ? 'O lightning.btc.tx.taxi' : this.sv ? 'Om lightning.btc.tx.taxi' : this.nb ? 'Om lightning.btc.tx.taxi' : this.uk ? 'Про lightning.btc.tx.taxi' : this.pl ? 'O lightning.btc.tx.taxi' : this.ko ? 'lightning.btc.tx.taxi 소개' : this.nl ? 'Over lightning.btc.tx.taxi' : this.tr ? 'lightning.btc.tx.taxi hakkında' : this.zh ? '关于lightning.btc.tx.taxi' : this.ja ? 'lightning.btc.tx.taxiについて' : this.pt ? 'Sobre lightning.btc.tx.taxi' : this.ru ? 'О lightning.btc.tx.taxi' : this.it ? 'Informazioni su lightning.btc.tx.taxi' : this.es ? 'Acerca de lightning.btc.tx.taxi' : this.fr ? 'À propos de lightning.btc.tx.taxi' : this.de ? 'Über lightning.btc.tx.taxi' : 'About lightning.btc.tx.taxi');
    this.seoService.setDescription(this.ne ? 'lightning.btc.tx.taxi मा Lightning नोड, च्यानल, राउटिङ नीतिहरू र नेटवर्कको इतिहास हेर्नुहोस्।' : this.ka ? 'დაათვალიერეთ Lightning-ის კვანძები, არხები, მარშრუტიზაციის წესები და ქსელის ისტორია lightning.btc.tx.taxi-ზე.' : this.vi ? 'Khám phá các nút, kênh, chính sách định tuyến và lịch sử mạng Lightning trên lightning.btc.tx.taxi.' : this.th ? 'สำรวจโหนด ช่องทาง นโยบายการกำหนดเส้นทาง และประวัติเครือข่าย Lightning บน lightning.btc.tx.taxi' : this.hu ? 'Fedezze fel a Lightning-csomópontokat, csatornákat, útválasztási szabályokat és a hálózat történetét a lightning.btc.tx.taxi oldalon.' : this.ro ? 'Explorează nodurile, canalele, politicile de rutare și istoricul rețelei Lightning pe lightning.btc.tx.taxi.' : this.he ? 'גלו צומתי Lightning, ערוצים, מדיניות ניתוב והיסטוריית הרשת ב־lightning.btc.tx.taxi.' : this.sl ? 'Raziščite vozlišča, kanale, pravila usmerjanja in zgodovino omrežja Lightning na lightning.btc.tx.taxi.' : this.lt ? 'Naršykite Lightning mazgus, kanalus, maršruto parinkimo taisykles ir tinklo istoriją svetainėje lightning.btc.tx.taxi.' : this.hr ? 'Istražite Lightning čvorove, kanale, pravila usmjeravanja i povijest mreže na lightning.btc.tx.taxi.' : this.ca ? 'Explora nodes, canals, polítiques d’encaminament i l’historial de la xarxa Lightning a lightning.btc.tx.taxi.' : this.da ? 'Udforsk Lightning-noder, kanaler, routingpolitikker og netværkshistorik på lightning.btc.tx.taxi.' : this.fi ? 'Tutustu Lightning-solmuihin, kanaviin, reitityskäytäntöihin ja verkon historiaan lightning.btc.tx.taxissa.' : this.fa ? 'گره‌ها، کانال‌ها، سیاست‌های مسیریابی و تاریخچهٔ شبکهٔ Lightning را در lightning.btc.tx.taxi بررسی کنید.' : this.ar ? 'استكشف عقد Lightning وقنواتها وسياسات التوجيه وتاريخ الشبكة على lightning.btc.tx.taxi.' : this.hi ? 'lightning.btc.tx.taxi पर Lightning नोड, चैनल, रूटिंग नीतियां और नेटवर्क इतिहास देखें।' : this.cs ? 'Prozkoumejte uzly, kanály, pravidla směrování a historii sítě Lightning na lightning.btc.tx.taxi.' : this.sv ? 'Utforska Lightning-noder, kanaler, routningsregler och nätverkshistorik på lightning.btc.tx.taxi.' : this.nb ? 'Utforsk Lightning-noder, kanaler, rutingsregler og nettverkshistorikk på lightning.btc.tx.taxi.' : this.uk ? 'Переглядайте вузли, канали, правила маршрутизації та історію мережі Lightning на lightning.btc.tx.taxi.' : this.pl ? 'Poznaj węzły, kanały, zasady routingu i historię sieci Lightning w lightning.btc.tx.taxi.' : this.ko ? 'lightning.btc.tx.taxi에서 Lightning 노드, 채널, 라우팅 정책과 네트워크 기록을 살펴보세요.' : this.nl ? 'Verken Lightning-nodes, kanalen, routeringsbeleid en netwerkgeschiedenis met lightning.btc.tx.taxi.' : this.tr ? 'lightning.btc.tx.taxi ile Lightning düğümlerini, kanallarını, yönlendirme politikalarını ve ağ geçmişini keşfedin.' : this.zh ? '通过lightning.btc.tx.taxi查看Lightning节点、通道、路由策略和网络历史。' : this.ja ? 'lightning.btc.tx.taxiでLightningのノード、チャネル、ルーティングポリシー、ネットワーク履歴を調べましょう。' : this.pt ? 'Explore nós, canais, políticas de encaminhamento e o histórico da rede Lightning em lightning.btc.tx.taxi.' : this.ru ? 'Изучайте узлы, каналы, правила маршрутизации и историю сети Lightning на lightning.btc.tx.taxi.' : this.it ? 'Esplora nodi, canali, politiche di instradamento e cronologia della rete Lightning su lightning.btc.tx.taxi.' : this.es ? 'Explora nodos, canales, políticas de enrutamiento e historial de la red Lightning con lightning.btc.tx.taxi.' : this.fr ? 'Explorez les nœuds, canaux, politiques de routage et l’historique du réseau Lightning sur lightning.btc.tx.taxi.' : this.de ? 'Erkunde Lightning-Knoten, Kanäle, Routing-Richtlinien und den Netzwerkverlauf mit lightning.btc.tx.taxi.' : 'Explore Lightning nodes, channels, routing policies, and network history with lightning.btc.tx.taxi.');
  }
}
