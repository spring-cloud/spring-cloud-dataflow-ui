import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { FloModule } from 'spring-flo';
import { DocService } from './shared/service/doc.service';
import { EditorService } from './task/editor.service';
import { MetamodelService } from './task/metamodel.service';
import { RenderService } from './task/render.service';
import { ParserService } from './shared/service/parser.service';
import { ContentAssistService } from './task/content-assist.service';
import { TaskNodeComponent } from './task/node/task-node.component';
import { TaskPropertiesDialogComponent } from './task/properties/task-properties-dialog-component';
import { ViewComponent } from './task/component/view.component';
import { TaskFloCreateComponent } from './task/component/create.component';
import { ToolsService } from './task/tools.service';
import { SharedFloModule } from './shared-flo.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    TaskNodeComponent,
    TaskPropertiesDialogComponent,
    ViewComponent,
    TaskFloCreateComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    FloModule,
    SharedFloModule,
    SharedModule
  ],
  providers: [
    DocService,
    EditorService,
    MetamodelService,
    RenderService,
    ParserService,
    ContentAssistService,
    ToolsService
  ],
  exports: [
    ViewComponent,
    TaskFloCreateComponent
  ]
})

export class TaskFloModule {
}
