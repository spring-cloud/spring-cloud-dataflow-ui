import { Component, OnInit } from '@angular/core';
import { AboutService } from './about.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AboutInfo } from '../shared/model/about/about-info.model';
import { NotificationService } from '../shared/services/notification.service';
import { LoggerService } from '../shared/services/logger.service';

@Component({
  templateUrl: './about-details.component.html'
})
export class AboutDetailsComponent implements OnInit {

  public dataflowVersionInfo$: Observable<AboutInfo>;

  constructor(
    private aboutService: AboutService,
    private notificationService: NotificationService,
    private loggerService: LoggerService,
    private router: Router) {
  }

  ngOnInit() {
    this.loggerService.log('Getting about details...');
    this.dataflowVersionInfo$ = this.aboutService.getDetails();
  }

  goBack() {
    this.loggerService.log('Back to about page ...');
    this.router.navigate(['about']);
  }

  onCopyToClipboardSuccess(e) {
    this.notificationService.success('Copied About Details to Clipboard (As JSON).');
    this.loggerService.log('Copy to clipboard', e);
  }

  isEmpty(obj) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }
}
