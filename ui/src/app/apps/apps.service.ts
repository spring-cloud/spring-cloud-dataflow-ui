import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedAppsService } from '../shared/services/shared-apps.service';
import { AppRegistration, ErrorHandler, Page, ApplicationType, DetailedAppRegistration } from '../shared/model';
import { HttpUtils } from '../shared/support/http.utils';
import { AppsWorkaroundService } from './apps.workaround.service';
import { AppListParams, AppRegisterParams, BulkImportParams } from './components/apps.interface';
import { AppVersion } from '../shared/model/app-version';
import { LoggerService } from '../shared/services/logger.service';
import { OrderParams } from '../shared/components/shared.interface';
import { forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Service class for the Apps module.
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Injectable()
export class AppsService {

  /**
   * URL API
   */
  private static appsUrl = '/apps';

  /**
   * Store the state of the applications list params
   */
  applicationsContext = {
    q: '',
    type: null,
    sort: 'name',
    order: 'ASC',
    page: 0,
    size: 30,
    itemsSelected: []
  };

  /**
   * Constructor
   *
   * @param {HttpClient} httpClient
   * @param {ErrorHandler} errorHandler
   * @param {LoggerService} loggerService
   * @param {AppsWorkaroundService} appsWorkaroundService
   * @param {SharedAppsService} sharedAppsService
   */
  constructor(private httpClient: HttpClient,
              private errorHandler: ErrorHandler,
              private loggerService: LoggerService,
              private appsWorkaroundService: AppsWorkaroundService,
              private sharedAppsService: SharedAppsService) {
  }

  /**
   * Returns an Observable of Page<AppRegistration>, providing the list
   * of all the applications
   *
   * @param params
   * @param {Boolean} force !workaround! force to kill the cache
   * @returns {Observable<Page<AppRegistration>>}
   */
  getApps(params: AppListParams, force?: boolean): Observable<Page<AppRegistration> | never> {
    return this.appsWorkaroundService.apps(params, force)
      .pipe(catchError(this.errorHandler.handleError));
  }

  /**
   * Returns an Observable of a {@link DetailedAppRegistration}, providing details
   * for an app registration.
   *
   * @param type
   * @param name
   * @param version
   */
  getAppInfo(type: ApplicationType, name: string, version: string = ''): Observable<DetailedAppRegistration> {
    return this.sharedAppsService.getAppInfo(type, name, version);
  }

  /**
   * Returns an Observable of a {@link version[]}, providing versions
   * for an app registration.
   *
   * @param type
   * @param name
   */
  getAppVersions(type: ApplicationType, name: string): Observable<AppVersion[] | never> {
    return this.appsWorkaroundService.appVersions(type, name)
      .pipe(catchError(this.errorHandler.handleError));
  }

  /**
   * Set a version as default version
   * Return an Observable of a {@Link Response}
   *
   * @param {ApplicationType} type The type of the application to get details for
   * @param {string} name The name of the application
   * @param {string} version The version to set default
   * @returns {Observable<any>}
   */
  setAppDefaultVersion(type: ApplicationType, name: string, version: string): Observable<void> {
    this.loggerService.log('Set app default version...', { name: name, type: type, version: version });
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .put(AppsService.appsUrl + '/' + type + '/' + name + '/' + version, { headers: httpHeaders })
      .pipe(
        map(AppsWorkaroundService.cache.invalidate),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Returns an Observable {@link Observable}, providing the status of the import
   *
   * @param {BulkImportParams} bulkImportParams Parameters
   * @returns {Observable<Response>}
   */
  bulkImportApps(bulkImportParams: BulkImportParams): Observable<void> {
    this.loggerService.log('Bulk import applications...', bulkImportParams);
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    const params = new HttpParams()
      .append('uri', bulkImportParams.uri)
      .append('apps', bulkImportParams.properties ? bulkImportParams.properties.join('\n') : null)
      .append('force', bulkImportParams.force ? 'true' : 'false');

    return this.httpClient
      .post(AppsService.appsUrl, {}, { headers: httpHeaders, params: params })
      .pipe(
        map(AppsWorkaroundService.cache.invalidate),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Unregister Application
   *
   * @param {AppRegistration} appRegistration
   * @returns {Observable<void>}
   */
  unregisterApp(appRegistration: AppRegistration): Observable<void> {
    this.loggerService.log('Unregistering...', appRegistration);
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .delete(AppsService.appsUrl + '/' + appRegistration.type + '/' + appRegistration.name, { headers: httpHeaders })
      .pipe(
        map(AppsWorkaroundService.cache.invalidate),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Unregister Applications
   * Join unregisterApp()
   *
   * @param {AppRegistration[]} appRegs
   * @returns {Observable<void[]>}
   */
  unregisterApps(appRegs: AppRegistration[]): Observable<void[]> {
    return forkJoin(appRegs.map(app => this.unregisterApp(app)));
  }

  /**
   * Unregister a version of an application
   *
   * @param {AppRegistration} appRegistration
   * @param {string} version
   * @returns {Observable<any>}
   */
  unregisterAppVersion(appRegistration: AppRegistration, version: string): Observable<any> {
    this.loggerService.log('Unregistering app version...', { app: appRegistration, version: version });
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient.delete(AppsService.appsUrl + '/' + appRegistration.type + '/' + appRegistration.name + '/'
      + version, { headers: httpHeaders })
      .pipe(
        map(AppsWorkaroundService.cache.invalidate),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Register Application
   *
   * @param {AppRegisterParams} appRegisterParams
   * @returns {Observable<void>}
   */
  registerApp(appRegisterParams: AppRegisterParams): Observable<void> {
    this.loggerService.log('Registering app...', appRegisterParams);
    let params = new HttpParams()
      .append('uri', appRegisterParams.uri)
      .append('force', appRegisterParams.force.toString());
    if (appRegisterParams.metaDataUri) {
      params = params.append('metadata-uri', appRegisterParams.metaDataUri);
    }
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();

    return this.httpClient.post(AppsService.appsUrl + '/' + ApplicationType[appRegisterParams.type] + '/' + appRegisterParams.name,
      {}, { params: params, headers: httpHeaders })
      .pipe(
        map(AppsWorkaroundService.cache.invalidate),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Register Applications
   * Join registerApp()
   *
   * @param {AppRegistration[]} appRegs
   * @returns {Observable<void[]>}
   */
  registerApps(appRegs: AppRegisterParams[]): Observable<void[]> {
    return forkJoin(appRegs.map(app => this.registerApp(app)));
  }

  /**
   * Get counters (apps for stream, app for task)
   * @returns {Observable<any>}
   */
  appsState(): Observable<any> {
    const apps$: Observable<Page<AppRegistration>> = this.getApps({
      q: '',
      type: null,
      page: 0,
      size: 1,
      order: 'name',
      sort: OrderParams.ASC
    });
    const appsForTask$: Observable<Page<AppRegistration>> = this.getApps({
      q: '',
      type: (ApplicationType[ApplicationType.task] as any),
      page: 0,
      size: 1,
      order: 'name',
      sort: OrderParams.ASC
    });
    return forkJoin(apps$, appsForTask$)
      .pipe(map(obs => {
        const apps = obs[0].totalElements;
        const apssForTask = obs[1].totalElements;
        return { streams: apps - apssForTask, tasks: apssForTask };
      }));
  }

}
