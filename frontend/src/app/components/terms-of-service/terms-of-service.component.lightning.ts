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

  ngOnInit(): void {
    this.seoService.setTitle(this.tr ? 'Hizmet Koşulları' : this.zh ? '服务条款' : this.ja ? '利用規約' : this.pt ? 'Termos de serviço' : this.ru ? 'Условия использования' : this.it ? 'Termini di servizio' : this.fr ? 'Conditions d’utilisation' : this.de ? 'Nutzungsbedingungen' : this.es ? 'Términos de servicio' : 'Terms of Service');
    this.seoService.setDescription(this.tr ? 'lightning.btc.tx.taxi bilgi amaçlı gezgininin kullanım koşulları.' : this.zh ? 'lightning.btc.tx.taxi作为信息浏览器的使用条款。' : this.ja ? 'lightning.btc.tx.taxiの情報提供エクスプローラーの利用規約。' : this.pt ? 'Termos de uso de lightning.btc.tx.taxi como explorador informativo Lightning.' : this.ru ? 'Условия использования lightning.btc.tx.taxi как информационного обозревателя Lightning.' : this.it ? 'Termini di utilizzo di lightning.btc.tx.taxi come esploratore informativo Lightning.' : this.fr ? 'Conditions d’utilisation de lightning.btc.tx.taxi comme explorateur informatif des nœuds et canaux Lightning.' : this.de ? 'Nutzungsbedingungen für lightning.btc.tx.taxi als Informations-Explorer für Lightning-Knoten und -Kanäle.' : this.es ? 'Términos de uso de lightning.btc.tx.taxi como explorador informativo de nodos y canales Lightning.' : 'Terms for using lightning.btc.tx.taxi as an informational Lightning node and channel explorer.');
  }
}
