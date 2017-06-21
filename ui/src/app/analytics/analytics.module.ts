import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AnalyticsComponent } from './analytics.component';
import { AnalyticsService } from './analytics.service';
import { AnalyticsRoutingModule } from './analytics-routing.module';

@NgModule({
  imports:      [ AnalyticsRoutingModule, SharedModule ],
  declarations: [ AnalyticsComponent ],
  providers:    [ AnalyticsService ]
})
export class AnalyticsModule { }
