import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TaskService } from '../../../shared/api/task.service';
import { NotificationService } from '../../../shared/service/notification.service';
import { Task } from '../../../shared/model/task.model';
import { AppError } from '../../../shared/model/error.model';

@Component({
  selector: 'app-task-cleanup',
  templateUrl: './cleanup.component.html',
})
export class CleanupComponent {
  isOpen = false;
  isRunning = false;
  loading = true;
  count: { completed: number; all: number };
  task: Task;
  status = 'all';
  @Output() onCleaned = new EventEmitter();

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService
  ) {}

  open(task: Task) {
    this.status = 'all';
    this.loading = true;
    this.task = task;
    this.taskService.getTaskExecutionsCount(this.task).subscribe(
      (count) => {
        this.count = count;
        this.loading = false;
        if (this.count.all === 0) {
          this.notificationService.warning(
            'No execution',
            'There is no execution for this task.'
          );
          this.isOpen = false;
          this.task = null;
        }
      },
      (error: AppError) => {
        this.notificationService.error('An error occurred', error.getMessage());
        this.isOpen = false;
      }
    );
    this.isRunning = false;
    this.isOpen = true;
  }

  clean() {
    this.isRunning = true;
    this.taskService
      .taskExecutionsClean(this.task, this.status === 'completed')
      .subscribe(
        () => {
          this.notificationService.success(
            'Clean up execution(s)',
            `${
              this.status === 'completed'
                ? this.count.completed
                : this.count.all
            } execution(s) cleaned up.`
          );
          this.onCleaned.emit(this.count);
          this.isOpen = false;
          this.task = null;
        },
        (error) => {
          this.notificationService.error('An error occurred', error);
          this.isOpen = false;
          this.task = null;
        }
      );
  }
}
