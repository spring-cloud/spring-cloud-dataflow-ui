import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { StreamDefinition } from './model/stream-definition';
import { Page } from '../shared/model/page';
import { ErrorHandler } from '../shared/model/error-handler';
import { HttpUtils } from '../shared/support/http.utils';

/**
 * Provides {@link StreamDefinition} related services.
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 * @author Glenn Renfro
 *
 */
@Injectable()
export class StreamsService {

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
   * @returns {Observable<R|T>} that will call the subscribed funtions to handle
   * the results when returned from the Spring Cloud Data Flow server.
   */
  getDefinitions(): Observable<Page<StreamDefinition>> {

    console.log('Getting paged stream definitions', this.streamDefinitions);
    console.log(this.streamDefinitions.getPaginationInstance());

    const params = HttpUtils.getPaginationParams(
      this.streamDefinitions.pageNumber,
      this.streamDefinitions.pageSize
    );
      // TODO Implement Sorting
      // params.sort = pageable.calculateSortParameter();

      // if (pageable.filterQuery && pageable.filterQuery.trim().length > 0) {
      //   params.search = pageable.filterQuery;
      // }

    if (this.streamDefinitions.filter && this.streamDefinitions.filter.length > 0) {
      params.append('search', this.streamDefinitions.filter);
    }
    return this.http.get(this.streamDefinitionsUrl, {search: params})
      .map(this.extractData.bind(this))
      .catch(this.errorHandler.handleError);
  }

  /**
   * Calls the Spring Cloud Data Flow server to delete the specified {@link StreamDefinition}.
   * @param streamDefinition the {@link StreamDefinition} to be deleted.
   * @returns {Observable<R|T>} that will call the subscribed functions to handle the result of the destroy.
   */
  destroyDefinition(streamDefinition: StreamDefinition): Observable<Response> {
    console.log('Destroying...', streamDefinition);
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.delete('/streams/definitions/' + streamDefinition.name, options)
      .map(data => {
        this.streamDefinitions.items = this.streamDefinitions.items.filter(item => item.name !== streamDefinition.name);
      })
      .catch(this.errorHandler.handleError);
  }

  /**
   * Calls the Spring Cloud Data Flow server to undeploy the {@link StreamDefinition}.
   * @param streamDefinition
   * @returns {Observable<R|T>} that will call subscribed functions to handle the result from the undeploy.
   */
  undeployDefinition(streamDefinition: StreamDefinition): Observable<Response> {
    console.log('Undeploying...', streamDefinition);
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.delete('/streams/deployments/' + streamDefinition.name, options)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Posts a request to the data flow server to deploy the stream associated with the streamDefinitionName.
   * @param streamDefinitionName the name of the stream to deploy.
   * @param propertiesAsMap the application or deployment properties to be used for stream deployment.
   * @returns {Observable<R|T>} that will call the subscribed functions to handle the resut of the deploy.
   */
  deployDefinition(streamDefinitionName: String, propertiesAsMap: any): Observable<Response> {
    console.log('Deploying...', streamDefinitionName);
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.post('/streams/deployments/' + streamDefinitionName, propertiesAsMap, options)
      .catch(this.errorHandler.handleError);
  }

  private extractData(res: Response): Page<StreamDefinition> {
    const body = res.json();
    let items: StreamDefinition[];
    if (body._embedded && body._embedded.streamDefinitionResourceList) {
      items = body._embedded.streamDefinitionResourceList.map(jsonItem => {
        const streamDefinition: StreamDefinition  = new StreamDefinition(
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
}
