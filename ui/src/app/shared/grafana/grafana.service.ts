import { Injectable } from '@angular/core';
import { StreamDefinition } from '../../streams/model/stream-definition';
import { Observable, of } from 'rxjs';
import { SharedAboutService } from '../services/shared-about.service';
import { map } from 'rxjs/operators';
import { FeatureInfo } from '../model/about/feature-info.model';
import { AboutInfo } from '../model/about/about-info.model';

/**
 * Grafana Service.
 *
 * @author Damien Vitrac
 */
@Injectable()
export class GrafanaService {

  /**
   * Constructor
   * @param sharedAboutService
   */
  constructor(private sharedAboutService: SharedAboutService) {
  }

  /**
   * Return an observable which contains a boolean
   * True if Grafana is enabled
   */
  isAllowed(): Observable<boolean> {
    return this.sharedAboutService
      .getFeatureInfo()
      .pipe(map((featuredInfo: FeatureInfo) => featuredInfo.grafanaEnabled));
  }

  /**
   * Return an observable which contains the URL to the stream dashboard
   */
  getDashboardStreams(): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo) => aboutInfo.grafanaInfo.url),
        map((url: string) => `${url}/d/scdf-streams/streams/`)
      );
  }

  /**
   * Return an observable which contains the URL to the application dashboard
   * @param {StreamDefinition} stream
   */
  getDashboardStream(stream: StreamDefinition): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo) => aboutInfo.grafanaInfo.url),
        map((url: string) => `${url}/d/scdf-streams/streams/${stream.name}`)
      );
  }


}
