import {Component, EventEmitter, Output} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {AppRegistration} from '../../shared/model/app-registration.model';
import {AppsService} from '../apps.service';
import 'rxjs/add/observable/throw';
import { NotificationService } from '../../shared/services/notification.service';

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
   * @param {NotificationService} notificationService
   */
  constructor(private modalRef: BsModalRef,
              private appsService: AppsService,
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
    console.log(`Proceeding to unregister ${this.applications.length} application(s).`, this.applications);
    this.appsService.unregisterApps(this.applications).subscribe(
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
        this.notificationService.error(error);
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
