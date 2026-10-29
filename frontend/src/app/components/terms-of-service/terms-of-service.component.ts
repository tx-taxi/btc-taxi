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

  ngOnInit(): void {
    this.seoService.setTitle(this.zh ? '服务条款' : this.ja ? '利用規約' : this.pt ? 'Termos de serviço' : this.ru ? 'Условия использования' : this.it ? 'Termini di servizio' : this.fr ? 'Conditions d’utilisation' : this.de ? 'Nutzungsbedingungen' : this.es ? 'Términos de servicio' : 'Terms of Service');
    this.seoService.setDescription(this.zh ? 'btc.tx.taxi作为信息浏览器的使用条款。' : this.ja ? 'btc.tx.taxiの情報提供エクスプローラーの利用規約。' : this.pt ? 'Termos de uso de btc.tx.taxi como explorador informativo Bitcoin.' : this.ru ? 'Условия использования btc.tx.taxi как информационного обозревателя Bitcoin.' : this.it ? 'Termini di utilizzo di btc.tx.taxi come esploratore informativo Bitcoin.' : this.fr ? 'Conditions d’utilisation de btc.tx.taxi comme explorateur informatif des blocs et du mempool Bitcoin.' : this.de ? 'Nutzungsbedingungen für btc.tx.taxi als Informations-Explorer für Bitcoin-Blöcke und den Mempool.' : this.es ? 'Términos de uso de btc.tx.taxi como explorador informativo de bloques y mempool de Bitcoin.' : 'Terms for using btc.tx.taxi as an informational Bitcoin block and mempool explorer.');
  }
}
