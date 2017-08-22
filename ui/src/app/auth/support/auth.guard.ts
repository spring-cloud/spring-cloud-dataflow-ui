import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

/**
 * A guard used by the router in order to check whether a the user has
 * the necessary access rights. If not, the user is redirected to the
 * login page and the original request url will be appended to the
 * 'returnUrl' query parameter.
 */
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  /**
   * If true the user has access to the route, if false, the user will
   * be redirected to the login url.
   *
   * @param route
   * @param state
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('Determining authorizations ... ', route.data);

    const securityInfo = this.authService.securityInfo;
    const routeNeedsAuthentication = route.data.authenticate;
    const rolesNeeded: string[] = route.data.roles;

    if (securityInfo.isAuthenticationEnabled && routeNeedsAuthentication && !securityInfo.isAuthenticated) {
      this.router.navigate(['login'], { queryParams: { 'returnUrl': state.url }});
      return false;
    }
    return true;
  }
}
