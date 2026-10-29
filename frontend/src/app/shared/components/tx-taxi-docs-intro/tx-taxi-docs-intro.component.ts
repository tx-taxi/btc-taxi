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
  get language(): string { return this.locale.startsWith('es') ? 'es' : this.locale.startsWith('fr') ? 'fr' : this.locale.startsWith('de') ? 'de' : this.locale.startsWith('it') ? 'it' : this.locale.startsWith('pt') ? 'pt' : this.locale.startsWith('ru') ? 'ru' : 'en'; }
  get hubUrl(): string { return localizedNativeUrl('https://tx.taxi/', this.language); }
  get nativeUrl(): string { return this.language === 'en' ? '/' : `/${this.language}/`; }
  get es(): boolean { return this.language === 'es'; }
  get fr(): boolean { return this.language === 'fr'; }
  get de(): boolean { return this.language === 'de'; }
  get it(): boolean { return this.language === 'it'; }
  get pt(): boolean { return this.language === 'pt'; }
  get ru(): boolean { return this.language === 'ru'; }
  get contextLabel(): string {
    const explorer = this.context === 'explorer';
    const chain = this.chainName.trim();
    if (this.es) return `${explorer ? 'Explorador' : 'Documentación'}${chain ? ' de ' + chain : ''}`;
    if (this.fr) return `${explorer ? 'Explorateur' : 'Documentation'}${chain ? ' ' + chain : ''}`;
    if (this.de) return `${chain ? chain + '-' : ''}${explorer ? 'Explorer' : 'Dokumentation'}`;
    if (this.it) return `${explorer ? 'Esploratore' : 'Documentazione'}${chain ? ' ' + chain : ''}`;
    if (this.pt) return `${explorer ? 'Explorador' : 'Documentação'}${chain ? ' ' + chain : ''}`;
    if (this.ru) return `${explorer ? 'Обозреватель' : 'Документация'}${chain ? ' ' + chain : ''}`;
    return `${chain}${chain ? ' ' : ''}${this.context}`;
  }
  @Input() context = 'documentation';
  @Input() chainName = '';
  @Input() chainHost = '';
}
