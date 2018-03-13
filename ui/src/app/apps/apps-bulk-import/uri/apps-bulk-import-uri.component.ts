import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ToastyService} from 'ng2-toasty';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/operators';
import {AppsService} from '../../apps.service';
import {AppsBulkImportValidator} from '../apps-bulk-import.validator';
import {BusyService} from '../../../shared/services/busy.service';

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
      'uri': new FormControl('', [Validators.required, AppsBulkImportValidator.uri]),
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
    const busy = this.appsService.bulkImportApps({
      force: this.form.get('force').value,
      properties: null,
      uri: this.form.get('uri').value.toString()
    }).pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(data => {
        this.toastyService.success('Apps Imported.');
        this.router.navigate(['apps']);
      });

    this.busyService.addSubscription(busy);
  }

}
