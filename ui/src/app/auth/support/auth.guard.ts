import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { LoggerService } from '../../shared/services/logger.service';

/**
 * A guard used by the router in order to check whether a the user has
 * the necessary access rights. If not, the user is redirected to the
 * an error page.
 *
 * @author Gunnar Hillert
 */
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private loggerService: LoggerService,
    private sharedAboutService: SharedAboutService
  ) {
  }

  /**
   * If true the user has access to the route, if false, the user will
   * be redirected to an error page.
   *
   * @param route
   * @param state
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const securityInfo = this.authService.securityInfo;
    const featureInfo = this.sharedAboutService.featureInfo;
    const rolesNeeded: string[] = route.data.roles;

    const featureNeeded: string = route.data.feature;

    if (featureNeeded && featureInfo && !featureInfo.isFeatureEnabled(featureNeeded)) {
      this.router.navigate(['feature-disabled']);
    }

    if (securityInfo.isAuthenticationEnabled) {
      this.loggerService.log(`Determining authorizations ... ` +
        `[authentication enabled: ${securityInfo.isAuthenticationEnabled}]`, route.data);
    }

    if (securityInfo.canAccess(rolesNeeded)) {
      return true;
    }

    if (securityInfo.isAuthenticationEnabled) {
      if (securityInfo.isAuthenticated) {
        this.loggerService.log('You do not have any of the necessary role(s) ' + rolesNeeded);
        this.router.navigate(['roles-missing']);
      } else {
        this.router.navigate(['authentication-required']);
      }
    }
    return false;
  }
}
