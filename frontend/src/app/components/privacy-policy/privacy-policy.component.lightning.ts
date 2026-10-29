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
  get zh(): boolean { return this.locale.startsWith('zh'); }
  get tr(): boolean { return this.locale.startsWith('tr'); }
  get nl(): boolean { return this.locale.startsWith('nl'); }
  get da(): boolean { return this.locale.startsWith('da'); }
  get fi(): boolean { return this.locale.startsWith('fi'); }
  get hr(): boolean { return this.locale.startsWith('hr'); }
  get sl(): boolean { return this.locale.startsWith('sl'); }
  get he(): boolean { return this.locale.startsWith('he'); }
  get lt(): boolean { return this.locale.startsWith('lt'); }
  get ca(): boolean { return this.locale.startsWith('ca'); }
  get hi(): boolean { return this.locale.startsWith('hi'); }
  get ar(): boolean { return this.locale.startsWith('ar'); }
  get fa(): boolean { return this.locale.startsWith('fa'); }
  get cs(): boolean { return this.locale.startsWith('cs'); }
  get sv(): boolean { return this.locale.startsWith('sv'); }
  get nb(): boolean { return this.locale.startsWith('nb'); }
  get uk(): boolean { return this.locale.startsWith('uk'); }
  get pl(): boolean { return this.locale.startsWith('pl'); }
  get ko(): boolean { return this.locale.startsWith('ko'); }

  ngOnInit(): void {
    this.seoService.setTitle(this.he ? 'מדיניות פרטיות' : this.sl ? 'Pravilnik zasebnosti' : this.lt ? 'Privatumo politika' : this.da ? 'Privatlivspolitik' : this.ar ? 'سياسة الخصوصية' : this.fi ? 'Tietosuojakäytäntö' : this.fa ? 'سیاست حریم خصوصی' : this.ca ? 'Política de privadesa' : this.hi ? 'गोपनीयता नीति' : this.cs ? 'Zásady ochrany soukromí' : this.sv ? 'Integritetspolicy' : this.nb ? 'Personvernerklæring' : this.uk ? 'Політика конфіденційності' : this.pl ? 'Polityka prywatności' : this.ko ? '개인정보 처리방침' : this.nl ? 'Privacybeleid' : this.tr ? 'Gizlilik Politikası' : this.zh ? '隐私政策' : this.ja ? 'プライバシーポリシー' : this.pt ? 'Política de privacidade' : this.ru ? 'Политика конфиденциальности' : this.it ? 'Informativa sulla privacy' : this.fr ? 'Politique de confidentialité' : this.de ? 'Datenschutzerklärung' : this.es ? 'Política de privacidad' : 'Privacy Policy');
    this.seoService.setDescription(this.he ? 'מידע על פרטיות ב־lightning.btc.tx.taxi, כולל נתונים ציבוריים, העדפות דפדפן, יומני שרת ואימות עצמאי.' : this.sl ? 'Informacije o zasebnosti lightning.btc.tx.taxi, vključno z javnimi podatki, nastavitvami brskalnika, strežniškimi dnevniki in neodvisnim preverjanjem.' : this.lt ? 'lightning.btc.tx.taxi privatumo informacija: vieši duomenys, naršyklės nuostatos, serverio žurnalai ir nepriklausomas patikrinimas.' : this.da ? 'Privatlivsoplysninger for lightning.btc.tx.taxi, herunder offentlige data, browserindstillinger, serverlogfiler og uafhængig verifikation.' : this.ar ? 'معلومات الخصوصية في lightning.btc.tx.taxi، بما يشمل البيانات العامة وتفضيلات المتصفح وسجلات الخادم والتحقق المستقل.' : this.fi ? 'lightning.btc.tx.taxi-palvelun tietosuoja: julkiset Lightning-tiedot, selaimen asetukset, palvelinlokit ja riippumaton tarkistus.' : this.fa ? 'اطلاعات حریم خصوصی lightning.btc.tx.taxi، شامل داده‌های عمومی، ترجیحات مرورگر، گزارش‌های سرور و راستی‌آزمایی مستقل.' : this.ca ? 'Informació de privadesa de lightning.btc.tx.taxi: dades públiques, preferències del navegador, registres del servidor i verificació independent.' : this.hi ? 'lightning.btc.tx.taxi की गोपनीयता जानकारी: सार्वजनिक डेटा, ब्राउज़र प्राथमिकताएं, सर्वर लॉग और स्वतंत्र सत्यापन।' : this.cs ? 'Informace o soukromí lightning.btc.tx.taxi, včetně veřejných dat, nastavení prohlížeče, serverových záznamů a nezávislého ověření.' : this.sv ? 'Integritetsinformation för lightning.btc.tx.taxi, inklusive offentliga data, webbläsarinställningar, serverloggar och oberoende verifiering.' : this.nb ? 'Personverninformasjon for lightning.btc.tx.taxi, inkludert offentlige data, nettleserinnstillinger, serverlogger og uavhengig verifisering.' : this.uk ? 'Інформація про конфіденційність lightning.btc.tx.taxi: публічні дані, налаштування браузера, журнали сервера та незалежна перевірка.' : this.pl ? 'Informacje o prywatności lightning.btc.tx.taxi, obejmujące dane publiczne, preferencje przeglądarki, dzienniki serwera i niezależną weryfikację.' : this.ko ? 'lightning.btc.tx.taxi의 공개 데이터, 브라우저 설정, 서버 로그 및 독립적 검증에 관한 개인정보 보호 정보.' : this.nl ? 'Privacy-informatie voor lightning.btc.tx.taxi, waaronder openbare gegevens, browservoorkeuren, serverlogs en onafhankelijke verificatie.' : this.tr ? 'lightning.btc.tx.taxi için herkese açık veriler, tarayıcı tercihleri, sunucu günlükleri ve bağımsız doğrulama hakkında gizlilik bilgileri.' : this.zh ? 'lightning.btc.tx.taxi有关公开数据、浏览器偏好、服务器日志和独立验证的隐私信息。' : this.ja ? 'lightning.btc.tx.taxiの公開データ、ブラウザー設定、サーバーログ、独立した検証に関するプライバシー情報。' : this.pt ? 'Informações de privacidade de lightning.btc.tx.taxi, incluindo dados públicos, preferências do navegador, registros do servidor e verificação independente.' : this.ru ? 'Сведения о конфиденциальности lightning.btc.tx.taxi: публичные данные, настройки браузера, журналы сервера и независимая проверка.' : this.it ? 'Informativa sulla privacy di lightning.btc.tx.taxi: dati pubblici, preferenze del browser, registri del server e verifica indipendente.' : this.fr ? 'Informations de confidentialité pour lightning.btc.tx.taxi : données publiques, préférences du navigateur, journaux du serveur et vérification indépendante.' : this.de ? 'Datenschutzhinweise für lightning.btc.tx.taxi zu öffentlichen Daten, Browsereinstellungen, Serverprotokollen und unabhängiger Überprüfung.' : this.es ? 'Información de privacidad de lightning.btc.tx.taxi sobre datos públicos de Lightning, preferencias del navegador, registros del servidor y verificación independiente.' : 'Privacy notes for lightning.btc.tx.taxi, including public Lightning data, browser preferences, server logs, and independent verification.');
  }
}
