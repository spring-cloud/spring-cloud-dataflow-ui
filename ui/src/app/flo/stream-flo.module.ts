import { NgModule } from '@angular/core';
import { GraphViewComponent } from './shared/graph-view/graph-view.component';
import { DocService } from './shared/service/doc.service';
import { MessageRateComponent } from './stream/message-rate/message-rate.component';
import { InstanceDotComponent } from './stream/instance-dot/instance-dot.component';
import { StreamNodeComponent } from './stream/node/stream-node.component';
import { StreamPropertiesDialogComponent } from './stream/properties/stream-properties-dialog.component';
import { EditorService } from './stream/editor.service';
import { MetamodelService } from './stream/metamodel.service';
import { RenderService } from './stream/render.service';
import { StreamFloViewComponent } from './stream/component/view.component';
import { FloModule } from 'spring-flo';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ParserService } from './shared/service/parser.service';
import { StreamFloCreateComponent } from './stream/component/create.component';
import { ContentAssistService } from './stream/content-assist.service';
import { ClarityModule } from '@clr/angular';
import { SharedFloModule } from './shared-flo.module';
import { SharedModule } from '../shared/shared.module';
import { RuntimeStreamFloViewComponent } from './stream/component/runtime-view.component';
import { NodeHelper } from './stream/node-helper.service';
import { PropertiesEditor } from './stream/properties-editor.service';
import { SanitizeDsl } from './stream/dsl-sanitize.service';

@NgModule({
  declarations: [
    GraphViewComponent,
    MessageRateComponent,
    InstanceDotComponent,
    StreamNodeComponent,
    StreamPropertiesDialogComponent,
    StreamFloViewComponent,
    RuntimeStreamFloViewComponent,
    StreamFloCreateComponent,
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
    NodeHelper,
    PropertiesEditor,
    SanitizeDsl,
  ],
  exports: [
    StreamFloViewComponent,
    RuntimeStreamFloViewComponent,
    StreamFloCreateComponent
  ]
})

export class StreamFloModule {
}
