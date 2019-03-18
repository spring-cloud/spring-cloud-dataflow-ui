import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { ErrorHandler } from '../model';
import { FeatureInfo } from '../model/about/feature-info.model';
import { AboutInfo } from '../model/about/about-info.model';
import { catchError, map } from 'rxjs/operators';

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
  public featureInfoSubject = new BehaviorSubject<FeatureInfo>(undefined);

  public aboutInfo: AboutInfo;
  public aboutInfo$ = new BehaviorSubject<AboutInfo>(undefined);

  constructor(private httpClient: HttpClient, private errorHandler: ErrorHandler) {
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
      this.httpClient
        .get<any>(this.aboutUrl)
        .pipe(
          map(this.extractData.bind(this)),
          catchError(this.errorHandler.handleError)
        ).subscribe();
    }
    return of(this.aboutInfo);
  }

  public extractData(responseJson: any): AboutInfo {
    this.aboutInfo = new AboutInfo().deserialize(responseJson);
    this.aboutInfo$.next(this.aboutInfo);
    this.featureInfo = this.aboutInfo.featureInfo;
    this.featureInfoSubject.next(this.aboutInfo.featureInfo);
    return this.aboutInfo;
  }
}
