import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LogoutComponent } from './logout.component';
import { AuthRoutingModule } from './auth-routing.module';
import { FeatureDisabledComponent } from './feature-disabled.component';
import { RolesDirective } from './directives/roles.directive';
import { RolesMissingComponent } from './roles-missing.component';
import { CapsLockDirective } from './directives/caps-lock.directive';
import { AuthService } from './auth.service';
import { AuthGuard } from './support/auth.guard';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TokenInterceptor } from './support/token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationRequiredComponent } from './authentication-required.component';

@NgModule({
  imports: [
    AuthRoutingModule,
    SharedModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [
    CapsLockDirective,
    AuthenticationRequiredComponent,
    FeatureDisabledComponent,
    LogoutComponent,
    RolesDirective,
    RolesMissingComponent
  ],
  providers: [
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  exports: [
    RolesDirective,
    CapsLockDirective
  ]
})

export class AuthModule {
}
