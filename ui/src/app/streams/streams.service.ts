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

  /**
   * URL API
   */
  public static URL = '/streams/definitions';

  /**
   * Streams List context
   * Persist the state of StreamDefinitionsComponent
   */
  public streamsContext = {
    q: '',
    page: 0,
    size: 30,
    sort: 'DEFINITION_NAME',
    order: OrderParams.ASC,
    itemsSelected: [],
    itemsExpanded: []
  };

  /**
   * Creates the {@link Page} instance for {@link StreamDefinition} pagination support.
   * @param httpClient handler for making calls to the data flow restful api
   * @param loggerService used to log.
   * @param errorHandler used to generate the error messages.
   */
  constructor(private httpClient: HttpClient,
              private loggerService: LoggerService,
              private errorHandler: ErrorHandler) {
  }

  /**
   * Retrieves the {@link StreamDefinition}s based on the page requested.
   *
   * @returns {Observable<R|T>} that will call the subscribed funtions to handle
   * the results when returned from the Spring Cloud Data Flow server.
   */
  getDefinitions(streamListParams: StreamListParams): Observable<Page<StreamDefinition>> {
    streamListParams = streamListParams || { q: '', page: 0, size: 30, sort: null, order: null };
    this.loggerService.log('Getting paged stream definitions', streamListParams);
    let params = HttpUtils.getPaginationParams(streamListParams.page, streamListParams.size);
    if (streamListParams.q) {
      params = params.append('search', streamListParams.q);
    }
    if (streamListParams.sort && streamListParams.order) {
      params = params.append('sort', `${streamListParams.sort},${streamListParams.order}`);
    }
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .get<any>(StreamsService.URL, { params: params, headers: httpHeaders })
      .map(StreamDefinition.pageFromJSON)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Retrieve the {@link StreamDefinition} based on the param name
   *
   * @param {string} name
   * @returns {Observable<StreamDefinition>}
   */
  getDefinition(name: string): Observable<StreamDefinition> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .get<any>(`${StreamsService.URL}/${name}`, { headers: httpHeaders })
      .map(StreamDefinition.fromJSON)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Calls the Spring Cloud Data Flow server to create a {@link StreamDefinition}.
   * @param {string} name
   * @param {string} dsl
   * @param {boolean} deploy
   * @returns {Observable<HttpResponse<any>>}
   */
  createDefinition(name: string, dsl: string, deploy?: boolean): Observable<HttpResponse<any>> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    let params = new HttpParams()
      .append('name', name)
      .append('definition', dsl);
    if (deploy) {
      params = params.set('deploy', deploy.toString());
    }
    return this.httpClient
      .post<any>(StreamsService.URL, null, { headers: httpHeaders, observe: 'response', params: params })
      .catch(this.errorHandler.handleError);
  }

  /**
   * Calls the Spring Cloud Data Flow server to delete the specified {@link StreamDefinition}.
   * @param streamDefinition the {@link StreamDefinition} to be deleted.
   * @returns {Observable<R|T>} that will call the subscribed functions to handle the result of the destroy.
   */
  destroyDefinition(streamDefinition: StreamDefinition): Observable<HttpResponse<any>> {
    this.loggerService.log('Destroying...', streamDefinition);
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .delete<any>('/streams/definitions/' + streamDefinition.name, { headers: httpHeaders })
      .catch(this.errorHandler.handleError);
  }

  /**
   * Calls the Spring Cloud Data Flow server for each stream to destroy
   * @param {StreamDefinition[]} streamDefinitions
   * @returns {Observable<HttpResponse<any>[]>}
   */
  destroyMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]): Observable<HttpResponse<any>[]> {
    return forkJoin(streamDefinitions.map(stream => this.destroyDefinition(stream)));
  }

  /**
   * Calls the Spring Cloud Data Flow server to undeploy the {@link StreamDefinition}.
   * @param streamDefinition
   * @returns {Observable<R|T>} that will call subscribed functions to handle the result from the undeploy.
   */
  undeployDefinition(streamDefinition: StreamDefinition): Observable<HttpResponse<any>> {
    this.loggerService.log('Undeploying...', streamDefinition);
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .delete<any>('/streams/deployments/' + streamDefinition.name, { headers: httpHeaders })
      .catch(this.errorHandler.handleError);
  }

  /**
   * Calls the Spring Cloud Data Flow server for each stream to undeploy
   * @param {StreamDefinition[]} streamDefinitions
   * @returns {Observable<HttpResponse<any>[]>}
   */
  undeployMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]): Observable<HttpResponse<any>[]> {
    return forkJoin(streamDefinitions.map(stream => this.undeployDefinition(stream)));
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
    return this.httpClient
      .post<any>('/streams/deployments/' + streamDefinitionName, propertiesAsMap, {
        headers: httpHeaders,
        observe: 'response'
      })
      .catch(this.errorHandler.handleError);
  }

  /**
   * Calls the Spring Cloud Data Flow server for each stream to deploy
   * @param {StreamDefinition[]} streamDefinitions
   * @returns {Observable<HttpResponse<any>[]>}
   */
  deployMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]): Observable<HttpResponse<any>[]> {
    return forkJoin(streamDefinitions.map(stream => this.deployDefinition(stream.name, stream.deploymentProperties)));
  }

  /**
   * Calls the Spring Cloud Data Flow server to update the deployment properties of a specified stream.
   * @param {String} streamDefinitionName
   * @param propertiesAsMap
   * @returns {Observable<HttpResponse<any>>}
   */
  updateDefinition(streamDefinitionName: String, propertiesAsMap: any = {}): Observable<HttpResponse<any>> {
    this.loggerService.log('Updating...', streamDefinitionName, propertiesAsMap);
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .post(`/streams/deployments/update/${streamDefinitionName}`, {
        releaseName: streamDefinitionName,
        packageIdentifier: { packageName: streamDefinitionName, packageVersion: null },
        updateProperties: propertiesAsMap
      }, { headers: httpHeaders, observe: 'response' })
      .catch(this.errorHandler.handleError);
  }

  /**
   * Calls the Spring Cloud Data Flow server to get the deployment info of a specified stream.
   * @param {string} streamDefinitionName
   * @returns {Observable<StreamDefinition>}
   */
  getDeploymentInfo(streamDefinitionName: string): Observable<StreamDefinition> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .get<any>(`/streams/deployments/${streamDefinitionName}`, { headers: httpHeaders })
      .map(StreamDefinition.fromJSON)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Calls the Spring Cloud Data Flow server to get the related definitions of a specified stream.
   * @param {string} streamName
   * @param {boolean} nested
   * @returns {Observable<StreamDefinition[]>}
   */
  getRelatedDefinitions(streamName: string, nested?: boolean): Observable<StreamDefinition[]> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    let params = new HttpParams();
    if (nested) {
      params = params.append('nested', nested.toString());
    }
    return this.httpClient
      .get<any>(`/streams/definitions/${streamName}/related`, { params: params, headers: httpHeaders })
      .map(jsonResponse => StreamDefinition.pageFromJSON(jsonResponse).items)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Calls the Spring Cloud Data Flow server to get the metrics of a specified stream.
   * @param {string[]} streamNames
   * @returns {Observable<StreamMetrics[]>}
   */
  getMetrics(streamNames?: string[]): Observable<StreamMetrics[]> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    let params = new HttpParams();
    if (streamNames) {
      params = params.append('names', streamNames.join(','));
    }
    return this.httpClient
      .get<any>('/metrics/streams', { headers: httpHeaders, params: params })
      .map(StreamMetrics.listFromJSON)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Calls the Spring Cloud Data Flow server to get the list of the platform.
   * @returns {Observable<Platform[]>}
   */
  getPlatforms(): Observable<Platform[]> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    const params = HttpUtils.getPaginationParams(0, 1000);
    return this.httpClient
      .get<any>(`/streams/deployments/platform/list`, { params: params, headers: httpHeaders })
      .map(Platform.listFromJSON)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Calls the Spring Cloud Data Flow server to get the history of a specified stream.
   * @param {string} streamName
   * @returns {Observable<StreamHistory[]>}
   */
  getHistory(streamName: string): Observable<StreamHistory[]> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .get<any>(`/streams/deployments/history/${streamName}`, { headers: httpHeaders })
      .map(StreamHistory.listFromJSON)
      .catch(this.errorHandler.handleError);
  }

}
