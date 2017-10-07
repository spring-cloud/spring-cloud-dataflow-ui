import {Observable} from 'rxjs/Observable';
import {PageInfo} from '../../shared/model/pageInfo';
import {Page} from '../../shared/model/page';
import {StreamDefinition} from '../../streams/model/stream-definition';

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

  get streamDefinitions(): any {
    return this._streamDefinitions;
  }

  set streamDefinitions(value: any) {
    this._streamDefinitions = value;
  }

  private _streamDefinitions: any;

  getDefinitions(): Observable<Page<StreamDefinition>> {
    const page = new Page<StreamDefinition>();
    if (this.streamDefinitions) {
      const response = this.streamDefinitions;
      let items: StreamDefinition[];
      if (response._embedded && response._embedded.streamDefinitionResourceList) {
        items = response._embedded.streamDefinitionResourceList as StreamDefinition[];
      } else {
        items = [];
      }
      page.items = items;
      page.totalElements = response.page.totalElements;
      page.totalPages = response.page.totalPages;
      page.pageNumber = response.page.number;
      page.pageSize = response.page.size;
    }
    return Observable.of(page);
  }

  undeployDefinition(streamDefinition: StreamDefinition): Observable<Response>|Observable<any> {
    return Observable.of({});
  }

  undeployMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]): Observable<any>[] {
    return [Observable.of({})];
  }

  destroyDefinition(streamDefinition: StreamDefinition): Observable<Response>|Observable<any> {
    return Observable.of({});
  }

  destroyMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]): Observable<any>[] {
    return [Observable.of({})];
  }

  deployDefinition(streamDefinitionName: String, propertiesAsMap: any): Observable<Response>|Observable<any> {
    return Observable.of({});
  }

  deployMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]): Observable<any>[] {
    return [Observable.of({})];
  }

  getRelatedDefinitions(streamDefinitionName: String, nested?: boolean): Observable<StreamDefinition[]> {
    return Observable.of([]);
  }
}
