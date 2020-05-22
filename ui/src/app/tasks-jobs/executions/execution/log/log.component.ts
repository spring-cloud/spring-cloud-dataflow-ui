import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../../shared/api/task.service';
import { TaskExecution } from '../../../../shared/model/task-execution.model';

@Component({
  selector: 'app-task-execution-log',
  template: `
    <clr-modal [(clrModalOpen)]="isOpen" *ngIf="isOpen" clrModalSize="xl">
      <h3 class="modal-title">{{title}}</h3>
      <div class="modal-body" style="padding:0;">
        <div class="clr-log" style="margin: 0;padding:0" *ngIf="!loading && logs">
          <pre style="margin:0"><code>{{logs}}</code></pre>
        </div>
        <div *ngIf="loading">
          <clr-spinner clrInline clrSmall></clr-spinner>
          Loading logs...
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="isOpen = false">Close</button>
      </div>
    </clr-modal>`
})
export class LogComponent {
  loading = true;
  isOpen = false;
  title = '';
  logs;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private taskService: TaskService) {
  }

  open(title: string, execution: TaskExecution) {
    this.loading = true;
    this.isOpen = true;
    this.title = title;
    this.logs = null;
    this.taskService.getExecutionLogs(execution)
      .subscribe((logs) => {
        this.logs = logs;
        this.loading = false;
      });
  }
}
