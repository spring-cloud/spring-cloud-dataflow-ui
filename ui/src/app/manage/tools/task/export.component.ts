import {Component} from '@angular/core';
import {ImportExportService} from '../../../shared/service/import-export.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {TaskPage} from '../../../shared/model/task.model';
import {TaskService} from '../../../shared/api/task.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-manage-task-export',
  template: `
    <clr-modal [(clrModalOpen)]="isOpen" [clrModalClosable]="!isRunning" clrModalSize="lg">
      <h3 class="modal-title">{{ 'tools.modal.exportTasks.title' | translate }}</h3>
      <div class="modal-body" *ngIf="!isRunning">
        <div [innerHTML]="'tools.modal.exportTasks.content' | translate"></div>
        <clr-datagrid [(clrDgSelected)]="selected" *ngIf="tasks">
          <clr-dg-column>{{ 'tools.modal.exportTasks.name' | translate }}</clr-dg-column>
          <clr-dg-column>{{ 'tools.modal.exportTasks.definition' | translate }}</clr-dg-column>
          <clr-dg-row *clrDgItems="let task of tasks.items" [clrDgItem]="task">
            <clr-dg-cell>{{ task.name }}</clr-dg-cell>
            <clr-dg-cell>
              <span class="dsl-text dsl-truncate">{{ task.dslText }}</span>
            </clr-dg-cell>
          </clr-dg-row>
        </clr-datagrid>
      </div>
      <div class="modal-body" *ngIf="isRunning">
        <clr-spinner clrInline clrSmall></clr-spinner>
        {{ 'tools.modal.exportTasks.exporting' | translate }}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" [disabled]="isRunning" (click)="isOpen = false">
          {{ 'commons.cancel' | translate }}
        </button>
        <button type="button" class="btn btn-primary" (click)="run()" [disabled]="isRunning">
          <span>{{ 'tools.modal.exportTasks.export' | translate }}</span>
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

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService,
    private importExportService: ImportExportService,
    private translate: TranslateService
  ) {}

  open(): void {
    this.isRunning = false;
    this.isOpen = true;
    this.taskService.getTasks(0, 100000, '', 'taskName', 'ASC').subscribe((page: TaskPage) => {
      this.tasks = page;
      this.selected = [...page.items];
    },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
        this.isRunning = false;
        this.isOpen = false;
      }
    );
  }

  run(): void {
    if (this.selected.length === 0) {
      this.notificationService.error(
        this.translate.instant('tools.modal.exportTasks.message.errorNoTaskTitle'),
        this.translate.instant('tools.modal.exportTasks.message.errorNoTaskContent')
      );
    } else {
      this.isRunning = true;
      this.importExportService.tasksExport(this.selected).subscribe(() => {
        this.notificationService.success(
          this.translate.instant('tools.modal.exportTasks.message.successTitle'),
          this.translate.instant('tools.modal.exportTasks.message.successContent')
        );
        this.isOpen = false;
      },
        error => {
          this.notificationService.error(this.translate.instant('commons.message.error'), error);
          this.isRunning = false;
          this.isOpen = false;
        }
      );
    }
  }
}
