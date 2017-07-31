import { Component, OnInit } from '@angular/core';

import { AboutService } from './about.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastyService } from 'ng2-toasty';
import { StompService } from 'ng2-stomp-service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './about-details.component.html'
})
export class AboutDetailsComponent implements OnInit {

  dataflowVersionInfo;
  busy: Subscription;
  websocketData;

  private subscription: any;

  constructor(
    private aboutService: AboutService,
    private toastyService: ToastyService,
    private stomp: StompService,
    private router: Router) {
  }

  ngOnInit() {
    console.log('Getting about details...');
    this.getAboutDetails();
  }

  getAboutDetails(): void {
    this.busy = this.aboutService.getDetails().subscribe(
      data => {
        this.dataflowVersionInfo = data;
        this.toastyService.success('About details data loaded.');
      }
    );
  }

  goBack() {
    console.log('Back to about page ...');
    this.router.navigate(['about']);
  };

  onCopyToClipboardSuccess(e) {
    this.toastyService.success('Copied About Details to Clipboard (As JSON).');
    console.log(e);
  }

  isEmpty(obj) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  };
}
