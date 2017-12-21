import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { SharedAboutService } from '../../shared/services/shared-about.service';

/**
 * A guard used by the router in order to check whether a the user has
 * the necessary access rights. If not, the user is redirected to the
 * login page and the original request url will be appended to the
 * 'returnUrl' query parameter.
 *
 * @author Gunnar Hillert
 */
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private sharedAboutService: SharedAboutService
  ) { }

  /**
   * If true the user has access to the route, if false, the user will
   * be redirected to the login url.
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
      console.log(`Determining authorizations ... ` +
        `[authentication enabled: ${securityInfo.isAuthenticationEnabled}, ` +
        `authorization enabled: ${securityInfo.isAuthorizationEnabled}]`, route.data);
    }

    if (securityInfo.canAccess(rolesNeeded)) {
      return true;
    }

    if (securityInfo.isAuthenticationEnabled) {
      if (securityInfo.isAuthorizationEnabled && securityInfo.isAuthenticated) {
        console.log('You do not have any of the necessary role(s) ' + rolesNeeded);
        this.router.navigate(['roles-missing']);
      } else {
        this.router.navigate(['login'], { queryParams: { 'returnUrl': state.url }});
      }
    }
    return false;
  }
}
