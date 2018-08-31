import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppsRegisterValidator } from './apps-register.validator';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { ApplicationType } from '../../../shared/model/application-type';
import { AppsService } from '../../apps.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { BusyService } from '../../../shared/services/busy.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { AppRegisterParams } from '../../components/apps.interface';
import { AppError } from '../../../shared/model/error.model';

/**
 * Applications Register
 * Provide forms to register application
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-apps',
  styleUrls: ['./styles.scss'],
  templateUrl: './apps-register.component.html'
})
export class AppsRegisterComponent implements OnInit, OnDestroy {

  /**
   * Busy Subscriptions
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Array of forms registration
   * @type {Array}
   */
  forms: FormGroup[] = [];

  /**
   * Application types
   * @type {ApplicationType}
   */
  applicationTypes = ApplicationType;

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
   * @param {LoggerService} loggerService
   * @param {Router} router
   */
  constructor(private appsService: AppsService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
              private busyService: BusyService,
              private loggerService: LoggerService,
              private router: Router) {
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
   * Initialize by creating the first form registration
   */
  ngOnInit() {
    this.newForm();
  }

  /**
   * Collect the filled forms and submit them to the service
   */
  register() {
    this.submitted = true;
    if (!this.isValid()) {
      if (this.noValue()) {
        this.notificationService.error('Please, register at least one application.');
      } else {
        this.notificationService.error('Some field(s) are missing or invalid.');
      }
    } else {
      const applications: AppRegisterParams[] = this.forms.map((form: FormGroup) => {
        if (!form.invalid && !this.isFormEmpty(form)) {
          return {
            name: form.get('name').value,
            type: form.get('type').value as ApplicationType,
            uri: form.get('uri').value,
            metaDataUri: form.get('metaDataUri').value,
            force: form.get('force').value
          };
        }
      }).filter((a) => a != null);
      const busy = this.appsService.registerApps(applications)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(
          data => {
            this.notificationService.success(`${data.length} App(s) registered.`);
            this.cancel();
          },
          error => {
            this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
          }
        );

      this.busyService.addSubscription(busy);
    }
  }

  /**
   * Return true if no form is invalid and at least one form is fill correctly
   *
   * @returns {boolean}
   */
  isValid(): boolean {
    let count = 0;
    for (let i = 0; i < this.forms.length; i++) {
      if (this.isFormEmpty(this.forms[i])) {
        continue;
      }
      if (this.forms[i].invalid) {
        return false;
      }
      count++;
    }
    return (count > 0);
  }

  /**
   * Return true if all the forms are empty
   *
   * @returns {boolean}
   */
  noValue(): boolean {
    for (let i = 0; i < this.forms.length; i++) {
      if (!this.isFormEmpty(this.forms[i])) {
        return false;
      }
    }
    return true;
  }

  /**
   * State of a form (is empty)
   *
   * @param {FormGroup} form
   * @returns {boolean}
   */
  isFormEmpty(form: FormGroup) {
    return (form.get('uri').hasError('required') && form.get('name').hasError('required')
      && form.get('metaDataUri').value === '' && form.get('type').hasError('required'));
  }

  /**
   * Adds form with the default values
   * @param index Insertion index
   */
  newForm(index?: number) {
    index = index || this.forms.length;
    const form = this.fb.group({
      name: new FormControl('', [AppsRegisterValidator.appName, Validators.required]),
      type: new FormControl('', Validators.required),
      uri: new FormControl('', [AppsRegisterValidator.uri, Validators.required]),
      metaDataUri: new FormControl('', AppsRegisterValidator.uri),
      force: new FormControl(false)
    });

    this.forms.splice(index + 1, 0, form);
  }

  /**
   * Removes form
   * @param {number} index Index of the entry
   */
  removeForm(index: number) {
    this.forms.splice(index, 1);
  }

  /**
   * Navigate to the applications list
   */
  cancel() {
    this.loggerService.log('Back to apps page ...');
    this.router.navigate(['apps']);
  }

}
