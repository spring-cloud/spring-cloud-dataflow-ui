import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AnalyticsComponent } from './analytics.component';
import { CountersComponent } from './counters/counters.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../auth/support/auth.guard';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'analytics',
      canActivate: [AuthGuard],
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
