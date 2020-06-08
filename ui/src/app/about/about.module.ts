import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info/info.component';
import { ClarityModule } from '@clr/angular';
import { SignpostComponent } from './signpost/signpost.component';


@NgModule({
  declarations: [
    InfoComponent,
    SignpostComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
  ],
  exports: [
    SignpostComponent
  ]
})
export class AboutModule {
}
