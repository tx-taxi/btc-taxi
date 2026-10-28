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

  ngOnInit(): void {
    this.seoService.setTitle(this.es ? 'Política de privacidad' : 'Privacy Policy');
    this.seoService.setDescription(this.es ? 'Información de privacidad de lightning.btc.tx.taxi sobre datos públicos de Lightning, preferencias del navegador, registros del servidor y verificación independiente.' : 'Privacy notes for lightning.btc.tx.taxi, including public Lightning data, browser preferences, server logs, and independent verification.');
  }
}
