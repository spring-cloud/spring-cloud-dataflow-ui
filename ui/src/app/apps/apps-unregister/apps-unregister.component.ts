import { Component, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AppRegistration } from '../../shared/model';
import { AppsService } from '../apps.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { AppError } from '../../shared/model/error.model';
import { BlockerService } from '../../shared/components/blocker/blocker.service';
import { finalize } from 'rxjs/operators';

/**
 * Applications Unregister modal
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-apps-unregister',
  templateUrl: './apps-unregister.component.html'
})
export class AppsUnregisterComponent {

  /**
   * Applications
   */
  applications: AppRegistration[];

  /**
   * Emit on changes
   * @type {EventEmitter<any>}
   */
  @Output() event = new EventEmitter();

  /**
   * Initialize component
   *
   * @param {BsModalRef} modalRef used to control the current modal
   * @param {AppsService} appsService
   * @param {LoggerService} loggerService
   * @param {BlockerService} blockerService
   * @param {NotificationService} notificationService
   */
  constructor(private modalRef: BsModalRef,
              private appsService: AppsService,
              private loggerService: LoggerService,
              private blockerService: BlockerService,
              private notificationService: NotificationService) {

  }

  /**
   * Initialize context
   * @param {AppRegistration[]} applications
   * @returns {EventEmitter<any>}
   */
  open(applications: AppRegistration[]): EventEmitter<any> {
    this.applications = applications;
    return this.event;
  }

  /**
   * Complete the unregistration {@link AppRegistration}s.
   * Emit confirm event if success and close the open modal dialog.
   */
  unregister() {
    this.loggerService.log(`Proceeding to unregister ${this.applications.length} application(s).`, this.applications);
    this.blockerService.lock();
    this.appsService.unregisterApps(this.applications).pipe(finalize(() => this.blockerService.unlock())).subscribe(
      data => {
        if (data.length === 1) {
          this.notificationService.success('Successfully removed app "'
            + this.applications[0].name + '" of type "' + this.applications[0].type.toString() + '".');
        } else {
          this.notificationService.success(`${data.length} app(s) unregistered.`);
        }
        this.event.emit(data);
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
