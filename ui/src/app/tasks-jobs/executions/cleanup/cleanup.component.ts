import {Component, EventEmitter, Output} from '@angular/core';
import {TaskExecution} from '../../../shared/model/task-execution.model';
import {TaskService} from '../../../shared/api/task.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-execution-cleanup',
  templateUrl: './cleanup.component.html'
})
export class CleanupComponent {
  isOpen = false;
  isRunning = false;
  executions: TaskExecution[];
  @Output() onCleaned = new EventEmitter();

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  open(executions: TaskExecution[]): void {
    this.executions = executions;
    this.isRunning = false;
    this.isOpen = true;
  }

  clean(): void {
    this.isRunning = true;
    this.taskService.executionsClean(this.executions).subscribe(
      data => {
        this.notificationService.success(
          this.translate.instant('executions.cleanup.message.successTitle'),
          this.translate.instant('executions.cleanup.message.successContent', {count: typeof data === 'object' ? data.length : data})
        );
        this.onCleaned.emit(data);
        this.isOpen = false;
        this.executions = null;
      },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
        this.isOpen = false;
        this.executions = null;
      }
    );
  }
}
