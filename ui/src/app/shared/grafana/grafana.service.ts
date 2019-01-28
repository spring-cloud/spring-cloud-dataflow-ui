import { Injectable } from '@angular/core';
import { StreamDefinition } from '../../streams/model/stream-definition';
import { Observable, of } from 'rxjs';
import { SharedAboutService } from '../services/shared-about.service';
import { map } from 'rxjs/operators';
import { FeatureInfo } from '../model/about/feature-info.model';
import { AboutInfo } from '../model/about/about-info.model';
import { GrafanaInfo } from '../model/about/grafana.model';
import { RuntimeApp } from '../../runtime/model/runtime-app';
import { RuntimeAppInstance } from '../../runtime/model/runtime-app-instance';

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
   * Return an observable which contains the URL to the streams dashboard
   */
  getDashboardStreams(): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): GrafanaInfo => aboutInfo.grafanaInfo),
        map((grafanaInfo: GrafanaInfo): string => `${grafanaInfo.url}/d/scdf-streams/streams?refresh=${grafanaInfo.refreshInterval}s`)
      );
  }

  /**
   * Return an observable which contains the URL to the stream dashboard
   * @param {StreamDefinition} stream
   */
  getDashboardStream(stream: StreamDefinition): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): GrafanaInfo => aboutInfo.grafanaInfo),
        map((grafanaInfo: GrafanaInfo): string => `${grafanaInfo.url}/d/scdf-applications/applications?refresh=${grafanaInfo.refreshInterval}s&var-stream_name=${stream.name}&var-application_name=All`)
      );
  }

  /**
   * Return an observable which contains the URL to the applications dashboard
   */
  getDashboardApplications(): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): GrafanaInfo => aboutInfo.grafanaInfo),
        map((grafanaInfo: GrafanaInfo): string => `${grafanaInfo.url}/d/scdf-applications/applications?refresh=${grafanaInfo.refreshInterval}s`)
      );
  }

  /**
   * Return an observable which contains the URL to the application dashboard
   * @param appInstance
   */
  getDashboardApplication(appInstance: RuntimeAppInstance): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): GrafanaInfo => aboutInfo.grafanaInfo),
        map((grafanaInfo: GrafanaInfo): string => `${grafanaInfo.url}/d/scdf-applications/applications?refresh=${grafanaInfo.refreshInterval}s&var-application_name=${appInstance.instanceId}`)
      );
  }

}
