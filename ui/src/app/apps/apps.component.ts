import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AppsService } from './apps.service';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AppRegistration } from './model/app-registration';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  providers: [AppsService]
})
export class AppsComponent implements OnInit {

  currentPage: number = 1;
  filter: string = '';

  appRegistrations: AppRegistration[];
  busy: Subscription;

  constructor(
    private appsService: AppsService,
    private toastyService: ToastyService,
    private router: Router ) {
      this.currentPage = appsService.currentPage;
      this.filter = appsService.filter;
    }

  ngOnInit() {
    this.busy = this.appsService.getApps().subscribe(
      data => {
        console.log(data);
        this.appRegistrations = data;
        this.toastyService.success('Apps loaded.');
      }
    );
  }

  bulkImportApps() {
    console.log('Go to Bulk Import page ...');
    this.router.navigate(['apps/bulk-import-apps']);
  };

  setCurrentFilter(value) {
    console.log('Set filter to ' + value);
  }
}
