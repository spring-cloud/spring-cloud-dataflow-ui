import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeatureDisabledComponent } from './component/feature-disabled.component';
import { RolesMissingComponent } from './component/roles-missing.component';
import { AuthenticationRequiredComponent } from './component/authentication-required.component';


const routes: Routes = [
  {
    path: 'feature-disabled',
    component: FeatureDisabledComponent
  },
  {
    path: 'roles-missing',
    component: RolesMissingComponent
  },
  {
    path: 'authentication-required',
    component: AuthenticationRequiredComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
