
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureDisabledComponent } from './feature-disabled.component';
import { LoginComponent } from './login.component';
import { LogoutComponent } from './logout.component';
import { RolesMissingComponent } from './roles-missing.component';

const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
