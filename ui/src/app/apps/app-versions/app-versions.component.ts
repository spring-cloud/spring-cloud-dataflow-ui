import {Component, EventEmitter, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {AppRegistration} from '../../shared/model/app-registration.model';
import {AppsService} from '../apps.service';
import {ConfirmService} from '../../shared/components/confirm/confirm.service';
import {BsModalRef} from 'ngx-bootstrap';
import {AppVersion} from '../../shared/model/app-version';
import {SortParams, OrderParams} from '../../shared/components/shared.interface';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/operators';
import {BusyService} from '../../shared/services/busy.service';
import {ApplicationType} from '../../shared/model/application-type';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';

/**
 * Provides versions for an App Registration
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-versions',
  templateUrl: './app-versions.component.html'
})
export class AppVersionsComponent implements OnDestroy {

  /**
   * Busy Subscriptions
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Application
   */
  application: AppRegistration;

  /**
   * Emit at every success change
   * makeDefaultVersion and unregisterVersion
   *
   * @type {EventEmitter<boolean>}
   */
  event: EventEmitter<boolean> = new EventEmitter();

  /**
   * Sort parameters use on the versions list
   * Initialize for a sort by version name
   * @type {SortParams} Sort/Order params
   */
  sort: SortParams = {
    sort: 'version',
    order: OrderParams.ASC
  };

  /**
   * Constructor
   *
   * @param {AppsService} appsService
   * @param {ConfirmService} confirmService
   * @param {BsModalRef} modalRef
   * @param {BusyService} busyService
   * @param {NotificationService} notificationService
   * @param {LoggerService} loggerService
   */
  constructor(private appsService: AppsService,
              private confirmService: ConfirmService,
              private modalRef: BsModalRef,
              private busyService: BusyService,
              private notificationService: NotificationService,
              private loggerService: LoggerService) {

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
   * Init the component
   *
   * @param {AppRegistration} application
   * @returns {EventEmitter<boolean>}
   */
  open(application: AppRegistration) {
    this.application = new AppRegistration(application.name, application.type);
    this.refresh();
    return this.event;
  }

  /**
   * Used to load versions of an application
   */
  refresh() {
    this.loggerService.log(`Retrieving versions application for ${this.application.name} (${this.application.type}).`);
    const busy = this.appsService
      .getAppVersions(ApplicationType[this.application.type.toString()], this.application.name)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: any) => {
          this.application.versions = data;
        },
        error => {
          this.notificationService.error(error);
        });

    this.busyService.addSubscription(busy);
  }

  /**
   * Apply sort
   * Triggered on column header click
   *
   * @param {SortParams} sort
   */
  applySort(sort: SortParams) {
    this.sort.sort = sort.sort;
    this.sort.order = sort.order;
  }

  /**
   * Used to update the current version
   *
   * @param {AppVersion} version
   */
  makeDefaultVersion(version: AppVersion) {
    const run = () => {
      const busy = this.appsService.setAppDefaultVersion(this.application.type, this.application.name, version.version)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => {
            this.notificationService.success(`The version <strong>${version.version}</strong> is now the default ` +
              `version of the application <strong>${this.application.name}</strong> (${this.application.type}).`);
            this.refresh();
            this.event.emit(true);
          },
          error => {
            this.notificationService.error(error);
          });

      this.busyService.addSubscription(busy);
    };
    if (this.application.versionOnError()) {
      run();
    } else {
      const title = `Confirm make default version`;
      const description = `This action will make the version <strong>${version.version}</strong> as the default ` +
        ` version for the application <strong>${this.application.name}</strong> (${this.application.type}). ` +
        `Are you sure?`;
      this.confirmService.open(title, description).subscribe(() => {
        this.loggerService.log(`Set default version application "${version}" for ${this.application.name} (${this.application.type}).`);
        run();
      });
    }
  }

  /**
   * Used to unregister a version of an application
   * Confirm is required for this action
   *
   * @param {AppVersion} version to unregister
   */
  unregisterVersion(version: AppVersion) {
    const title = `Confirm unregister version`;
    let description = `This action will unregister the <strong>version ${version.version}</strong> ` +
      `of the application <strong>${this.application.name}</strong> (${this.application.type}). Are you sure?`;

    if (version.defaultVersion) {
      description = `This action will unregister the <strong>version ${version.version}</strong>` +
        `of the application <strong>${this.application.name}</strong> (${this.application.type}). This version ` +
        ` is the <strong>default version</strong>. Are you sure?`;
    }
    this.confirmService.open(title, description, {confirm: 'Unregister version'}).subscribe(() => {
      this.appsService.unregisterAppVersion(this.application, version.version).subscribe(() => {
          this.notificationService.success(`The version <strong>${version.version}</strong> of the application ` +
            `<strong>${this.application.name}</strong> (${this.application.type}) has been unregister.`);

          if (this.application.versions.length === 1) {
            this.close();
          } else {
            this.refresh();
          }
          this.event.emit(true);
        },
        error => {
          this.notificationService.error(error);
        });
    });
  }

  /**
   * Close the modal
   */
  close() {
    this.modalRef.hide();
  }
}
