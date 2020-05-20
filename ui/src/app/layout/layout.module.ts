import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './logo/logo.component';
import { NavComponent } from './nav/nav.component';
import { ClarityModule } from '@clr/angular';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    LogoComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    ClarityModule
  ],
  exports: [
    LogoComponent,
    NavComponent
  ]
})
export class LayoutModule { }
