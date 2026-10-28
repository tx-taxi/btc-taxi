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
  get language(): string { return this.locale.startsWith('es') ? 'es' : this.locale.startsWith('fr') ? 'fr' : this.locale.startsWith('de') ? 'de' : 'en'; }
  get hubUrl(): string { return localizedNativeUrl('https://tx.taxi/', this.language); }
  get nativeUrl(): string { return this.language === 'en' ? '/' : `/${this.language}/`; }
  get es(): boolean { return this.language === 'es'; }
  get fr(): boolean { return this.language === 'fr'; }
  get de(): boolean { return this.language === 'de'; }
  @Input() context = 'documentation';
  @Input() chainName = '';
  @Input() chainHost = '';
}
