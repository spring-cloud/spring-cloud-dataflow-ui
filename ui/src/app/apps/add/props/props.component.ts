import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../shared/api/app.service';
import { NotificationService } from '../../../shared/service/notification.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KeyValueValidator } from '../../../shared/component/key-value/key-value.validator';

@Component({
  selector: 'app-add-props',
  templateUrl: './props.component.html',
})
export class PropsComponent {
  form: FormGroup;
  isImporting = false;
  validators = {
    key: [Validators.required],
    value: [Validators.required]
  };

  constructor(private appService: AppService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
              private router: Router) {
    this.form = fb.group({
      properties: new FormControl('', [
        KeyValueValidator.validateKeyValue(this.validators),
        Validators.required
      ]),
      force: new FormControl(false)
    });
  }

  submit() {
    if (!this.form.valid) {
      this.notificationService.error('Invalid field(s)', 'Some field(s) are missing or invalid.');
    } else {
      this.isImporting = true;
      this.appService
        .importProps(this.form.get('properties').value.toString(), this.form.get('force').value)
        // .pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
        .subscribe(() => {
          this.notificationService.success('Import application(s)', 'Application(s) Imported.');
          this.back();
        }, () => {
          this.isImporting = false;
          this.notificationService.error('An error occurred', 'An error occurred while importing Apps. ' +
            'Please check the server logs for more details.');
        });
    }
  }

  back() {
    this.router.navigateByUrl('apps');
  }

}
