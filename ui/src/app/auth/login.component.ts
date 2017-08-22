import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { LoginRequest } from './model/login-request.model';
import { SecurityInfo } from './model/security-info.model';

import { Subscription } from 'rxjs/Subscription';
import { ToastyService } from 'ng2-toasty';

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
          console.log(`Login successful, using return Url: ${returnUrl}`);
          this.router.navigate([returnUrl]);
        } else {
          console.error('Something went wrong.', result);
          this.toastyService.error('Not logged in.');
        }
      },
      error => {
        this.toastyService.error(error);
      });
  }
}
