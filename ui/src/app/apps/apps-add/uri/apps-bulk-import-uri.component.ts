import { Component, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs/operators';
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
   * Unsubscribe
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Fom Group
   */
  form: FormGroup;

  /**
   * Form Submitted
   */
  submitted = false;

  /**
   * Constructor
   *
   * @param {AppsService} appsService
   * @param {NotificationService} notificationService
   * @param {BlockerService} blockerService
   * @param {FormBuilder} fb
   * @param {Router} router
   */
  constructor(private appsService: AppsService,
              private notificationService: NotificationService,
              private blockerService: BlockerService,
              private fb: FormBuilder,
              private router: Router) {

    this.form = fb.group({
      'uri': new FormControl('', [Validators.required, AppsAddValidator.uri]),
      'force': new FormControl(false)
    });
  }

  /**
   * Will clean up any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Fill input with the URL in parameter
   * @param url
   */
  fillUrl(url: string) {
    this.form.get('uri').setValue(url);
  }

  /**
   * Bulk Import Apps.
   */
  submit() {
    this.submitted = true;
    if (!this.form.valid) {
      this.notificationService.error('Some field(s) are missing or invalid.');
    } else {
      this.blockerService.lock();
      this.appsService.bulkImportApps({
        force: this.form.get('force').value,
        properties: null,
        uri: this.form.get('uri').value.toString()
      }).pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
        .subscribe(data => {
          this.notificationService.success('Apps Imported.');
          this.router.navigate(['apps']);
        }, (error) => {
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        });
    }
  }

}
