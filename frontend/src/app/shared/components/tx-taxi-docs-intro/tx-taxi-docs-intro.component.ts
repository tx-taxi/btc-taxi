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
  get language(): string { return this.locale.startsWith('hu') ? 'hu' : this.locale.startsWith('ro') ? 'ro' : this.locale.startsWith('he') ? 'he' : this.locale.startsWith('sl') ? 'sl' : this.locale.startsWith('lt') ? 'lt' : this.locale.startsWith('hr') ? 'hr' : this.locale.startsWith('ca') ? 'ca' : this.locale.startsWith('da') ? 'da' : this.locale.startsWith('fa') ? 'fa' : this.locale.startsWith('fi') ? 'fi' : this.locale.startsWith('ar') ? 'ar' : this.locale.startsWith('hi') ? 'hi' : this.locale.startsWith('cs') ? 'cs' : this.locale.startsWith('sv') ? 'sv' : this.locale.startsWith('nb') ? 'nb' : this.locale.startsWith('uk') ? 'uk' : this.locale.startsWith('pl') ? 'pl' : this.locale.startsWith('es') ? 'es' : this.locale.startsWith('fr') ? 'fr' : this.locale.startsWith('de') ? 'de' : this.locale.startsWith('it') ? 'it' : this.locale.startsWith('pt') ? 'pt' : this.locale.startsWith('ru') ? 'ru' : this.locale.startsWith('ja') ? 'ja' : this.locale.startsWith('zh') ? 'zh' : this.locale.startsWith('tr') ? 'tr' : this.locale.startsWith('nl') ? 'nl' : this.locale.startsWith('ko') ? 'ko' : 'en'; }
  get hubUrl(): string { return localizedNativeUrl('https://tx.taxi/', this.language); }
  get nativeUrl(): string { return this.language === 'en' ? '/' : `/${this.language}/`; }
  get hu(): boolean { return this.language === 'hu'; }
  get ro(): boolean { return this.language === 'ro'; }
  get he(): boolean { return this.language === 'he'; }
  get nativeAriaHost(): string { return this.he ? `\u2068${this.chainHost}\u2069` : this.chainHost; }
  get sl(): boolean { return this.language === 'sl'; }
  get lt(): boolean { return this.language === 'lt'; }
  get hi(): boolean { return this.language === 'hi'; }
  get hr(): boolean { return this.language === 'hr'; }
  get ca(): boolean { return this.language === 'ca'; }
  get da(): boolean { return this.language === 'da'; }
  get fa(): boolean { return this.language === 'fa'; }
  get fi(): boolean { return this.language === 'fi'; }
  get ar(): boolean { return this.language === 'ar'; }
  get cs(): boolean { return this.language === 'cs'; }
  get sv(): boolean { return this.language === 'sv'; }
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
    if (this.he) return `${explorer ? 'סייר' : 'תיעוד'}${chain ? ' \u2068' + chain + '\u2069' : ''}`;
    if (this.hu) return `${chain ? chain + ' ' : ''}${explorer ? 'böngésző' : 'dokumentáció'}`;
    if (this.ro) return `${explorer ? 'Explorator' : 'Documentație'}${chain ? ' ' + chain : ''}`;
    if (this.sl) return `${explorer ? 'Raziskovalnik' : 'Dokumentacija'}${chain ? ' ' + chain : ''}`;
    if (this.lt) return `${chain ? chain + ' ' : ''}${explorer ? 'naršyklė' : 'dokumentacija'}`;
    if (this.hr) return `${explorer ? 'Preglednik' : 'Dokumentacija'}${chain ? ' ' + chain : ''}`;
    if (this.ca) return `${explorer ? 'Explorador' : 'Documentació'}${chain ? ' ' + chain : ''}`;
    if (this.da) return `${explorer ? 'Udforsker' : 'Dokumentation'}${chain ? ' ' + chain : ''}`;
    if (this.fa) return `${explorer ? 'کاوشگر' : 'مستندات'}${chain ? ' ' + chain : ''}`;
    if (this.fi) return `${chain ? chain + ' ' : ''}${explorer ? 'lohkoketjuselain' : 'dokumentaatio'}`;
    if (this.ar) return `${explorer ? 'مستكشف' : 'وثائق'}${chain ? ' ' + chain : ''}`;
    if (this.hi) return `${chain ? chain + ' ' : ''}${explorer ? 'एक्सप्लोरर' : 'दस्तावेज़'}`;
    if (this.cs) return `${explorer ? 'Průzkumník' : 'Dokumentace'}${chain ? ' ' + chain : ''}`;
    if (this.sv) return `${chain}${chain ? '-' : ''}${explorer ? 'utforskare' : 'dokumentation'}`;
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
