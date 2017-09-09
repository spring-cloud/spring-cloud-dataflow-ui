import { Injectable, OnDestroy } from '@angular/core';
import { Http, Response, RequestOptionsArgs } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ErrorHandler, Page } from '../shared/model';
import { Counter } from './model/counter.model';
import { DashboardItem } from './model/dashboard-item.model';
import { MetricType } from './model/metric-type.model';

import { HttpUtils } from '../shared/support/http.utils';
import { ToastyService } from 'ng2-toasty';
/**
 * @author Gunnar Hillert
 */
@Injectable()
export class AnalyticsService {

  private metricsCountersUrl = '/metrics/counters';

  public counters: Page<Counter>;
  public _counterInterval = 2;
  public counterPoller: Subscription;

  public metricTypes: MetricType[] = MetricType.getMetricTypes();

  rowId = 1; // For Dashboard
  public dashboardItems: DashboardItem[];

  constructor(
    private http: Http,
    private errorHandler: ErrorHandler,
    private toastyService: ToastyService) {
  }

  public set counterInterval(rate: number) {
    if (rate && !isNaN(rate)) {
      if (rate < 0.01) {
          rate = 0;
          this.stopPollingForCounters();
          this.toastyService.success(`Polling stopped.`);
      } else {
        console.log('Setting interval to ' + rate);
        this._counterInterval = rate;
        if (this.counterPoller && !this.counterPoller.closed) {
          this.stopPollingForCounters();
          this.startPollingForCounters();
          this.toastyService.success(`Polling interval changed to ${rate}s.`);
        } else {
          this.startPollingForCounters();
          this.toastyService.success(`Polling started with interval of ${rate}s.`);
        }
      }
    }
  }

  public get counterInterval(): number {
    return this._counterInterval;
  }

  public totalCacheSize() {
    return Math.max(Math.ceil(60 / this.counterInterval), 20);
  }

  /**
   * Starts the polling process for counters. Method
   * will check if the poller is already running and will
   * start the poller only if the poller is undefined or
   * stopped.
   */
  public startPollingForCounters() {
    if (!this.counterPoller || this.counterPoller.closed) {
      this.counterPoller = Observable.interval(this.counterInterval * 1000)
        .switchMap(() => this.getAllCounters(true)).subscribe(
          result => {},
          error => {
            this.toastyService.error(error);
        });
    }
  }

  /**
   * Stops the polling process for counters if the poller
   * is running and is defined.
   */
  public stopPollingForCounters() {
    if (this.counterPoller && !this.counterPoller.closed) {
      this.counterPoller.unsubscribe();
    }
  }

  /**
   * Retrieves all counters. Will take pagination into account.
   *
   * @param detailed If true will request additional counter values from the REST endpoint
   */
  public getAllCounters(detailed = false): Observable<Page<Counter>> {

      if (!this.counters) {
        this.counters = new Page<Counter>();
        this.counters.pageSize = 50;
      }

      const params = HttpUtils.getPaginationParams(this.counters.pageNumber, this.counters.pageSize);
      const requestOptionsArgs: RequestOptionsArgs = HttpUtils.getDefaultRequestOptions();

      if (detailed) {
        params.append('detailed', detailed.toString());
      }

      requestOptionsArgs.search = params;
      const handleRates = true;
      return this.http.get(this.metricsCountersUrl, requestOptionsArgs)
                      .map(response => this.extractData(response, detailed))
                      .catch(this.errorHandler.handleError);
  }

  private extractData(response: Response, handleRates: boolean): Page<Counter> {
    const body = response.json();
    console.log('body', body);
    const items: Counter[] = [];
    const cache: Counter[] = [];

    if (handleRates) {
      for (const oldCounter of this.counters.items) {
        cache[oldCounter.name] = oldCounter;
      }
      if (body._embedded && body._embedded.counterResourceList) {
        for (const counterResourceListItems of body._embedded.counterResourceList) {
          console.log('>>>>>>', counterResourceListItems);
          const counter = new Counter().deserialize(counterResourceListItems);

          if (cache[counter.name]) {
            const cached = cache[counter.name];
            counter.rates = cached.rates;
            counter.rates.push((counter.value - cached.value) / this.counterInterval);
            counter.rates.splice(0, counter.rates.length - this.totalCacheSize());
          }
          items.push(counter);
        }
      }
    } else {
      if (body._embedded && body._embedded.metricResourceList) {
        for (const metricResourceListItems of body._embedded.metricResourceList) {
          const counter = new Counter().deserialize(metricResourceListItems);
          items.push(counter);
        }
      }
    }

    console.log('items', items);
    const page = new Page<Counter>();
    page.items = items;
    page.totalElements = body.page.totalElements;
    page.pageNumber = body.page.number;
    page.pageSize = body.page.size;
    page.totalPages = body.page.totalPages;
    this.counters.update(page);
    return page;
  }

