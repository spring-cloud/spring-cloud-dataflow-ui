import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TaskExecution} from '../../../shared/model/task-execution.model';
import {TaskService} from '../../../shared/api/task.service';
import {NotificationService} from '../../../shared/service/notification.service';

@Component({
  selector: 'app-execution-stop',
  templateUrl: './stop.component.html'
})
export class StopComponent {
  isRunning = false;
  isOpen = false;
  execution: TaskExecution;
  @Output() onStopped = new EventEmitter();

  constructor(private taskService: TaskService, private notificationService: NotificationService) {}

  open(execution: TaskExecution): void {
    this.execution = execution;
    this.isRunning = false;
    this.isOpen = true;
  }

  stop(): void {
    this.isRunning = true;
    this.taskService.executionStop(this.execution).subscribe(
      () => {
        this.notificationService.success(
          'Stop task execution(s)',
          `Request submitted to stop task execution "${this.execution.executionId}".`
        );
        this.onStopped.emit(true);
        this.isOpen = false;
        this.execution = null;
        this.isRunning = false;
      },
      error => {
        this.notificationService.error(
          'An error occurred',
          'An error occurred while stopping task executions. ' + 'Please check the server logs for more details.'
        );
        this.isOpen = false;
        this.execution = null;
        this.isRunning = false;
      }
    );
  }
}
