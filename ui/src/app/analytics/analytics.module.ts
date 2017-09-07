import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AnalyticsComponent } from './analytics.component';
import { CountersComponent } from './counters/counters.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AnalyticsService } from './analytics.service';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { GraphChartComponent } from './charts/graph-chart/graph-chart.component';

@NgModule({
  imports:      [ AnalyticsRoutingModule, SharedModule ],
  declarations: [ AnalyticsComponent, CountersComponent, DashboardComponent, GraphChartComponent ],
  providers:    [ AnalyticsService ]
})
export class AnalyticsModule { }
