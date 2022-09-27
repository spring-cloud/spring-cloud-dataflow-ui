import {Component} from '@angular/core';
import {NotificationService} from '../../../shared/service/notification.service';
import {ImportExportService} from '../../../shared/service/import-export.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-manage-task-import',
  template: `
    <clr-modal
      [(clrModalOpen)]="isOpen"
      [clrModalClosable]="view !== 'loading'"
      [clrModalSize]="view === 'result' ? 'lg' : 'md'"
    >
      <h3 class="modal-title">{{ 'tools.modal.importTasks.title' | translate }}</h3>
      <div class="modal-body clr-form clr-form-horizontal" *ngIf="view === 'file'">
        <div [innerHTML]="'tools.modal.importTasks.content' | translate"></div>
        <div class="clr-form-control clr-row">
          <label class="clr-col-2 clr-control-label">{{ 'tools.modal.importTasks.jsonFile' | translate }}</label>
          <div class="clr-control-container clr-col-10">
            <div class="clr-file-input-wrapper">
              <label for="file">
                <span class="filename text-truncate">{{ file?.name }}</span>
                <span class="btn btn-sm btn-secondary">{{ 'commons.selectFile' | translate }}</span>
                <input name="file" id="file" type="file" (change)="fileChanged($event)" />
              </label>
            </div>
          </div>
        </div>
        <clr-checkbox-container class="clr-form-control clr-row">
          <label class="clr-col-2">{{ 'tools.modal.importTasks.options' | translate }}</label>
          <clr-checkbox-wrapper>
            <input
              type="checkbox"
              clrCheckbox
              name="options"
              value="option1"
              [(ngModel)]="excludeChildren"
              class="clr-col-10"
            />
            <label>{{ 'tools.modal.importTasks.excludeChildren' | translate }}</label>
          </clr-checkbox-wrapper>
        </clr-checkbox-container>
      </div>
      <div class="modal-body" *ngIf="view === 'result'">
        <div>
          {{ 'tools.modal.importTasks.file' | translate }}: <strong>{{ file?.name }}</strong
          ><br />
          {{ 'tools.modal.importTasks.duration' | translate }}: <strong>{{ result.duration }}s</strong>
        </div>
        <div *ngIf="result.error.length > 0">
          <h4>{{ 'tools.modal.importTasks.errors' | translate: {count: result.error.length} }}</h4>
          <clr-datagrid class="clr-datagrid-no-fixed-height">
            <clr-dg-column [style.width.px]="10">&nbsp;</clr-dg-column>
            <clr-dg-column>{{ 'tools.modal.importTasks.description' | translate }}</clr-dg-column>
            <clr-dg-row *clrDgItems="let task of result.error; index as i">
              <clr-dg-cell>
                <clr-icon shape="error-standard" class="is-solid is-error"></clr-icon>
              </clr-dg-cell>
              <clr-dg-cell>
                <div style="padding-bottom: 6px;">
                  <strong>{{ task.name }}</strong>
                </div>
                <div style="padding-bottom: 4px;">
                  <span class="dsl-text dsl-truncate">{{ task.dslText }}</span>
                </div>
                <div class="error">
                  {{ 'tools.modal.importTasks.errorMessage' | translate }}: {{ task.message }}<br />
                  {{ 'tools.modal.importTasks.index' | translate }}: {{ i }}
                </div>
              </clr-dg-cell>
            </clr-dg-row>
          </clr-datagrid>
        </div>
        <div *ngIf="result.success.length > 0">
          <h4>{{ 'tools.modal.importTasks.success' | translate: {count: result.success.length} }}</h4>
          <clr-datagrid class="clr-datagrid-no-fixed-height">
            <clr-dg-column [style.width.px]="10">&nbsp;</clr-dg-column>
            <clr-dg-column>{{ 'tools.modal.importTasks.description' | translate }}</clr-dg-column>
            <clr-dg-row *clrDgItems="let task of result.success">
              <clr-dg-cell>
                <clr-icon shape="success-standard" class="is-solid is-success"></clr-icon>
              </clr-dg-cell>
              <clr-dg-cell>
                <div style="padding-bottom: 6px;">
                  <strong>{{ task.name }}</strong>
                </div>
                <div>
                  <span class="dsl-text">{{ task.dslText }}</span>
                </div>
              </clr-dg-cell>
            </clr-dg-row>
          </clr-datagrid>
        </div>
      </div>
      <div class="modal-body" *ngIf="view === 'importing'">
        <clr-spinner clrInline clrSmall></clr-spinner>
        {{ 'tools.modal.importTasks.importing' | translate }}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" [disabled]="view === 'importing'" (click)="isOpen = false">
          {{ 'commons.close' | translate }}
        </button>
        <button
          type="button"
          class="btn btn-primary"
          (click)="run()"
          [disabled]="view === 'importing'"
          *ngIf="view === 'file'"
        >
          <span>{{ 'tools.modal.importTasks.import' | translate }}</span>
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

  constructor(
    private notificationService: NotificationService,
    private importExportService: ImportExportService,
    private translate: TranslateService
  ) {}

  open(): void {
    this.result = {
      success: [],
      error: [],
      duration: 0
    };
    this.view = 'file';
    this.file = null;
    this.excludeChildren = false;
    this.isOpen = true;
  }

  fileChanged(event: any): void {
    try {
      this.file = event.target.files[0];
    } catch (e) {
      this.file = null;
    }
  }

  run(): void {
    if (!this.file) {
      this.notificationService.error(
        this.translate.instant('tools.modal.importTasks.message.errorSelectFileTitle'),
        this.translate.instant('tools.modal.importTasks.message.errorSelectFileContent')
      );
      return;
    }
    const date = new Date().getTime();
    this.view = 'importing';

    this.importExportService.tasksImport(this.file, this.excludeChildren).subscribe(
      result => {
        this.result = {
          success: result.filter(item => item.created),
          error: result.filter(item => !item.created),
          duration: Math.round((new Date().getTime() - date) / 1000)
        };
        this.view = 'result';
      },
      () => {
        this.view = 'file';
        this.notificationService.error(
          this.translate.instant('tools.modal.importTasks.message.errorInvalidFileTitle'),
          this.translate.instant('tools.modal.importTasks.message.errorInvalidFileContent')
        );
      }
    );
  }
}
