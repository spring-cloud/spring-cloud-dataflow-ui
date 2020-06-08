import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TaskService } from '../../../shared/api/task.service';
import { Task } from '../../../shared/model/task.model';
import { NotificationService } from '../../../shared/service/notification.service';

@Component({
  selector: 'app-task-destroy',
  templateUrl: './destroy.component.html'
})
export class DestroyComponent {

  tasks: Task[];
  isOpen = false;
  isRunning = false;
  @Output() onDestroyed = new EventEmitter();

  constructor(private taskService: TaskService,
              private notificationService: NotificationService) {
  }

  open(tasks: Task[]) {
    this.isRunning = false;
    this.tasks = tasks;
    this.isOpen = true;
  }

  destroy() {
    this.isRunning = true;
    this.taskService.destroyTasks(this.tasks)
      .subscribe(
        data => {
          this.notificationService.success('Destroy task(s)', `${data.length} task definition(s) destroyed.`);
          this.onDestroyed.emit(data);
          this.isOpen = false;
          this.tasks = null;
        }, error => {
          this.notificationService.error('An error occurred', 'An error occurred while destroying tasks. ' +
            'Please check the server logs for more details.');
          this.isOpen = false;
          this.tasks = null;
        });
  }

}
