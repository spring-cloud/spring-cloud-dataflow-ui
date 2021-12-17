import {Component} from '@angular/core';
import {AppService} from '../../../shared/api/app.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AppsAddValidator} from '../add.validtor';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-add-uri',
  templateUrl: './uri.component.html'
})
export class UriComponent {
  form: FormGroup;
  isImporting = false;

  constructor(
    private appService: AppService,
    private notificationService: NotificationService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.form = new FormGroup({
      uri: new FormControl('', [Validators.required, AppsAddValidator.uri]),
      force: new FormControl(false)
    });
  }

  fillUrl(url: string): void {
    this.form.get('uri').setValue(url);
  }

  submit(): void {
    if (!this.form.valid) {
      this.notificationService.error(
        this.translate.instant('commons.message.invalidFieldsTitle'),
        this.translate.instant('commons.message.invalidFieldsContent')
      );
    } else {
      this.isImporting = true;
      this.appService.importUri(this.form.get('uri').value.toString(), this.form.get('force').value).subscribe(
        () => {
          this.notificationService.success(
            this.translate.instant('applications.add.uri.message.successTitle'),
            this.translate.instant('applications.add.uri.message.successContent')
          );
          this.back();
        },
        error => {
          this.isImporting = false;
          this.notificationService.error(this.translate.instant('commons.message.error'), error);
        }
      );
    }
  }

  back(): void {
    this.router.navigateByUrl('apps');
  }
}
