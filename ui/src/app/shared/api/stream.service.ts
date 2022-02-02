import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {HttpUtils} from '../support/http.utils';
import {catchError, delay, map} from 'rxjs/operators';
import {Stream, StreamHistory, StreamPage} from '../model/stream.model';
import {forkJoin, Observable, timer} from 'rxjs';
import {ErrorUtils} from '../support/error.utils';
import {DataflowEncoder} from '../support/encoder.utils';
import {Platform, PlatformList} from '../model/platform.model';
import {StreamStatus, StreamStatuses} from '../model/metrics.model';
import {UrlUtilities} from '../../url-utilities.service';

@Injectable({
  providedIn: 'root'
})
export class StreamService {
  constructor(protected httpClient: HttpClient) {}

  getStreams(
    page: number,
    size: number,
    search?: string,
    sort?: string,
    order?: string
  ): Observable<StreamPage | unknown> {
    let params = HttpUtils.getPaginationParams(page, size);
    const headers = HttpUtils.getDefaultHttpHeaders();
    if (search) {
      params = params.append('search', search);
    }
    if (sort && order) {
      params = params.append('sort', `${sort},${order}`);
    }
    return this.httpClient
      .get<any>(UrlUtilities.calculateBaseApiUrl() + 'streams/definitions', {params, headers})
      .pipe(map(StreamPage.parse), catchError(ErrorUtils.catchError));
  }

  getStreamsRelated(streamName: string, nested?: boolean): Observable<Stream[] | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    let params = new HttpParams();
    if (nested) {
      params = params.append('nested', nested.toString());
    }
    return this.httpClient
      .get<any>(UrlUtilities.calculateBaseApiUrl() + `streams/definitions/${streamName}/related`, {params, headers})
      .pipe(
        map(jsonResponse => StreamPage.parse(jsonResponse).items),
        catchError(ErrorUtils.catchError)
      );
  }

  getStream(name: string): Observable<Stream | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .get<any>(UrlUtilities.calculateBaseApiUrl() + `streams/definitions/${name}`, {headers})
      .pipe(map(Stream.parse), catchError(ErrorUtils.catchError));
  }

  destroyStream(stream: Stream): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const url = UrlUtilities.calculateBaseApiUrl() + `streams/definitions/${stream.name}`;
    return this.httpClient.delete(url, {headers}).pipe(catchError(ErrorUtils.catchError));
  }

  destroyStreams(streams: Stream[]): Observable<any[]> {
    return forkJoin(streams.map(stream => this.destroyStream(stream)));
  }

  undeployStream(stream: Stream): Observable<HttpResponse<any>> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .delete<any>(UrlUtilities.calculateBaseApiUrl() + 'streams/deployments/' + stream.name, {headers})
      .pipe(catchError(ErrorUtils.catchError));
  }

  createStream(name: string, dsl: string, description: string): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const params = new HttpParams({encoder: new DataflowEncoder()})
      .append('name', name)
      .append('definition', dsl)
      .append('description', description);
    return this.httpClient
      .post<any>(UrlUtilities.calculateBaseApiUrl() + 'streams/definitions', null, {
        headers,
        observe: 'response',
        params
      })
      .pipe(catchError(ErrorUtils.catchError));
  }

  undeployStreams(streams: Stream[]): Observable<HttpResponse<any>[]> {
    return forkJoin(streams.map(stream => this.undeployStream(stream)));
  }

  getDeploymentInfo(name: string, reuseDeploymentProperties: boolean = false): Observable<Stream | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const reuse = reuseDeploymentProperties ? '?reuse-deployment-properties=true' : '';
    return this.httpClient
      .get<any>(UrlUtilities.calculateBaseApiUrl() + `streams/deployments/${name}${reuse}`, {headers})
      .pipe(map(Stream.parse), catchError(ErrorUtils.catchError));
  }

  updateStream(name: string, propertiesAsMap: any = {}): Observable<HttpResponse<any> | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .post(
        UrlUtilities.calculateBaseApiUrl() + `streams/deployments/update/${name}`,
        {
          releaseName: name,
          packageIdentifier: {packageName: name, packageVersion: null},
          updateProperties: propertiesAsMap
        },
        {headers, observe: 'response'}
      )
      .pipe(catchError(ErrorUtils.catchError));
  }

  deployStream(name: string, propertiesAsMap: any = {}): Observable<HttpResponse<any> | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .post<any>(UrlUtilities.calculateBaseApiUrl() + `streams/deployments/${name}`, propertiesAsMap, {
        headers,
        observe: 'response'
      })
      .pipe(catchError(ErrorUtils.catchError));
  }

  getPlatforms(): Observable<Platform[] | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const params = HttpUtils.getPaginationParams(0, 1000);
    return this.httpClient
      .get<any>(UrlUtilities.calculateBaseApiUrl() + 'streams/deployments/platform/list', {params, headers})
      .pipe(map(PlatformList.parse), catchError(ErrorUtils.catchError));
  }

  getLogs(name: string): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .get<any>(UrlUtilities.calculateBaseApiUrl() + `streams/logs/${name}`, {headers})
      .pipe(catchError(ErrorUtils.catchError));
  }

  getRuntimeStreamStatuses(names?: string[]): Observable<StreamStatus[] | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    let params = HttpUtils.getPaginationParams(0, 100);
    if (names) {
      params = params.append('names', names.join(','));
    }
    return this.httpClient
      .get<any>(UrlUtilities.calculateBaseApiUrl() + 'runtime/streams', {headers, params})
      .pipe(map(StreamStatuses.parse), catchError(ErrorUtils.catchError));
  }

  getStreamHistory(name: string): Observable<StreamHistory[]> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .get<any>(UrlUtilities.calculateBaseApiUrl() + `streams/deployments/history/${name}`, {headers})
      .pipe(
        map(items => items.map(StreamHistory.parse)),
        catchError(ErrorUtils.catchError)
      );
  }

  getApplications(name: string): Observable<any[] | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .get<any[]>(UrlUtilities.calculateBaseApiUrl() + `streams/definitions/${name}/applications`, {headers})
      .pipe(catchError(ErrorUtils.catchError));
  }

  rollbackStream(streamHistory: StreamHistory): Observable<HttpResponse<any>> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .post<any>(
        UrlUtilities.calculateBaseApiUrl() +
          `streams/deployments/rollback/${streamHistory.stream}/${streamHistory.version}`,
        {headers}
      )
      .pipe(catchError(ErrorUtils.catchError));
  }

  scaleAppInstance(streamName: string, appName: string, count: number): Observable<HttpResponse<any>> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const url =
      UrlUtilities.calculateBaseApiUrl() + `streams/deployments/scale/${streamName}/${appName}/instances/${count}`;
    return this.httpClient.post<any>(url, null, {headers}).pipe(catchError(ErrorUtils.catchError));
  }
}
