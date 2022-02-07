import {Component} from '@angular/core';
import {NotificationService} from '../../../shared/service/notification.service';
import {ImportExportService} from '../../../shared/service/import-export.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-manage-stream-import',
  template: `
    <clr-modal
      [(clrModalOpen)]="isOpen"
      [clrModalClosable]="view !== 'loading'"
      [clrModalSize]="view === 'result' ? 'lg' : 'md'"
    >
      <h3 class="modal-title">{{ 'tools.modal.importStreams.title' | translate }}</h3>
      <div class="modal-body clr-form clr-form-horizontal" *ngIf="view === 'file'">
        <div [innerHTML]="'tools.modal.importStreams.content' | translate"></div>
        <div class="clr-form-control clr-row">
          <label class="clr-col-2 clr-control-label">{{ 'tools.modal.importStreams.jsonFile' | translate }}</label>
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
          <label class="clr-col-2">{{ 'tools.modal.importStreams.options' | translate }}</label>
          <clr-checkbox-wrapper>
            <input
              type="checkbox"
              clrCheckbox
              name="options"
              value="option1"
              [(ngModel)]="optimize"
              class="clr-col-10"
            />
            <label>{{ 'tools.modal.importStreams.optimize' | translate }}</label>
          </clr-checkbox-wrapper>
        </clr-checkbox-container>
      </div>
      <div class="modal-body" *ngIf="view === 'result'">
        <div>
          {{ 'tools.modal.importStreams.file' | translate }}: <strong>{{ file?.name }}</strong
          ><br />
          {{ 'tools.modal.importStreams.duration' | translate }}: <strong>{{ result.duration }}s</strong>
        </div>
        <div *ngIf="result.error.length > 0">
          <h4>{{ 'tools.modal.importStreams.errors' | translate: {count: result.error.length} }}</h4>
          <clr-datagrid class="clr-datagrid-no-fixed-height">
            <clr-dg-column [style.width.px]="10">&nbsp;</clr-dg-column>
            <clr-dg-column>{{ 'tools.modal.importStreams.description' | translate }}</clr-dg-column>
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
                  {{ 'tools.modal.importStreams.errorMessage' | translate }}: {{ stream.message }}<br />
                  {{ 'tools.modal.importStreams.index' | translate }}: {{ i }}
                </div>
              </clr-dg-cell>
            </clr-dg-row>
          </clr-datagrid>
        </div>
        <div *ngIf="result.success.length > 0">
          <h4>{{ 'tools.modal.importStreams.success' | translate: {count: result.success.length} }}</h4>
          <clr-datagrid class="clr-datagrid-no-fixed-height">
            <clr-dg-column [style.width.px]="10">&nbsp;</clr-dg-column>
            <clr-dg-column>{{ 'tools.modal.importStreams.description' | translate }}</clr-dg-column>
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
        {{ 'tools.modal.importStreams.importing' | translate }}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" [disabled]="view === 'importing'" (click)="isOpen = false">
          {{ 'commons.cancel' | translate }}
        </button>
        <button
          type="button"
          class="btn btn-primary"
          (click)="run()"
          [disabled]="view === 'importing'"
          *ngIf="view === 'file'"
        >
          <span>{{ 'tools.modal.importStreams.import' | translate }}</span>
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
      this.notificationService.error(
        this.translate.instant('tools.modal.importStreams.message.errorSelectFileTitle'),
        this.translate.instant('tools.modal.importStreams.message.errorSelectFileContent')
      );
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
        this.notificationService.error(
          this.translate.instant('tools.modal.importStreams.message.errorInvalidFileTitle'),
          this.translate.instant('tools.modal.importStreams.message.errorInvalidFileContent')
        );
      }
    );
  }
}
