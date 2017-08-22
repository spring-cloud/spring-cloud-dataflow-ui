import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AboutComponent } from './about.component';
import { AboutDetailsComponent } from './about-details.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'about',
      component: AboutComponent,
      data:{
        authenticate: true
      }
    },
    {
      path: 'about/details',
      component: AboutDetailsComponent,
      data:{
        authenticate: true
      }
    }
  ])],
  exports: [RouterModule]
})
export class AboutRoutingModule {}
