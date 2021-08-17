import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TasksJobsRoutingModule} from './tasks-jobs-routing.module';
import {TasksComponent} from './tasks/tasks.component';
import {JobsComponent} from './jobs/jobs.component';
import {ExecutionsComponent} from './executions/executions.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {DestroyComponent} from './tasks/destroy/destroy.component';
import {DestroyComponent as DestroyScheduleComponent} from './schedules/destroy/destroy.component';
import {TaskComponent} from './tasks/task/task.component';
import {LaunchComponent} from './tasks/launch/launch.component';
import {FreeTextComponent} from './tasks/launch/free-text/free-text.component';
import {BuilderComponent} from './tasks/launch/builder/builder.component';
import {SharedModule} from '../shared/shared.module';
import {ExecutionComponent} from './executions/execution/execution.component';
import {ExecutionComponent as JobExecutionComponent} from './jobs/execution/execution.component';
import {StopComponent} from './executions/stop/stop.component';
import {CleanupComponent} from './executions/cleanup/cleanup.component';
import {CleanupComponent as CleanupTaskComponent} from './tasks/cleanup/cleanup.component';
import {StepComponent} from './jobs/step/step.component';
import {CreateComponent} from './tasks/create/create.component';
import {CreateComponent as CreateScheduleComponent} from './schedules/create/create.component';
import {TaskFloModule} from '../flo/task-flo.module';
import {LogComponent} from './executions/execution/log/log.component';
import {SchedulesComponent} from './schedules/schedules.component';
import {ScheduleComponent} from './schedules/schedule/schedule.component';
import {SecurityModule} from '../security/security.module';
import {PlatformFilterComponent} from './schedules/platform.filter';
import {CloneComponent} from './tasks/clone/clone.component';
import {SharedFloModule} from '../flo/shared-flo.module';
import {ErrorsComponent} from './tasks/launch/builder/errors/errors.component';

@NgModule({
  declarations: [
    TasksComponent,
    JobsComponent,
    ExecutionsComponent,
    DestroyComponent,
    TaskComponent,
    LaunchComponent,
    FreeTextComponent,
    BuilderComponent,
    ExecutionComponent,
    StopComponent,
    CleanupComponent,
    JobExecutionComponent,
    StepComponent,
    CreateComponent,
    LogComponent,
    SchedulesComponent,
    DestroyScheduleComponent,
    ScheduleComponent,
    CreateScheduleComponent,
    PlatformFilterComponent,
    CleanupTaskComponent,
    CloneComponent,
    ErrorsComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
    ReactiveFormsModule,
    SharedModule,
    SharedFloModule,
    TasksJobsRoutingModule,
    FormsModule,
    TaskFloModule,
    SecurityModule
  ]
})
export class TasksJobsModule {}
