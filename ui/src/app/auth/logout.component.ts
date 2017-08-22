import { Component, OnInit } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginRequest } from './model/login-request.model';
import { Subscription } from 'rxjs/Subscription';

import { ToastyService } from 'ng2-toasty';

@Component({
  template: ''
})
export class LogoutComponent implements OnInit {

  public busy: Subscription;

  constructor(
    private authService: AuthService,
    private toastyService: ToastyService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  /**
   * Logging out.
   */
  public ngOnInit() {
    console.log('Logging out ...');
    this.authService.logout().subscribe(
      result => {
        this.toastyService.success('Logged out.');
      },
      error => {
        this.toastyService.error(error);
      },
  );
    this.router.navigate(['login']);
  }
}
