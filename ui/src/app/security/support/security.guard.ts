import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AboutService } from '../../shared/api/about.service';
import { SecurityService } from '../service/security.service';
import get from 'lodash.get';

@Injectable()
export class SecurityGuard implements CanActivate {
  constructor(private router: Router,
              private securityService: SecurityService,
              private aboutService: AboutService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const security = this.securityService.security;
    const features = this.aboutService.about.features;
    const rolesNeeded: string[] = route.data.roles;
    const featureNeeded: string = route.data.feature;
    if (featureNeeded && features && !get(features, featureNeeded, false)) {
      this.router.navigate(['feature-disabled']);
    }
    // if (security.isAuthenticationEnabled) {
    //   this.loggerService.log(`Determining authorizations ... ` +
    //     `[authentication enabled: ${securityInfo.isAuthenticationEnabled}]`, route.data);
    // }
    if (security.canAccess(rolesNeeded)) {
      return true;
    }
    if (security.isAuthenticationEnabled) {
      if (security.isAuthenticated) {
        this.router.navigate(['roles-missing']);
      } else {
        this.router.navigate(['authentication-required']);
      }
    }
    return false;
  }
}
