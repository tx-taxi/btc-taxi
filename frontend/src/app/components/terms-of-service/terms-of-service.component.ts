import { Component, Inject, LOCALE_ID } from '@angular/core';
import { SeoService } from '@app/services/seo.service';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  standalone: false,
})
export class TermsOfServiceComponent {
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
  get hu(): boolean { return this.locale.startsWith('hu'); }
  get th(): boolean { return this.locale.startsWith('th'); }
  get vi(): boolean { return this.locale.startsWith('vi'); }
  get ka(): boolean { return this.locale.startsWith('ka'); }
  get ne(): boolean { return this.locale.startsWith('ne'); }
  get sl(): boolean { return this.locale.startsWith('sl'); }
  get ro(): boolean { return this.locale.startsWith('ro'); }
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
    this.seoService.setTitle(this.ne ? 'सेवाका सर्तहरू' : this.ka ? 'მომსახურების პირობები' : this.vi ? 'Điều khoản dịch vụ' : this.th ? 'ข้อกำหนดการใช้บริการ' : this.hu ? 'Szolgáltatási feltételek' : this.he ? 'תנאי השירות' : this.sl ? 'Pogoji uporabe' : this.lt ? 'Paslaugos teikimo sąlygos' : this.da ? 'Servicevilkår' : this.ar ? 'شروط الخدمة' : this.fi ? 'Käyttöehdot' : this.fa ? 'شرایط خدمات' : this.ca ? 'Condicions del servei' : this.hi ? 'सेवा की शर्तें' : this.cs ? 'Podmínky používání' : this.sv ? 'Användarvillkor' : this.nb ? 'Bruksvilkår' : this.uk ? 'Умови використання' : this.pl ? 'Warunki korzystania' : this.ko ? '서비스 이용약관' : this.nl ? 'Gebruiksvoorwaarden' : this.tr ? 'Hizmet Koşulları' : this.zh ? '服务条款' : this.ja ? '利用規約' : this.pt ? 'Termos de serviço' : this.ru ? 'Условия использования' : this.it ? 'Termini di servizio' : this.fr ? 'Conditions d’utilisation' : this.de ? 'Nutzungsbedingungen' : this.es ? 'Términos de servicio' : 'Terms of Service');
    this.seoService.setDescription(this.ne ? 'btc.tx.taxi को सूचनामूलक सेवा, डेटा उपलब्धता र प्रयोगका सर्तहरू।' : this.ka ? 'საინფორმაციო ბლოკჩეინის ბრაუზერის გამოყენების პირობები, მონაცემები, ხელმისაწვდომობა და დასაშვები გამოყენება.' : this.vi ? 'Điều khoản sử dụng btc.tx.taxi, gồm thông tin dịch vụ, tính sẵn có, cách sử dụng và các liên kết bên ngoài.' : this.th ? 'ข้อกำหนดการใช้บริการ btc.tx.taxi ข้อมูล ความพร้อมใช้งาน และการใช้งานที่ยอมรับได้' : this.hu ? 'A btc.tx.taxi tájékoztató Bitcoin-böngésző használatának feltételei.' : this.he ? 'תנאי השימוש ב־btc.tx.taxi, כולל השירות למידע, זמינות, שימוש מותר ושירותים חיצוניים.' : this.sl ? 'Pogoji uporabe btc.tx.taxi kot informacijskega raziskovalca Bitcoin.' : this.lt ? 'btc.tx.taxi kaip informacinės Bitcoin naršyklės naudojimo sąlygos.' : this.da ? 'Vilkår for brug af btc.tx.taxi som informationsudforsker for Bitcoin.' : this.ar ? 'شروط استخدام btc.tx.taxi بوصفه مستكشفًا معلوماتيًا لشبكة Bitcoin.' : this.fi ? 'btc.tx.taxi-tietopalvelun käyttöehdot.' : this.fa ? 'شرایط استفاده از btc.tx.taxi به‌عنوان مرورگر اطلاع‌رسانی شبکهٔ Bitcoin.' : this.ca ? 'Condicions d’ús de btc.tx.taxi com a explorador informatiu de la xarxa Bitcoin.' : this.hi ? 'Bitcoin ब्लॉक और मेमपूल के सूचनात्मक एक्सप्लोरर के रूप में btc.tx.taxi के उपयोग की शर्तें।' : this.cs ? 'Podmínky používání btc.tx.taxi jako informačního průzkumníka bloků a mempoolu Bitcoinu.' : this.sv ? 'Villkor för användning av btc.tx.taxi som informativ utforskare för Bitcoin-block och mempoolen.' : this.nb ? 'Vilkår for bruk av btc.tx.taxi som informativ utforsker for Bitcoin-blokker og mempoolen.' : this.uk ? 'Умови використання btc.tx.taxi як інформаційного оглядача блоків і мемпулу Bitcoin.' : this.pl ? 'Warunki korzystania z btc.tx.taxi jako informacyjnego eksploratora bloków i mempoola Bitcoin.' : this.ko ? 'btc.tx.taxi 정보 제공 탐색기의 이용약관.' : this.nl ? 'Voorwaarden voor het gebruik van btc.tx.taxi als informatieve verkenner.' : this.tr ? 'btc.tx.taxi bilgi amaçlı gezgininin kullanım koşulları.' : this.zh ? 'btc.tx.taxi作为信息浏览器的使用条款。' : this.ja ? 'btc.tx.taxiの情報提供エクスプローラーの利用規約。' : this.pt ? 'Termos de uso de btc.tx.taxi como explorador informativo Bitcoin.' : this.ru ? 'Условия использования btc.tx.taxi как информационного обозревателя Bitcoin.' : this.it ? 'Termini di utilizzo di btc.tx.taxi come esploratore informativo Bitcoin.' : this.fr ? 'Conditions d’utilisation de btc.tx.taxi comme explorateur informatif des blocs et du mempool Bitcoin.' : this.de ? 'Nutzungsbedingungen für btc.tx.taxi als Informations-Explorer für Bitcoin-Blöcke und den Mempool.' : this.es ? 'Términos de uso de btc.tx.taxi como explorador informativo de bloques y mempool de Bitcoin.' : 'Terms for using btc.tx.taxi as an informational Bitcoin block and mempool explorer.');
  }
}
