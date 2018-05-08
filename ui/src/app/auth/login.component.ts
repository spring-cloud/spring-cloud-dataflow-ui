import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginRequest } from './model/login-request.model';
import { SecurityInfo } from '../shared/model/about/security-info.model';
import { Subscription } from 'rxjs/Subscription';
import { AboutService } from '../about/about.service';
import { Subject } from 'rxjs/Subject';
import { BusyService } from '../shared/services/busy.service';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../shared/services/notification.service';
import { LoggerService } from '../shared/services/logger.service';

/**
 * Handles application logins.
 *
 * @author Gunnar Hillert
 */
@Component({
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  public user = new LoginRequest('', '');
  public securityInfo: SecurityInfo;

  constructor(
    private authService: AuthService,
    private aboutService: AboutService,
    private busyService: BusyService,
    private router: Router,
    private notificationService: NotificationService,
    private loggerService: LoggerService,
    private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.securityInfo = this.authService.securityInfo;
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
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
    const busy = this.authService.login(this.user)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(
      result => {
        if (result.isAuthenticated) {
          this.aboutService.getAboutInfo(true)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe(
            aboutInfo => {
              this.loggerService.log(`Login successful, using return Url: ${returnUrl}`);
              this.router.navigate([returnUrl]);
            },
            error => {
              this.loggerService.error('User was not logged in because:', error);
              this.notificationService.error(error);
            }
          );
        } else {
          this.loggerService.error('The following error occurred:', result);
          this.notificationService.error('Not logged in.');
        }
      },
      error => {
        this.notificationService.error(error);
      });
    this.busyService.addSubscription(busy);
  }
}
