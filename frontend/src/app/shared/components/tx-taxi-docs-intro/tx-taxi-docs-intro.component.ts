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
  get language(): string { return this.locale.startsWith('nb') ? 'nb' : this.locale.startsWith('uk') ? 'uk' : this.locale.startsWith('pl') ? 'pl' : this.locale.startsWith('es') ? 'es' : this.locale.startsWith('fr') ? 'fr' : this.locale.startsWith('de') ? 'de' : this.locale.startsWith('it') ? 'it' : this.locale.startsWith('pt') ? 'pt' : this.locale.startsWith('ru') ? 'ru' : this.locale.startsWith('ja') ? 'ja' : this.locale.startsWith('zh') ? 'zh' : this.locale.startsWith('tr') ? 'tr' : this.locale.startsWith('nl') ? 'nl' : this.locale.startsWith('ko') ? 'ko' : 'en'; }
  get hubUrl(): string { return localizedNativeUrl('https://tx.taxi/', this.language); }
  get nativeUrl(): string { return this.language === 'en' ? '/' : `/${this.language}/`; }
  get nb(): boolean { return this.language === 'nb'; }
  get uk(): boolean { return this.language === 'uk'; }
  get pl(): boolean { return this.language === 'pl'; }
  get es(): boolean { return this.language === 'es'; }
  get fr(): boolean { return this.language === 'fr'; }
  get de(): boolean { return this.language === 'de'; }
  get it(): boolean { return this.language === 'it'; }
  get pt(): boolean { return this.language === 'pt'; }
  get ru(): boolean { return this.language === 'ru'; }
  get ja(): boolean { return this.language === 'ja'; }
  get zh(): boolean { return this.language === 'zh'; }
  get tr(): boolean { return this.language === 'tr'; }
  get ko(): boolean { return this.language === 'ko'; }
  get nl(): boolean { return this.language === 'nl'; }
  get contextLabel(): string {
    const explorer = this.context === 'explorer';
    const chain = this.chainName.trim();
    if (this.es) return `${explorer ? 'Explorador' : 'Documentación'}${chain ? ' de ' + chain : ''}`;
    if (this.fr) return `${explorer ? 'Explorateur' : 'Documentation'}${chain ? ' ' + chain : ''}`;
    if (this.de) return `${chain ? chain + '-' : ''}${explorer ? 'Explorer' : 'Dokumentation'}`;
    if (this.it) return `${explorer ? 'Esploratore' : 'Documentazione'}${chain ? ' ' + chain : ''}`;
    if (this.pt) return `${explorer ? 'Explorador' : 'Documentação'}${chain ? ' ' + chain : ''}`;
    if (this.nb) return `${chain}${chain ? '-' : ''}${explorer ? 'utforsker' : 'dokumentasjon'}`;
    if (this.uk) return `${explorer ? 'Оглядач' : 'Документація'}${chain ? ' ' + chain : ''}`;
    if (this.pl) return `${explorer ? 'Eksplorator' : 'Dokumentacja'}${chain ? ' ' + chain : ''}`;
    if (this.ko) return `${chain}${chain ? ' ' : ''}${explorer ? '탐색기' : '문서'}`;
    if (this.nl) return `${chain}${chain ? '-' : ''}${explorer ? 'verkenner' : 'documentatie'}`;
    if (this.tr) return `${chain}${chain ? ' ' : ''}${explorer ? 'gezgini' : 'belgeleri'}`;
    if (this.zh) return `${chain}${explorer ? '浏览器' : '文档'}`;
    if (this.ja) return `${chain}${explorer ? 'エクスプローラー' : 'ドキュメント'}`;
    if (this.ru) return `${explorer ? 'Обозреватель' : 'Документация'}${chain ? ' ' + chain : ''}`;
    return `${chain}${chain ? ' ' : ''}${this.context}`;
  }
  @Input() context = 'documentation';
  @Input() chainName = '';
  @Input() chainHost = '';
}
