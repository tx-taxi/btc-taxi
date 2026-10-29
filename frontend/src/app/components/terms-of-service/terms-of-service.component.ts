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

  ngOnInit(): void {
    this.seoService.setTitle(this.it ? 'Termini di servizio' : this.fr ? 'Conditions d’utilisation' : this.de ? 'Nutzungsbedingungen' : this.es ? 'Términos de servicio' : 'Terms of Service');
    this.seoService.setDescription(this.it ? 'Termini di utilizzo di btc.tx.taxi come esploratore informativo Bitcoin.' : this.fr ? 'Conditions d’utilisation de btc.tx.taxi comme explorateur informatif des blocs et du mempool Bitcoin.' : this.de ? 'Nutzungsbedingungen für btc.tx.taxi als Informations-Explorer für Bitcoin-Blöcke und den Mempool.' : this.es ? 'Términos de uso de btc.tx.taxi como explorador informativo de bloques y mempool de Bitcoin.' : 'Terms for using btc.tx.taxi as an informational Bitcoin block and mempool explorer.');
  }
}
