import {Component, OnInit, ViewChild} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../shared/service/notification.service';
import {TaskService} from '../../../shared/api/task.service';
import {Router} from '@angular/router';
import {Properties} from 'spring-flo';
import {Observable} from 'rxjs';
import {TaskFloCreateComponent} from '../../../flo/task/component/create.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['../../../flo/shared/flo.scss']
})
export class CreateComponent implements OnInit {
  errors: Array<string>;
  warnings: Array<string>;
  isOpen = false;
  isCreating = false;
  form: UntypedFormGroup;
  dsl: string;

  @ViewChild('flo', {static: true}) flo: TaskFloCreateComponent;

  taskName = new UntypedFormControl(
    '',
    [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-\_]+$/), Validators.maxLength(255)],
    [Properties.Validators.uniqueResource(value => this.isUniqueTaskName(value), 500)]
  );
  taskDescription = new UntypedFormControl('', Validators.maxLength(255));

  constructor(
    private fb: UntypedFormBuilder,
    private taskService: TaskService,
    private router: Router,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {
    this.form = fb.group({
      taskName: this.taskName,
      taskDescription: this.taskDescription
    });
  }

  ngOnInit(): void {
    this.errors = new Array<string>();
    this.warnings = new Array<string>();
  }

  submit(): void {
    // if (!this.form.valid) {
    //   this.notificationService.error('An error occurred.', 'Some field(s) are missing or invalid.');
    // } else {
    this.isCreating = true;
    this.taskService.createTask(this.taskName.value, this.dsl, this.taskDescription.value).subscribe(
      () => {
        this.notificationService.success(
          this.translate.instant('tasks.create.message.successTitle'),
          this.translate.instant('tasks.create.message.successContent', {name: this.taskName.value})
        );
        this.back();
      },
      error => {
        this.isCreating = false;
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
      }
    );
    // }
  }

  isUniqueTaskName(name: string): Observable<boolean> {
    return new Observable<boolean>(obs => {
      if (name) {
        this.taskService.getTask(name).subscribe(
          def => {
            if (def) {
              obs.next(false);
            } else {
              obs.next(true);
            }
            obs.complete();
          },
          () => {
            obs.next(true);
            obs.complete();
          }
        );
      } else {
        obs.next(true);
        obs.complete();
      }
    });
  }

  createTask(): void {
    if (!this.flo.dsl || !this.flo.dsl.trim()) {
      this.notificationService.error(
        this.translate.instant('commons.message.error'),
        this.translate.instant('tasks.create.message.errorContent')
      );
      return;
    }
    this.taskName.setValue('');
    this.taskDescription.setValue('');
    this.dsl = this.flo.dsl;
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }

  back(): void {
    this.router.navigateByUrl('tasks-jobs/tasks');
  }
}
