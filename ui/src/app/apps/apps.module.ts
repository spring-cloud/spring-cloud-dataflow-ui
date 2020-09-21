import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SecurityModule } from '../security/security.module';
import { AppsRoutingModule } from './apps-routing.module';
import { AddComponent } from './add/add.component';
import { AppComponent } from './app/app.component';
import { AppsComponent } from './apps.component';
import { UnregisterComponent } from './unregister/unregister.component';
import { VersionComponent } from './version/version.component';
import { TypeFilterComponent } from './type.filter';
import { PropsComponent } from './add/props/props.component';
import { RegisterComponent } from './add/register/register.component';
import { UriComponent } from './add/uri/uri.component';
import { WebsiteStartersComponent } from './add/website-starters/website-starters.component';


@NgModule({
  declarations: [
    AddComponent,
    AppComponent,
    AppsComponent,
    UnregisterComponent,
    VersionComponent,
    TypeFilterComponent,
    PropsComponent,
    RegisterComponent,
    UriComponent,
    WebsiteStartersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ClarityModule,
    SecurityModule,
    AppsRoutingModule
  ],
  providers: []
})
export class AppsModule {
}
