import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AppsService } from './apps.service';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss'],
  providers: [AppsService]
})
export class AppsComponent implements OnInit {

  apps: any;
  busy: Subscription;
  constructor(
    private appsService: AppsService,
    private toastyService: ToastyService,
    private router: Router ) { }

  ngOnInit() {
    this.busy = this.appsService.getApps().subscribe(
      data => {
        this.apps = data;
        this.toastyService.success('Apps loaded.');
      }
    );
  }

  bulkImportApps() {
    console.log('Go to Bulk Import page ...');
    this.router.navigate(['apps/bulk-import-apps']);
  };
}
