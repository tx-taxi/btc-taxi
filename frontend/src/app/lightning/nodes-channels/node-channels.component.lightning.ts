import { ChangeDetectorRef as TaxiChangeDetectorRef } from '@angular/core';
import { ThemeService as TaxiThemeService } from '@app/services/theme.service';
import { lightningColor } from '@app/lightning-app/chart-palette';
import { formatNumber } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, LOCALE_ID, NgZone, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption, TreemapSeriesOption } from '@app/graphs/echarts';
import { Observable, share, switchMap, tap } from 'rxjs';
import { lerpColor } from '@app/shared/graphs.utils';
import { AmountShortenerPipe } from '@app/shared/pipes/amount-shortener.pipe';
import { LightningApiService } from '@app/lightning/lightning-api.service';
import { RelativeUrlPipe } from '@app/shared/pipes/relative-url/relative-url.pipe';
import { StateService } from '@app/services/state.service';

@Component({
  selector: 'app-node-channels',
  templateUrl: './node-channels.component.html',
  styleUrls: ['./node-channels.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeChannels implements OnChanges {
  @Input() publicKey: string;

  chartInstance: any;
  chartOptions: EChartsOption = {};
  chartInitOptions = {
    renderer: 'svg',
  };

  channelsObservable$: Observable<any>;
  isLoading = true;

  private taxiChartArgs?: any[];
  private taxiThemeSubscription = this.taxiTheme.themeState$.subscribe(state => {
    if (!state.loading && this.taxiChartArgs) {(this.prepareChartOptions as any)(...this.taxiChartArgs);this.taxiCd.markForCheck();}
  });

  constructor(
    private taxiTheme: TaxiThemeService,
    private taxiCd: TaxiChangeDetectorRef,
    @Inject(LOCALE_ID) public locale: string,
    private lightningApiService: LightningApiService,
    private amountShortenerPipe: AmountShortenerPipe,
    private zone: NgZone,
    private router: Router,
    public stateService: StateService,
  ) {}

  ngOnChanges(): void {
    this.prepareChartOptions(null);

    this.channelsObservable$ = this.lightningApiService.getChannelsByNodeId$(this.publicKey, -1, 'active')
      .pipe(
        switchMap((response) => {
          this.isLoading = true;
          if ((response.body?.length ?? 0) <= 0) {
            this.isLoading = false;
            return [''];
          }
          return [response.body];
        }),
        tap((body: any[]) => {
          if (body.length === 0 || body[0].length === 0) {
            return;
          }
          const biggestCapacity = body[0].capacity;
          this.prepareChartOptions(body.map(channel => {
            return {
              name: channel.node.alias,
              value: channel.capacity,
              shortId: channel.short_id,
              id: channel.id,
              itemStyle: {
                color: lerpColor(lightningColor('#1E88E5'), lightningColor('#D81B60'), Math.pow(channel.capacity / biggestCapacity, 0.4)),
              }
            };
          }));
          this.isLoading = false;
        }),
        share(),
      );
  }

  prepareChartOptions(data): void {
    this.taxiChartArgs = Array.from(arguments);
    if (data?.length) { const maximum=Math.max(...data.map(channel=>channel.value));data=data.map(channel=>({...channel,itemStyle:{...channel.itemStyle,color:lerpColor(lightningColor('#1E88E5'),lightningColor('#D81B60'),Math.pow(channel.value/maximum,0.4))}})); }
    this.chartOptions = {
      tooltip: {
        trigger: 'item',
        textStyle: {
          align: 'left',
        }
      },
      series: <TreemapSeriesOption[]>[
        {
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          roam: false,
          type: 'treemap',
          data: data,
          nodeClick: 'link',
          progressive: 100,
          tooltip: {
            show: true,
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--tooltip-bg').trim() || getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#202026',
            borderRadius: 4,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            textStyle: {
              color: 'var(--tooltip-grey)',
            },
            borderColor: '#000',
            formatter: (value): string => {
              if (value.data.name === undefined) {
                return ``;
              }
              let capacity = '';
              if (value.data.value > 100000000) {
                capacity = formatNumber(Math.round(value.data.value / 100000000), this.locale, '1.2-2') + ' BTC';
              } else {
                capacity = <string>this.amountShortenerPipe.transform(value.data.value, 2) + ' sats';
              }

              return `
                <b style="color: white; margin-left: 2px">${value.data.shortId}</b><br>
                <span>Node: ${value.name}</span><br>
                <span>Capacity: ${capacity}</span>
              `;
            }
          },
          itemStyle: {
            borderColor: 'black',
            borderWidth: 1,
          },
          breadcrumb: {
            show: false,
          }
        }
      ]
    };
  }

  onChartInit(ec: any): void {
    this.chartInstance = ec;

    this.chartInstance.on('click', (e) => {
      //@ts-ignore
      if (!e.data.id) {
        return;
      }
      this.zone.run(() => {
        //@ts-ignore
        const url = new RelativeUrlPipe(this.stateService).transform(`/lightning/channel/${e.data.id}`);
        this.router.navigate([url]);
      });
    });
  }
  ngOnDestroy(): void { this.taxiThemeSubscription.unsubscribe(); }

}
