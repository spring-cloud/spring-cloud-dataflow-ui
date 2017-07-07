import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import {StreamDeployComponent} from "./stream-deploy.component";
import {StreamDeployRoutingModule} from "./stream-deploy-routing.module";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  imports:      [ StreamDeployRoutingModule, SharedModule, FormsModule, BrowserModule ],
  declarations: [ StreamDeployComponent ]
})
export class StreamModule { }

