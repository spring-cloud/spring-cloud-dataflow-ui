import {Component} from '@angular/core';
import {StreamPage} from '../../../shared/model/stream.model';
import {StreamService} from '../../../shared/api/stream.service';
import {ImportExportService} from '../../../shared/service/import-export.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-manage-stream-export',
  template: `
    <clr-modal [(clrModalOpen)]="isOpen" [clrModalClosable]="!isRunning" clrModalSize="lg">
      <h3 class="modal-title">{{ 'tools.modal.exportStreams.title' | translate }}</h3>
      <div class="modal-body" *ngIf="!isRunning">
        <div [innerHTML]="'tools.modal.exportStreams.content' | translate"></div>
        <clr-datagrid [(clrDgSelected)]="selected" *ngIf="streams">
          <clr-dg-column>{{ 'tools.modal.exportStreams.name' | translate }}</clr-dg-column>
          <clr-dg-column>{{ 'tools.modal.exportStreams.definition' | translate }}</clr-dg-column>
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
        {{ 'tools.modal.exportStreams.exporting' | translate }}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" [disabled]="isRunning" (click)="isOpen = false">
          {{ 'commons.cancel' | translate }}
        </button>
        <button type="button" class="btn btn-primary" (click)="run()" [disabled]="isRunning">
          <span>{{ 'tools.modal.exportStreams.export' | translate }}</span>
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
    private importExportService: ImportExportService,
    private translate: TranslateService
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
      this.notificationService.error(
        this.translate.instant('tools.modal.exportStreams.message.errorNoStreamTitle'),
        this.translate.instant('tools.modal.exportStreams.message.errorNoStreamContent')
      );
    } else {
      this.isRunning = true;
      this.importExportService.streamsExport(this.selected).subscribe(() => {
        this.notificationService.success(
          this.translate.instant('tools.modal.exportStreams.message.successTitle'),
          this.translate.instant('tools.modal.exportStreams.message.successContent')
        );
        this.isOpen = false;
      });
    }
  }
}
