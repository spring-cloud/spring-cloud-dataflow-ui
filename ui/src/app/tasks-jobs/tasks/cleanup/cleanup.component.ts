import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TaskService} from '../../../shared/api/task.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {Task} from '../../../shared/model/task.model';
import {AppError} from '../../../shared/model/error.model';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-task-cleanup',
  templateUrl: './cleanup.component.html'
})
export class CleanupComponent {
  isOpen = false;
  isRunning = false;
  loading = true;
  count: {completed: number; all: number};
  task: Task;
  status = 'all';
  @Output() onCleaned = new EventEmitter();

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  open(task: Task): void {
    this.status = 'all';
    this.loading = true;
    this.task = task;
    this.taskService.getTaskExecutionsCount(this.task).subscribe(
      (count: {completed: number; all: number}) => {
        this.count = count;
        this.loading = false;
        if (this.count.all === 0) {
          this.notificationService.warning(
            this.translate.instant('tasks.cleanup.message.warningNoExecutionTitle'),
            this.translate.instant('tasks.cleanup.message.warningNoExecutionContent')
          );
          this.isOpen = false;
          this.task = null;
        }
      },
      (error: AppError) => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error.getMessage());
        this.isOpen = false;
      }
    );
    this.isRunning = false;
    this.isOpen = true;
  }

  clean(): void {
    this.isRunning = true;
    this.taskService.taskExecutionsClean(this.task, this.status === 'completed').subscribe(
      () => {
        this.notificationService.success(
          this.translate.instant('tasks.cleanup.message.successTitle'),
          this.translate.instant('tasks.cleanup.message.successContent', {
            count: this.status === 'completed' ? this.count.completed : this.count.all
          })
        );
        this.onCleaned.emit(this.count);
        this.isOpen = false;
        this.task = null;
      },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
        this.isOpen = false;
        this.task = null;
      }
    );
  }
}
