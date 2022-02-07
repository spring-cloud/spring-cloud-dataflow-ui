import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {TaskService} from '../../../shared/api/task.service';
import {Task} from '../../../shared/model/task.model';
import {NotificationService} from '../../../shared/service/notification.service';

@Component({
  selector: 'app-task-destroy',
  templateUrl: './destroy.component.html'
})
export class DestroyComponent {
  tasks: Task[];
  isOpen = false;
  isRunning = false;
  @Output() onDestroyed = new EventEmitter();

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  open(tasks: Task[]): void {
    this.isRunning = false;
    this.tasks = tasks;
    this.isOpen = true;
  }

  destroy(): void {
    this.isRunning = true;
    this.taskService.destroyTasks(this.tasks).subscribe(
      data => {
        if (data.length === 1) {
          this.notificationService.success(
            this.translate.instant('tasks.destroy.message.successTitle'),
            this.translate.instant('tasks.destroy.message.successContent', {name: this.tasks[0].name})
          );
        } else {
          this.notificationService.success(
            this.translate.instant('tasks.destroy.message.successTitle2'),
            this.translate.instant('tasks.destroy.message.successContent2', {count: data.length})
          );
        }
        this.isRunning = false;
        this.onDestroyed.emit(data);
        this.isOpen = false;
        this.tasks = null;
      },
      () => {
        this.notificationService.error(
          this.translate.instant('commons.message.error'),
          this.translate.instant('tasks.destroy.message.errorContent')
        );
        this.isOpen = false;
        this.tasks = null;
      }
    );
  }
}
