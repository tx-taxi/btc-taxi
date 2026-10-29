import { Component, Inject, LOCALE_ID } from '@angular/core';
import { SeoService } from '@app/services/seo.service';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.lightning.html',
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
  get hi(): boolean { return this.locale.startsWith('hi'); }
  get da(): boolean { return this.locale.startsWith('da'); }
  get cs(): boolean { return this.locale.startsWith('cs'); }
  get sv(): boolean { return this.locale.startsWith('sv'); }
  get nb(): boolean { return this.locale.startsWith('nb'); }
  get uk(): boolean { return this.locale.startsWith('uk'); }
  get pl(): boolean { return this.locale.startsWith('pl'); }
  get ko(): boolean { return this.locale.startsWith('ko'); }

  ngOnInit(): void {
    this.seoService.setTitle(this.hi ? 'सेवा की शर्तें' : this.cs ? 'Podmínky používání' : this.sv ? 'Användarvillkor' : this.nb ? 'Bruksvilkår' : this.uk ? 'Умови використання' : this.pl ? 'Warunki korzystania' : this.ko ? '서비스 이용약관' : this.nl ? 'Gebruiksvoorwaarden' : this.tr ? 'Hizmet Koşulları' : this.zh ? '服务条款' : this.ja ? '利用規約' : this.pt ? 'Termos de serviço' : this.ru ? 'Условия использования' : this.it ? 'Termini di servizio' : this.fr ? 'Conditions d’utilisation' : this.de ? 'Nutzungsbedingungen' : this.es ? 'Términos de servicio' : 'Terms of Service');
    this.seoService.setDescription(this.hi ? 'Lightning नेटवर्क के सूचनात्मक एक्सप्लोरर के रूप में lightning.btc.tx.taxi के उपयोग की शर्तें।' : this.cs ? 'Podmínky používání lightning.btc.tx.taxi jako informačního průzkumníka sítě Lightning.' : this.sv ? 'Villkor för användning av lightning.btc.tx.taxi som informativ utforskare för Lightning-nätverket.' : this.nb ? 'Vilkår for bruk av lightning.btc.tx.taxi som informativ utforsker for Lightning-nettverket.' : this.uk ? 'Умови використання lightning.btc.tx.taxi як інформаційного оглядача мережі Lightning.' : this.pl ? 'Warunki korzystania z lightning.btc.tx.taxi jako informacyjnego eksploratora sieci Lightning.' : this.ko ? 'lightning.btc.tx.taxi 정보 제공 탐색기의 이용약관.' : this.nl ? 'Voorwaarden voor het gebruik van lightning.btc.tx.taxi als informatieve verkenner.' : this.tr ? 'lightning.btc.tx.taxi bilgi amaçlı gezgininin kullanım koşulları.' : this.zh ? 'lightning.btc.tx.taxi作为信息浏览器的使用条款。' : this.ja ? 'lightning.btc.tx.taxiの情報提供エクスプローラーの利用規約。' : this.pt ? 'Termos de uso de lightning.btc.tx.taxi como explorador informativo Lightning.' : this.ru ? 'Условия использования lightning.btc.tx.taxi как информационного обозревателя Lightning.' : this.it ? 'Termini di utilizzo di lightning.btc.tx.taxi come esploratore informativo Lightning.' : this.fr ? 'Conditions d’utilisation de lightning.btc.tx.taxi comme explorateur informatif des nœuds et canaux Lightning.' : this.de ? 'Nutzungsbedingungen für lightning.btc.tx.taxi als Informations-Explorer für Lightning-Knoten und -Kanäle.' : this.es ? 'Términos de uso de lightning.btc.tx.taxi como explorador informativo de nodos y canales Lightning.' : 'Terms for using lightning.btc.tx.taxi as an informational Lightning node and channel explorer.');
  }
}