  addNewDashboardItem(index?: number): DashboardItem {
    if (!this.dashboardItems) {
      this.dashboardItems = [];
    }
    const dashboardItem = new DashboardItem();
    dashboardItem.id = this.rowId++;
    dashboardItem.refreshRate = 2;
    dashboardItem.visualization = '';

    console.log('>>>', this.dashboardItems);
    if (index) {
      this.dashboardItems.splice(index, 0, dashboardItem);
    } else {
      this.dashboardItems.push(dashboardItem);
    }
    console.log('>>>', this.dashboardItems);
    return dashboardItem;
  }

  removeDashboardItem(index: number): void {
    if (!this.dashboardItems || this.dashboardItems.length === 0) {
      return;
    }
    this.dashboardItems.splice(index, 1);
  }

  getAllDashboardItems(): Observable<DashboardItem> {
    this.addNewDashboardItem();
    return Observable.from(this.dashboardItems);
  }

  getStreamsForMetricType(metricType: MetricType) {
    if (MetricType.COUNTER === metricType) {
      return this.getAllCounters();
    } else {
      this.toastyService.error(`Metric type ${metricType.name} is not supported.`);
    }
  }

  getVisualizationsForMetricType(metricType: MetricType) {
    if (MetricType.COUNTER.id === metricType.id) {
      return this.getAllCounters();
    }
  }

  resetDashboard() {
    this.dashboardItems.length = 0;
    this.addNewDashboardItem();
  }

  //

    /**
   * Starts the polling process for a single counters. Method
   * will check if the poller is already running and will
   * start the poller only if the poller is undefined or
   * stopped. The subscription is store on the {@link DashboardItem}.
   */
  public startPollingForSingleDashboardItem(dashboardItem: DashboardItem) {
    console.log(dashboardItem);
    if (!dashboardItem.counterPoller || dashboardItem.counterPoller.closed) {
      dashboardItem.counterPoller = Observable.interval(dashboardItem.refreshRate * 1000)
        .switchMap(() => this.getSingleCounter(dashboardItem.counter.name)).subscribe(
          result => {
            dashboardItem.counter.rates.push((result.value - dashboardItem.counter.value) / dashboardItem.refreshRate);
            dashboardItem.counter.rates.splice(0, dashboardItem.counter.rates.length - this.totalCacheSize());
            dashboardItem.counter.value = result.value;
          },
          error => {
            console.log('error', error);
            this.toastyService.error(error);
          });
    }
  }

  /**
   * Stops the polling process for counters if the poller
   * is running and is defined.
   */
  public stopPollingOfSingleDashboarItem(dashboardItem: DashboardItem) {
    if (dashboardItem.counterPoller && !dashboardItem.counterPoller.closed) {
      dashboardItem.counterPoller.unsubscribe();
    }
  }

  /**
   * Restarts the polling process for counters if the poller
   * is running and is defined. Will stop the poller first and restart
   * the counter with the {@link DashboardItem}s refresh rate.
   *
   * Will NOT restart the poller if the refresh rate is zero.
   */
  public restartPollingOfSingleDashboarItem(dashboardItem: DashboardItem) {
    this.stopPollingOfSingleDashboarItem(dashboardItem);
    if (dashboardItem.refreshRate > 0 ) {
      this.startPollingForSingleDashboardItem(dashboardItem);
    }
  }

  /**
   * Retrieves all counters. Will take pagination into account.
   *
   * @param detailed If true will request additional counter values from the REST endpoint
   */
  public getSingleCounter(counterName: string): Observable<Counter> {
          const requestOptionsArgs: RequestOptionsArgs = HttpUtils.getDefaultRequestOptions();
          return this.http.get(this.metricsCountersUrl + '/' + counterName, requestOptionsArgs)
                          .map(response => {
                            const body = response.json();
                            console.log('body', body);
                            return new Counter().deserialize(body);
                          })
                          .catch(this.errorHandler.handleError);
      }
}
