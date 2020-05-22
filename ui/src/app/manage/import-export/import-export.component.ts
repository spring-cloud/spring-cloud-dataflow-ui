import { Component, ViewChild } from '@angular/core';
import { StreamExportComponent } from './stream/export.component';
import { StreamImportComponent } from './stream/import.component';
import { TaskExportComponent } from './task/export.component';
import { TaskImportComponent } from './task/import.component';

@Component({
  selector: 'app-import-export',
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.sass']
})
export class ImportExportComponent {
  @ViewChild('streamImportModal', { static: true }) streamImportModal: StreamImportComponent;
  @ViewChild('streamExportModal', { static: true }) streamExportModal: StreamExportComponent;
  @ViewChild('taskExportModal', { static: true }) taskExportModal: TaskExportComponent;
  @ViewChild('taskImportModal', { static: true }) taskImportModal: TaskImportComponent;

  run(type: string) {
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
    }
    return false;
  }

}
