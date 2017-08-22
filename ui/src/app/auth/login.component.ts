import { Component, OnInit } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { LoginRequest } from './model/login-request.model';
import { SecurityInfo } from './model/security-info.model';

import { Subscription } from 'rxjs/Subscription';
import { ToastyService } from 'ng2-toasty';

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
   * login
   */
  public login() {
    this.busy = this.authService.login(this.user).subscribe(
      result => {

        let returnUrl;

        if (this.route.queryParams && this.route.queryParams['returnUrl']) {
          returnUrl = this.route.queryParams['returnUrl'];
        } else {
          returnUrl = '';
        }

        if (result.isAuthenticated) {
          this.router.navigate([returnUrl]);
        }
      },
      error => {
        this.toastyService.error(error);
      });
  }
}
