import { Component } from '@angular/core';
import { ImportExportService } from '../../../shared/service/import-export.service';
import { NotificationService } from '../../../shared/service/notification.service';
import { TaskPage } from '../../../shared/model/task.model';
import { TaskService } from '../../../shared/api/task.service';

@Component({
  selector: 'app-manage-task-export',
  template: `
    <clr-modal [(clrModalOpen)]="isOpen" [clrModalClosable]="!isRunning" clrModalSize="lg">
      <h3 class="modal-title">Export task(s)</h3>
      <div class="modal-body" *ngIf="!isRunning">
        <div>
          You can create an export of your <strong>selected tasks</strong>.<br/>
          This operation will generate and download a <strong>JSON file</strong>.
        </div>
        <clr-datagrid [(clrDgSelected)]="selected" *ngIf="tasks">
          <clr-dg-column>Name</clr-dg-column>
          <clr-dg-column>Definition</clr-dg-column>
          <clr-dg-row *clrDgItems="let task of tasks.items" [clrDgItem]="task">
            <clr-dg-cell>{{task.name}}</clr-dg-cell>
            <clr-dg-cell>
              <span class="dsl-text dsl-truncate">{{task.dslText}}</span>
            </clr-dg-cell>
          </clr-dg-row>
        </clr-datagrid>
      </div>
      <div class="modal-body" *ngIf="isRunning">
        <clr-spinner clrInline clrSmall></clr-spinner>
        Exporting task(s) ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" [disabled]="isRunning" (click)="isOpen = false">Cancel</button>
        <button type="button" class="btn btn-primary" (click)="run()" [disabled]="isRunning">
          <span>Export task(s)</span>
        </button>
      </div>
    </clr-modal>
  `
})
export class TaskExportComponent {
  isOpen = false;
  isRunning = false;
  tasks: TaskPage;
  selected = [];

  constructor(private taskService: TaskService,
              private notificationService: NotificationService,
              private importExportService: ImportExportService) {
  }

  open() {
    this.isRunning = false;
    this.isOpen = true;
    this.taskService.getTasks(0, 100000, '', 'taskName', 'ASC')
      .subscribe((page: TaskPage) => {
        this.tasks = page;
        this.selected = [...page.items];
      });
  }

  run() {
    if (this.selected.length === 0) {
      this.notificationService.error('No task selected', 'Please, select task(s) to export.');
    } else {
      this.isRunning = true;
      this.importExportService.tasksExport(this.selected)
        .subscribe(() => {
          this.notificationService.success('Task(s) export', 'Task(s) has been exported.');
          this.isOpen = false;
        });
    }
  }
}
