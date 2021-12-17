import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TaskExecution} from '../../../shared/model/task-execution.model';
import {TaskService} from '../../../shared/api/task.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-execution-stop',
  templateUrl: './stop.component.html'
})
export class StopComponent {
  isRunning = false;
  isOpen = false;
  execution: TaskExecution;
  @Output() onStopped = new EventEmitter();

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

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
          this.translate.instant('executions.stop.message.successTitle'),
          this.translate.instant('executions.stop.message.successContent', {id: this.execution.executionId})
        );
        this.onStopped.emit(true);
        this.isOpen = false;
        this.execution = null;
        this.isRunning = false;
      },
      error => {
        this.notificationService.error(
          this.translate.instant('commons.message.error'),
          this.translate.instant('executions.stop.message.errorContent')
        );
        this.isOpen = false;
        this.execution = null;
        this.isRunning = false;
      }
    );
  }
}
