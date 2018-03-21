import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {StreamsService} from './streams.service';
import {StreamsRoutingModule} from './streams-routing.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {StreamsComponent} from './streams/streams.component';
import {StreamDeployComponent} from './stream-deploy/stream-deploy.component';
import {StreamCreateComponent} from './stream-create/stream-create.component';
import {AlertModule, BsDropdownModule, ModalModule, PopoverModule} from 'ngx-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';
import {FloModule} from 'spring-flo';
import {AuthModule} from '../auth/auth.module';
import {ProgressbarModule} from 'ngx-bootstrap';
import {MetamodelService} from './components/flo/metamodel.service';
import {RenderService} from './components/flo/render.service';
import {EditorService} from './components/flo/editor.service';
import {StreamCreateDialogComponent} from './stream-create/create-dialog/create-dialog.component';
import {StreamPropertiesDialogComponent} from './components/flo/properties/stream-properties-dialog.component';
import {ContentAssistService} from './components/flo/content-assist.service';
import {TooltipModule} from 'ngx-bootstrap';
import {NodeComponent} from './components/flo/node/node.component';
import {DecorationComponent} from '../shared/flo/decoration/decoration.component';
import {HandleComponent} from '../shared/flo/handle/handle.component';
import {InstanceDotComponent} from './components/flo/instance-dot/instance-dot.component';
import {MessageRateComponent} from './components/flo/message-rate/message-rate.component';
import {DeploymentPropertiesComponent} from './streams/deployment-properties/deployment-properties.component';
import {DeploymentPropertiesInfoComponent} from './streams/deployment-properties-info/deployment-properties-info.component';
import {StreamsDeployComponent} from './streams-deploy/streams-deploy.component';
import {StreamsUndeployComponent} from './streams-undeploy/streams-undeploy.component';
import {StreamsDestroyComponent} from './streams-destroy/streams-destroy.component';
import {StreamStatusComponent} from './components/stream-status/stream-status.component';
import {AppsModule} from '../apps/apps.module';
import {StreamDeployPropertiesDebugComponent} from './stream-deploy/properties-debug/properties-debug.component';
import {StreamGraphDefinitionComponent} from './components/stream-graph-definition/stream-graph-definition.component';
import {StreamDeployService} from './stream-deploy/stream-deploy.service';
import {StreamDeployAppPropertiesComponent} from './stream-deploy/app-properties/app-properties.component';
import {StreamComponent} from './stream/stream.component';
import {StreamGraphComponent} from './stream/graph/stream-graph.component';
import {StreamSummaryComponent} from './stream/summary/stream-summary.component';

@NgModule({
  imports: [
    StreamsRoutingModule,
    SharedModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    BsDropdownModule.forRoot(),
    AppsModule,
    FloModule,
    AuthModule,
    ProgressbarModule,
    TooltipModule.forRoot()
  ],
  declarations: [
    StreamCreateComponent,
    StreamsComponent,
    StreamComponent,
    StreamDeployComponent,
    StreamCreateDialogComponent,
    StreamPropertiesDialogComponent,
    NodeComponent,
    InstanceDotComponent,
    MessageRateComponent,
    DeploymentPropertiesComponent,
    DeploymentPropertiesInfoComponent,
    StreamsDeployComponent,
    StreamStatusComponent,
    StreamsUndeployComponent,
    StreamsDestroyComponent,
    StreamDeployPropertiesDebugComponent,
    StreamGraphDefinitionComponent,
    StreamDeployAppPropertiesComponent,
    StreamGraphComponent,
    StreamSummaryComponent
  ],
  entryComponents: [
    StreamCreateDialogComponent,
    StreamPropertiesDialogComponent,
    NodeComponent,
    StreamsDeployComponent,
    DecorationComponent,
    HandleComponent,
    InstanceDotComponent,
    MessageRateComponent,
    StreamsUndeployComponent,
    StreamsDestroyComponent,
    StreamDeployAppPropertiesComponent
  ],
  providers: [
    StreamsService,
    MetamodelService,
    RenderService,
    EditorService,
    ContentAssistService,
    StreamDeployService
  ]
})
export class StreamsModule {
}
