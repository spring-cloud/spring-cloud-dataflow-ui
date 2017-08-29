import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { ToastyService } from 'ng2-toasty';
import { AuthService } from './auth.service';

@Component({
  template: ''
})
export class LogoutComponent implements OnInit {

  public busy: Subscription;

  constructor(
    private authService: AuthService,
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
    this.authService.logout().subscribe(
      result => {
        this.toastyService.success('Logged out.');
        this.router.navigate(['login']);
      },
      error => {
        this.toastyService.error(error);
      },
    );
  }
}
