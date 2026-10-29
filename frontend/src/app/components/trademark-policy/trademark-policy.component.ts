import { Component, Inject, LOCALE_ID } from '@angular/core';
import { SeoService } from '@app/services/seo.service';

@Component({
  selector: 'app-trademark-policy',
  templateUrl: './trademark-policy.component.html',
  styleUrls: ['./trademark-policy.component.scss'],
  standalone: false,
})
export class TrademarkPolicyComponent {
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
  get nl(): boolean { return this.locale.startsWith('nl'); }
  get da(): boolean { return this.locale.startsWith('da'); }
  get fi(): boolean { return this.locale.startsWith('fi'); }
  get hr(): boolean { return this.locale.startsWith('hr'); }
  get hu(): boolean { return this.locale.startsWith('hu'); }
  get th(): boolean { return this.locale.startsWith('th'); }
  get vi(): boolean { return this.locale.startsWith('vi'); }
  get ka(): boolean { return this.locale.startsWith('ka'); }
  get sl(): boolean { return this.locale.startsWith('sl'); }
  get ro(): boolean { return this.locale.startsWith('ro'); }
  get he(): boolean { return this.locale.startsWith('he'); }
  get lt(): boolean { return this.locale.startsWith('lt'); }
  get ca(): boolean { return this.locale.startsWith('ca'); }
  get hi(): boolean { return this.locale.startsWith('hi'); }
  get ar(): boolean { return this.locale.startsWith('ar'); }
  get fa(): boolean { return this.locale.startsWith('fa'); }
  get cs(): boolean { return this.locale.startsWith('cs'); }
  get sv(): boolean { return this.locale.startsWith('sv'); }
  get nb(): boolean { return this.locale.startsWith('nb'); }
  get uk(): boolean { return this.locale.startsWith('uk'); }
  get pl(): boolean { return this.locale.startsWith('pl'); }
  get ko(): boolean { return this.locale.startsWith('ko'); }

