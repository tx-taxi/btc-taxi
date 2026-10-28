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

  ngOnInit(): void {
    this.seoService.setTitle(this.es ? 'Acerca de lightning.btc.tx.taxi' : 'About lightning.btc.tx.taxi');
    this.seoService.setDescription(this.es ? 'Explora nodos, canales, políticas de enrutamiento e historial de la red Lightning con lightning.btc.tx.taxi.' : 'Explore Lightning nodes, channels, routing policies, and network history with lightning.btc.tx.taxi.');
  }
}
