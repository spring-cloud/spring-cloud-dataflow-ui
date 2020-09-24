import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Platform } from '../../shared/model/platform.model';
import { Stream, StreamHistory, StreamPage } from '../../shared/model/stream.model';
import { StreamService } from '../../shared/api/stream.service';
import { StreamStatus } from '../../shared/model/metrics.model';
import { HttpUtils } from '../../shared/support/http.utils';
import { catchError, map } from 'rxjs/operators';
import { ErrorUtils } from '../../shared/support/error.utils';
import { GET_DEPLOYMENT_INFO } from '../data/stream';

/**
 * Mock for StreamsService.
 *
 * Create a mocked service:
 * const streamsService = new MockStreamsService();
 * TestBed.configureTestingModule({
 *   providers: [
 *     { provide: StreamsService, useValue: streamsService }
 *   ]
 * }).compileComponents();
 *
 * Set streamDefinition app infos:
 * runtimeAppsService._testRuntimeApps = STREAM_DEFINITIONS;//Stream Definitions json
 *
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
export class MockStreamsService extends StreamService {

  // public streamsContext = {
  //   q: '',
  //   page: 0,
  //   size: 30,
  //   sort: 'name',
  //   order: OrderParams.ASC,
  //   itemsSelected: [],
  //   itemsExpanded: []
  // };

  public streamDefinitions;

  constructor() {
    super(null);
  }

  getStreams(page: number, size: number, search?: string, sort?: string, order?: string): Observable<StreamPage> {
    return of(StreamPage.parse(this.streamDefinitions));
  }

  getStream(name: string): Observable<Stream> {
    return of(Stream.parse(this.streamDefinitions._embedded.streamDefinitionResourceList[0]));
  }

  undeployStreams(streams: Stream[]): Observable<HttpResponse<any>[]> {
    return of(Array.from({ length: streams.length }));
  }

  destroyStreams(streams: Stream[]): Observable<any[]> {
    return of(Array.from({ length: streams.length }));
  }

  getStreamsRelated(streamName: string, nested?: boolean): Observable<Stream[]> {
    return of([]);
  }

  getPlatforms(): Observable<Platform[]> {
    return of([
      Platform.parse({
        name: 'default', type: 'local', description: '',
        options: [{ id: 'spring.cloud.deployer.local.opt1', name: 'opt1' }]
      }),
      Platform.parse({ name: 'foo', type: 'bar', description: 'foobar' })
    ]);
  }

  getRuntimeStreamStatuses(names?: string[]): Observable<StreamStatus[]> {
    return of([]);
  }

  getHistory(streamDefinition: string): Observable<StreamHistory[]> {
    return of([
      StreamHistory.parse({
        name: streamDefinition,
        version: 2,
        platformName: 'default',
        info: { firstDeployed: new Date(), status: { statusCode: 'DEPLOYED' }, description: 'Upgrade complete' }
      }),
      StreamHistory.parse({
        name: streamDefinition,
        version: 1,
        platformName: 'default',
        info: { firstDeployed: new Date(), status: { statusCode: 'DELETED' }, description: 'Delete complete' }
      })
    ]);
  }

  getDeploymentInfo(name: string, reuseDeploymentProperties: boolean = false): Observable<Stream> {
    return of(GET_DEPLOYMENT_INFO)
      .pipe(
        map(Stream.parse)
      );
  }

  rollbackStream(streamHistory: StreamHistory): Observable<HttpResponse<any>> {
    return of();
  }

  getLogs(name: string): Observable<any> {
    return of([]);
  }

}
