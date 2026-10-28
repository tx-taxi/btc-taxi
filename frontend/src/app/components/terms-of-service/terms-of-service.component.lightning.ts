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

  ngOnInit(): void {
    this.seoService.setTitle(this.es ? 'Términos de servicio' : 'Terms of Service');
    this.seoService.setDescription(this.es ? 'Términos de uso de lightning.btc.tx.taxi como explorador informativo de nodos y canales Lightning.' : 'Terms for using lightning.btc.tx.taxi as an informational Lightning node and channel explorer.');
  }
}
