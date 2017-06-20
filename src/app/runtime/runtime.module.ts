import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { RuntimeComponent } from './runtime.component';
import { RuntimeService } from './runtime.service';
import { RuntimeRoutingModule } from './runtime-routing.module';

@NgModule({
  imports:      [ RuntimeRoutingModule, SharedModule ],
  declarations: [ RuntimeComponent ],
  providers:    [ RuntimeService ]
})
export class RuntimeModule { }
