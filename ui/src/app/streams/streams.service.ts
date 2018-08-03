import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { StreamDefinition } from './model/stream-definition';
import { StreamMetrics } from './model/stream-metrics';
import { Page } from '../shared/model/page';
import { ErrorHandler } from '../shared/model/error-handler';
import { HttpUtils } from '../shared/support/http.utils';
import { Platform } from './model/platform';
import { StreamListParams } from './components/streams.interface';
import { OrderParams } from '../shared/components/shared.interface';
import { LoggerService } from '../shared/services/logger.service';
import { forkJoin } from 'rxjs';
import { StreamHistory } from './model/stream-history';

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
   * @param httpClient handler for making calls to the data flow restful api
   * @param loggerService used to log.
   * @param errorHandler used to generate the error messages.
   */
  constructor(private httpClient: HttpClient,
              private loggerService: LoggerService,
              private errorHandler: ErrorHandler) {
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
    this.loggerService.log('Getting paged stream definitions', streamListParams);
    let params = HttpUtils.getPaginationParams(
      streamListParams.page,
      streamListParams.size
    );
    if (streamListParams.q) {
      params = params.append('searchName', streamListParams.q);
    }
    if (streamListParams.sort && streamListParams.order) {
      params = params.append('sort', `${streamListParams.sort},${streamListParams.order}`);
    }

    const httpHeaders = HttpUtils.getDefaultHttpHeaders();

    return this.httpClient.get<any>(this.streamDefinitionsUrl, {
      params: params,
      headers: httpHeaders,
      observe: 'response'
    })
      .map(response => this.extractData(response))
      .catch(this.errorHandler.handleError);
  }

  getDefinition(name: string): Observable<StreamDefinition> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient.get<any>(`${this.streamDefinitionsUrl}/${name}`, {
      headers: httpHeaders
    }).map(jsonResponse => {
        return new StreamDefinition(jsonResponse.name, jsonResponse.dslText, jsonResponse.status);
      })
      .catch(this.errorHandler.handleError);
  }

  createDefinition(name: string, dsl: string, deploy?: boolean): Observable<HttpResponse<any>> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    let params = new HttpParams()
      .append('name', name)
      .append('definition', dsl);
    if (deploy) {
      params = params.set('deploy', deploy.toString());
    }
   // options.observe = 'response' as 'response';
    return this.httpClient.post<any>(this.streamDefinitionsUrl, null, {
      headers: httpHeaders,
      observe: 'response',
      params: params
    });
  }

  /**
   * Calls the Spring Cloud Data Flow server to delete the specified {@link StreamDefinition}.
   * @param streamDefinition the {@link StreamDefinition} to be deleted.
   * @returns {Observable<R|T>} that will call the subscribed functions to handle the result of the destroy.
   */
  destroyDefinition(streamDefinition: StreamDefinition): Observable<Response> {
    this.loggerService.log('Destroying...', streamDefinition);
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient.delete<any>('/streams/definitions/' + streamDefinition.name, {
      headers: httpHeaders})
    .catch(this.errorHandler.handleError);
  }

  destroyMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]): Observable<HttpResponse<any>[]> {
    const observables: Observable<any>[] = [];
    for (const streamDefinition of streamDefinitions) {
      observables.push(this.destroyDefinition(streamDefinition));
    }
    return forkJoin([...observables]);
  }

  /**
   * Calls the Spring Cloud Data Flow server to undeploy the {@link StreamDefinition}.
   * @param streamDefinition
   * @returns {Observable<R|T>} that will call subscribed functions to handle the result from the undeploy.
   */
  undeployDefinition(streamDefinition: StreamDefinition): Observable<HttpResponse<any>> {
    this.loggerService.log('Undeploying...', streamDefinition);
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient.delete<any>('/streams/deployments/' + streamDefinition.name, { headers: httpHeaders})
      .catch(this.errorHandler.handleError);
  }

  undeployMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]): Observable<HttpResponse<any>[]> {
    const observables: Observable<HttpResponse<any>>[] = [];
    for (const streamDefinition of streamDefinitions) {
      observables.push(this.undeployDefinition(streamDefinition));
    }
    return forkJoin([...observables]);
  }


  /**
   * Posts a request to the data flow server to deploy the stream associated with the streamDefinitionName.
   * @param streamDefinitionName the name of the stream to deploy.
   * @param propertiesAsMap the application or deployment properties to be used for stream deployment.
   * @returns {Observable<R|T>} that will call the subscribed functions to handle the resut of the deploy.
   */
  deployDefinition(streamDefinitionName: String, propertiesAsMap: any = {}): Observable<HttpResponse<any>> {
    this.loggerService.log('Deploying...', streamDefinitionName);
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient.post<any>('/streams/deployments/' + streamDefinitionName, propertiesAsMap, {
      headers: httpHeaders,
      observe: 'response'
    })
      .catch(this.errorHandler.handleError);
  }

  deployMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]): Observable<HttpResponse<any>[]> {
    const observables: Observable<HttpResponse<any>>[] = [];
    for (const streamDefinition of streamDefinitions) {
      observables.push(this.deployDefinition(streamDefinition.name, streamDefinition.deploymentProperties));
    }
    return forkJoin([...observables]);
  }

  updateDefinition(streamDefinitionName: String, propertiesAsMap: any = {}): Observable<HttpResponse<any>> {
    this.loggerService.log('Updating...', streamDefinitionName, propertiesAsMap);
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient.post(`/streams/deployments/update/${streamDefinitionName}`, {
      releaseName: streamDefinitionName,
      packageIdentifier: { packageName: streamDefinitionName, packageVersion: null },
      updateProperties: propertiesAsMap
    }, {
      headers: httpHeaders,
      observe: 'response'
    })
      .catch(this.errorHandler.handleError);
  }

  getDeploymentInfo(streamDefinitionName: string): Observable<StreamDefinition> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient.get<any>(`/streams/deployments/${streamDefinitionName}`, {
      headers: httpHeaders
    }).map(jsonResponse => {
      const streamDef = new StreamDefinition(jsonResponse.streamName, jsonResponse.dslText, jsonResponse.status);
      this.loggerService.log(jsonResponse.deploymentProperties);
      // deploymentProperties come as json string -> turn the string into object
      streamDef.deploymentProperties = jsonResponse.deploymentProperties ? JSON.parse(jsonResponse.deploymentProperties) : [];
      return streamDef;
    }).catch(this.errorHandler.handleError);
  }

  getRelatedDefinitions(streamName: string, nested?: boolean): Observable<StreamDefinition[]> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    let params = new HttpParams();

    if (nested) {
      params = params.append('nested', nested.toString());
    }
    return this.httpClient.get<any>(`/streams/definitions/${streamName}/related`, {
      params: params,
      headers: httpHeaders
    })
      .map(jsonResponse => this.extractData(jsonResponse).items)
      .catch(this.errorHandler.handleError);
  }

  metrics(streamNames?: string[]): Observable<StreamMetrics[]> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    let params = new HttpParams();
    if (streamNames) {
      params = params.append('names', streamNames.join(','));
    }
    return this.httpClient.get<any>('/metrics/streams', {
      headers: httpHeaders,
      params: params
    })
      .map(jsonResponse => {
        if (Array.isArray(jsonResponse)) {
          return jsonResponse.map(entry => new StreamMetrics().deserialize(entry));
        } else {
          return [];
        }
      })
      .catch(this.errorHandler.handleError);
  }

  extractData(res: HttpResponse<any>): Page<StreamDefinition> {
    const body = res.body;
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
      this.loggerService.log('BODY', body.page);
      this.streamDefinitions.pageNumber = body.page.number;
      this.streamDefinitions.pageSize = body.page.size;
      this.streamDefinitions.totalElements = body.page.totalElements;
      this.streamDefinitions.totalPages = body.page.totalPages;
    }

    this.streamDefinitions.items = items;

    this.loggerService.log('Extracted Stream Definitions:', this.streamDefinitions);
    return this.streamDefinitions;
  }

  /**
   * Platforms
   * @returns {Observable<Platform[]>}
   */
  platforms(): Observable<Platform[]> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    const params = new HttpParams()
      .append('page', '0')
      .append('size', '1000');

    return this.httpClient.get<any>(`/streams/deployments/platform/list`, {
      params: params,
      headers: httpHeaders
    })
      .map(data => {
        if (data && Array.isArray(data)) {
          return data.map(entry => new Platform().deserialize(entry));
        }
        return [];
      })
      .catch(this.errorHandler.handleError);
  }

  /**
   * Stream History
   * @param {string} streamName
   * @returns {Observable<StreamHistory[]>}
   */
  getHistory(streamName: string): Observable<StreamHistory[]> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient.get<any>(`/streams/deployments/history/${streamName}`, {
      headers: httpHeaders
    })
      .map(data => {
        if (data && Array.isArray(data)) {
          console.log(data);
          return data.map((item) => {
            return StreamHistory.fromJSON(item);
          });
        }
        return [];
      }).catch(this.errorHandler.handleError);
  }

}
