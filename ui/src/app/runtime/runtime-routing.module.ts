import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RuntimeAppsComponent } from './runtime-apps/runtime-apps.component';
import { AuthGuard } from '../auth/support/auth.guard';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'runtime/apps',
            canActivate: [AuthGuard],
            component: RuntimeAppsComponent,
            data: {
              authenticate: true,
              roles: ['ROLE_VIEW'],
              feature: 'streamsEnabled'
            },
        }
    ])],
    exports: [RouterModule]
})
export class RuntimeAppsRoutingModule {
}
