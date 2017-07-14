import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {ErrorHandler} from "../shared/model/error-handler";

@Injectable()
export class AboutService {

  private aboutUrl = '/about';

  constructor(private http: Http, private errorHandler: ErrorHandler) { }

  getAboutInfo(): Observable<any[]> {
    return this.http.get(this.aboutUrl)
                    .map(this.extractData)
                    .catch(this.errorHandler.handleError);
  }

  getDetails(): Observable<any[]> {
    return this.http.get(this.aboutUrl)
                    .map(this.extractData)
                    .catch(this.errorHandler.handleError);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body;
    // return body.data || { };
  }

}
