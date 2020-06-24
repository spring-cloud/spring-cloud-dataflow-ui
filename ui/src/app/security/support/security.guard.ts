import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AboutService } from '../../shared/api/about.service';
import { SecurityService } from '../service/security.service';
import { take } from 'rxjs/operators';

@Injectable()
export class SecurityGuard implements CanActivate {

  constructor(
    private router: Router,
    private securityService: SecurityService,
    private aboutService: AboutService) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const rolesNeeded: string[] = route.data.roles;
    const featureNeeded: string = route.data.feature;
    if (featureNeeded) {
      if (await this.aboutService.isFeatureEnabled(featureNeeded) === false) {
        this.router.navigate(['feature-disabled']);
      }
    }

    const canAccess = await this.securityService.canAccess(rolesNeeded);
    if (canAccess) {
      return true;
    }
    const securityEnabled = await this.securityService.securityEnabled().pipe(take(1)).toPromise();
    if (securityEnabled) {
      const loggedInUser = await this.securityService.loggedinUser().pipe(take(1)).toPromise();
      if (loggedInUser) {
        this.router.navigate(['roles-missing']);
      } else {
        this.router.navigate(['authentication-required']);
      }
    } else {
      return true;
    }
    return false;
  }
}
