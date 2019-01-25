import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { GrafanaService } from './grafana.service';
import { SharedAboutService } from '../services/shared-about.service';

/**
 * This module is dedicated to grafana integration.
 *
 * @author Vitrac Damien
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [
  ],
  providers: [
    GrafanaService,
    SharedAboutService
  ],
  exports: [
  ]
})

export class GrafanaModule {
}
