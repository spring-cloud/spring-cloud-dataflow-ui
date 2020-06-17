import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { RoleDirective } from './directive/role.directive';
import { ClarityModule } from '@clr/angular';
import { SharedModule } from '../shared/shared.module';
import { RolesMissingComponent } from './component/roles-missing.component';
import { FeatureDisabledComponent } from './component/feature-disabled.component';
import { AuthenticationRequiredComponent } from './component/authentication-required.component';
import { SecurityRoutingModule } from './security-routing.module';
import { SecurityGuard } from './support/security.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './support/token.interceptor';
import * as fromSecurity from './reducers/security.reducer';

@NgModule({
  declarations: [
    RoleDirective,
    RolesMissingComponent,
    FeatureDisabledComponent,
    AuthenticationRequiredComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
    SharedModule,
    SecurityRoutingModule,
    StoreModule.forFeature(fromSecurity.securityFeatureKey, fromSecurity.reducer)
  ],
  providers: [
    SecurityGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  exports: [
    RoleDirective
  ]
})
export class SecurityModule {
}
