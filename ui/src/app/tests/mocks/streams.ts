import { Page } from '../../shared/model/page';
import { StreamDefinition } from '../../streams/model/stream-definition';
import { StreamStatuses } from '../../streams/model/stream-metrics';
import { OrderParams } from '../../shared/components/shared.interface';
import { StreamHistory } from '../../streams/model/stream-history';
import { Observable, of } from 'rxjs';
import { Platform } from '../../shared/model/platform';

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
export class MockStreamsService {

  public streamsContext = {
    q: '',
    page: 0,
    size: 30,
    sort: 'name',
    order: OrderParams.ASC,
    itemsSelected: [],
    itemsExpanded: []
  };

  public streamDefinitions;

  getDefinitions(): Observable<Page<StreamDefinition>> {
    return of(StreamDefinition.pageFromJSON(this.streamDefinitions));
  }

  getDefinition(name: string): Observable<any> {
    return of(StreamDefinition.fromJSON(this.streamDefinitions._embedded.streamDefinitionResourceList[0]));
  }

  undeployMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]): Observable<Array<any>> {
    return of(Array.from({ length: streamDefinitions.length }));
  }

  destroyMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]): Observable<Array<any>> {
    return of(Array.from({ length: streamDefinitions.length }));
  }

  deployMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]): Observable<Array<any>> {
    return of(Array.from({ length: streamDefinitions.length }));
  }

  getRelatedDefinitions(streamDefinitionName: String, nested?: boolean): Observable<StreamDefinition[]> {
    return of([]);
  }

  getPlatforms(): Observable<Platform[]> {
    return of([
      Platform.fromJSON({name: 'default', type: 'local', description: '',
        options: [{id: 'spring.cloud.deployer.local.opt1', name: 'opt1'}]
      }),
      Platform.fromJSON({name: 'foo', type: 'bar', description: 'foobar'})
    ]);
  }

  getRuntimeStreamStatuses(streamNames?: string[]): Observable<StreamStatuses[]> {
    return of([]);
  }

  getHistory(streamDefinition: string): Observable<StreamHistory[]> {
    return of([
      StreamHistory.fromJSON({
        name: streamDefinition,
        version: 2,
        platformName: 'default',
        info: { firstDeployed: new Date(), status: { statusCode: 'DEPLOYED' }, description: 'Upgrade complete' }
      }),
      StreamHistory.fromJSON({
        name: streamDefinition,
        version: 1,
        platformName: 'default',
        info: { firstDeployed: new Date(), status: { statusCode: 'DELETED' }, description: 'Delete complete' }
      })
    ]);
  }

  historyRollback(streamHistory: StreamHistory): Observable<any> {
    return of([]);
  }

}
