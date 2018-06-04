import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ErrorHandler } from '../shared/model/error-handler';

import { SharedAboutService } from '../shared/services/shared-about.service';
import { FeatureInfo } from '../shared/model/about/feature-info.model';
import { AboutInfo } from '../shared/model/about/about-info.model';

@Injectable()
export class AboutService {

  /**
   * Constructor
   *
   * @param {SharedAboutService} sharedAboutService
   * @param {Http} http
   * @param {ErrorHandler} errorHandler
   */
  constructor(private sharedAboutService: SharedAboutService,
              private http: Http,
              private errorHandler: ErrorHandler) {
  }

  /**
   * Get About info
   *
   * @returns {AboutInfo}
   */
  public get aboutInfo(): AboutInfo {
    return this.sharedAboutService.aboutInfo;
  }

  /**
   * Get Feature Info
   *
   * @returns {FeatureInfo}
   */
  public get featureInfo(): FeatureInfo {
    return this.sharedAboutService.featureInfo;
  }

  /**
   * Set Feature info
   *
   * @param {FeatureInfo} featureInfo
   */
  public set featureInfo(featureInfo: FeatureInfo) {
    this.sharedAboutService.featureInfo = featureInfo;
  }

  /**
   * Get Feature Info Subject
   * @returns {Subject<FeatureInfo>}
   */
  public get featureInfoSubject(): Subject<FeatureInfo> {
    return this.sharedAboutService.featureInfoSubject;
  }

  /**
   * Get Info
   *
   * @param {boolean} reload
   * @returns {Observable<AboutInfo>}
   */
  getAboutInfo(reload?: boolean): Observable<AboutInfo> {
    if (reload) {
      this.sharedAboutService.loadAboutInfo(reload);
    }
    return this.sharedAboutService.getAboutInfo();
  }

  /**
   * Get details
   * @returns {Observable<AboutInfo>}
   */
  getDetails(): Observable<AboutInfo> {
    return this.sharedAboutService.getAboutInfo();
  }

}
