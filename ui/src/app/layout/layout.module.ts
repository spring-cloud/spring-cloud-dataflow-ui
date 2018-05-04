import { NgModule } from '@angular/core';
import { AuthModule } from '../auth/auth.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { BodyComponent } from './body/body.component';
import { LogoComponent } from './logo/logo.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavigationSearchComponent } from './navigation/search/search.component';
import { AppsModule } from '../apps/apps.module';
import { StreamsModule } from '../streams/streams.module';
import { TasksModule } from '../tasks/tasks.module';

@NgModule({
  declarations: [
    NavigationComponent,
    BodyComponent,
    SidebarComponent,
    LogoComponent,
    NavigationSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule,
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    SharedModule,
    AppsModule,
    StreamsModule,
    TasksModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  entryComponents: [],
  exports: [
    NavigationComponent,
    BodyComponent,
    LogoComponent,
    SidebarComponent
  ]
})
export class LayoutModule {
}
