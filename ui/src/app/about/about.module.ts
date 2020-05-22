import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutRoutingModule } from './about-routing.module';
import { InfoComponent } from './info/info.component';
import { ClarityModule } from '@clr/angular';


@NgModule({
  declarations: [InfoComponent],
  imports: [
    CommonModule,
    ClarityModule,
    AboutRoutingModule
  ]
})
export class AboutModule {
}
