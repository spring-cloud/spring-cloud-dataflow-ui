import { NgModule } from '@angular/core';
import { AuthModule } from '../auth/auth.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { BodyComponent } from './body/body.component';


@NgModule({
  declarations: [
    NavigationComponent,
    FooterComponent,
    BodyComponent
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
    BsDropdownModule.forRoot(),
  ],
  exports: [
    NavigationComponent,
    FooterComponent,
    BodyComponent
  ]
})
export class LayoutModule {
}
