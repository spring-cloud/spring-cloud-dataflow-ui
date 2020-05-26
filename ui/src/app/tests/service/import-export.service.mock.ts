import { ImportExportService } from '../../shared/service/import-export.service';
import { Stream } from '../../shared/model/stream.model';
import { Observable, of } from 'rxjs';
import { Task } from '../../shared/model/task.model';

export class ImportExportServiceMock {
  static mock: ImportExportServiceMock = null;

  streamsExport(streams: Stream[]): Observable<any> {
    return of({});
  }

  tasksExport(tasks: Task[]): Observable<any> {
    return of({});

  }

  streamsImport(file: Blob, optimize: boolean): Observable<any> {
    return of([
      {
        created: true,
        name: 'foo',
        dslTest: 'time | log',
        error: '',
        message: ''
      }
    ]);
  }

  tasksImport(file: Blob, excludeChildren: boolean): Observable<any> {
    return of([
      {
        created: true,
        name: 'foo',
        dslTest: 'timestamp',
        error: '',
        message: ''
      }
    ]);
  }

  static get provider() {
    if (!ImportExportServiceMock.mock) {
      ImportExportServiceMock.mock = new ImportExportServiceMock();
    }
    return { provide: ImportExportService, useValue: ImportExportServiceMock.mock };
  }
}
