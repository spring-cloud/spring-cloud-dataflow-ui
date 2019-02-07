import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppsService } from '../../apps.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { AppsAddValidator } from '../apps-add.validator';
import { AppError } from '../../../shared/model/error.model';
import { BlockerService } from '../../../shared/components/blocker/blocker.service';

/**
 * Applications Bulk Import
 * Provide a form to import applications by HTTP
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-apps-bulk-import-uri',
  styleUrls: ['./../styles.scss'],
  templateUrl: './apps-bulk-import-uri.component.html'
})
export class AppsBulkImportUriComponent implements OnDestroy {

  /**
   * Fom Group
   */
  form: FormGroup;

  /**
   * Form Submitted
   */
  submitted = false;

  /**
   * Subscription
   */
  bulkImportAppsSubscription: Subscription;

  /**
   * Constructor
   *
   * @param {AppsService} appsService
   * @param {NotificationService} notificationService
   * @param {FormBuilder} fb
   * @param {BlockerService} blockerService
   * @param {Router} router
   */
  constructor(private appsService: AppsService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
              private blockerService: BlockerService,
              private router: Router) {

    this.form = fb.group({
      'uri': new FormControl('', [Validators.required, AppsAddValidator.uri]),
      'force': new FormControl(false)
    });
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    if (this.bulkImportAppsSubscription) {
      this.bulkImportAppsSubscription.unsubscribe();
    }
  }

  /**
   * Bulk Import Apps.
   */
  submit() {
    this.submitted = true;
    if (!this.form.valid) {
      this.notificationService.error('Some field(s) are missing or invalid.');
    } else {
      if (this.bulkImportAppsSubscription) {
        this.bulkImportAppsSubscription.unsubscribe();
      }
      this.blockerService.lock();
      this.bulkImportAppsSubscription = this.appsService
        .bulkImportApps({
          force: this.form.get('force').value,
          properties: null,
          uri: this.form.get('uri').value.toString()
        }).subscribe(data => {
          this.notificationService.success('Apps Imported.');
          this.router.navigate(['apps']);
          this.blockerService.unlock();
        }, (error) => {
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
          this.blockerService.unlock();
        });
    }
  }

}
