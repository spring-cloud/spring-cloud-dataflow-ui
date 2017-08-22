import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login.component';
import { LogoutComponent } from './logout.component';
import { AuthRoutingModule } from './auth-routing.module';
import { RolesDirective } from './directives/roles.directive';
import { AuthService } from './auth.service';
import { AuthGuard } from './support/auth.guard';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  imports: [
    AuthRoutingModule, SharedModule, BsDropdownModule.forRoot()
  ],
  declarations: [
    LoginComponent,
    LogoutComponent,
    RolesDirective,
  ],
  providers: [
    AuthGuard,
    AuthService
  ],
  exports: [
    RolesDirective
  ]
})

export class AuthModule { }
