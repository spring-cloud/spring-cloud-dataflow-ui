import { Component, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AppRegistration, Page } from '../../shared/model';
import { AppsService } from '../apps.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { AppError } from '../../shared/model/error.model';
import { Observable } from 'rxjs';
import { OrderParams } from '../../shared/components/shared.interface';
import { map } from 'rxjs/operators';

/**
 * Applications Unregister all modal
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-apps-unregister-all',
  templateUrl: './apps-unregister-all.component.html'
})
export class AppsUnregisterAllComponent {


  /**
   * Emit on changes
   * @type {EventEmitter<any>}
   */
  @Output() event = new EventEmitter();


  /**
   * Observable count applications
   */
  countApplications$: Observable<number>;

  /**
   * Initialize component
   *
   * @param {BsModalRef} modalRef used to control the current modal
   * @param {AppsService} appsService
   * @param {LoggerService} loggerService
   * @param {NotificationService} notificationService
   */
  constructor(private modalRef: BsModalRef,
              private appsService: AppsService,
              private loggerService: LoggerService,
              private notificationService: NotificationService) {

    this.countApplications$ = this.appsService.getApps({
      q: '',
      type: null,
      page: 0,
      size: 1,
      order: 'name',
      sort: OrderParams.ASC
    }).pipe(
      map((page: Page<AppRegistration>) => page.totalElements)
    );

  }

  /**
   * Initialize context
   * @returns {EventEmitter<any>}
   */
  open(): EventEmitter<any> {
    return this.event;
  }

  /**
   * Complete the unregistration {@link AppRegistration}s.
   * Emit confirm event if success and close the open modal dialog.
   */
  unregister() {
    this.loggerService.log(`Proceeding to unregister all the applications`);
    this.appsService.unregisterAllApps()
      .subscribe(
        data => {
          this.notificationService.success(`Successfully removed all apps.`);
          this.event.emit(true);
          this.close();
        }, error => {
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
          this.close();
        });
  }

  /**
   * Close the modal
   */
  close() {
    this.modalRef.hide();
  }

}
