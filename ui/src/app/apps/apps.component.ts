import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AppsService } from './apps.service';
import { AppRegistration, Page } from '../shared/model';

import { ToastyService } from 'ng2-toasty';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { BusyService } from '../shared/services/busy.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

/**
 * Main entry point to the Apps Module. Provides
 * a paginated list of {@link AppRegistration}s and
 * also provides operation to unregister {@link AppRegistration}s.
 *
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html'
})
export class AppsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  appRegistrations: Page<AppRegistration>;

  appRegistrationToUnregister: AppRegistration;
  appRegistrationsToUnregister: AppRegistration[];

  @ViewChild('unregisterSingleAppModal')
  public unregisterSingleAppModal: ModalDirective;


  @ViewChild('unregisterMultipleAppsModal')
  public unregisterMultipleAppsModal: ModalDirective;

  constructor(
    public appsService: AppsService,
    private busyService: BusyService,
    private toastyService: ToastyService,
    private router: Router ) {
    }

  /**
   * As soon as the page loads we retrieve a list
   * of {@link AppRegistration}s.
   */
  ngOnInit() {
    this.loadAppRegistrations(false);
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.  
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Load a paginated list of {@link AppRegistration}s.
   *
   * @param reload
   */
  public loadAppRegistrations(reload: boolean) {
    const busy = this.appsService.getApps(reload, this.getFilter())
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(
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
    this.busyService.addSubscription(busy);
  }

  /**
   * Navigate to the page in order to register a new
   * {@link AppRegistration}.
   */
  registerApps() {
    this.router.navigate(['apps/register-apps']);
  }

  /**
   * Starts the unregistration process of a single {@link AppRegistration}
   * by opening a confirmation modal dialog.
   *
   * @param appRegistration
   * @param index
   */
  unregisterSingleApp(appRegistration: AppRegistration, index: number) {
    console.log(`Unregister single app ${appRegistration.name} (Index: ${index})`);
    this.appRegistrationToUnregister = appRegistration;
    this.unregisterSingleAppModal.show();
  }

  /**
   * Starts the unregistration process of multiple {@link AppRegistration}s
   * by opening a confirmation modal dialog.
   *
   * @param appRegistrations An array of AppRegistrations to unregister
   */
  unregisterMultipleApps(appRegistrations: AppRegistration[]) {
    this.appRegistrationsToUnregister = appRegistrations.filter(item => item.isSelected);
    console.log(`Unregister ${this.appRegistrationsToUnregister.length} app(s).`, this.appRegistrationsToUnregister);
    this.unregisterMultipleAppsModal.show();
  }

  /**
   * Navigate to the page that allows for the bulk import of {@link AppRegistration}s.
   */
  bulkImportApps() {
    console.log('Go to Bulk Import page ...');
    this.router.navigate(['apps/bulk-import-apps']);
  }

  /**
   * Completes the unregistration step for a single {@link AppRegistration}.
   * Closes the open modal dialog.
   *
   * @param appRegistration The AppRegistration to unregister
   */
  public proceedToUnregisterSingleAppRegistration(appRegistration: AppRegistration): void {
    console.log('Proceeding to unregister application...', appRegistration);

    const busy = this.appsService.unregisterApp(appRegistration)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(
      data => {
        this.unregisterSingleAppModal.hide();
        this.toastyService.success('Successfully removed app "'
          + appRegistration.name + '" of type "' + appRegistration.type + '"');

        if (this.appsService.appRegistrations.items.length === 0 && this.appsService.appRegistrations.pageNumber > 0) {
          this.appRegistrations.pageNumber = this.appRegistrations.pageNumber - 1;
        }
        const busyForAppsSubscription = this.appsService.getApps(true, this.getFilter())
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(
          appRegistrations => {}
        );
        this.busyService.addSubscription(busyForAppsSubscription);
      },
      error => {
        this.toastyService.error(error);
      }
    );
    this.busyService.addSubscription(busy);
  }

  /**
   * Completes the unregistration step for multiple {@link AppRegistration}s.
   * Closes the open modal dialog.
   *
   * @param appRegistrations The array of AppRegistrations to unregister
   */
  public proceedToUnregisterMultipleAppRegistrations(appRegistrations: AppRegistration[]): void {
    console.log(`Proceeding to unregister ${appRegistrations.length} application(s).`, appRegistrations);
    const subscription = this.appsService.unregisterMultipleApps(appRegistrations)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(
      data => {
        console.log(data);
        this.toastyService.success(`${data.length} app(s) unregistered.`);

        if (this.appsService.appRegistrations.items.length === 0 && this.appsService.appRegistrations.pageNumber > 0) {
          this.appRegistrations.pageNumber = this.appRegistrations.pageNumber - 1;
        }
        this.busyService.addSubscription(
          this.appsService.getApps(true, this.getFilter())
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe(
            appRegistrationsResult => {}
          )
        );
      }
    );
    this.busyService.addSubscription(subscription);

    this.unregisterMultipleAppsModal.hide();
  }

  /**
   * Close the confirmation modal dialog for
   * unregistering a single {@link AppRegistration}.
   */
  public cancelUnregisterSingleApp() {
    this.unregisterSingleAppModal.hide();
  }

  /**
   * Close the confirmation modal dialog for
   * unregistering multiple {@link AppRegistration}s.
   */
  public cancelUnregisterMultipleApps() {
    this.unregisterMultipleAppsModal.hide();
  }

  /**
   * Navigate to the page that provides a detail view for the
   * passed-in {@link AppRegistration}.
   *
   * @param appRegistration
   */
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

  private getFilter(): string {
    let search: string;
    if (this.appRegistrations) {
      search = this.appRegistrations.filter;
    }
    return search;
  }
}