  ngOnInit(): void {
    this.seoService.setTitle(this.ka ? 'სავაჭრო ნიშნები და წყაროს მითითება' : this.vi ? 'Nhãn hiệu và ghi nhận nguồn' : this.th ? 'เครื่องหมายการค้าและการระบุที่มา' : this.hu ? 'Védjegyek és forrásmegjelölés' : this.he ? 'סימני מסחר וייחוס' : this.sl ? 'Blagovne znamke in navedba izvora' : this.lt ? 'Prekių ženklai ir kilmės nurodymas' : this.da ? 'Varemærker og kreditering' : this.ar ? 'العلامات التجارية والإسناد' : this.fi ? 'Tavaramerkit ja alkuperän ilmoittaminen' : this.fa ? 'علائم تجاری و انتساب' : this.ca ? 'Marques comercials i atribució' : this.hi ? 'ट्रेडमार्क और श्रेय' : this.cs ? 'Ochranné známky a uvedení původu' : this.sv ? 'Varumärken och erkännande' : this.nb ? 'Varemerker og kreditering' : this.uk ? 'Торговельні марки та зазначення авторства' : this.pl ? 'Znaki towarowe i informacje o pochodzeniu' : this.ko ? '상표 및 출처 표시' : this.nl ? 'Handelsmerken en naamsvermelding' : this.tr ? 'Ticari Markalar ve Atıf' : this.zh ? '商标与归属' : this.ja ? '商標と帰属表示' : this.pt ? 'Marcas e atribuição' : this.ru ? 'Товарные знаки и авторство' : this.it ? 'Marchi e attribuzioni' : this.fr ? 'Marques et attributions' : this.de ? 'Marken und Quellenangaben' : this.es ? 'Marcas y atribuciones' : 'Trademark & Attribution');
    this.seoService.setDescription(this.ka ? 'სავაჭრო ნიშნების, საწყისი პროექტის წყაროს მითითებისა და დამოუკიდებლობის შესახებ ინფორმაცია.' : this.vi ? 'Thông tin về nhãn hiệu và ghi nhận nguồn của btc.tx.taxi, bao gồm mempool/mempool và tính độc lập của dự án.' : this.th ? 'ข้อมูลเครื่องหมายการค้าและการระบุที่มาของ btc.tx.taxi และโครงการต้นทาง' : this.hu ? 'A btc.tx.taxi védjegyei és forrásmegjelölése, beleértve a mempool/mempool projektet és a projekt függetlenségét.' : this.he ? 'מידע על סימני מסחר, ייחוס לפרויקט המקורי ורישוי ב־btc.tx.taxi.' : this.sl ? 'Informacije o blagovnih znamkah in navedbi izvora btc.tx.taxi, vključno z mempool/mempool in neodvisnostjo projekta.' : this.lt ? 'btc.tx.taxi prekių ženklų ir kilmės informacija, įskaitant mempool/mempool ir projekto nepriklausomumą.' : this.da ? 'Oplysninger om varemærker og kreditering for btc.tx.taxi, herunder mempool/mempool og projektets uafhængighed.' : this.ar ? 'معلومات العلامات التجارية والإسناد في btc.tx.taxi، بما في ذلك mempool/mempool واستقلال المشروع.' : this.fi ? 'btc.tx.taxi-palvelun tavaramerkit, alkuperän ilmoittaminen ja projektin riippumattomuus.' : this.fa ? 'اطلاعات علائم تجاری و انتساب btc.tx.taxi، شامل mempool/mempool و استقلال پروژه.' : this.ca ? 'Informació sobre marques i atribució de btc.tx.taxi, inclosa l’atribució a mempool/mempool i la independència del projecte.' : this.hi ? 'btc.tx.taxi के ट्रेडमार्क और श्रेय की जानकारी, जिसमें mempool/mempool और परियोजना की स्वतंत्रता शामिल है।' : this.cs ? 'Informace o ochranných známkách a původu btc.tx.taxi, včetně mempool/mempool a nezávislosti projektu.' : this.sv ? 'Information om varumärken och erkännande för btc.tx.taxi, inklusive mempool/mempool och projektets självständighet.' : this.nb ? 'Informasjon om varemerker og kreditering for btc.tx.taxi, inkludert mempool/mempool og prosjektets uavhengighet.' : this.uk ? 'Інформація про торговельні марки та походження btc.tx.taxi, зокрема про mempool/mempool і незалежність проєкту.' : this.pl ? 'Informacje o znakach towarowych i pochodzeniu btc.tx.taxi, w tym o mempool/mempool i niezależności projektu.' : this.ko ? 'btc.tx.taxi의 mempool/mempool 출처 표시 및 프로젝트 독립성을 포함한 상표와 출처 정보.' : this.nl ? 'Handelsmerk- en naamsvermeldingsinformatie voor btc.tx.taxi, inclusief mempool/mempool en de onafhankelijkheid van het project.' : this.tr ? 'btc.tx.taxi için mempool/mempool atfı ve projenin bağımsızlığı dahil ticari marka ve atıf bilgileri.' : this.zh ? 'btc.tx.taxi有关mempool/mempool归属及项目独立性的信息。' : this.ja ? 'btc.tx.taxiのmempool/mempoolへの帰属表示とプロジェクトの独立性に関する情報。' : this.pt ? 'Informações de marcas e atribuição de btc.tx.taxi, incluindo a atribuição a mempool/mempool e a independência do projeto.' : this.ru ? 'Товарные знаки и авторство btc.tx.taxi, включая указание mempool/mempool и независимость проекта.' : this.it ? 'Marchi e attribuzioni di btc.tx.taxi, inclusa l’attribuzione a mempool/mempool e l’indipendenza del progetto.' : this.fr ? 'Informations de marques et d’attribution pour btc.tx.taxi, notamment l’attribution à mempool/mempool et l’indépendance du projet.' : this.de ? 'Marken- und Quellenangaben für btc.tx.taxi, einschließlich der Zuordnung zu mempool/mempool und der Unabhängigkeit des Projekts.' : this.es ? 'Información de marcas y atribuciones de btc.tx.taxi, incluida la atribución a mempool/mempool y la independencia del proyecto.' : 'Trademark and attribution notes for btc.tx.taxi, including upstream mempool/mempool attribution and project independence.');
  }
}
