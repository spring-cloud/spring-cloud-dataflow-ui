import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ApplicationType} from '../../../shared/model/app.model';
import {AppService} from '../../../shared/api/app.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {Router} from '@angular/router';
import {AppsAddValidator} from '../add.validtor';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-add-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  forms: UntypedFormGroup[] = [];
  applicationTypes = ApplicationType;
  bootVersions: Array<string>;
  defaultBoot: string;
  submitted = false;
  isImporting = false;

  constructor(
    private appService: AppService,
    private notificationService: NotificationService,
    private fb: UntypedFormBuilder,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.appService.getBootVersions().subscribe((data: any) => {
      this.bootVersions = data.versions;
      this.defaultBoot = data.defaultSchemaVersion;
      this.newForm();
    });
  }

  register(): void {
    this.submitted = true;
    if (!this.isValid()) {
      if (this.noValue()) {
        this.notificationService.error(
          this.translate.instant('applications.add.register.message.invalidAppTitle'),
          this.translate.instant('applications.add.register.message.invalidAppContent')
        );
      } else {
        this.notificationService.error(
          this.translate.instant('commons.message.invalidFieldsTitle'),
          this.translate.instant('commons.message.invalidFieldsContent')
        );
      }
    } else {
      this.isImporting = true;
      const applications = this.forms
        .map((form: UntypedFormGroup) => {
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
      this.appService.registerProps(applications).subscribe(
        data => {
          this.notificationService.success(
            this.translate.instant('applications.add.register.message.successTitle'),
            this.translate.instant('applications.add.register.message.successContent', {count: data.length})
          );
          this.cancel();
        },
        error => {
          this.isImporting = false;
          this.notificationService.error(this.translate.instant('commons.message.error'), error);
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

  isFormEmpty(form: UntypedFormGroup): boolean {
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
      name: new UntypedFormControl('', [AppsAddValidator.appName, Validators.required]),
      type: new UntypedFormControl('', Validators.required),
      uri: new UntypedFormControl('', [AppsAddValidator.appUri, Validators.required]),
      metaDataUri: new UntypedFormControl('', AppsAddValidator.appUri),
      force: new UntypedFormControl(false)
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
