import { Component, Inject, LOCALE_ID } from '@angular/core';
import { SeoService } from '@app/services/seo.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.lightning.html',
  styleUrls: ['./privacy-policy.component.scss'],
  standalone: false,
})
export class PrivacyPolicyComponent {
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

  ngOnInit(): void {
    this.seoService.setTitle(this.ja ? 'プライバシーポリシー' : this.pt ? 'Política de privacidade' : this.ru ? 'Политика конфиденциальности' : this.it ? 'Informativa sulla privacy' : this.fr ? 'Politique de confidentialité' : this.de ? 'Datenschutzerklärung' : this.es ? 'Política de privacidad' : 'Privacy Policy');
    this.seoService.setDescription(this.ja ? 'lightning.btc.tx.taxiの公開データ、ブラウザー設定、サーバーログ、独立した検証に関するプライバシー情報。' : this.pt ? 'Informações de privacidade de lightning.btc.tx.taxi, incluindo dados públicos, preferências do navegador, registros do servidor e verificação independente.' : this.ru ? 'Сведения о конфиденциальности lightning.btc.tx.taxi: публичные данные, настройки браузера, журналы сервера и независимая проверка.' : this.it ? 'Informativa sulla privacy di lightning.btc.tx.taxi: dati pubblici, preferenze del browser, registri del server e verifica indipendente.' : this.fr ? 'Informations de confidentialité pour lightning.btc.tx.taxi : données publiques, préférences du navigateur, journaux du serveur et vérification indépendante.' : this.de ? 'Datenschutzhinweise für lightning.btc.tx.taxi zu öffentlichen Daten, Browsereinstellungen, Serverprotokollen und unabhängiger Überprüfung.' : this.es ? 'Información de privacidad de lightning.btc.tx.taxi sobre datos públicos de Lightning, preferencias del navegador, registros del servidor y verificación independiente.' : 'Privacy notes for lightning.btc.tx.taxi, including public Lightning data, browser preferences, server logs, and independent verification.');
  }
}
