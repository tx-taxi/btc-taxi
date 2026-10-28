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

  ngOnInit(): void {
    this.seoService.setTitle(this.es ? 'Términos de servicio' : 'Terms of Service');
    this.seoService.setDescription(this.es ? 'Términos de uso de btc.tx.taxi como explorador informativo de bloques y mempool de Bitcoin.' : 'Terms for using btc.tx.taxi as an informational Bitcoin block and mempool explorer.');
  }
}
