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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AboutInfo } from '../model/about/about-info.model';

/**
 * Common service used by multiple modules such as
 * {@link AboutModule} and the {@link AuthModule}. Provides
 * feature information and general meta-data information about
 * the Spring Cloud Data Flow server.
 *
 * @author Gunnar Hillert
 */
@Injectable()
export class SharedAboutService {

  public aboutUrl = '/about';
  public featureInfo;
  public featureInfoSubject = new Subject<FeatureInfo>();

  public aboutInfo: AboutInfo;
  public aboutInfo$ = new BehaviorSubject<AboutInfo>(undefined);

  constructor(private http: Http, private errorHandler: ErrorHandler) {
  }

  getAboutInfo(): Observable<AboutInfo> {
    return this.aboutInfo$.asObservable();
  }

  getFeatureInfo(): Observable<FeatureInfo> {
    return this.getAboutInfo().map(result => {
      if (!result) {
        return new FeatureInfo();
      }
      return new FeatureInfo().deserialize(result.featureInfo);
    });
  }

  loadAboutInfo(reload?: boolean): Observable<AboutInfo> {
    if (!this.aboutInfo || reload) {
      this.http.get(this.aboutUrl)
        .map(this.extractData.bind(this))
        .catch(this.errorHandler.handleError)
        .subscribe();
    }
    return Observable.of(this.aboutInfo);
  }

  public extractData(response: Response): AboutInfo {
    this.aboutInfo = new AboutInfo().deserialize(response.json());
    this.aboutInfo$.next(this.aboutInfo);
    this.featureInfo = this.aboutInfo.featureInfo;
    this.featureInfoSubject.next(this.aboutInfo.featureInfo);
    return this.aboutInfo;
  }
}
