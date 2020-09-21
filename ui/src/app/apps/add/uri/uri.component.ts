import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../shared/api/app.service';
import { NotificationService } from '../../../shared/service/notification.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppsAddValidator } from '../add.validtor';

@Component({
  selector: 'app-add-uri',
  templateUrl: './uri.component.html',
})
export class UriComponent {

  form: FormGroup;
  isImporting = false;

  constructor(private appService: AppService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
              private router: Router) {

    this.form = fb.group({
      uri: new FormControl('', [Validators.required, AppsAddValidator.uri]),
      force: new FormControl(false)
    });
  }

  fillUrl(url: string) {
    this.form.get('uri').setValue(url);
  }

  submit() {
    if (!this.form.valid) {
      this.notificationService.error('Invalid field', 'Some field(s) are missing or invalid.');
    } else {
      this.isImporting = true;
      this.appService
        .importUri(this.form.get('uri').value.toString(), this.form.get('force').value)
        // .pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
        .subscribe(data => {
          this.notificationService.success('Import application(s)', 'Application(s) Imported.');
          this.back();
        }, (error) => {
          this.isImporting = false;
          this.notificationService.error('An error occurred', error);
        });
    }
  }

  back() {
    this.router.navigateByUrl('apps');
  }
}
