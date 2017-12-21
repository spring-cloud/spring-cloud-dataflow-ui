import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { LoginRequest } from './model/login-request.model';
import { SecurityInfo } from './model/security-info.model';

import { Subscription } from 'rxjs/Subscription';
import { ToastyService } from 'ng2-toasty';
import { AboutService } from '../about/about.service';

/**
 * Handles application logins.
 *
 * @author Gunnar Hillert
 */
@Component({
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  public user = new LoginRequest('', '');
  public securityInfo: SecurityInfo;
  public busy: Subscription;

  constructor(
    private authService: AuthService,
    private aboutService: AboutService,
    private router: Router,
    private toastyService: ToastyService,
    private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.securityInfo = this.authService.securityInfo;
  }

  /**
   * Handles the login form submission.
   */
  public login() {
    let returnUrl;
    if (this.route.snapshot.queryParams && this.route.snapshot.queryParams['returnUrl']) {
      returnUrl = this.route.snapshot.queryParams['returnUrl'];
    } else {
      returnUrl = '';
    }
    this.busy = this.authService.login(this.user).subscribe(
      result => {
        if (result.isAuthenticated) {
          this.aboutService.getAboutInfo().subscribe(
            aboutInfo => {
              console.log(`Login successful, using return Url: ${returnUrl}`);
              this.router.navigate([returnUrl]);
            },
            error => {
              console.error('User was not logged in because:', error);
              this.toastyService.error(error);
            }
          );
        } else {
          console.error('The following error occurred:', result);
          this.toastyService.error('Not logged in.');
        }
      },
      error => {
        this.toastyService.error(error);
      });
  }
}
