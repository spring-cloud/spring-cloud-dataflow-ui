import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Page} from '../shared/model/page';
import {RuntimeApp} from './model/runtime-app';
import {PageInfo} from '../shared/model/pageInfo';
import {ErrorHandler} from '../shared/model/error-handler';

/**
 * Service to interact with the SCDF server on Runtime applications queries.
 *
 * @author Ilayaperumal Gopinathan
 */
@Injectable()
export class RuntimeAppsService {

    private runtimeServiceURL = '/runtime/apps';

    constructor(private http: Http, private errorHandler: ErrorHandler) {
    }

    /**
     * Get the runtime applications based on the paged parameters.
     *
     * @param pageInfo the page information for the current page being retrieved.
     * @returns {Observable<R|T>} the Promise that returns the paged result of Runtime applications.
     */
    public getRuntimeApps(pageInfo: PageInfo): Observable<Page<RuntimeApp>> {
        const params = {};
        params['page'] = pageInfo.pageNumber.toString();
        params['size'] = pageInfo.pageSize.toString();
        return this.http.get(this.runtimeServiceURL, {params: params})
            .map(this.extractData.bind(this))
            .catch(this.errorHandler.handleError);
    }

    private extractData(result: Response): Page<RuntimeApp> {
        const response = result.json();
        let items: RuntimeApp[];
        if (response._embedded && response._embedded.appStatusResourceList) {
            items = response._embedded.appStatusResourceList as RuntimeApp[];
          for (const item of items) {
            item.appInstances = item.instances._embedded.appInstanceStatusResourceList;
          }
        } else {
            items = [];
        }
        const page = new Page<RuntimeApp>();
        page.items = items;
        page.totalElements = response.page.totalElements;
        page.totalPages = response.page.totalPages;
        page.pageNumber = response.page.number;
        page.pageSize = response.page.size;
        return page;
    }

}
