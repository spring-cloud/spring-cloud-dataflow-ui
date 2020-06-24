import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DevRoutingModule } from './dev-routing.module';
import { StreamCreateComponent } from './dashboard/stream-create/stream-create.component';
import { TaskCreateComponent } from './dashboard/task-create/task-create.component';

@NgModule({
  declarations: [
    DashboardComponent,
    StreamCreateComponent,
    TaskCreateComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DevRoutingModule
  ]
})
export class DevModule { }
