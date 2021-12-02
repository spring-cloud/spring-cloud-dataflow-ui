import {Component} from '@angular/core';
import {StreamPage} from '../../../shared/model/stream.model';
import {StreamService} from '../../../shared/api/stream.service';
import {ImportExportService} from '../../../shared/service/import-export.service';
import {NotificationService} from '../../../shared/service/notification.service';


@Component({
  selector: 'app-manage-stream-export',
  template: `
    <clr-modal [(clrModalOpen)]="isOpen" [clrModalClosable]="!isRunning" clrModalSize="lg">
      <h3 class="modal-title"><ng-container i18n>Export stream(s)</ng-container></h3>
      <div class="modal-body" *ngIf="!isRunning">
        <div><ng-container i18n>You can create an export of your <strong>selected streams</strong>.<br />
          This operation will generate and download a <strong>JSON file</strong>.</ng-container>
        </div>
        <clr-datagrid [(clrDgSelected)]="selected" *ngIf="streams">
          <clr-dg-column><ng-container i18n>Name</ng-container></clr-dg-column>
          <clr-dg-column><ng-container i18n>Definition</ng-container></clr-dg-column>
          <clr-dg-row *clrDgItems="let stream of streams.items" [clrDgItem]="stream">
            <clr-dg-cell>{{ stream.name }}</clr-dg-cell>
            <clr-dg-cell>
              <span class="dsl-text dsl-truncate">{{ stream.dslText }}</span>
            </clr-dg-cell>
          </clr-dg-row>
        </clr-datagrid>
      </div>
      <div class="modal-body" *ngIf="isRunning">
        <clr-spinner clrInline clrSmall></clr-spinner>
        <ng-container i18n>Exporting stream(s) ...</ng-container>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" [disabled]="isRunning" (click)="isOpen = false"><ng-container i18n>Cancel</ng-container></button>
        <button type="button" class="btn btn-primary" (click)="run()" [disabled]="isRunning">
          <span><ng-container i18n>Export stream(s)</ng-container></span>
        </button>
      </div>
    </clr-modal>
  `
})
export class StreamExportComponent {
  isOpen = false;
  isRunning = false;
  streams: StreamPage;
  selected = [];

  constructor(
    private streamService: StreamService,
    private notificationService: NotificationService,
    private importExportService: ImportExportService
  ) {}

  open(): void {
    this.isRunning = false;
    this.isOpen = true;
    this.streamService.getStreams(0, 100000, '', 'name', 'ASC').subscribe((page: StreamPage) => {
      this.streams = page;
      this.selected = [...page.items];
    });
  }

  run(): void {
    if (this.selected.length === 0) {
      this.notificationService.error($localize `No stream selected`, $localize `Please, select stream(s) to export.`);
    } else {
      this.isRunning = true;
      this.importExportService.streamsExport(this.selected).subscribe(() => {
        this.notificationService.success($localize `Stream(s) export`, $localize `Stream(s) has been exported.`);
        this.isOpen = false;
      });
    }
  }
}
