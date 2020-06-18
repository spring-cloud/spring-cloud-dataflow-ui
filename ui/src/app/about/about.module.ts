import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info/info.component';
import { ClarityModule } from '@clr/angular';
import { SignpostComponent } from './signpost/signpost.component';
import { UserComponent } from './user/user.component';
import { StoreModule } from '@ngrx/store';
import * as fromAbout from '../shared/store/about.reducer';


@NgModule({
  declarations: [
    InfoComponent,
    SignpostComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
    StoreModule.forFeature(fromAbout.aboutFeatureKey, fromAbout.reducer)
  ],
  exports: [
    SignpostComponent,
    UserComponent
  ]
})
export class AboutModule {
}
