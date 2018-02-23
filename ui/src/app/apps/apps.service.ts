import {Injectable} from '@angular/core';
import {Http, Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';
import {SharedAppsService} from '../shared/services/shared-apps.service';
import {AppRegistration, ErrorHandler, Page, ApplicationType, DetailedAppRegistration} from '../shared/model';
import {PageRequest} from '../shared/model/pagination/page-request.model';
import {HttpUtils} from '../shared/support/http.utils';
import {AppsWorkaroundService} from './apps.workaround.service';
import {AppListParams, AppRegisterParams, BulkImportParams} from './components/apps.interface';
import {AppVersion} from '../shared/model/app-version';

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
   * Constructor
   *
   * @param {Http} http
   * @param {ErrorHandler} errorHandler
   * @param {AppsWorkaroundService} appsWorkaroundService
   * @param {SharedAppsService} sharedAppsService
   */
  constructor(private http: Http,
              private errorHandler: ErrorHandler,
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
  getApps(params: AppListParams, force?: boolean): Observable<Page<AppRegistration>> {
    return this.appsWorkaroundService.apps(params, force)
      .catch(this.errorHandler.handleError);
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
  getAppVersions(type: ApplicationType, name: string): Observable<AppVersion[]> {
    return this.appsWorkaroundService.appVersions(type, name)
      .catch(this.errorHandler.handleError);
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
  setAppDefaultVersion(type: ApplicationType, name: string, version: string): Observable<Response> {
    console.log('Set app default version...', {name: name, type: type, version: version});
    const options = HttpUtils.getDefaultRequestOptions();
    return this.http.put(AppsService.appsUrl + '/' + type + '/' + name + '/' + version, options)
      .map(AppsWorkaroundService.cache.invalidate)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Returns an Observable {@link Observable}, providing the status of the import
   *
   * @param {BulkImportParams} bulkImportParams Parameters
   * @returns {Observable<Response>}
   */
  bulkImportApps(bulkImportParams: BulkImportParams): Observable<Response> {
    console.log('Bulk import applications...', bulkImportParams);
    const options = HttpUtils.getDefaultRequestOptions();
    const params = new URLSearchParams();
    params.append('uri', bulkImportParams.uri);
    params.append('apps', bulkImportParams.properties ? bulkImportParams.properties.join('\n') : null);
    params.append('force', bulkImportParams.force ? 'true' : 'false');
    options.params = params;
    return this.http.post(AppsService.appsUrl, {}, options)
      .map(AppsWorkaroundService.cache.invalidate)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Unregister Application
   *
   * @param {AppRegistration} appRegistration
   * @returns {Observable<Response>}
   */
  unregisterApp(appRegistration: AppRegistration): Observable<Response> {
    console.log('Unregistering...', appRegistration);
    const options = HttpUtils.getDefaultRequestOptions();
    return this.http.delete(AppsService.appsUrl + '/' + appRegistration.type + '/' + appRegistration.name, options)
      .map(AppsWorkaroundService.cache.invalidate)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Unregister Applications
   * Join unregisterApp()
   *
   * @param {AppRegistration[]} appRegs
   * @returns {Observable<Response[]>}
   */
  unregisterApps(appRegs: AppRegistration[]): Observable<Response[]> {
    const observables: Observable<Response>[] = [];
    for (const appReg of appRegs) {
      observables.push(this.unregisterApp(appReg));
    }
    return Observable.forkJoin(observables);
  }

  /**
   * Unregister a version of an application
   *
   * @param {AppRegistration} appRegistration
   * @param {string} version
   * @returns {Observable<any>}
   */
  unregisterAppVersion(appRegistration: AppRegistration, version: string): Observable<any> {
    console.log('Unregistering app version...', {app: appRegistration, version: version});
    const options = HttpUtils.getDefaultRequestOptions();
    return this.http.delete(AppsService.appsUrl + '/' + appRegistration.type + '/' + appRegistration.name
      + '/' + version, options)
      .map(AppsWorkaroundService.cache.invalidate)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Register Application
   *
   * @param {AppRegisterParams} appRegisterParams
   * @returns {Observable<Response>}
   */
  registerApp(appRegisterParams: AppRegisterParams): Observable<Response> {
    console.log('Registering app...', appRegisterParams);
    const params = new URLSearchParams();
    params.append('uri', appRegisterParams.uri);
    params.append('force', appRegisterParams.force.toString());
    if (appRegisterParams.metaDataUri) {
      params.append('metadata-uri', appRegisterParams.metaDataUri);
    }
    const options = HttpUtils.getDefaultRequestOptions();
    options.params = params;
    return this.http.post(AppsService.appsUrl + '/' + ApplicationType[appRegisterParams.type] + '/' + appRegisterParams.name, {}, options)
      .map(AppsWorkaroundService.cache.invalidate)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Register Applications
   * Join registerApp()
   *
   * @param {AppRegistration[]} appRegs
   * @returns {Observable<Response[]>}
   */
  registerApps(appRegs: AppRegisterParams[]): Observable<Response[]> {
    console.log(`Registering ${appRegs.length} apps...`, appRegs);
    const observables: Observable<Response>[] = [];
    for (const appReg of appRegs) {
      observables.push(this.registerApp(appReg));
    }
    return Observable.forkJoin(observables);
  }

}
