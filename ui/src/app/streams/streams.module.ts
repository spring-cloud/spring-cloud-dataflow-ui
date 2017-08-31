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
import { StreamCreateDialogComponent } from './stream-create/stream.create.dialog.component';
import { PropertiesDialogComponent } from './flo/properties/properties.dialog.component';
import { ContentAssistService } from './flo/content.assist.service';

import { AppsModule } from '../apps/apps.module'; //TODO: Remove when moved to SharedModule

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

    AppsModule //TODO: Remove when moved to SharedModule
  ],
  declarations: [
    StreamsComponent,
    StreamCreateComponent,
    StreamDefinitionsComponent,
    StreamDetailsComponent,
    StreamDeployComponent,
    StreamCreateDialogComponent,
    PropertiesDialogComponent
  ],
  entryComponents: [
    StreamCreateDialogComponent,
    PropertiesDialogComponent
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
