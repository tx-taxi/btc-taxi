import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Inject, LOCALE_ID, OnInit } from '@angular/core';

import { localizedNativeUrl, refreshLocalizedCapabilities } from '@app/services/localized-native-url';
import { StateService } from '@app/services/state.service';

@Component({
  selector: 'app-tx-taxi-docs-intro',
  standalone: true,
  templateUrl: './tx-taxi-docs-intro.component.html',
  styleUrls: ['./tx-taxi-docs-intro.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TxTaxiDocsIntroComponent implements OnInit {
  constructor(@Inject(LOCALE_ID) readonly locale: string, private state: StateService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    void refreshLocalizedCapabilities(this.state.env.TX_TAXI_ROUTER_URL || 'https://tx.taxi').then(() => this.cdr.markForCheck());
  }
  get hubUrl(): string { return localizedNativeUrl('https://tx.taxi/', this.es ? 'es' : 'en'); }
  get es(): boolean { return this.locale.startsWith('es'); }
  @Input() context = 'documentation';
  @Input() chainName = '';
  @Input() chainHost = '';
}
