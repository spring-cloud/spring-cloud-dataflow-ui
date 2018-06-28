import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FloModule } from 'spring-flo';
import { TaskExecutionsComponent } from './task-executions/task-executions.component';
import { TaskLaunchComponent } from './task-launch/task-launch.component';
import { TasksService } from './tasks.service';
import { TasksRoutingModule } from './tasks-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, ModalModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { AuthModule } from '../auth/auth.module';
import { TaskGraphViewComponent } from './components/flo/task-graph-view/task-graph-view.component';
import { MetamodelService } from './components/flo/metamodel.service';
import { RenderService } from './components/flo/render.service';
import { EditorService } from './components/flo/editor.service';
import { NodeComponent } from './components/flo/node/node.component';
import { ToolsService } from './components/flo/tools.service';
import { TaskPropertiesDialogComponent } from './components/flo/properties/task-properties-dialog-component';
import { DecorationComponent } from '../shared/flo/decoration/decoration.component';
import { HandleComponent } from '../shared/flo/handle/handle.component';
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
import { TaskDefinitionExecutionsComponent } from './task-definition/executions/task-definition-executions.component';

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
    NodeComponent,
    TaskPropertiesDialogComponent,
    TaskDefinitionComponent,
    TaskStatusComponent,
    TaskDefinitionsDestroyComponent,
    TaskDefinitionsComponent,
    TaskSummaryComponent,
    TaskGraphComponent,
    TasksTabulationComponent,
    TaskDefinitionExecutionsComponent
  ],
  entryComponents: [
    NodeComponent,
    TaskDefinitionCreateDialogComponent,
    TaskPropertiesDialogComponent,
    DecorationComponent,
    HandleComponent,
    TaskDefinitionsDestroyComponent
  ],
  providers: [
    TasksService,
    MetamodelService,
    RenderService,
    EditorService,
    ToolsService,
    ContentAssistService
  ]
})
export class TasksModule {
}
