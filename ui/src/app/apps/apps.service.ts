import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/observable/of';

import { AppRegistration, ErrorHandler, Page } from '../shared/model';
import { SharedAppsService } from '../shared/services/shared-apps.service';
import { DetailedAppRegistration } from './model/detailed-app-registration';
import { ApplicationType } from '../shared/model/application-type';
import { AppRegistrationImport } from './model/app-registration-import';
import { PageRequest } from '../shared/model/pagination/page-request.model';

import { HttpUtils } from '../shared/support/http.utils'

/**
 * Service class for the Apps module.
 *
 * @author Gunnar Hillert
 */
@Injectable()
export class AppsService {

  private static appsUrl = '/apps';

  public appRegistrations: Page<AppRegistration>;
  public currentPage = 1;
  public filter = '';
  public remotelyLoaded = false;

  constructor(private http: Http, private errorHandler: ErrorHandler,
    private sharedAppsService: SharedAppsService) {
    console.log('constructing');
  }

  getApps(reload?: boolean): Observable<Page<AppRegistration>> {
    console.log(`Get apps - reload ${reload}`, this.appRegistrations);
    if (!this.appRegistrations || reload) {
      if (!this.appRegistrations) {
        this.appRegistrations = new Page<AppRegistration>();
      }
      console.log('Fetching App Registrations remotely.')
      this.remotelyLoaded = true;

      return this.sharedAppsService.getApps(
        new PageRequest(this.appRegistrations.pageNumber, this.appRegistrations.pageSize))
          .map(page => {
            this.appRegistrations.update(page);
            return this.appRegistrations;
          });
    } else {
      this.remotelyLoaded = false;
      console.log('Fetching App Registrations from local state.', this.appRegistrations);
      return Observable.of(this.appRegistrations);
    }
  }

  getAppInfo(appType: ApplicationType, appName: string): Observable<DetailedAppRegistration> {
    console.log(this.appRegistrations);
    const options = HttpUtils.getDefaultRequestOptions();

    return this.http.get(AppsService.appsUrl + '/' + appType + '/' + appName, options)
      .map(data => {
        console.log('Returned App Registration Detail:', data);
        const body = data.json();
        const detailedAppRegistration = <DetailedAppRegistration> body;
        return detailedAppRegistration;
      })
      .catch(this.errorHandler.handleError);
  }

  bulkImportApps(appRegistrationImport: AppRegistrationImport): Observable<Response> {
    console.log(this.appRegistrations);
    const options = HttpUtils.getDefaultRequestOptions();

    const params = new URLSearchParams();

    params.append('uri', appRegistrationImport.uri);
    params.append('apps', appRegistrationImport.appsProperties ? appRegistrationImport.appsProperties.join('\n') : null);
    params.append('force', appRegistrationImport.force ? 'true' : 'false');

    options.params = params;

    console.log(options.params);
    return this.http.post(AppsService.appsUrl, {}, options)
                    .catch(this.errorHandler.handleError);
  }

  unregisterApp(appRegistration: AppRegistration): Observable<Response> {
    console.log('Unregistering...', appRegistration);
    const options = HttpUtils.getDefaultRequestOptions();

    return this.http.delete(AppsService.appsUrl + '/' + appRegistration.type + '/' + appRegistration.name, options)
      .map(data => {
        this.appRegistrations.items = this.appRegistrations.items.filter(item => item.name !== appRegistration.name);
      })
      .catch(this.errorHandler.handleError);

  }

  registerMultipleApps(appRegs: AppRegistration[]): Observable<Response[]> {
    const observables: Observable<Response>[] = [];
    for (const appReg of appRegs) {
      observables.push(this.registerApp(appReg));
    }
    return Observable.forkJoin(observables);
  }

  registerApp(appRegistration: AppRegistration): Observable<Response> {
    console.log('Registering...', appRegistration);

    const params = new URLSearchParams();

    params.append('uri', appRegistration.uri);
    if (appRegistration.metaDataUri) {
        params.append('metadata-uri', appRegistration.metaDataUri);
    }
    params.append('force', appRegistration.force ? 'true' : 'false');

    const options = HttpUtils.getDefaultRequestOptions();
    options.params = params;

    console.log(options.params);

    return this.http.post(AppsService.appsUrl + '/' + ApplicationType[appRegistration.type] + '/' + appRegistration.name, {}, options)
      .map(data => {
        if (this.appRegistrations && this.appRegistrations.items) {
          this.appRegistrations.items = this.appRegistrations.items.filter(item => item.name !== appRegistration.name);
        }
    })
    .catch(this.errorHandler.handleError);
  }

}
