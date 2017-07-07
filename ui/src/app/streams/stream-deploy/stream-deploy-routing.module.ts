import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {StreamDeployComponent} from "./stream-deploy.component";

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'streams/:streamname/deploy', component: StreamDeployComponent }
  ])],
  exports: [RouterModule]
})
export class StreamDeployRoutingModule {}
