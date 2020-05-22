import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AboutService } from '../../shared/api/about.service';
import { NotificationService } from '../../shared/service/notification.service';
import { LoggerService } from '../../shared/service/logger.service';
import { SecurityService } from '../service/security.service';

@Component({
  template: ''
})
export class LogoutComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  constructor(
    private securityService: SecurityService,
    private aboutService: AboutService,
    private notificationService: NotificationService,
    private loggerService: LoggerService,
    private router: Router) {
  }

  public ngOnInit() {
    if (!this.securityService.security.isAuthenticationEnabled) {
      this.loggerService.log('No need to logout. Authentication is not enabled.');
      this.router.navigate(['']);
      return;
    } else if (!this.securityService.security.isAuthenticated) {
      this.loggerService.log('No need to logout. User is not authenticated.');
      this.router.navigate(['']);
      return;
    }

    this.loggerService.log('Logging out ...');
    this.loggerService.log(`Logging out user ${this.securityService.security.username} (OAuth)`);
    this.securityService.clearLocalSecurity();
    // TODO
    // this.aboutService.about.reset();

    const logoutUrl = '//' + window.location.host + '/logout';
    this.loggerService.log('Redirecting to ' + logoutUrl);
    window.open(logoutUrl, '_self');
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
