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

  ngOnInit(): void {
    this.seoService.setTitle(this.fr ? 'Marques et attributions' : this.de ? 'Marken und Quellenangaben' : this.es ? 'Marcas y atribuciones' : 'Trademark & Attribution');
    this.seoService.setDescription(this.fr ? 'Informations de marques et d’attribution pour lightning.btc.tx.taxi, notamment l’attribution à mempool/mempool et l’indépendance du projet.' : this.de ? 'Marken- und Quellenangaben für lightning.btc.tx.taxi, einschließlich der Zuordnung zu mempool/mempool und der Unabhängigkeit des Projekts.' : this.es ? 'Información de marcas y atribuciones de lightning.btc.tx.taxi, incluida la atribución a mempool/mempool y la independencia del proyecto.' : 'Trademark and attribution notes for lightning.btc.tx.taxi, including upstream mempool/mempool attribution and project independence.');
  }
}
