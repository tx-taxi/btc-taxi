import { Component, Inject, LOCALE_ID } from '@angular/core';
import { SeoService } from '@app/services/seo.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
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
  get zh(): boolean { return this.locale.startsWith('zh'); }
  get tr(): boolean { return this.locale.startsWith('tr'); }
  get nl(): boolean { return this.locale.startsWith('nl'); }
  get fi(): boolean { return this.locale.startsWith('fi'); }
  get hi(): boolean { return this.locale.startsWith('hi'); }
  get cs(): boolean { return this.locale.startsWith('cs'); }
  get sv(): boolean { return this.locale.startsWith('sv'); }
  get nb(): boolean { return this.locale.startsWith('nb'); }
  get uk(): boolean { return this.locale.startsWith('uk'); }
  get pl(): boolean { return this.locale.startsWith('pl'); }
  get ko(): boolean { return this.locale.startsWith('ko'); }

  ngOnInit(): void {
    this.seoService.setTitle(this.fi ? 'Tietosuojakäytäntö' : this.hi ? 'गोपनीयता नीति' : this.cs ? 'Zásady ochrany soukromí' : this.sv ? 'Integritetspolicy' : this.nb ? 'Personvernerklæring' : this.uk ? 'Політика конфіденційності' : this.pl ? 'Polityka prywatności' : this.ko ? '개인정보 처리방침' : this.nl ? 'Privacybeleid' : this.tr ? 'Gizlilik Politikası' : this.zh ? '隐私政策' : this.ja ? 'プライバシーポリシー' : this.pt ? 'Política de privacidade' : this.ru ? 'Политика конфиденциальности' : this.it ? 'Informativa sulla privacy' : this.fr ? 'Politique de confidentialité' : this.de ? 'Datenschutzerklärung' : this.es ? 'Política de privacidad' : 'Privacy Policy');
    this.seoService.setDescription(this.fi ? 'btc.tx.taxi-palvelun tietosuoja: julkiset Bitcoin-tiedot, selaimen asetukset, palvelinlokit ja riippumaton tarkistus.' : this.hi ? 'btc.tx.taxi की गोपनीयता जानकारी: सार्वजनिक डेटा, ब्राउज़र प्राथमिकताएं, सर्वर लॉग और स्वतंत्र सत्यापन।' : this.cs ? 'Informace o soukromí btc.tx.taxi, včetně veřejných dat, nastavení prohlížeče, serverových záznamů a nezávislého ověření.' : this.sv ? 'Integritetsinformation för btc.tx.taxi, inklusive offentliga data, webbläsarinställningar, serverloggar och oberoende verifiering.' : this.nb ? 'Personverninformasjon for btc.tx.taxi, inkludert offentlige data, nettleserinnstillinger, serverlogger og uavhengig verifisering.' : this.uk ? 'Інформація про конфіденційність btc.tx.taxi: публічні дані, налаштування браузера, журнали сервера та незалежна перевірка.' : this.pl ? 'Informacje o prywatności btc.tx.taxi, obejmujące dane publiczne, preferencje przeglądarki, dzienniki serwera i niezależną weryfikację.' : this.ko ? 'btc.tx.taxi의 공개 데이터, 브라우저 설정, 서버 로그 및 독립적 검증에 관한 개인정보 보호 정보.' : this.nl ? 'Privacy-informatie voor btc.tx.taxi, waaronder openbare gegevens, browservoorkeuren, serverlogs en onafhankelijke verificatie.' : this.tr ? 'btc.tx.taxi için herkese açık veriler, tarayıcı tercihleri, sunucu günlükleri ve bağımsız doğrulama hakkında gizlilik bilgileri.' : this.zh ? 'btc.tx.taxi有关公开数据、浏览器偏好、服务器日志和独立验证的隐私信息。' : this.ja ? 'btc.tx.taxiの公開データ、ブラウザー設定、サーバーログ、独立した検証に関するプライバシー情報。' : this.pt ? 'Informações de privacidade de btc.tx.taxi, incluindo dados públicos, preferências do navegador, registros do servidor e verificação independente.' : this.ru ? 'Сведения о конфиденциальности btc.tx.taxi: публичные данные, настройки браузера, журналы сервера и независимая проверка.' : this.it ? 'Informativa sulla privacy di btc.tx.taxi: dati pubblici, preferenze del browser, registri del server e verifica indipendente.' : this.fr ? 'Informations de confidentialité pour btc.tx.taxi : données publiques, préférences du navigateur, journaux du serveur et vérification indépendante.' : this.de ? 'Datenschutzhinweise für btc.tx.taxi zu öffentlichen Daten, Browsereinstellungen, Serverprotokollen und unabhängiger Überprüfung.' : this.es ? 'Información de privacidad de btc.tx.taxi sobre datos públicos de Bitcoin, preferencias del navegador, registros del servidor y verificación independiente.' : 'Privacy notes for btc.tx.taxi, including public Bitcoin data, browser preferences, server logs, and independent verification.');
  }
}
