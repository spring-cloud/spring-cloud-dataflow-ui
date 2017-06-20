import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RuntimeComponent } from './runtime.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'runtime', component: RuntimeComponent }
  ])],
  exports: [RouterModule]
})
export class RuntimeRoutingModule {}
