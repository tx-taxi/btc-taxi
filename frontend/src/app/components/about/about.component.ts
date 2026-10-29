import { ChangeDetectionStrategy, Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { SeoService } from '@app/services/seo.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  constructor(
    private seoService: SeoService,
    @Inject(LOCALE_ID) private locale: string,
  ) { }

  ngOnInit(): void {
    const lang = this.locale.toLowerCase().split(/[-_]/)[0];
    const titles: Record<string, string> = { es: 'Acerca de btc.tx.taxi', fr: 'À propos de btc.tx.taxi', de: 'Über btc.tx.taxi', it: 'Informazioni su btc.tx.taxi', pt: 'Sobre btc.tx.taxi', ru: 'О btc.tx.taxi', ja: 'btc.tx.taxiについて', zh: '关于btc.tx.taxi' };
    const descriptions: Record<string, string> = {
      es: 'Conoce btc.tx.taxi, un explorador de bloques y mempool de Bitcoin de la familia multicadena tx.taxi.',
      fr: 'Découvrez btc.tx.taxi, un explorateur de blocs et du mempool Bitcoin de la famille multichaîne tx.taxi.',
      de: 'Lerne btc.tx.taxi kennen, einen Bitcoin-Block- und Mempool-Explorer der Multichain-Familie tx.taxi.',
      it: 'Scopri btc.tx.taxi, un esploratore di blocchi e mempool Bitcoin della famiglia multichain tx.taxi.',
      pt: 'Conheça btc.tx.taxi, um explorador de blocos e mempool Bitcoin da família multicadeia tx.taxi.',
      zh: '了解btc.tx.taxi，tx.taxi多链家族的Bitcoin区块和内存池浏览器。',
      ja: 'tx.taxiファミリーのBitcoinブロックとメンプールのエクスプローラー、btc.tx.taxiについて紹介します。',
      ru: 'Узнайте о btc.tx.taxi — обозревателе блоков и мемпула Bitcoin из мультичейн-семейства tx.taxi.',
    };
    this.seoService.setTitle(titles[lang] || 'About btc.tx.taxi');
    this.seoService.setDescription(descriptions[lang] || 'Learn about btc.tx.taxi, a Bitcoin block and mempool explorer in the tx.taxi multi-chain family.');
  }
}
