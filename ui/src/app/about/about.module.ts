import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info/info.component';
import { ClarityModule } from '@clr/angular';
import { SignpostComponent } from './signpost/signpost.component';
import { UserComponent } from './user/user.component';


@NgModule({
  declarations: [
    InfoComponent,
    SignpostComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
  ],
  exports: [
    SignpostComponent,
    UserComponent
  ]
})
export class AboutModule {
}
