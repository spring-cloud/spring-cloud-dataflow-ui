import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { AppsService } from '../../apps.service';
import { BusyService } from '../../../shared/services/busy.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { AppsAddValidator } from '../apps-add.validator';

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
   * Busy Subscriptions
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
   * @param {FormBuilder} fb
   * @param {BusyService} busyService
   * @param {Router} router
   */
  constructor(private appsService: AppsService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
              private busyService: BusyService,
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
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Bulk Import Apps.
   */
  submit() {
    this.submitted = true;
    if (!this.form.valid) {
      this.notificationService.error('Some field(s) are missing or invalid.');
    } else {
      const busy = this.appsService.bulkImportApps({
        force: this.form.get('force').value,
        properties: null,
        uri: this.form.get('uri').value.toString()
      }).pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(data => {
          this.notificationService.success('Apps Imported.');
          this.router.navigate(['apps']);
        });

      this.busyService.addSubscription(busy);
    }
  }

}
