import { StreamDefinition } from '../../streams/model/stream-definition';
import { Observable, of } from 'rxjs';

export class MockStreamsUtilsService {

  createFile(streams: StreamDefinition[]) {
    return true;
  }

  importStreams(file: Blob, options: any): Observable<any> {
    return of([]);
  }

}
