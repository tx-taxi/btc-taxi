import { TxTaxiDocsIntroComponent } from '@app/shared/components/tx-taxi-docs-intro/tx-taxi-docs-intro.component';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
  ) { }

  ngOnInit(): void {
    this.seoService.setTitle('About lightning.btc.tx.taxi');
    this.seoService.setDescription('Explore Lightning nodes, channels, routing policies, and network history with lightning.btc.tx.taxi.');
  }
}
