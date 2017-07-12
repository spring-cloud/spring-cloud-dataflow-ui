import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Page} from '../shared/model/page';
import {StreamDefinition} from './model/stream-definition';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class StreamsService {

  public streamDefinitions: Page<StreamDefinition>;

  private streamDefinitionsUrl = '/streams/definitions';

  constructor(private http: Http) {
  }

  getDefinitions(filter?: string): Observable<Page<StreamDefinition>> {
    let params = new URLSearchParams();
    if (filter) {
      params.append('search', filter);
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
      items = body._embedded.streamDefinitionResourceList as StreamDefinition[];
    }
    else {
      items = [];
    }

    let page = new Page<StreamDefinition>();
    page.items = items;
    page.totalElements = items.length;

    this.streamDefinitions = page;

    console.log('Extracted Stream Definitions:', this.streamDefinitions);
    return page;
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
