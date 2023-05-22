import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AboutService} from '../../shared/api/about.service';
import {SecurityService} from '../service/security.service';
import {take} from 'rxjs/operators';

@Injectable()
export class SecurityGuard implements CanActivate {
  constructor(private router: Router, private securityService: SecurityService, private aboutService: AboutService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const rolesNeeded: string[] = route.data.roles;
    const featureNeeded: string = route.data.feature;
    if (featureNeeded) {
      if ((await this.aboutService.isFeatureEnabled(featureNeeded)) === false) {
        await this.router.navigate(['feature-disabled']);
      }
    }

    // Check if the role requirements are met
    if (await this.securityService.canAccess(rolesNeeded)) {
      return true;
    }

    // Check if security is disabled
    if (!(await this.securityService.securityEnabled().pipe(take(1)))) {
      return true;
    }

    // Check if the user is authenticated, otherwise navigate to authentication / role missing page
    if (await this.securityService.loggedinUser().pipe(take(1))) {
      await this.router.navigate(['roles-missing']);
    } else {
      await this.router.navigate(['authentication-required']);
    }

    return false;
  }
}
