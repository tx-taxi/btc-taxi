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
  get sv(): boolean { return this.locale.startsWith('sv'); }
  get nb(): boolean { return this.locale.startsWith('nb'); }
  get uk(): boolean { return this.locale.startsWith('uk'); }
  get pl(): boolean { return this.locale.startsWith('pl'); }
  get ko(): boolean { return this.locale.startsWith('ko'); }

  ngOnInit(): void {
    this.seoService.setTitle(this.nb ? 'Bruksvilkår' : this.uk ? 'Умови використання' : this.pl ? 'Warunki korzystania' : this.ko ? '서비스 이용약관' : this.nl ? 'Gebruiksvoorwaarden' : this.tr ? 'Hizmet Koşulları' : this.zh ? '服务条款' : this.ja ? '利用規約' : this.pt ? 'Termos de serviço' : this.ru ? 'Условия использования' : this.it ? 'Termini di servizio' : this.fr ? 'Conditions d’utilisation' : this.de ? 'Nutzungsbedingungen' : this.es ? 'Términos de servicio' : 'Terms of Service');
    this.seoService.setDescription(this.nb ? 'Vilkår for bruk av btc.tx.taxi som informativ utforsker for Bitcoin-blokker og mempoolen.' : this.uk ? 'Умови використання btc.tx.taxi як інформаційного оглядача блоків і мемпулу Bitcoin.' : this.pl ? 'Warunki korzystania z btc.tx.taxi jako informacyjnego eksploratora bloków i mempoola Bitcoin.' : this.ko ? 'btc.tx.taxi 정보 제공 탐색기의 이용약관.' : this.nl ? 'Voorwaarden voor het gebruik van btc.tx.taxi als informatieve verkenner.' : this.tr ? 'btc.tx.taxi bilgi amaçlı gezgininin kullanım koşulları.' : this.zh ? 'btc.tx.taxi作为信息浏览器的使用条款。' : this.ja ? 'btc.tx.taxiの情報提供エクスプローラーの利用規約。' : this.pt ? 'Termos de uso de btc.tx.taxi como explorador informativo Bitcoin.' : this.ru ? 'Условия использования btc.tx.taxi как информационного обозревателя Bitcoin.' : this.it ? 'Termini di utilizzo di btc.tx.taxi come esploratore informativo Bitcoin.' : this.fr ? 'Conditions d’utilisation de btc.tx.taxi comme explorateur informatif des blocs et du mempool Bitcoin.' : this.de ? 'Nutzungsbedingungen für btc.tx.taxi als Informations-Explorer für Bitcoin-Blöcke und den Mempool.' : this.es ? 'Términos de uso de btc.tx.taxi como explorador informativo de bloques y mempool de Bitcoin.' : 'Terms for using btc.tx.taxi as an informational Bitcoin block and mempool explorer.');
  }
}
