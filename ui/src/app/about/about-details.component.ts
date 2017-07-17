import { Component, OnInit } from '@angular/core';

import { AboutService } from './about.service';
import { Subscription } from 'rxjs/Subscription';
import { BusyModule, BusyDirective } from 'angular2-busy';
import { ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  templateUrl: './about-details.component.html'
})
export class AboutDetailsComponent implements OnInit {

  dataflowVersionInfo;
  busy: Subscription;

  private subscription: any;

  constructor(
    private aboutService: AboutService,
    private toastyService: ToastyService,
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
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  };
}
