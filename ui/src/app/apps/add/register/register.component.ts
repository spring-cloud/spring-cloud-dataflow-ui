import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApplicationType} from '../../../shared/model/app.model';
import {AppService} from '../../../shared/api/app.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {Router} from '@angular/router';
import {AppsAddValidator} from '../add.validtor';

@Component({
  selector: 'app-add-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  forms: FormGroup[] = [];
  applicationTypes = ApplicationType;
  submitted = false;
  isImporting = false;

  constructor(
    private appService: AppService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.newForm();
  }

  register(): void {
    this.submitted = true;
    if (!this.isValid()) {
      if (this.noValue()) {
        this.notificationService.error($localize `Invalid application`, $localize `Please, register at least one application.`);
      } else {
        this.notificationService.error($localize `Invalid application(s)`, $localize `Some field(s) are missing or invalid.`);
      }
    } else {
      this.isImporting = true;
      const applications = this.forms
        .map((form: FormGroup) => {
          if (!form.invalid && !this.isFormEmpty(form)) {
            return {
              name: form.get('name').value,
              type: form.get('type').value as ApplicationType,
              uri: form.get('uri').value,
              metaDataUri: form.get('metaDataUri').value,
              force: form.get('force').value
            };
          }
        })
        .filter(a => a != null);
      this.appService
        .registerProps(applications)
        // .pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
        .subscribe(
          data => {
            this.notificationService.success($localize `Register application(s).`, `${data.length}`+ $localize ` App(s) registered.`);
            this.cancel();
          },
          error => {
            this.isImporting = false;
            this.notificationService.error($localize `An error occurred`, error);
          }
        );
    }
  }

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
    return count > 0;
  }

  noValue(): boolean {
    for (let i = 0; i < this.forms.length; i++) {
      if (!this.isFormEmpty(this.forms[i])) {
        return false;
      }
    }
    return true;
  }

  isFormEmpty(form: FormGroup): boolean {
    return (
      form.get('uri').hasError('required') &&
      form.get('name').hasError('required') &&
      form.get('metaDataUri').value === '' &&
      form.get('type').hasError('required')
    );
  }

  newForm(index?: number): void {
    index = index || this.forms.length;
    const form = this.fb.group({
      name: new FormControl('', [AppsAddValidator.appName, Validators.required]),
      type: new FormControl('', Validators.required),
      uri: new FormControl('', [AppsAddValidator.appUri, Validators.required]),
      metaDataUri: new FormControl('', AppsAddValidator.appUri),
      force: new FormControl(false)
    });

    this.forms.splice(index + 1, 0, form);
  }

  removeForm(index: number): void {
    this.forms.splice(index, 1);
  }

  cancel(): void {
    this.router.navigateByUrl('apps');
  }
}
