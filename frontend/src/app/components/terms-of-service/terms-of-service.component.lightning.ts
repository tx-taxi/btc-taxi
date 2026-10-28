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

  ngOnInit(): void {
    this.seoService.setTitle(this.fr ? 'Conditions d’utilisation' : this.de ? 'Nutzungsbedingungen' : this.es ? 'Términos de servicio' : 'Terms of Service');
    this.seoService.setDescription(this.fr ? 'Conditions d’utilisation de lightning.btc.tx.taxi comme explorateur informatif des nœuds et canaux Lightning.' : this.de ? 'Nutzungsbedingungen für lightning.btc.tx.taxi als Informations-Explorer für Lightning-Knoten und -Kanäle.' : this.es ? 'Términos de uso de lightning.btc.tx.taxi como explorador informativo de nodos y canales Lightning.' : 'Terms for using lightning.btc.tx.taxi as an informational Lightning node and channel explorer.');
  }
}
