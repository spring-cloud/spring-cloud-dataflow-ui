import { StreamDefinition } from '../../streams/model/stream-definition';
import { Observable, of } from 'rxjs';

export class MockTasksUtilsService {

  createFile(streams: StreamDefinition[]) {
    return true;
  }

  importTasks(file: Blob, options: any): Observable<any> {
    return of([]);
  }

}
