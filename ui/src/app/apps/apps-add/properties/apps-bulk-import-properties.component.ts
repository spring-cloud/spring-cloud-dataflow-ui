import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppsService } from '../../apps.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { BulkImportParams } from '../../components/apps.interface';
import { AppsAddValidator } from '../apps-add.validator';
import { BlockerService } from '../../../shared/components/blocker/blocker.service';
import { AppError } from '../../../shared/model/error.model';

/**
 * Applications Bulk Import Properties
 * Provide a form to import applications by properties
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-apps-bulk-import-properties',
  styleUrls: ['./../styles.scss'],
  templateUrl: './apps-bulk-import-properties.component.html'
})
export class AppsBulkImportPropertiesComponent implements OnDestroy {

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
   * @param {BlockerService} blockerService
   * @param {Router} router
   */
  constructor(private appsService: AppsService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
              private blockerService: BlockerService,
              private router: Router) {

    this.form = fb.group({
      'properties': new FormControl('', [Validators.required, AppsAddValidator.properties]),
      'file': new FormControl(''),
      'force': new FormControl(false)
    });
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
  }

  /**
   * Parse and load a file to the properties control
   * Produce an exception when the user cancel the file dialog
   *
   * @param {Blob} contents File
   */
  fileChange(contents) {
    try {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        this.form.get('properties').setValue(reader.result);
        this.form.get('file').setValue('');
      };
      reader.readAsText(contents.target.files[0]);
    } catch (e) {
    }
  }

  /**
   * Prepare Bulk Import Params
   * @param force
   * @param {string} importProps
   */
  prepareBulkImportRequest(force, importProps: string): BulkImportParams {
    return {
      force: force,
      properties: importProps.split('\n'),
      uri: ''
    };
  }

  /**
   * Bulk Import Apps.
   * Submit the parameters
   */
  submit() {
    this.submitted = true;
    if (!this.form.valid) {
      this.notificationService.error('Some field(s) are missing or invalid.');
    } else {
      this.blockerService.lock();
      const reqImportBulkApps = this.prepareBulkImportRequest(
        this.form.get('force').value,
        this.form.get('properties').value.toString()
      );
      this.appsService.bulkImportApps(reqImportBulkApps)
        .subscribe(() => {
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
