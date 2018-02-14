import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {AppsService} from '../apps.service';
import {ToastyService} from 'ng2-toasty';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AppsBulkImportValidator} from './apps-bulk-import.validator';
import {BulkImportParams} from '../components/apps.interface';
import {Subject} from 'rxjs';
import {BusyService} from '../../shared/services/busy.service';
import {takeUntil} from 'rxjs/operators';

/**
 * Applications Bulk Import
 * Provide a form to import applications
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-apps',
  styleUrls: ['./styles.scss'],
  templateUrl: './apps-bulk-import.component.html'
})
export class AppsBulkImportComponent implements OnDestroy {

  /**
   * Busy Subscriptions
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Fom Group
   */
  form: FormGroup;

  /**
   * Constructor
   *
   * @param {AppsService} appsService
   * @param {ToastyService} toastyService
   * @param {FormBuilder} fb
   * @param {BusyService} busyService
   * @param {Router} router
   */
  constructor(private appsService: AppsService,
              private toastyService: ToastyService,
              private fb: FormBuilder,
              private busyService: BusyService,
              private router: Router) {

    this.form = fb.group({
        'uri': new FormControl('', AppsBulkImportValidator.uri),
        'properties': new FormControl('', AppsBulkImportValidator.properties),
        'file': new FormControl(''),
        'force': new FormControl(false)
      }, {validator: AppsBulkImportValidator.form}
    );
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
   * Parse and load a file to the properties control
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
   * Bulk Import Apps.
   */
  bulkImportApps() {
    const bulkImportParams: BulkImportParams = {
      force: this.form.get('force').value,
      properties: this.form.get('properties').value.toString().split('/n'),
      uri: this.form.get('uri').value.toString()
    };
    const busy = this.appsService.bulkImportApps(bulkImportParams)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        data => {
          this.toastyService.success('Apps Imported.');
          this.cancel();
        }
      );

    this.busyService.addSubscription(busy);
  }

  /**
   * Cancel to applications list
   */
  cancel() {
    this.router.navigate(['apps']);
  }
}
