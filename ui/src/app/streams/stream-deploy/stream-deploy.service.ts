import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import {RequestOptions, Headers, Http, Response} from '@angular/http';
import {StreamDeploymentRequest} from "./model/stream-deployment-request";


/**
 * Service used to handle stream deployment requests.
 */
@Injectable()
export class StreamDeployService {

  constructor(private http: Http) {
    console.log('constructing');
  }

  /**
   * Requests a stream deployment from the Data Flow Server
   * @param streamDeploymentRequest a request that contains the information to deploy the stream.
   * @returns {Observable<R|T>}
   */
  deployStream(streamDeploymentRequest: StreamDeploymentRequest): Observable<Response> {
    console.log('Deploying...', streamDeploymentRequest);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let deploymentUrl = '/streams/deployments/' + streamDeploymentRequest.name;
    return this.http.post(deploymentUrl, streamDeploymentRequest.properties, options)
      .catch(this.handleError);
  }

  /**
   * Generate the error message that will be used and throw the appropriate exception.
   * @param error the exception that was thrown by the http post.
   * @returns {any} Exception to be thrown by the Observable
   */
  private handleError (error: Response | any) {
    let errMsg: string = '';

    if (error instanceof Response) {
      const body = error.json() || '';
      let isFirst: boolean = true;
      for(let bodyElement of body) {
        if(!isFirst) {
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
