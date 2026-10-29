import { Component, Inject, LOCALE_ID } from '@angular/core';
import { SeoService } from '@app/services/seo.service';

@Component({
  selector: 'app-trademark-policy',
  templateUrl: './trademark-policy.component.lightning.html',
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
  get pl(): boolean { return this.locale.startsWith('pl'); }
  get ko(): boolean { return this.locale.startsWith('ko'); }

  ngOnInit(): void {
    this.seoService.setTitle(this.ko ? '상표 및 출처 표시' : this.nl ? 'Handelsmerken en naamsvermelding' : this.tr ? 'Ticari Markalar ve Atıf' : this.zh ? '商标与归属' : this.ja ? '商標と帰属表示' : this.pt ? 'Marcas e atribuição' : this.ru ? 'Товарные знаки и авторство' : this.it ? 'Marchi e attribuzioni' : this.fr ? 'Marques et attributions' : this.de ? 'Marken und Quellenangaben' : this.es ? 'Marcas y atribuciones' : 'Trademark & Attribution');
    this.seoService.setDescription(this.ko ? 'lightning.btc.tx.taxi의 mempool/mempool 출처 표시 및 프로젝트 독립성을 포함한 상표와 출처 정보.' : this.nl ? 'Handelsmerk- en naamsvermeldingsinformatie voor lightning.btc.tx.taxi, inclusief mempool/mempool en de onafhankelijkheid van het project.' : this.tr ? 'lightning.btc.tx.taxi için mempool/mempool atfı ve projenin bağımsızlığı dahil ticari marka ve atıf bilgileri.' : this.zh ? 'lightning.btc.tx.taxi有关mempool/mempool归属及项目独立性的信息。' : this.ja ? 'lightning.btc.tx.taxiのmempool/mempoolへの帰属表示とプロジェクトの独立性に関する情報。' : this.pt ? 'Informações de marcas e atribuição de lightning.btc.tx.taxi, incluindo a atribuição a mempool/mempool e a independência do projeto.' : this.ru ? 'Товарные знаки и авторство lightning.btc.tx.taxi, включая указание mempool/mempool и независимость проекта.' : this.it ? 'Marchi e attribuzioni di lightning.btc.tx.taxi, inclusa l’attribuzione a mempool/mempool e l’indipendenza del progetto.' : this.fr ? 'Informations de marques et d’attribution pour lightning.btc.tx.taxi, notamment l’attribution à mempool/mempool et l’indépendance du projet.' : this.de ? 'Marken- und Quellenangaben für lightning.btc.tx.taxi, einschließlich der Zuordnung zu mempool/mempool und der Unabhängigkeit des Projekts.' : this.es ? 'Información de marcas y atribuciones de lightning.btc.tx.taxi, incluida la atribución a mempool/mempool y la independencia del proyecto.' : 'Trademark and attribution notes for lightning.btc.tx.taxi, including upstream mempool/mempool attribution and project independence.');
  }
}
