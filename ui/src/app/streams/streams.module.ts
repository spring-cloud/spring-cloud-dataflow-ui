import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamsRoutingModule } from './streams-routing.module';
import { RuntimeComponent } from './runtime/runtime.component';
import { StreamsComponent } from './streams/streams.component';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { StreamComponent } from './streams/stream/stream.component';
import { DeployComponent } from './streams/deploy/deploy.component';
import { UndeployComponent } from './streams/undeploy/undeploy.component';
import { DestroyComponent } from './streams/destroy/destroy.component';
import { DetailsComponent } from './runtime/details/details.component';
import { StreamFloModule } from '../flo/stream-flo.module';
import { CreateComponent } from './streams/create/create.component';
import { FreeTextComponent } from './streams/deploy/free-text/free-text.component';
import { BuilderComponent } from './streams/deploy/builder/builder.component';
import { ErrorsComponent } from './streams/deploy/builder/errors/errors.component';
import { MultiDeployComponent } from './streams/multi-deploy/multi-deploy.component';
import { SharedFloModule } from '../flo/shared-flo.module';
import { SecurityModule } from '../security/security.module';
import { StatusComponent } from './streams/status/status.component';
import { RollbackComponent } from './streams/rollback/rollback.component';

@NgModule({
  declarations: [
    RuntimeComponent,
    DetailsComponent,
    StreamsComponent,
    StreamComponent,
    DeployComponent,
    UndeployComponent,
    DestroyComponent,
    CreateComponent,
    FreeTextComponent,
    BuilderComponent,
    ErrorsComponent,
    MultiDeployComponent,
    StatusComponent,
    RollbackComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    StreamsRoutingModule,
    SharedFloModule,
    StreamFloModule,
    SecurityModule
  ],
})
export class StreamsModule {
}
