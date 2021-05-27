import {Component, ViewChild} from '@angular/core';
import {NotificationService} from '../../shared/service/notification.service';
import {CleanupComponent} from './cleanup/cleanup.component';
import {StreamExportComponent} from './stream/export.component';
import {StreamImportComponent} from './stream/import.component';
import {TaskExportComponent} from './task/export.component';
import {TaskImportComponent} from './task/import.component';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html'
})
export class ToolsComponent {
  @ViewChild('streamImportModal', {static: true})
  streamImportModal: StreamImportComponent;
  @ViewChild('streamExportModal', {static: true})
  streamExportModal: StreamExportComponent;
  @ViewChild('taskExportModal', {static: true})
  taskExportModal: TaskExportComponent;
  @ViewChild('taskImportModal', {static: true})
  taskImportModal: TaskImportComponent;
  @ViewChild('cleanupModal', {static: true})
  cleanupModal: CleanupComponent;

  constructor(private notificationService: NotificationService) {}

  run(type: string): any {
    switch (type) {
      case 'import-stream':
        this.streamImportModal.open();
        break;
      case 'export-stream':
        this.streamExportModal.open();
        break;
      case 'export-task':
        this.taskExportModal.open();
        break;
      case 'import-task':
        this.taskImportModal.open();
        break;
      case 'cleanup-all':
        this.cleanupModal.open('all');
        break;
      case 'cleanup-completed':
        this.cleanupModal.open('completed');
        break;
    }
    return false;
  }
}
