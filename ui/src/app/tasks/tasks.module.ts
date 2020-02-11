import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FloModule } from 'spring-flo';
import { TaskExecutionsComponent } from './task-executions/task-executions.component';
import { TaskLaunchComponent } from './task-launch/task-launch.component';
import { TasksService } from './tasks.service';
import { TasksRoutingModule } from './tasks-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import {
  BsDropdownModule, ModalModule, PopoverModule, TimepickerModule,
  TooltipModule
} from 'ngx-bootstrap';
import { AuthModule } from '../auth/auth.module';
import { TaskGraphViewComponent } from './components/flo/task-graph-view/task-graph-view.component';
import { MetamodelService } from './components/flo/metamodel.service';
import { RenderService } from './components/flo/render.service';
import { EditorService } from './components/flo/editor.service';
import { TaskNodeComponent } from './components/flo/node/task-node.component';
import { ToolsService } from './components/flo/tools.service';
import { TaskPropertiesDialogComponent } from './components/flo/properties/task-properties-dialog-component';
import { ContentAssistService } from './components/flo/content-assist.service';
import { TasksComponent } from './tasks/tasks.components';
import { TaskDefinitionCreateComponent } from './task-definition-create/task-definition-create.component';
import { TaskDefinitionCreateDialogComponent } from './task-definition-create/create-dialog/create-dialog.component';
import { TaskExecutionComponent } from './task-execution/task-execution.component';
import { TaskDefinitionComponent } from './task-definition/task-definition.component';
import { TaskStatusComponent } from './components/task-status/task-status.component';
import { TaskDefinitionsDestroyComponent } from './task-definitions-destroy/task-definitions-destroy.component';
import { TaskDefinitionsComponent } from './task-definitions/task-definitions.component';
import { TaskGraphComponent } from './task-definition/graph/task-graph.component';
import { TaskSummaryComponent } from './task-definition/summary/task-summary.component';
import { AppsModule } from '../apps/apps.module';
import { TasksTabulationComponent } from './components/tasks-tabulation/tasks-tabulation.component';
import { TaskSchedulesComponent } from './task-schedules/task-schedules.component';
import { TaskScheduleCreateComponent } from './task-schedule-create/task-schedule-create.component';
import { TaskScheduleComponent } from './task-schedule/task-schedule.component';
import { TaskScheduleSummaryComponent } from './task-schedule/summary/task-schedule-summary.component';
import { TaskSchedulesDestroyComponent } from './task-schedules-destroy/task-schedules-destroy.component';
import { TaskDefinitionScheduleComponent } from './task-definition/schedules/task-definition-schedules.component';
import { TaskDefinitionExecutionsComponent } from './task-definition/executions/task-definition-executions.component';
import { TaskSchedulesFilterPipe } from './task-schedules/task-schedules.filter';
import { TaskExecutionsStopComponent } from './task-executions-stop/task-executions-stop.component';
import { TaskExecutionsDestroyComponent } from './task-executions-destroy/task-executions-destroy.component';
import { TasksUtilsComponent } from './tasks-utils/tasks-utils.component';
import { TasksImportComponent } from './tasks-utils/tasks-import/tasks-import.component';
import { TasksExportComponent } from './tasks-utils/tasks-export/tasks-export.component';
import { TasksUtilsService } from './tasks-utils/tasks-utils.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  imports: [
    TasksRoutingModule,
    SharedModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    AppsModule,
    AuthModule,
    FloModule
  ],
  declarations: [
    TasksComponent,
    TaskDefinitionCreateComponent,
    TaskDefinitionCreateDialogComponent,
    TaskExecutionsComponent,
    TaskExecutionComponent,
    TaskLaunchComponent,
    TaskGraphViewComponent,
    TaskNodeComponent,
    TaskPropertiesDialogComponent,
    TaskDefinitionComponent,
    TaskStatusComponent,
    TaskDefinitionsDestroyComponent,
    TaskDefinitionsComponent,
    TaskSummaryComponent,
    TaskGraphComponent,
    TasksTabulationComponent,
    TaskSchedulesComponent,
    TaskScheduleCreateComponent,
    TaskScheduleComponent,
    TaskScheduleSummaryComponent,
    TaskSchedulesDestroyComponent,
    TaskDefinitionScheduleComponent,
    TaskDefinitionExecutionsComponent,
    TaskSchedulesFilterPipe,
    TaskExecutionsStopComponent,
    TaskExecutionsDestroyComponent,
    TasksUtilsComponent,
    TasksImportComponent,
    TasksExportComponent
  ],
  entryComponents: [
    TaskNodeComponent,
    TaskDefinitionCreateDialogComponent,
    TaskPropertiesDialogComponent,
    TaskDefinitionsDestroyComponent,
    TaskSchedulesDestroyComponent,
    TaskExecutionsStopComponent,
    TaskExecutionsDestroyComponent
  ],
  providers: [
    TasksService,
    MetamodelService,
    RenderService,
    EditorService,
    ToolsService,
    ContentAssistService,
    TasksUtilsService
  ],
  exports: [
    TaskStatusComponent
  ]
})
export class TasksModule {
}
