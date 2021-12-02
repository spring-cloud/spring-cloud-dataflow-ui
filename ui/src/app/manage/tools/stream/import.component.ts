import {Component} from '@angular/core';
import {NotificationService} from '../../../shared/service/notification.service';
import {ImportExportService} from '../../../shared/service/import-export.service';

@Component({
  selector: 'app-manage-stream-import',
  template: `
    <clr-modal
      [(clrModalOpen)]="isOpen"
      [clrModalClosable]="view !== 'loading'"
      [clrModalSize]="view === 'result' ? 'lg' : 'md'"
    >
      <h3 class="modal-title"><ng-container i18n>Import stream(s)</ng-container></h3>
      <div class="modal-body clr-form clr-form-horizontal" *ngIf="view === 'file'">
        <div>
          <ng-container i18n>You can import your streams from a <strong>JSON file</strong>.<br />
          The file needs to be modified for sensitive properties before importing.</ng-container>
        </div>
        <div class="clr-form-control clr-row">
          <label class="clr-col-2 clr-control-label"><ng-container i18n>JSON file</ng-container></label>
          <div class="clr-control-container clr-col-10">
            <div class="clr-file-input-wrapper">
              <label for="file">
                <span class="filename text-truncate">{{ file?.name }}</span>
                <span class="btn btn-sm btn-secondary"><ng-container i18n>Select a file</ng-container></span>
                <input name="file" id="file" type="file" (change)="fileChanged($event)" />
              </label>
            </div>
          </div>
        </div>
        <clr-checkbox-container class="clr-form-control clr-row">
          <label class="clr-col-2"><ng-container i18n>Options</ng-container></label>
          <clr-checkbox-wrapper>
            <input
              type="checkbox"
              clrCheckbox
              name="options"
              value="option1"
              [(ngModel)]="optimize"
              class="clr-col-10"
            />
            <label><ng-container i18n>Optimize</ng-container></label>
          </clr-checkbox-wrapper>
        </clr-checkbox-container>
      </div>
      <div class="modal-body" *ngIf="view === 'result'">
        <div>
          <ng-container i18n>File:</ng-container> <strong>{{ file?.name }}</strong
          ><br />
          <ng-container i18n>Duration:</ng-container> <strong>{{ result.duration }}s</strong>
        </div>
        <div *ngIf="result.error.length > 0">
          <h4>{{ result.error.length }} <ng-container i18n>error(s)</ng-container></h4>
          <clr-datagrid class="clr-datagrid-no-fixed-height">
            <clr-dg-column [style.width.px]="10">&nbsp;</clr-dg-column>
            <clr-dg-column><ng-container i18n>Description</ng-container></clr-dg-column>
            <clr-dg-row *clrDgItems="let stream of result.error; index as i">
              <clr-dg-cell>
                <clr-icon shape="error-standard" class="is-solid"></clr-icon>
              </clr-dg-cell>
              <clr-dg-cell>
                <div style="padding-bottom: 6px;">
                  <strong>{{ stream.name }}</strong>
                </div>
                <div style="padding-bottom: 4px;">
                  <span class="dsl-text dsl-truncate">{{ stream.dslText }}</span>
                </div>
                <div class="error">
                  <ng-container i18n>Message:</ng-container> {{ stream.message }}<br />
                  <ng-container i18n>Index:</ng-container> {{ i }}
                </div>
              </clr-dg-cell>
            </clr-dg-row>
          </clr-datagrid>
        </div>
        <div *ngIf="result.success.length > 0">
          <h4>{{ result.success.length }} <ng-container i18n>stream(s) created</ng-container></h4>
          <clr-datagrid class="clr-datagrid-no-fixed-height">
            <clr-dg-column [style.width.px]="10">&nbsp;</clr-dg-column>
            <clr-dg-column><ng-container i18n>Description</ng-container></clr-dg-column>
            <clr-dg-row *clrDgItems="let stream of result.success">
              <clr-dg-cell>
                <clr-icon shape="success-standard" class="is-solid"></clr-icon>
              </clr-dg-cell>
              <clr-dg-cell>
                <div style="padding-bottom: 6px;">
                  <strong>{{ stream.name }}</strong>
                </div>
                <div>
                  <span class="dsl-text">{{ stream.dslText }}</span>
                </div>
              </clr-dg-cell>
            </clr-dg-row>
          </clr-datagrid>
        </div>
      </div>
      <div class="modal-body" *ngIf="view === 'importing'">
        <clr-spinner clrInline clrSmall></clr-spinner>
        <ng-container i18n>Importing stream(s) ...</ng-container>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" [disabled]="view === 'importing'" (click)="isOpen = false">
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          (click)="run()"
          [disabled]="view === 'importing'"
          *ngIf="view === 'file'"
        >
          <span><ng-container i18n>Import stream(s)</ng-container></span>
        </button>
      </div>
    </clr-modal>
  `
})
export class StreamImportComponent {
  isOpen = false;
  optimize = false;
  file: any;
  view = 'file';
  result = {
    success: [],
    error: [],
    duration: 0
  };

  constructor(private notificationService: NotificationService, private importExportService: ImportExportService) {}

  open(): void {
    this.result = {
      success: [],
      error: [],
      duration: 0
    };
    this.view = 'file';
    this.file = null;
    this.optimize = false;
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
      this.notificationService.error('Invalid file', 'Please, select a file.');
      return;
    }
    const date = new Date().getTime();
    this.view = 'importing';

    this.importExportService.streamsImport(this.file, this.optimize).subscribe(
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
        this.notificationService.error('Invalid file', 'The file is not valid.');
      }
    );
  }
}
