import { Component } from '@angular/core';
import { StreamPage } from '../../../shared/model/stream.model';
import { StreamService } from '../../../shared/api/stream.service';
import { ImportExportService } from '../../../shared/service/import-export.service';
import { NotificationService } from '../../../shared/service/notification.service';

@Component({
  selector: 'app-manage-stream-export',
  template: `
    <clr-modal [(clrModalOpen)]="isOpen" [clrModalClosable]="!isRunning" clrModalSize="lg">
      <h3 class="modal-title">Export stream(s)</h3>
      <div class="modal-body" *ngIf="!isRunning">
        <div>
          You can create an export of your <strong>selected streams</strong>.<br/>
          This operation will generate and download a <strong>JSON file</strong>.
        </div>
        <clr-datagrid [(clrDgSelected)]="selected" *ngIf="streams">
          <clr-dg-column>Name</clr-dg-column>
          <clr-dg-column>Definition</clr-dg-column>
          <clr-dg-row *clrDgItems="let stream of streams.items" [clrDgItem]="stream">
            <clr-dg-cell>{{stream.name}}</clr-dg-cell>
            <clr-dg-cell>
              <span class="dsl-text dsl-truncate">{{stream.dslText}}</span>
            </clr-dg-cell>
          </clr-dg-row>
        </clr-datagrid>
      </div>
      <div class="modal-body" *ngIf="isRunning">
        <clr-spinner clrInline clrSmall></clr-spinner>
        Exporting stream(s) ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" [disabled]="isRunning" (click)="isOpen = false">Cancel</button>
        <button type="button" class="btn btn-primary" (click)="run()" [disabled]="isRunning">
          <span>Export stream(s)</span>
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

  constructor(private streamService: StreamService,
              private notificationService: NotificationService,
              private importExportService: ImportExportService) {
  }

  open() {
    this.isRunning = false;
    this.isOpen = true;
    this.streamService.getStreams(0, 100000, '', 'name', 'ASC')
      .subscribe((page: StreamPage) => {
        this.streams = page;
        this.selected = [...page.items];
      });
  }

  run() {
    if (this.selected.length === 0) {
      this.notificationService.error('No stream selected', 'Please, select stream(s) to export.');
    } else {
      this.isRunning = true;
      this.importExportService.streamsExport(this.selected)
        .subscribe(() => {
          this.notificationService.success('Stream(s) export', 'Stream(s) has been exported.');
          this.isOpen = false;
        });
    }
  }
}
