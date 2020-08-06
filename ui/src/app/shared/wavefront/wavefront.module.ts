import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedAboutService } from '../services/shared-about.service';
import { WavefrontService } from './wavefront.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [],
  providers: [
    SharedAboutService,
    WavefrontService
  ],
  exports: []
})

export class WavefrontModule {
}
