import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { ToastyService } from 'ng2-toasty';
import { AuthService } from './auth.service';
import { AboutService } from '../about/about.service';

/**
 * Handles logouts. Logouts are handled differently depending on whether
 * traditional Spring Security is used on the server-side or whether
 * OAuth2 security is used.
 *
 * @author Gunnar Hillert
 */
@Component({
  template: ''
})
export class LogoutComponent implements OnInit {

  public busy: Subscription;

  constructor(
    private authService: AuthService,
    private aboutService: AboutService,
    private toastyService: ToastyService,
    private router: Router) {
  }

  /**
   * Logging out.
   */
  public ngOnInit() {
    if (!this.authService.securityInfo.isAuthenticationEnabled) {
      console.log('No need to logout. Authentication is not enabled.');
      this.router.navigate(['']);
      return;
    } else if (!this.authService.securityInfo.isAuthenticated) {
      console.log('No need to logout. User is not authenticated.');
      this.router.navigate(['']);
      return;
    }

    console.log('Logging out ...');
    if (this.authService.securityInfo.isFormLogin) {
      this.authService.logout().subscribe(
        result => {
          this.aboutService.featureInfo.reset();
          this.toastyService.success('Logged out.');
          this.router.navigate(['login']);
        },
        error => {
          this.aboutService.featureInfo.reset();
          this.toastyService.error(error);
        },
      );
    } else {
      console.log(`Logging out user ${this.authService.securityInfo.username} (OAuth)`);
      this.authService.clearLocalSecurity();
      this.aboutService.featureInfo.reset();

      const logoutUrl = '//' + window.location.host + '/logout';
      console.log('Redirecting to ' + logoutUrl);
      window.open(logoutUrl, '_self');
    }
  }
}
