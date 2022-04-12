import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {SecurityService} from '../../security/service/security.service';
import {UrlUtilities} from '../../url-utilities.service';
import {NotificationService} from 'src/app/shared/service/notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent {
  loggedinUser$ = this.securityService.loggedinUser();
  baseApiUrl = UrlUtilities.calculateBaseApiUrl();

  constructor(
    private securityService: SecurityService,
    private router: Router,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  logout(): void {
    this.securityService.logout().subscribe(security => {
      this.router.navigate(['/']);
    },
    error => {
      this.notificationService.error(this.translate.instant('commons.message.error'), error);
    });
  }
}
