import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { StreamDefinition } from './model/stream-definition';
import { StreamMetrics } from './model/stream-metrics';
import { Page } from '../shared/model/page';
import { ErrorHandler } from '../shared/model/error-handler';
import { HttpUtils, URL_QUERY_ENCODER } from '../shared/support/http.utils';
import { Platform } from './model/platform';
import { StreamListParams } from './components/streams.interface';
import { OrderParams } from '../shared/components/shared.interface';

/**
 * Provides {@link StreamDefinition} related services.
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 * @author Glenn Renfro
 * @author Damien Vitrac
 *
 */
@Injectable()
export class StreamsService {

  public streamsContext = {
    q: '',
    page: 0,
    size: 30,
    sort: 'DEFINITION_NAME',
    order: OrderParams.ASC,
    itemsSelected: [],
    itemsExpanded: []
  };

  /** Will never be null. */
  public streamDefinitions: Page<StreamDefinition>;

  private streamDefinitionsUrl = '/streams/definitions';

  /**
   * Creates the {@link Page} instance for {@link StreamDefinition} pagination support.
   * @param http handler for making calls to the data flow restful api
   * @param errorHandler used to generate the error messages.
   */
  constructor(private http: Http, private errorHandler: ErrorHandler) {
    this.streamDefinitions = new Page<StreamDefinition>();
  }

  /**
   * Retrieves the {@link StreamDefinition}s based on the page requested.
   *
   * @returns {Observable<R|T>} that will call the subscribed funtions to handle
   * the results when returned from the Spring Cloud Data Flow server.
   */
  getDefinitions(streamListParams: StreamListParams): Observable<Page<StreamDefinition>> {
    streamListParams = streamListParams || {
      q: '',
      page: 0,
      size: 30,
      sort: null,
      order: null
    };
    console.log('Getting paged stream definitions', streamListParams);
    const params = HttpUtils.getPaginationParams(
      streamListParams.page,
      streamListParams.size
    );
    if (streamListParams.q) {
      params.append('search', streamListParams.q);
    }
    if (streamListParams.sort && streamListParams.order) {
      params.append('sort', `${streamListParams.sort},${streamListParams.order}`);
    }

    const options = HttpUtils.getDefaultRequestOptions();
    options.params = params;
    return this.http.get(this.streamDefinitionsUrl, options)
      .map(this.extractData.bind(this))
      .catch(this.errorHandler.handleError);
  }

  getDefinition(name: string): Observable<StreamDefinition> {
    const options = HttpUtils.getDefaultRequestOptions();
    return this.http.get(`${this.streamDefinitionsUrl}/${name}`, options)
      .map(res => {
        const json = res.json();
        return new StreamDefinition(json.name, json.dslText, json.status);
      })
      .catch(this.errorHandler.handleError);
  }

  createDefinition(name: string, dsl: string, deploy?: boolean): Observable<Response> {
    const options = HttpUtils.getDefaultRequestOptions();
    const params = new URLSearchParams('', URL_QUERY_ENCODER);
    params.append('name', name);
    params.append('definition', dsl);
    if (deploy) {
      params.set('deploy', deploy.toString());
    }
    options.params = params;
    return this.http.post(this.streamDefinitionsUrl, null, options);
  }

  /**
   * Calls the Spring Cloud Data Flow server to delete the specified {@link StreamDefinition}.
   * @param streamDefinition the {@link StreamDefinition} to be deleted.
   * @returns {Observable<R|T>} that will call the subscribed functions to handle the result of the destroy.
   */
  destroyDefinition(streamDefinition: StreamDefinition): Observable<Response> {
    console.log('Destroying...', streamDefinition);
    const options = HttpUtils.getDefaultRequestOptions();
    return this.http.delete('/streams/definitions/' + streamDefinition.name, options)
      .map(data => {
        this.streamDefinitions.items = this.streamDefinitions.items.filter(item => item.name !== streamDefinition.name);
      })
      .catch(this.errorHandler.handleError);
  }

  destroyMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]): Observable<Response[]> {
    const observables: Observable<Response>[] = [];
    for (const streamDefinition of streamDefinitions) {
      observables.push(this.destroyDefinition(streamDefinition));
    }
    return Observable.forkJoin(observables);
  }

  /**
   * Calls the Spring Cloud Data Flow server to undeploy the {@link StreamDefinition}.
   * @param streamDefinition
   * @returns {Observable<R|T>} that will call subscribed functions to handle the result from the undeploy.
   */
  undeployDefinition(streamDefinition: StreamDefinition): Observable<Response> {
    console.log('Undeploying...', streamDefinition);
    const options = HttpUtils.getDefaultRequestOptions();
    return this.http.delete('/streams/deployments/' + streamDefinition.name, options)
      .catch(this.errorHandler.handleError);
  }

  undeployMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]): Observable<Response[]> {
    const observables: Observable<Response>[] = [];
    for (const streamDefinition of streamDefinitions) {
      observables.push(this.undeployDefinition(streamDefinition));
    }
    return Observable.forkJoin(observables);
  }


  /**
   * Posts a request to the data flow server to deploy the stream associated with the streamDefinitionName.
   * @param streamDefinitionName the name of the stream to deploy.
   * @param propertiesAsMap the application or deployment properties to be used for stream deployment.
   * @returns {Observable<R|T>} that will call the subscribed functions to handle the resut of the deploy.
   */
  deployDefinition(streamDefinitionName: String, propertiesAsMap: any = {}): Observable<Response> {
    console.log('Deploying...', streamDefinitionName);
    const options = HttpUtils.getDefaultRequestOptions();
    return this.http.post('/streams/deployments/' + streamDefinitionName, propertiesAsMap, options)
      .catch(this.errorHandler.handleError);
  }

  deployMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]): Observable<Response[]> {
    const observables: Observable<Response>[] = [];
    for (const streamDefinition of streamDefinitions) {
      observables.push(this.deployDefinition(streamDefinition.name, streamDefinition.deploymentProperties));
    }
    return Observable.forkJoin(observables);
  }

  getDeploymentInfo(streamDefinitionName: string): Observable<StreamDefinition> {
    const options = HttpUtils.getDefaultRequestOptions();
    return this.http.get(`/streams/deployments/${streamDefinitionName}`, options).map(res => {
      const json = res.json();
      const streamDef = new StreamDefinition(json.streamName, json.dslText, json.status);
      // deploymentProperties come as json string -> turn the string into object
      streamDef.deploymentProperties = JSON.parse(json.deploymentProperties);
      return streamDef;
    }).catch(this.errorHandler.handleError);
  }

  getRelatedDefinitions(streamName: string, nested?: boolean): Observable<StreamDefinition[]> {
    const options = HttpUtils.getDefaultRequestOptions();
    if (nested) {
      const params = new URLSearchParams('', URL_QUERY_ENCODER);
      params.append('nested', nested.toString());
      options.params = params;
    }
    return this.http.get(`/streams/definitions/${streamName}/related`, options)
      .map(res => this.extractData(res).items)
      .catch(this.errorHandler.handleError);
  }

  metrics(streamNames?: string[]): Observable<StreamMetrics[]> {
    const options = HttpUtils.getDefaultRequestOptions();
    if (streamNames) {
      const params = new URLSearchParams('', URL_QUERY_ENCODER);
      params.append('names', streamNames.join(','));
      options.params = params;
    }
    return this.http.get('/metrics/streams', options)
      .map(res => {
        const data = res.json();
        if (Array.isArray(data)) {
          return data.map(entry => new StreamMetrics().deserialize(entry));
        } else {
          return [];
        }
      })
      .catch(this.errorHandler.handleError);
  }

  extractData(res: Response): Page<StreamDefinition> {
    const body = res.json();
    let items: StreamDefinition[];
    if (body._embedded && body._embedded.streamDefinitionResourceList) {
      items = body._embedded.streamDefinitionResourceList.map(jsonItem => {
        const streamDefinition: StreamDefinition = new StreamDefinition(
          jsonItem.name,
          jsonItem.dslText,
          jsonItem.status
        );
        return streamDefinition;
      });
    } else {
      items = [];
    }

    if (body.page) {
      console.log('BODY', body.page);
      this.streamDefinitions.pageNumber = body.page.number;
      this.streamDefinitions.pageSize = body.page.size;
      this.streamDefinitions.totalElements = body.page.totalElements;
      this.streamDefinitions.totalPages = body.page.totalPages;
    }

    this.streamDefinitions.items = items;

    console.log('Extracted Stream Definitions:', this.streamDefinitions);
    return this.streamDefinitions;
  }

  platforms(): Observable<Platform[]> {
    const options = HttpUtils.getDefaultRequestOptions();
    const params = new URLSearchParams('', URL_QUERY_ENCODER);
    params.append('page', '0');
    params.append('size', '1000');
    options.params = params;
    return this.http.get(`/streams/deployments/platform/list`, options)
      .map(res => {
        const data = res.json();
        if (data && Array.isArray(data)) {
          return data.map(entry => new Platform().deserialize(entry));
        }
        return [];
      })
      .catch(this.errorHandler.handleError);
  }

}
