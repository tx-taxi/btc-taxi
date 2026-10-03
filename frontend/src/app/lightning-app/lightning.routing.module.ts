import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LightningDashboardComponent } from '@app/lightning/lightning-dashboard/lightning-dashboard.component';
import { LightningWrapperComponent } from '@app/lightning/lightning-wrapper/lightning-wrapper.component';
import { NodeComponent } from '@app/lightning/node/node.component';
import { ChannelComponent } from '@app/lightning/channel/channel.component';
import { NodesPerCountry } from '@app/lightning/nodes-per-country/nodes-per-country.component';
import { NodesPerISP } from '@app/lightning/nodes-per-isp/nodes-per-isp.component';
import { NodesRanking } from '@app/lightning/nodes-ranking/nodes-ranking.component';
import { NodesRankingsDashboard } from '@app/lightning/nodes-rankings-dashboard/nodes-rankings-dashboard.component';
import { GroupComponent } from '@app/lightning/group/group.component';
import { JusticeList } from '@app/lightning/justice-list/justice-list.component';

import { NodesNetworksChartComponent } from '@app/lightning/nodes-networks-chart/nodes-networks-chart.component';
import { LightningStatisticsChartComponent } from '@app/lightning/statistics-chart/lightning-statistics-chart.component';
import { NodesPerISPChartComponent } from '@app/lightning/nodes-per-isp-chart/nodes-per-isp-chart.component';
import { NodesPerCountryChartComponent } from '@app/lightning/nodes-per-country-chart/nodes-per-country-chart.component';
import { NodesMap } from '@app/lightning/nodes-map/nodes-map.component';
import { NodesChannelsMap } from '@app/lightning/nodes-channels-map/nodes-channels-map.component';

import { GraphsComponent } from '@app/lightning-app/graphs.component';

const routes: Routes = [
    {
      path: '',
      component: LightningWrapperComponent,
      children: [
        {path:'lightning',redirectTo:'',pathMatch:'full'},
        {path:'lightning/node/:public_key',redirectTo:'node/:public_key'},
        {path:'lightning/channel/:short_id',redirectTo:'channel/:short_id'},
        {path:'graphs/lightning/:graph',redirectTo:'graphs/:graph'},
        {path:'graphs',component:GraphsComponent,children:[
          {path:'',redirectTo:'capacity',pathMatch:'full'},
          {path:'capacity',component:LightningStatisticsChartComponent},
          {path:'nodes-networks',component:NodesNetworksChartComponent},
          {path:'nodes-per-isp',component:NodesPerISPChartComponent},
          {path:'nodes-per-country',component:NodesPerCountryChartComponent},
          {path:'nodes-map',component:NodesMap},
          {path:'nodes-channels-map',component:NodesChannelsMap},
        ]},
        {
          path: '',
          component: LightningDashboardComponent,
        },
        {
          path: 'node/:public_key',
          data: { networkSpecific: true },
          component: NodeComponent,
        },
        {
          path: 'channel/:short_id',
          data: { networkSpecific: true },
          component: ChannelComponent,
        },
        {
          path: 'nodes/country/:country',
          component: NodesPerCountry,
        },
        {
          path: 'nodes/isp/:isp',
          component: NodesPerISP,
        },
        {
          path: 'group/the-mempool-open-source-project',
          component: GroupComponent,
        },
        {
          path: 'nodes/rankings',
          component: NodesRankingsDashboard,
        },
        {
          path: 'nodes/rankings/liquidity',
          component: NodesRanking,
          data: {
            type: 'capacity'
          },
        },
        {
          path: 'nodes/rankings/connectivity',
          component: NodesRanking,
          data: {
            type: 'channels'
          },
        },
        {
          path: 'nodes/oldest',
          component: NodesRanking,
          data: {
            type: 'oldest'
          },
        },
        {
          path: 'penalties',
          component: JusticeList,
        },
        {
          path: '**',
          redirectTo: ''
        }
      ]
    },
    {
      path: '**',
      redirectTo: ''
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LightningRoutingModule { }
