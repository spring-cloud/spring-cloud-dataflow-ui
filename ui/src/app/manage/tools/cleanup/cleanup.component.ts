import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {TaskService} from '../../../shared/api/task.service';
import {NotificationService} from '../../../shared/service/notification.service';

@Component({
  selector: 'app-tools-cleanup',
  templateUrl: './cleanup.component.html'
})
export class CleanupComponent {
  isOpen = false;
  isRunning = false;
  loading = true;
  count: {completed: number; all: number};
  status = 'all';
  @Output() onCleaned = new EventEmitter();

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  open(status: string): void {
    this.status = status;
    this.loading = true;
    this.taskService.getTaskExecutionsCount().subscribe((count: {completed: number; all: number}) => {
      this.count = count;
      this.loading = false;
      if (this.count.all === 0) {
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
    this.isRunning = false;
    this.isOpen = true;
  }

  clean(): void {
    this.isRunning = true;
    this.taskService.taskExecutionsClean(null, this.status === 'completed').subscribe(
      () => {
        this.notificationService.success(
          this.translate.instant('tools.modal.cleanUp.message.successTitle'),
          this.translate.instant('tools.modal.cleanUp.message.successContent', {
            count: this.status === 'completed' ? this.count.completed : this.count.all
          })
        );
        this.onCleaned.emit(this.count);
        this.isOpen = false;
      },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
        this.isOpen = false;
      }
    );
  }
}
