import {Component} from '@angular/core';
import {AppService} from '../../../shared/api/app.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AppsAddValidator} from '../add.validtor';

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
    private router: Router
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
      this.notificationService.error($localize `Invalid field`, $localize `Some field(s) are missing or invalid.`);
    } else {
      this.isImporting = true;
      this.appService
        .importUri(this.form.get('uri').value.toString(), this.form.get('force').value)
        // .pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
        .subscribe(
          data => {
            this.notificationService.success($localize `Import application(s)`, $localize `Application(s) Imported.`);
            this.back();
          },
          error => {
            this.isImporting = false;
            this.notificationService.error($localize `An error occurred`, error);
          }
        );
    }
  }

  back(): void {
    this.router.navigateByUrl('apps');
  }
}
