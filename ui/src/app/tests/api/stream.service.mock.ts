import { StreamService } from '../../shared/api/stream.service';
import { Observable, of } from 'rxjs';
import { Stream, StreamHistory, StreamPage } from '../../shared/model/stream.model';
import { Platform, PlatformList } from '../../shared/model/platform.model';
import { StreamStatus } from '../../shared/model/metrics.model';
import { delay, map } from 'rxjs/operators';
import {
  GET_DEPLOYMENT_INFO,
  GET_LOGS,
  GET_PLATFORMS,
  GET_STREAM, GET_STREAM_APPLICATIONS, GET_STREAM_HISTORY,
  GET_STREAMS,
  GET_STREAMS_RELATED
} from '../data/stream';

export class StreamServiceMock {

  static mock: StreamServiceMock = null;

  getStreams(page: number, size: number, search?: string, sort?: string, order?: string): Observable<StreamPage> {
    return of(GET_STREAMS)
      .pipe(
        delay(1),
        map(StreamPage.parse)
      );
  }

  getStreamsRelated(streamName: string, nested?: boolean): Observable<Stream[]> {
    return of(GET_STREAMS_RELATED)
      .pipe(
        delay(1),
        map(jsonResponse => StreamPage.parse(jsonResponse).items),
      );
  }

  getStream(name: string): Observable<Stream> {
    return of(GET_STREAM)
      .pipe(
        delay(1),
        map(Stream.parse),
      );
  }

  destroyStream(stream: Stream): Observable<any> {
    return of({});
  }

  destroyStreams(streams: Stream[]): Observable<any[]> {
    return of(streams);
  }

  undeployStream(stream: Stream): Observable<any> {
    return of({});
  }

  createStream(name: string, dsl: string, description: string): Observable<any> {
    return of({});
  }

  undeployStreams(streams: Stream[]): Observable<any[]> {
    return of(streams);
  }

  getDeploymentInfo(name: string): Observable<Stream> {
    return of(GET_DEPLOYMENT_INFO)
      .pipe(
        delay(1),
        map(Stream.parse),
      );
  }

  updateStream(name: string, propertiesAsMap: any = {}): Observable<any> {
    return of({});
  }

  deployStream(name: string, propertiesAsMap: any = {}): Observable<any> {
    return of({});
  }

  getPlatforms(): Observable<Platform[]> {
    return of(GET_PLATFORMS)
      .pipe(
        delay(1),
        map(PlatformList.parse)
      );
  }

  getLogs(name: string): Observable<any> {
    return of(GET_LOGS)
      .pipe(
        delay(1),
      );
  }

  getRuntimeStreamStatuses(names?: string[]): Observable<StreamStatus[]> {
    return of([]);
  }

  getStreamHistory(name: string): Observable<StreamHistory[]> {
    return of(GET_STREAM_HISTORY)
      .pipe(
        delay(1),
        map((items) => {
          return items.map(StreamHistory.parse);
        })
      );
  }

  getApplications(name: string): Observable<any[]> {
    return of(GET_STREAM_APPLICATIONS)
      .pipe(
        delay(1)
      );
  }

  rollbackStream(streamHistory: StreamHistory): Observable<any> {
    return of({});
  }

  static get provider() {
    if (!StreamServiceMock.mock) {
      StreamServiceMock.mock = new StreamServiceMock();
    }
    return { provide: StreamService, useValue: StreamServiceMock.mock };
  }

}
