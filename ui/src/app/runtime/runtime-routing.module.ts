import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {RuntimeAppsComponent} from './runtime-apps.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'runtime/apps',
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
