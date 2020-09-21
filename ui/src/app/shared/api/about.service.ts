import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, take } from 'rxjs/operators';
import { ErrorUtils } from '../support/error.utils';
import { Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { aboutFeatureKey, AboutState, getAbout, getFeatures, getMonitoring, State } from '../store/about.reducer';
import { loaded } from '../store/about.action';
import { parse } from '../store/about.support';
import { LOAD } from '../../tests/data/about';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  constructor(private httpClient: HttpClient,
              private store: Store<State>) {
  }

  load(): Observable<AboutState> {
    return this.httpClient
      .get<any>('/about')
      .pipe(
        map(parse),
        map((about: AboutState) => {
          this.store.dispatch(loaded(about));
          return about;
        }),
        catchError(ErrorUtils.catchError)
      );
  }

  getAbout(): Observable<AboutState> {
    return this.store
      .pipe(select(getAbout));
  }

  async isFeatureEnabled(feature: string): Promise<boolean> {
    const features = await this.store.pipe(select(getFeatures)).pipe(take(1)).toPromise();
    return features[feature] === true;
  }

  getMonitoringType(): Observable<string> {
    return this.store.pipe(select(state => {
      return state[aboutFeatureKey].features.monitoringDashboardType;
    }));
  }

  getMonitoring(): Observable<any> {
    return this.store.pipe(select(getMonitoring));
  }

}
