import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AppsService } from '../apps.service';
import { AppRegistration, Page } from '../../shared/model';
import { AppsUnregisterComponent } from '../apps-unregister/apps-unregister.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { AppVersionsComponent } from '../app-versions/app-versions.component';
import { AppsWorkaroundService } from '../apps.workaround.service';
import { AppListParams } from '../components/apps.interface';
import { OrderParams, SortParams } from '../../shared/components/shared.interface';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { BusyService } from '../../shared/services/busy.service';
import { NotificationService } from '../../shared/services/notification.service';

/**
 * Main entry point to the Apps Module. Provides
 * a paginated list of {@link AppRegistration}s and
 * also provides operations to unregister {@link AppRegistration}s,
 * displays versions control if skipper is enabled.
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html'
})
export class AppsComponent implements OnInit, OnDestroy {

  /**
   * Current applications items
   */
  appRegistrations: Page<AppRegistration>;

  /**
   * Busy Subscriptions
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Modal
   */
  modal: BsModalRef;

  /**
   * Subscription to Feature Info
   */
  subscriptionFeatureInfo: Subscription;

  /**
   * Skipper enabled
   * @type {boolean}
   */
  skipperEnabled: boolean;

  /**
   * Current forms value
   */
  form: any = {
    q: '',
    type: '',
    checkboxes: []
  };

  /**
   * State of App List Params
   * @type {SortParams}
   */
  params: AppListParams = {
    sort: 'name',
    order: OrderParams.ASC,
    page: 0,
    size: 30,
    q: '',
    type: null
  };

  /**
   * Contain a key application of each selected application
   * @type {Array}
   */
  itemsSelected: Array<string> = [];

  /**
   * Storage context
   */
  context: any;

  /**
   * Constructor
   *
   * @param {AppsService} appsService
   * @param {NotificationService} notificationService
   * @param {SharedAboutService} sharedAboutService
   * @param {BsModalService} modalService
   * @param {BusyService} busyService
   * @param {Router} router
   */
  constructor(public appsService: AppsService,
              private notificationService: NotificationService,
              private sharedAboutService: SharedAboutService,
              private modalService: BsModalService,
              private busyService: BusyService,
              private router: Router) {
  }

  /**
   * As soon as the page loads we retrieve a list of {@link AppRegistration}s
   * after init the context.
   */
  ngOnInit() {
    this.context = this.appsService.applicationsContext;
    this.params = { ...this.context };
    this.form = { q: this.context.q, type: this.context.type, checkboxes: [] };
    this.itemsSelected = this.context.itemsSelected || [];
    this.loadAppRegistrations();
    this.subscriptionFeatureInfo = this.sharedAboutService.getFeatureInfo().subscribe(featureInfo => {
      this.skipperEnabled = featureInfo.skipperEnabled;
    });

  }

  /**
   * On Destroy operations
   */
  ngOnDestroy() {
    this.updateContext();
    this.subscriptionFeatureInfo.unsubscribe();
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Load a paginated list of {@link AppRegistration}s.
   * Build the form checkboxes (persist selection)
   */
  loadAppRegistrations() {
    const busy = this.appsService.getApps(this.params).map((page: Page<AppRegistration>) => {
      this.form.checkboxes = page.items.map((app) => {
        return this.itemsSelected.indexOf(`${app.name}#${app.type}`) > -1;
      });
      return page;
    }).pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((page: Page<AppRegistration>) => {
          if (page.items.length === 0 && this.params.page > 0) {
            this.params.page = 0;
            this.loadAppRegistrations();
            return;
          }
          this.appRegistrations = page;
          this.changeCheckboxes();
          this.updateContext();
        },
        error => {
          this.notificationService.error(error);
        }
      );

    this.busyService.addSubscription(busy);
  }

  /**
   * Refresh the page
   * Work around: invalidate the cache applications
   */
  refresh() {
    AppsWorkaroundService.cache.invalidate();
    this.loadAppRegistrations();
  }

  /**
   * Write the context in the service.
   */
  updateContext() {
    this.context.q = this.params.q;
    this.context.type = this.params.type;
    this.context.sort = this.params.sort;
    this.context.order = this.params.order;
    this.context.page = this.params.page;
    this.context.size = this.params.size;
    this.context.itemsSelected = this.itemsSelected;
  }

  /**
   * Apply sort
   * Triggered on column header click
   *
   * @param {SortParams} sort
   */
  applySort(sort: SortParams) {
    this.params.sort = sort.sort;
    this.params.order = sort.order;
    this.loadAppRegistrations();
  }

  /**
   * Run the search
   */
  search() {
    this.params.q = this.form.q;
    this.params.type = this.form.type;
    this.params.page = 0;
    this.loadAppRegistrations();
  }

  /**
   * Used to determinate the state of the query parameters
   *
   * @returns {boolean} Search is active
   */
  isSearchActive() {
    return (this.form.type !== this.params.type) || (this.form.q !== this.params.q);
  }

  /**
   * Reset the search parameters and run the search
   */
  clearSearch() {
    this.form.q = '';
    this.form.type = '';
    this.search();
  }

  /**
   * Determine if there is no application
   */
  isAppsEmpty(): boolean {
    if (this.appRegistrations) {
      if (this.appRegistrations.totalPages < 2) {
        return (this.params.q === '' && (this.params.type === null || this.params.type.toString() === '')
          && this.appRegistrations.items.length === 0);
      }
    }
    return false;
  }

  /**
   * Update the list of selected checkbox
   */
  changeCheckboxes() {
    if (!this.appRegistrations || (this.appRegistrations.items.length !== this.form.checkboxes.length)) {
      return;
    }
    const value: Array<string> = this.appRegistrations.items.map((app, index) => {
      if (this.form.checkboxes[index]) {
        return `${app.name}#${app.type}`;
      }
    }).filter((a) => a != null);
    this.itemsSelected = value;
    this.updateContext();
  }

  /**
   * Number of selected applications
   * @returns {number}
   */
  countSelected(): number {
    return this.form.checkboxes.filter((a) => a).length;
  }

  /**
   * Used for requesting a new page. The past is page number is
   * 1-index-based. It will be converted to a zero-index-based
   * page number under the hood.
   *
   * @param page 1-index-based
   */
  getPage(page: number) {
    this.params.page = page - 1;
    this.loadAppRegistrations();
  }

  /**
   * Changes items per page
   * Reset the pagination (first page)
   * @param {number} size
   */
  changeSize(size: number) {
    this.params.size = size;
    this.params.page = 0;
    this.updateContext();
    this.loadAppRegistrations();
  }

  /**
   * Starts the unregistration process {@link AppRegistration}s
   * by opening a confirmation modal dialog.
   */
  unregisterAppsSelected() {
    const appRegistrations = this.appRegistrations.items.filter((app) => {
      return this.itemsSelected.indexOf(`${app.name}#${app.type}`) > -1;
    });
    this.unregisterApps(appRegistrations);
  }

  /**
   * Starts the unregistration process {@link AppRegistration}s
   * by opening a confirmation modal dialog.
   *
   * @param appRegistrations An array of AppRegistrations to unregister
   */
  unregisterApps(appRegistrations: AppRegistration[]) {
    console.log(`Unregister ${appRegistrations.length} app(s).`, appRegistrations);
    this.modal = this.modalService.show(AppsUnregisterComponent);
    this.modal.content.open(appRegistrations).subscribe(() => {
      this.loadAppRegistrations();
    });
  }

  /**
   * Navigate to the page in order to register a new
   * {@link AppRegistration}.
   */
  registerApps() {
    console.log('Go to Register page ...');
    this.router.navigate(['apps/register-apps']);
  }

  /**
   * Navigate to the page that allows for the bulk import of {@link AppRegistration}s.
   */
  bulkImportApps() {
    console.log('Go to Bulk Import page ...');
    this.router.navigate(['apps/bulk-import-apps']);
  }

  /**
   * Navigate to the page that provides a detail view for the
   * passed-in {@link AppRegistration}.
   *
   * @param {AppRegistration} appRegistration
   */
  view(appRegistration: AppRegistration) {
    console.log(`View app ${appRegistration.name}.`, appRegistration);
    this.router.navigate(['apps/' + appRegistration.type + '/' + appRegistration.name]);
  }

  /**
   * Open the version dialog of an application
   * @param {AppRegistration} appRegistration
   */
  versions(appRegistration: AppRegistration) {
    console.log(`Manage versions ${appRegistration.name} app.`, appRegistration);
    this.modal = this.modalService.show(AppVersionsComponent, { class: 'modal-xl' });
    this.modal.content.open(appRegistration).subscribe(() => {
      this.loadAppRegistrations();
    });
  }

}
