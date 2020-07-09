import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';
import { NavComponent } from './nav/nav.component';
import { LogoComponent } from './logo/logo.component';
import { SecurityModule } from '../security/security.module';

@NgModule({
  declarations: [
    LogoComponent,
    NavComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    ClarityModule,
    SecurityModule
  ],
  exports: [
    LogoComponent,
    NavComponent,
  ]
})
export class LayoutModule { }
