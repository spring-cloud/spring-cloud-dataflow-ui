import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AppsService } from '../apps.service';
import { AppRegistration, Page } from '../../shared/model';
import { AppsUnregisterComponent } from '../apps-unregister/apps-unregister.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { AppVersionsComponent } from '../app-versions/app-versions.component';
import { AppsWorkaroundService } from '../apps.workaround.service';
import { AppListParams } from '../components/apps.interface';
import { SortParams } from '../../shared/components/shared.interface';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { AppError } from '../../shared/model/error.model';
import { AppListBarComponent } from '../components/app-list-bar/app-list-bar.component';
import { AuthService } from '../../auth/auth.service';

/**
 * Main entry point to the Apps Module. Provides
 * a paginated list of {@link AppRegistration}s and
 * also provides operations to unregister {@link AppRegistration}s,
 * displays versions control
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
   * Unsubscribe
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Modal
   */
  modal: BsModalRef;

  /**
   * Current forms value
   */
  form: any = {
    checkboxes: []
  };

  /**
   * State of App List Params
   * @type {SortParams}
   */
  params: AppListParams = null;

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
   * List Bar Component
   */
  @ViewChild('listBar', { static: true })
  listBar: AppListBarComponent;

  /**
   * Constructor
   *
   * @param {AppsService} appsService
   * @param {NotificationService} notificationService
   * @param {SharedAboutService} sharedAboutService
   * @param {BsModalService} modalService
   * @param {LoggerService} loggerService
   * @param {AuthService} authService
   * @param {Router} router
   */
  constructor(public appsService: AppsService,
              private notificationService: NotificationService,
              private sharedAboutService: SharedAboutService,
              private modalService: BsModalService,
              private loggerService: LoggerService,
              private authService: AuthService,
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
  }

  /**
   * On Destroy operations
   */
  ngOnDestroy() {
    this.updateContext();
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Return a list of action for an application
   */
  applicationsActions() {
    return [
      {
        id: 'unregister-apps',
        icon: 'trash',
        action: 'unregisterSelected',
        title: 'Unregister application(s)',
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DESTROY'])
      }
    ];
  }

  /**
   * Return a list of action for an application
   * @param {number} index
   */
  applicationActions(index: number) {
    return [
      {
        id: 'view' + index,
        icon: 'info-circle',
        action: 'view',
        title: 'Show details',
        isDefault: true
      },
      {
        divider: true,
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DESTROY'])
      },
      {
        id: 'remove' + index,
        icon: 'trash',
        action: 'unregister',
        roles: ['ROLE_CREATE'],
        title: 'Remove',
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DESTROY'])
      }
    ];
  }

  /**
   * Apply Action
   * @param action
   * @param args
   */
  applyAction(action: string, args?: any) {
    switch (action) {
      case 'view':
        this.view(args);
        break;
      case 'unregister':
        this.unregisterApps([args]);
        break;
      case 'unregisterSelected':
        this.unregisterAppsSelected();
        break;
    }
  }

  /**
   * Load a paginated list of {@link AppRegistration}s.
   * Build the form checkboxes (persist selection)
   */
  loadAppRegistrations() {
    this.appsService.getApps(this.params).map((page: Page<AppRegistration>) => {
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
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        });
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
  search(value: AppListParams) {
    this.params.q = value.q;
    this.params.type = value.type;
    this.params.page = 0;
    this.loadAppRegistrations();
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
   * Update event from the Paginator Pager
   * @param params
   */
  changePaginationPager(params) {
    this.params.page = params.page;
    this.params.size = params.size;
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
    this.loggerService.log(`Unregister ${appRegistrations.length} app(s).`, appRegistrations);
    this.modal = this.modalService.show(AppsUnregisterComponent);
    this.modal.content.open(appRegistrations).subscribe(() => {
      this.loadAppRegistrations();
    });
  }

  /**
   * Navigate to the page in order to register a new
   * {@link AppRegistration}.
   */
  addApps() {
    this.loggerService.log('Go to Add Application page ...');
    this.router.navigate(['/apps/add']);
  }

  /**
   * Navigate to the page that provides a detail view for the
   * passed-in {@link AppRegistration}.
   *
   * @param {AppRegistration} appRegistration
   */
  view(appRegistration: AppRegistration) {
    this.loggerService.log(`View app ${appRegistration.name}.`, appRegistration);
    this.router.navigate(['apps/' + appRegistration.type + '/' + appRegistration.name]);
  }

  /**
   * Open the version dialog of an application
   * @param {AppRegistration} appRegistration
   */
  versions(appRegistration: AppRegistration) {
    this.loggerService.log(`Manage versions ${appRegistration.name} app.`, appRegistration);
    this.modal = this.modalService.show(AppVersionsComponent, { class: 'modal-xl' });
    this.modal.content.open(appRegistration).subscribe(() => {
      this.loadAppRegistrations();
    });
  }

}
