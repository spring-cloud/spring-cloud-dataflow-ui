import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppRegistration } from '../../apps/model/app-registration';
import { Page } from '../../shared/model/page';
import { AppsService } from '../../apps/apps.service';

@Component({
  selector: 'app-task-app',
  templateUrl: './task-apps.component.html',
})
export class TaskAppsComponent implements OnInit {

  appRegistrations: Page<AppRegistration>;
  busy: Subscription;

  constructor(
    private appsService: AppsService,
    private toastyService: ToastyService,
    private router: Router) {
  }

  ngOnInit() {
    this.loadAppRegistrations();
  }

  /**
   * Used for requesting a new page. The past is page number is
   * 1-index-based. It will be converted to a zero-index-based
   * page number under the hood.
   *
   * @param page 1-index-based
   */
  getPage(page: number) {
    console.log(`Getting page ${page}.`)
    this.appsService.appRegistrations.pageNumber = page - 1;
    this.loadAppRegistrations();
  }

  details(item: AppRegistration) {
    console.log('details ...' + item);
    this.router.navigate(['tasks/apps/' + item.name]);
  }

  createDefinition(item: AppRegistration) {
    console.log('createDefinition ..' + item.name);
    this.router.navigate(['tasks/apps/' + item.name + '/task-create']);
  }

  loadAppRegistrations() {
    this.busy = this.appsService.getApps(true, 'task').subscribe(
      data => {
        this.appRegistrations = data;
        this.toastyService.success('Task apps loaded.');
      }
    );
  }

}
