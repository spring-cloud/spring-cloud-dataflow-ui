import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AnalyticsComponent } from './analytics.component';
import { CountersComponent } from './counters/counters.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'analytics',
      component: AnalyticsComponent,
      data: {
        authenticate: true,
        roles: ['ROLE_VIEW'],
        feature: 'analyticsEnabled'
      },
      children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: 'dashboard'
        },
        {
          path: 'dashboard',
          component: DashboardComponent,
        },
        {
          path: 'counters',
          component: CountersComponent,
        }
      ]
    }
  ])],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule {}
