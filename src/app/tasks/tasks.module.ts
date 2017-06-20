import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { TasksComponent } from './tasks.component';
import { TasksService } from './tasks.service';
import { TasksRoutingModule } from './tasks-routing.module';

@NgModule({
  imports:      [ TasksRoutingModule, SharedModule ],
  declarations: [ TasksComponent ],
  providers:    [ TasksService ]
})
export class TasksModule { }
