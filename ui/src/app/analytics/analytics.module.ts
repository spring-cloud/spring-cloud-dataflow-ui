import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AnalyticsComponent } from './analytics.component';
import { CountersComponent } from './counters/counters.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AnalyticsService } from './analytics.service';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { GraphChartComponent } from './charts/graph-chart/graph-chart.component';
import { CounterHeaderComponent } from './components/counter-header.component';

@NgModule({
  imports:      [ AnalyticsRoutingModule, SharedModule ],
  declarations: [
    AnalyticsComponent,
    BarChartComponent,
    CountersComponent,
    CounterHeaderComponent,
    DashboardComponent,
    GraphChartComponent ],
  providers:    [ AnalyticsService ]
})
export class AnalyticsModule { }
