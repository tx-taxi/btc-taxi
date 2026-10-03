import { Component } from '@angular/core';
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
  ) { }

  ngOnInit(): void {
    this.seoService.setTitle('Privacy Policy');
    this.seoService.setDescription('Privacy notes for lightning.btc.tx.taxi, including public Lightning data, browser preferences, server logs, and independent verification.');
  }
}
