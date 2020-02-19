import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageRequest } from '../shared/model/pagination/page-request.model';
import { AppRegistration } from '../shared/model/app-registration.model';
import { SharedAppsService } from '../shared/services/shared-apps.service';
import { AppVersion } from '../shared/model/app-version';
import { Page } from '../shared/model/page';
import { Subscriber } from 'rxjs';
import { AppListParams } from './components/apps.interface';
import { ApplicationType } from '../shared/model/application-type';
import { DateTime } from 'luxon';
import { map } from 'rxjs/operators';


/**
 * Service class for the Apps module.
 * Workaround, to be remove after resolve the related Spring Data Flow Server issues.
 *
 * Related issue spring-cloud-dataflow: https://github.com/spring-cloud/spring-cloud-dataflow/issues/2039
 *
 * @author Damien Vitrac
 */
@Injectable()
export class AppsWorkaroundService {

  public static cache = {
    init: false,
    invalid: true,
    time: DateTime.local(),
    page: new Page<any>(),
    set: (page) => {
      AppsWorkaroundService.cache.init = false;
      AppsWorkaroundService.cache.invalid = false;
      AppsWorkaroundService.cache.page.update(page);
      AppsWorkaroundService.cache.time = DateTime.local();
    },
    invalidate: () => {
      AppsWorkaroundService.cache.invalid = true;
    },
    doCheck: () => {
      // Invalidate the cache after 30s
      const date = DateTime.local();
      if (date.diff(AppsWorkaroundService.cache.time).seconds > 30) {
        AppsWorkaroundService.cache.invalidate();
      }
    }
  };

  constructor(private sharedAppsService: SharedAppsService) {
  }

  public apps(params: AppListParams, force: boolean = false): Observable<Page<AppRegistration>> {

    const fakeApps = new Observable((subscriber: Subscriber<any>) => {
      subscriber.next();
      subscriber.complete();
    });

    if (force) {
      AppsWorkaroundService.cache.invalidate();
    }

    AppsWorkaroundService.cache.doCheck();

    return new Observable((subscriber: Subscriber<any>) => {
      let queue;
      if (!AppsWorkaroundService.cache.init || AppsWorkaroundService.cache.invalid) {
        queue = this.run().pipe(map(() => {
          AppsWorkaroundService.cache.init = true;
        }));
      } else {
        queue = fakeApps;
      }
      queue.subscribe(() => {
        const page = new Page<AppRegistration>();
        page.pageNumber = params.page;
        page.pageSize = params.size;
        page.items = Object.assign([], AppsWorkaroundService.cache.page.items);
        if (!params.q) {
          params.q = '';
        }
        if (params.q !== '' || params.type) {
          page.items = page.items.filter((a: AppRegistration) => {
            const t = (a.type === params.type);
            const q = (a.name.toLowerCase().indexOf(params.q.toLowerCase()) !== -1);
            if (params.q !== '' && params.type) {
              return (t && q);
            }
            if (params.q) {
              return q;
            }
            if (params.type) {
              return t;
            }
          });
        }
        if (params.sort) {
          const asc = (column, a, b) => a[column] < b[column] ? -1 : 1;
          const desc = (column, a, b) => a[column] > b[column] ? -1 : 1;
          if (!params.order) {
            params.order = 'ASC';
          }
          page.items = page.items.sort((a, b) => {
            return (params.order === 'ASC') ? asc(params.sort, a, b) : desc(params.sort, a, b);
          });
        }
        page.totalPages = Math.ceil(page.items.length / page.pageSize);
        page.totalElements = page.items.length;
        page.items = page.items.slice((params.page * page.pageSize), ((params.page + 1) * page.pageSize));
        subscriber.next(page);
        subscriber.complete();
      });
    });
  }

  appVersions(appType: ApplicationType, appName: string): Observable<AppVersion[]> {
    return this.sharedAppsService
      .getApps(new PageRequest(0, 10000), appType, appName, [{ sort: 'name', order: 'ASC' }, {
        sort: 'type',
        order: 'ASC'
      }])
      .pipe(map((app: Page<AppRegistration>): AppVersion[] => {
        return app.items
          .map((a) => {
            return (a.name === appName && a.type.toString() === ApplicationType[appType].toString())
              ? new AppVersion(a.version, a.uri, a.defaultVersion)
              : null;
          })
          .filter((a) => a != null)
          .sort((a, b) => a.version < b.version ? -1 : 1);
      }));
  }

  private run(): Observable<any> {
    return this.sharedAppsService
      .getApps(new PageRequest(0, 10000), null, '', [{ sort: 'name', order: 'ASC' }, { sort: 'type', order: 'ASC' }])
      .pipe(map(page => {
        page.items = page.items.sort((a, b) => a.name < b.name ? -1 : 1);
        return page;
      }),
      map(page => {
        for (let i = 0; i < page.items.length; i++) {
          const item = page.items[i] as AppRegistration;
          if (!item) {
            continue;
          }
          item.versions.push(new AppVersion(item.version, item.uri, item.defaultVersion));
          let next = true;
          for (let j = (i + 1); j < page.items.length && next; j++) {
            const itemNext = page.items[j] as AppRegistration;
            if (!itemNext) {
              continue;
            }
            next = (item.name === itemNext.name);
            if (next && item.type === itemNext.type) {
              item.versions.push(new AppVersion(itemNext.version, itemNext.uri, itemNext.defaultVersion));
              page.items[j] = null;
            }
          }
          const curr = item.versions.find((a) => a.defaultVersion);
          if (curr) {
            item.uri = curr.uri;
            item.version = curr.version;
            item.defaultVersion = true;
          }
          item.versions = item.versions.sort((a, b) => a.version < b.version ? -1 : 1);
        }
        page.items = page.items.filter(a => a != null);
        AppsWorkaroundService.cache.set(page);
        return page;
      }));
  }

}
