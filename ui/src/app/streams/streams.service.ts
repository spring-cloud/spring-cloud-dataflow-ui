import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Page} from '../shared/model/page';
import {StreamDefinition} from './model/stream-definition';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

/**
 * Provides {@streamDefinition} related services.
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 *
 */
@Injectable()
export class StreamsService {

  /** Will never be null. */
  public streamDefinitions: Page<StreamDefinition>;

  private streamDefinitionsUrl = '/streams/definitions';

  constructor(private http: Http) {
    this.streamDefinitions = new Page<StreamDefinition>();
  }

  getDefinitions(): Observable<Page<StreamDefinition>> {
    let params = new URLSearchParams();

    console.info('Getting paged stream definitions', this.streamDefinitions);
    console.log(this.streamDefinitions.getPaginationInstance());
    params.append('page', this.streamDefinitions.pageNumber.toString());
    params.append('size', this.streamDefinitions.pageSize.toString());

      //TODO Implement Sorting
      //params.sort = pageable.calculateSortParameter();

      // if (pageable.filterQuery && pageable.filterQuery.trim().length > 0) {
      //   params.search = pageable.filterQuery;
      // }

    if (this.streamDefinitions.filter && this.streamDefinitions.filter.length > 0) {
      params.append('search', this.streamDefinitions.filter);
    }
    return this.http.get(this.streamDefinitionsUrl, {search: params})
      .map(this.extractData.bind(this))
      .catch(this.handleError);
  }

  destroyDefinition(streamDefinition: StreamDefinition): Observable<Response> {
    console.log('Destroying...', streamDefinition);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.delete('/streams/definitions/' + streamDefinition.name, options)
      .map(data => {
        this.streamDefinitions.items = this.streamDefinitions.items.filter(item => item.name !== streamDefinition.name);
      })
      .catch(this.handleError);
  }

  undeployDefinition(streamDefinition: StreamDefinition): Observable<Response> {
    console.log('Undeploying...', streamDefinition);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.delete('/streams/deployments/' + streamDefinition.name, options)
      .catch(this.handleError);
  }

  /**
   * Posts a request to the data flow server to deploy the stream associated with the streamDefinitionName.
   * @param streamDefinitionName the name of the stream to deploy.
   * @param propertiesAsMap the application or deployment properties to be used for stream deployment.
   * @returns {Observable<R|T>}
   */
  deployDefinition(streamDefinitionName: String, propertiesAsMap: any): Observable<Response> {
    console.log('Deploying...', streamDefinitionName);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post('/streams/deployments/' + streamDefinitionName, propertiesAsMap, options)
      .catch(this.handleError);
  }

  private extractData(res: Response): Page<StreamDefinition> {
    const body = res.json();
    let items: StreamDefinition[];
    if (body._embedded && body._embedded.streamDefinitionResourceList) {
      items = body._embedded.streamDefinitionResourceList.map(jsonItem => {
        let streamDefinition: StreamDefinition  = new StreamDefinition(
          jsonItem.name,
          jsonItem.dslText,
          jsonItem.status
        );
        return streamDefinition;
      });
    }
    else {
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


  /**
   * Generate the error message that will be used and throw the appropriate exception.
   * @param error the exception that was thrown by the http post.
   * @returns {any} Exception to be thrown by the Observable
   */
  private handleError(error: Response | any) {
    let errMsg: string = '';

    if (error instanceof Response) {
      const body = error.json() || '';
      let isFirst: boolean = true;
      for (let bodyElement of body) {
        if (!isFirst) {
          errMsg += '\n';
        }
        else {
          isFirst = false;
        }
        errMsg += bodyElement.message;
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
