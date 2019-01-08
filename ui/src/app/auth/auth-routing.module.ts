
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureDisabledComponent } from './feature-disabled.component';
import { LogoutComponent } from './logout.component';
import { RolesMissingComponent } from './roles-missing.component';
import { AuthenticationRequiredComponent } from './authentication-required.component';

const authRoutes: Routes = [
  {
    path: 'logout',
    component: LogoutComponent
  },
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
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
