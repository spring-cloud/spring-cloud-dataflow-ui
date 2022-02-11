import {Component} from '@angular/core';
import {AppService} from '../../../shared/api/app.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {KeyValueValidator} from '../../../shared/component/key-value/key-value.validator';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-add-props',
  templateUrl: './props.component.html'
})
export class PropsComponent {
  form: FormGroup;
  isImporting = false;
  validators = {
    key: [Validators.required],
    value: [Validators.required]
  };

  constructor(
    private appService: AppService,
    private notificationService: NotificationService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.form = new FormGroup({
      properties: new FormControl('', [KeyValueValidator.validateKeyValue(this.validators), Validators.required]),
      force: new FormControl(false)
    });
  }

  submit(): void {
    if (!this.form.valid) {
      this.notificationService.error(
        this.translate.instant('commons.message.invalidFieldsTitle'),
        this.translate.instant('commons.message.invalidFieldsContent')
      );
    } else {
      this.isImporting = true;
      this.appService.importProps(this.form.get('properties').value.toString(), this.form.get('force').value).subscribe(
        () => {
          this.notificationService.success(
            this.translate.instant('applications.add.props.message.successTitle'),
            this.translate.instant('applications.add.props.message.successContent')
          );
          this.back();
        },
        () => {
          this.isImporting = false;
          this.notificationService.error(
            this.translate.instant('commons.message.error'),
            this.translate.instant('applications.add.props.message.errorContent')
          );
        }
      );
    }
  }

  back(): void {
    this.router.navigateByUrl('apps');
  }
}
