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
  get cs(): boolean { return this.locale.startsWith('cs'); }
  get sv(): boolean { return this.locale.startsWith('sv'); }
  get nb(): boolean { return this.locale.startsWith('nb'); }
  get uk(): boolean { return this.locale.startsWith('uk'); }
  get pl(): boolean { return this.locale.startsWith('pl'); }
  get ko(): boolean { return this.locale.startsWith('ko'); }

  ngOnInit(): void {
    this.seoService.setTitle(this.sv ? 'Varumärken och erkännande' : this.nb ? 'Varemerker og kreditering' : this.uk ? 'Торговельні марки та зазначення авторства' : this.pl ? 'Znaki towarowe i informacje o pochodzeniu' : this.ko ? '상표 및 출처 표시' : this.nl ? 'Handelsmerken en naamsvermelding' : this.tr ? 'Ticari Markalar ve Atıf' : this.zh ? '商标与归属' : this.ja ? '商標と帰属表示' : this.pt ? 'Marcas e atribuição' : this.ru ? 'Товарные знаки и авторство' : this.it ? 'Marchi e attribuzioni' : this.fr ? 'Marques et attributions' : this.de ? 'Marken und Quellenangaben' : this.es ? 'Marcas y atribuciones' : 'Trademark & Attribution');
    this.seoService.setDescription(this.sv ? 'Information om varumärken och erkännande för btc.tx.taxi, inklusive mempool/mempool och projektets självständighet.' : this.nb ? 'Informasjon om varemerker og kreditering for btc.tx.taxi, inkludert mempool/mempool og prosjektets uavhengighet.' : this.uk ? 'Інформація про торговельні марки та походження btc.tx.taxi, зокрема про mempool/mempool і незалежність проєкту.' : this.pl ? 'Informacje o znakach towarowych i pochodzeniu btc.tx.taxi, w tym o mempool/mempool i niezależności projektu.' : this.ko ? 'btc.tx.taxi의 mempool/mempool 출처 표시 및 프로젝트 독립성을 포함한 상표와 출처 정보.' : this.nl ? 'Handelsmerk- en naamsvermeldingsinformatie voor btc.tx.taxi, inclusief mempool/mempool en de onafhankelijkheid van het project.' : this.tr ? 'btc.tx.taxi için mempool/mempool atfı ve projenin bağımsızlığı dahil ticari marka ve atıf bilgileri.' : this.zh ? 'btc.tx.taxi有关mempool/mempool归属及项目独立性的信息。' : this.ja ? 'btc.tx.taxiのmempool/mempoolへの帰属表示とプロジェクトの独立性に関する情報。' : this.pt ? 'Informações de marcas e atribuição de btc.tx.taxi, incluindo a atribuição a mempool/mempool e a independência do projeto.' : this.ru ? 'Товарные знаки и авторство btc.tx.taxi, включая указание mempool/mempool и независимость проекта.' : this.it ? 'Marchi e attribuzioni di btc.tx.taxi, inclusa l’attribuzione a mempool/mempool e l’indipendenza del progetto.' : this.fr ? 'Informations de marques et d’attribution pour btc.tx.taxi, notamment l’attribution à mempool/mempool et l’indépendance du projet.' : this.de ? 'Marken- und Quellenangaben für btc.tx.taxi, einschließlich der Zuordnung zu mempool/mempool und der Unabhängigkeit des Projekts.' : this.es ? 'Información de marcas y atribuciones de btc.tx.taxi, incluida la atribución a mempool/mempool y la independencia del proyecto.' : 'Trademark and attribution notes for btc.tx.taxi, including upstream mempool/mempool attribution and project independence.');
  }
}
