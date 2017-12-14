import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {ErrorHandler} from '../shared/model/error-handler';

import { SharedAboutService } from '../shared/services/shared-about.service';
import { FeatureInfo } from '../shared/model/about/feature-info.model';

@Injectable()
export class AboutService {

  constructor(
    private sharedAboutService: SharedAboutService,
    private http: Http, private errorHandler: ErrorHandler) {}

  public get aboutInfo(): any {
    return this.sharedAboutService.aboutInfo;
  }

  public set aboutInfo(aboutInfo) {
    this.sharedAboutService.aboutInfo = aboutInfo;
  }

  public get featureInfo(): FeatureInfo {
    return this.sharedAboutService.featureInfo;
  }

  public set featureInfo(featureInfo: FeatureInfo) {
    this.sharedAboutService.featureInfo = featureInfo;
  }

  public get featureInfoSubject(): Subject<FeatureInfo> {
    return this.sharedAboutService.featureInfoSubject;
  }

  getAboutInfo(): Observable<any> {
    return this.sharedAboutService.getAboutInfo();
  }

  getDetails(): Observable<any> {
    return this.http.get(this.sharedAboutService.aboutUrl)
                    .map(this.sharedAboutService.extractData.bind(this))
                    .catch(this.errorHandler.handleError);
  }
}
