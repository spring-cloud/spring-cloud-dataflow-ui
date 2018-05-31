import { Component, OnInit } from '@angular/core';
import { AboutService } from './about.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AboutInfo } from '../shared/model/about/about-info.model';
import { NotificationService } from '../shared/services/notification.service';

@Component({
  templateUrl: './about-details.component.html'
})
export class AboutDetailsComponent implements OnInit {

  public dataflowVersionInfo$: Observable<AboutInfo>;

  constructor(
    private aboutService: AboutService,
    private notificationService: NotificationService,
    private router: Router) {
  }

  ngOnInit() {
    console.log('Getting about details...');
    this.dataflowVersionInfo$ = this.aboutService.getDetails();
  }

  goBack() {
    console.log('Back to about page ...');
    this.router.navigate(['about']);
  }

  onCopyToClipboardSuccess(e) {
    this.notificationService.success('Copied About Details to Clipboard (As JSON).');
    console.log(e);
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
