import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AppsService } from './apps.service';
import { AppRegistration, Page } from '../shared/model';

import { ToastyService } from 'ng2-toasty';

import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html'
})
export class AppsComponent implements OnInit {

  appRegistrations: Page<AppRegistration>;
  busy: Subscription;

  appRegistrationToUnregister: AppRegistration;
  appRegistrationsToUnregister: AppRegistration[];

  @ViewChild('unregisterSingleAppModal')
  public unregisterSingleAppModal: ModalDirective;


  @ViewChild('unregisterMultipleAppsModal')
  public unregisterMultipleAppsModal: ModalDirective;

  constructor(
    public appsService: AppsService,
    private toastyService: ToastyService,
    private router: Router ) {
    }

  ngOnInit() {
    this.loadAppRegistrations(false);
  }

  public loadAppRegistrations(reload: boolean) {
    this.busy = this.appsService.getApps(reload).subscribe(
      data => {
        if (!this.appRegistrations) {
          this.appRegistrations = data;
        }
      },
      error => {
        console.log('error', error);
        this.toastyService.error(error);
      }
    );
  }

  registerApps() {
    this.router.navigate(['apps/register-apps']);
  }

  unregisterSingleApp(appRegistration: AppRegistration, index: number) {
    console.log(`Unregister single app ${appRegistration.name} (Index: ${index})`);
    this.appRegistrationToUnregister = appRegistration;
    this.unregisterSingleAppModal.show();
  }

  unregisterMultipleApps(appRegistrations: AppRegistration[]) {
    this.appRegistrationsToUnregister = appRegistrations.filter(item => item.isSelected);
    console.log(`Unregister ${this.appRegistrationsToUnregister.length} app(s).`, this.appRegistrationsToUnregister);
    this.unregisterMultipleAppsModal.show();
  }


  bulkImportApps() {
    console.log('Go to Bulk Import page ...');
    this.router.navigate(['apps/bulk-import-apps']);
  }

  public proceedToUnregisterSingleAppRegistration(appRegistration: AppRegistration): void {
    console.log('Proceeding to unregister application...', appRegistration);

    this.busy = this.appsService.unregisterApp(appRegistration).subscribe(
      data => {
        this.unregisterSingleAppModal.hide();
        this.toastyService.success('Successfully removed app "'
          + appRegistration.name + '" of type "' + appRegistration.type + '"');

        if (this.appsService.appRegistrations.items.length === 0 && this.appsService.appRegistrations.pageNumber > 0) {
          this.appRegistrations.pageNumber = this.appRegistrations.pageNumber - 1;
          this.loadAppRegistrations(true);
        }
      },
      error => {
        this.toastyService.error(error);
      }
    );
  }

  public proceedToUnregisterMultipleAppRegistrations(appRegistrations: AppRegistration[]): void {
    console.log(`Proceeding to unregister ${appRegistrations.length} application(s).`, appRegistrations);
    for (const appRegistrationToUnregister of appRegistrations) {
      this.proceedToUnregisterSingleAppRegistration(appRegistrationToUnregister);
    }
    this.unregisterMultipleAppsModal.hide();
  }

  public cancelUnregisterSingleApp() {
    this.unregisterSingleAppModal.hide();
  }

  public cancelUnregisterMultipleApps() {
    this.unregisterMultipleAppsModal.hide();
  }

  public viewDetails(appRegistration: AppRegistration) {
    this.router.navigate(['apps/' + appRegistration.type + '/' +  appRegistration.name]);
  }

  /**
   * Used for requesting a new page. The past is page number is
   * 1-index-based. It will be converted to a zero-index-based
   * page number under the hood.
   *
   * @param page 1-index-based
   */
  getPage(page: number) {
    console.log(`Getting page ${page}.`);
    this.appsService.appRegistrations.pageNumber = page - 1;
    this.loadAppRegistrations(true);
  }
}





