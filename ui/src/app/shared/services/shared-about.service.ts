import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/observable/of';

import { ErrorHandler } from '../model';
import { FeatureInfo } from '../model/about/feature-info.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedAboutService {

  public aboutUrl = '/about';
  public aboutInfo: any;
  public featureInfo;
  public featureInfoSubject = new Subject<FeatureInfo>();

  constructor(private http: Http, private errorHandler: ErrorHandler) {
  }

  getFeatureInfo(): Observable<FeatureInfo> {
    return this.getAboutInfo().map(result => {
      return new FeatureInfo().deserialize(result.featureInfo);
    });
  }

  getAboutInfo(): Observable<any> {
    if (!this.aboutInfo) {
      return this.http.get(this.aboutUrl)
                      .map(this.extractData.bind(this))
                      .catch(this.errorHandler.handleError);
    } else {
      console.log('Fetching About Info from local state.', this.aboutInfo);
      return Observable.of(this.aboutInfo);
    }
  }

  public extractData(res: Response) {
    console.log('extract data', res);
    const body = res.json();
    this.aboutInfo = body;
    this.featureInfo = new FeatureInfo().deserialize(body.featureInfo);
    this.featureInfoSubject.next(this.featureInfo);
    return body;
  }

}
