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
    const titles: Record<string, string> = { sv: 'Om btc.tx.taxi', nb: 'Om btc.tx.taxi', uk: 'Про btc.tx.taxi', pl: 'O btc.tx.taxi', ko: 'btc.tx.taxi 소개', es: 'Acerca de btc.tx.taxi', fr: 'À propos de btc.tx.taxi', de: 'Über btc.tx.taxi', it: 'Informazioni su btc.tx.taxi', pt: 'Sobre btc.tx.taxi', ru: 'О btc.tx.taxi', ja: 'btc.tx.taxiについて', zh: '关于btc.tx.taxi', tr: 'btc.tx.taxi hakkında', nl: 'Over btc.tx.taxi' };
    const descriptions: Record<string, string> = {
      sv: 'Läs om btc.tx.taxi, en Bitcoin-block- och mempoolutforskare i tx.taxis flerkedjefamilj.',
      nb: 'Les om btc.tx.taxi, en Bitcoin-blokk- og mempoolutforsker i tx.taxis flerkjedefamilie.',
      uk: 'Дізнайтеся про btc.tx.taxi — оглядач блоків і мемпулу Bitcoin із багатоланцюгової родини tx.taxi.',
      pl: 'Poznaj btc.tx.taxi, eksplorator bloków i mempoola Bitcoin z wielosieciowej rodziny tx.taxi.',
      ko: '여러 체인을 지원하는 tx.taxi의 Bitcoin 블록 및 멤풀 탐색기 btc.tx.taxi를 알아보세요.',
      es: 'Conoce btc.tx.taxi, un explorador de bloques y mempool de Bitcoin de la familia multicadena tx.taxi.',
      fr: 'Découvrez btc.tx.taxi, un explorateur de blocs et du mempool Bitcoin de la famille multichaîne tx.taxi.',
      de: 'Lerne btc.tx.taxi kennen, einen Bitcoin-Block- und Mempool-Explorer der Multichain-Familie tx.taxi.',
      it: 'Scopri btc.tx.taxi, un esploratore di blocchi e mempool Bitcoin della famiglia multichain tx.taxi.',
      pt: 'Conheça btc.tx.taxi, um explorador de blocos e mempool Bitcoin da família multicadeia tx.taxi.',
      nl: 'Ontdek btc.tx.taxi, de Bitcoin-blok- en mempoolverkenner van de multichainfamilie tx.taxi.',
      tr: 'tx.taxi çok zincirli ailesinin Bitcoin blok ve mempool gezgini btc.tx.taxi hakkında bilgi edinin.',
      zh: '了解btc.tx.taxi，tx.taxi多链家族的Bitcoin区块和内存池浏览器。',
      ja: 'tx.taxiファミリーのBitcoinブロックとメンプールのエクスプローラー、btc.tx.taxiについて紹介します。',
      ru: 'Узнайте о btc.tx.taxi — обозревателе блоков и мемпула Bitcoin из мультичейн-семейства tx.taxi.',
    };
    this.seoService.setTitle(titles[lang] || 'About btc.tx.taxi');
    this.seoService.setDescription(descriptions[lang] || 'Learn about btc.tx.taxi, a Bitcoin block and mempool explorer in the tx.taxi multi-chain family.');
  }
}
