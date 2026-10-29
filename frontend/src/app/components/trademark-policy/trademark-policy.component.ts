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
  get zh(): boolean { return this.locale.startsWith('zh'); }

  ngOnInit(): void {
    this.seoService.setTitle(this.zh ? '商标与归属' : this.pt ? 'Marcas e atribuição' : this.ru ? 'Товарные знаки и авторство' : this.it ? 'Marchi e attribuzioni' : this.fr ? 'Marques et attributions' : this.de ? 'Marken und Quellenangaben' : this.es ? 'Marcas y atribuciones' : 'Trademark & Attribution');
    this.seoService.setDescription(this.zh ? 'btc.tx.taxi有关mempool/mempool归属及项目独立性的信息。' : this.pt ? 'Informações de marcas e atribuição de btc.tx.taxi, incluindo a atribuição a mempool/mempool e a independência do projeto.' : this.ru ? 'Товарные знаки и авторство btc.tx.taxi, включая указание mempool/mempool и независимость проекта.' : this.it ? 'Marchi e attribuzioni di btc.tx.taxi, inclusa l’attribuzione a mempool/mempool e l’indipendenza del progetto.' : this.fr ? 'Informations de marques et d’attribution pour btc.tx.taxi, notamment l’attribution à mempool/mempool et l’indépendance du projet.' : this.de ? 'Marken- und Quellenangaben für btc.tx.taxi, einschließlich der Zuordnung zu mempool/mempool und der Unabhängigkeit des Projekts.' : this.es ? 'Información de marcas y atribuciones de btc.tx.taxi, incluida la atribución a mempool/mempool y la independencia del proyecto.' : 'Trademark and attribution notes for btc.tx.taxi, including upstream mempool/mempool attribution and project independence.');
  }
}
