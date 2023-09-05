import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {TaskService} from '../../../shared/api/task.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-tools-cleanup',
  templateUrl: './cleanup.component.html'
})
export class CleanupComponent {
  isOpen = false;
  isRunning = false;
  loading = true;
  status = 'all';
  days: number;
  form: UntypedFormGroup;
  @Output() onCleaned = new EventEmitter();

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  open(status: string, days: number): void {
    this.status = status;
    this.days = days;
    this.loading = true;

    this.form = new UntypedFormGroup({
      onlyComplete: new UntypedFormControl(false, [Validators.required]),
      activeDays: new UntypedFormControl(false, [Validators.required]),
      days: new UntypedFormControl(null)
    });

    this.taskService.getTaskExecutionsCount(null).subscribe(
      (count: {completed: number; all: number}) => {
        this.loading = false;
        if (count.all === 0) {
          this.notificationService.warning(
            this.translate.instant('tools.modal.cleanUp.message.warningNoExecutionTitle'),
            this.translate.instant('tools.modal.cleanUp.message.warningNoExecutionContent')
          );
          this.isOpen = false;
        }
      },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
        this.loading = false;
        this.isOpen = false;
      }
    );
    this.loading = false;
    this.isRunning = false;
    this.isOpen = true;
  }

  clean(): void {
    this.isRunning = true;
    const values = this.form.getRawValue();
    const days = values.activeDays ? values.days : null;

    if (this.form.invalid) {
      return;
    }

    this.taskService.taskExecutionsClean(null, values.onlyComplete, days).subscribe(
      () => {
        this.notificationService.success(
          this.translate.instant('tools.modal.cleanUp.message.successTitle'),
          this.translate.instant('tools.modal.cleanUp.message.successContent')
        );
        this.onCleaned.emit();
        this.isOpen = false;
      },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
        this.isOpen = false;
      }
    );
  }
}
