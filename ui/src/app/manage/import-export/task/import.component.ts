import { Component } from '@angular/core';
import { NotificationService } from '../../../shared/service/notification.service';
import { ImportExportService } from '../../../shared/service/import-export.service';

@Component({
  selector: 'app-manage-task-import',
  template: `
    <clr-modal [(clrModalOpen)]="isOpen" [clrModalClosable]="view !== 'loading'"
               [clrModalSize]="view === 'result' ? 'lg' : 'md'">
      <h3 class="modal-title">Import task(s)</h3>
      <div class="modal-body clr-form clr-form-horizontal" *ngIf="view === 'file'">
        <div>
          You can import your tasks from a <strong>JSON file</strong>.<br/>
          The file needs to be modified for sensitive properties before importing.
        </div>
        <div class="clr-form-control clr-row">
          <label class="clr-col-2 clr-control-label">JSON file</label>
          <div class="clr-control-container clr-col-10">
            <div class="clr-file-input-wrapper">
              <label for="file">
                <span class="filename text-truncate">{{file?.name}}</span>
                <span class="btn btn-sm btn-secondary">Select a file</span>
                <input name="file" id="file" type='file' (change)="fileChanged($event)">
              </label>
            </div>
          </div>
        </div>
        <clr-checkbox-container class="clr-form-control clr-row">
          <label class="clr-col-2">Options</label>
          <clr-checkbox-wrapper>
            <input type="checkbox" clrCheckbox name="options" value="option1" [(ngModel)]="excludeChildren"
                   class="clr-col-10"/>
            <label>Exclude children</label>
          </clr-checkbox-wrapper>
        </clr-checkbox-container>
      </div>
      <div class="modal-body" *ngIf="view === 'result'">
        <div>
          File: <strong>{{file?.name}}</strong><br/>
          Duration: <strong>{{result.duration}}s</strong>
        </div>
        <div *ngIf="result.error.length > 0">
          <h4>{{result.error.length}} error(s)</h4>
          <clr-datagrid class="clr-datagrid-no-fixed-height">
            <clr-dg-column [style.width.px]="10">&nbsp;</clr-dg-column>
            <clr-dg-column>Description</clr-dg-column>
            <clr-dg-row *clrDgItems="let task of result.error; index as i">
              <clr-dg-cell>
                <clr-icon shape="error-standard" class="is-solid"></clr-icon>
              </clr-dg-cell>
              <clr-dg-cell>
                <div style="padding-bottom: 6px;">
                  <strong>{{task.name}}</strong>
                </div>
                <div style="padding-bottom: 4px;">
                  <span class="dsl-text dsl-truncate">{{task.dslText}}</span>
                </div>
                <div class="error">
                  Message: {{task.message}}<br/>
                  Index: {{i}}
                </div>
              </clr-dg-cell>
            </clr-dg-row>
          </clr-datagrid>
        </div>
        <div *ngIf="result.success.length > 0">
          <h4>{{result.success.length}} task(s) created</h4>
          <clr-datagrid class="clr-datagrid-no-fixed-height">
            <clr-dg-column [style.width.px]="10">&nbsp;</clr-dg-column>
            <clr-dg-column>Description</clr-dg-column>
            <clr-dg-row *clrDgItems="let task of result.success">
              <clr-dg-cell>
                <clr-icon shape="success-standard" class="is-solid"></clr-icon>
              </clr-dg-cell>
              <clr-dg-cell>
                <div style="padding-bottom: 6px;">
                  <strong>{{task.name}}</strong>
                </div>
                <div>
                  <span class="dsl-text">{{task.dslText}}</span>
                </div>
              </clr-dg-cell>
            </clr-dg-row>
          </clr-datagrid>
        </div>
      </div>
      <div class="modal-body" *ngIf="view === 'importing'">
        <clr-spinner clrInline clrSmall></clr-spinner>
        Importing task(s) ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" [disabled]="view === 'importing'" (click)="isOpen = false">
          Cancel
        </button>
        <button type="button" class="btn btn-primary" (click)="run()" [disabled]="view === 'importing'"
                *ngIf="view === 'file'">
          <span>Import task(s)</span>
        </button>
      </div>
    </clr-modal>
  `
})
export class TaskImportComponent {
  isOpen = false;
  excludeChildren = false;
  file: any;
  view = 'file';
  result = {
    success: [],
    error: [],
    duration: 0
  };

  constructor(private notificationService: NotificationService,
              private importExportService: ImportExportService) {
  }

  open() {
    this.isOpen = true;
  }

  fileChanged(event) {
    try {
      this.file = event.target.files[0];
    } catch (e) {
      this.file = null;
    }
  }

  run() {
    if (!this.file) {
      this.notificationService.error('Invalid file', 'Please, select a file.');
      return;
    }
    const date = new Date().getTime();
    this.view = 'importing';

    this.importExportService.tasksImport(this.file, this.excludeChildren)
      .subscribe((result) => {
          this.result = {
            success: result.filter(item => item.created),
            error: result.filter(item => !item.created),
            duration: Math.round((new Date().getTime() - date) / 1000)
          };
          this.view = 'result';
        },
        () => {
          this.view = 'file';
          this.notificationService.error('Invalid file', 'The file is not valid.');
        });
  }

}
