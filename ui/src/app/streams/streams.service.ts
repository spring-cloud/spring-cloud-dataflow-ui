import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Page } from '../shared/model/page';
import { StreamDefinition } from './model/stream-definition';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class StreamsService {

  public streamDefinitions: Page<StreamDefinition>;

  private streamDefinitionsUrl = '/streams/definitions';

  constructor(private http: Http) { }

  getDefinitions(filter?: string): Observable<Page<StreamDefinition>> {
    let params = new URLSearchParams();
    if (filter) {
      params.append('search', filter);
    }
    return this.http.get(this.streamDefinitionsUrl, { search: params })
                    .map(this.extractData.bind(this))
                    .catch(this.handleError);
  }

  destroyDefinition(streamDefinition: StreamDefinition): Observable<Response> {
    console.log('Destroying...', streamDefinition);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete('/streams/definitions/' + streamDefinition.name, options)
      .map(data => {
        this.streamDefinitions.items = this.streamDefinitions.items.filter(item => item.name !== streamDefinition.name);
      })
      .catch(this.handleError);
  }

  undeployDefinition(streamDefinition: StreamDefinition): Observable<Response> {
    console.log('Undeploying...', streamDefinition);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete('/streams/deployments/' + streamDefinition.name, options)
      .map(data => {
        this.streamDefinitions.items = this.streamDefinitions.items.filter(item => item.name !== streamDefinition.name);
      })
      .catch(this.handleError);
  }

  deployDefinition(streamDefinitionName: String, propertiesAsMap: any): Observable<Response> {
    console.log('Deploying...', streamDefinitionName);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post('/streams/deployments/' + streamDefinitionName, propertiesAsMap, options)
      .map(data => {
        this.streamDefinitions.items = this.streamDefinitions.items.filter(item => item.name !== streamDefinitionName);
      })
      .catch(this.handleError);
  }

  private extractData(res: Response) : Page<StreamDefinition> {
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


  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
