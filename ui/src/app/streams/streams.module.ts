import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { StreamsService } from './streams.service';
import { StreamsRoutingModule } from './streams-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { StreamsComponent } from './streams.component';
import { StreamDefinitionsComponent } from './stream-definitions/stream-definitions.component';
import { StreamDetailsComponent } from './stream-details/stream-details.component';
import { StreamDeployComponent } from './stream-deploy/stream-deploy.component';
import { StreamCreateComponent } from './stream-create/stream-create.component';
import { AlertModule, ModalModule, PopoverModule } from 'ngx-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FloModule } from 'spring-flo';
import { AuthModule } from '../auth/auth.module';
import { ProgressbarModule } from 'ngx-bootstrap';
import { MetamodelService } from './flo/metamodel.service';
import { RenderService } from './flo/render.service';
import { EditorService } from './flo/editor.service';
import { StreamCreateDialogComponent } from './stream-create-dialog/stream-create-dialog.component';
import { StreamPropertiesDialogComponent } from './flo/properties/stream-properties-dialog.component';
import { ContentAssistService } from './flo/content-assist.service';
import { TooltipModule } from 'ngx-bootstrap';
import { NodeComponent } from './flo/node/node.component';
import { DecorationComponent } from '../shared/flo/decoration/decoration.component';
import { HandleComponent } from '../shared/flo/handle/handle.component';
import { StreamGraphDefinitionComponent } from './stream-graph-definition/stream-graph-definition.component';
import { InstanceDotComponent } from './flo/instance-dot/instance-dot.component';
import { MessageRateComponent } from './flo/message-rate/message-rate.component';
import {DeploymentPropertiesComponent} from './stream-definitions/deployment-properties/deployment-properties.component';

@NgModule({
  imports: [
    StreamsRoutingModule,
    SharedModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    FloModule,
    AuthModule,
    ProgressbarModule,
    TooltipModule.forRoot()
  ],
  declarations: [
    StreamsComponent,
    StreamCreateComponent,
    StreamDefinitionsComponent,
    StreamDetailsComponent,
    StreamDeployComponent,
    StreamCreateDialogComponent,
    StreamPropertiesDialogComponent,
    NodeComponent,
    StreamGraphDefinitionComponent,
    InstanceDotComponent,
    MessageRateComponent,
    DeploymentPropertiesComponent
  ],
  entryComponents: [
    StreamCreateDialogComponent,
    StreamPropertiesDialogComponent,
    NodeComponent,
    DecorationComponent,
    HandleComponent,
    InstanceDotComponent,
    MessageRateComponent
  ],
  providers: [
    StreamsService,
    MetamodelService,
    RenderService,
    EditorService,
    ContentAssistService
  ]
})
export class StreamsModule { }
