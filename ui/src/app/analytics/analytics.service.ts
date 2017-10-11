import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ErrorHandler, Page } from '../shared/model';
import { AggregateCounter, BaseCounter, Counter, DashboardItem, FieldValueCounter, MetricType } from './model';
import { HttpUtils } from '../shared/support/http.utils';
import { ToastyService } from 'ng2-toasty';

/**
 * @author Gunnar Hillert
 */
@Injectable()
export class AnalyticsService {

  private metricsCountersUrl = '/metrics/counters';
  private metricsFieldValueCountersUrl = '/metrics/field-value-counters';
  private metricsAggregateCountersUrl = '/metrics/aggregate-counters';

  /**
   * For Counter Tab.
   */
  public counters: Page<Counter>;

  /**
   * For Counter Tab.
   */
  public _counterInterval = 2;

  /**
   * For Counter Tab.
   */
  public counterPoller: Subscription;

  public metricTypes: MetricType[] = MetricType.getMetricTypes();

  private rowId = 1; // For Dashboard
  public dashboardItems: DashboardItem[];

  constructor(
    private http: Http,
    private errorHandler: ErrorHandler,
    private toastyService: ToastyService) {
  }

  public set counterInterval(rate: number) {
    if (rate !== undefined && !isNaN(rate)) {
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
   * Starts the polling process for ALL counters. Method
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
  private  getAllCounters(detailed = false): Observable<Page<Counter>> {

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
      return this.http.get(this.metricsCountersUrl, requestOptionsArgs)
                      .map(response => this.extractData(response, detailed))
                      .catch(this.errorHandler.handleError);
  }

  /**
   * Retrieves all field-value-counters.
   */
  private  getAllFieldValueCounters(): Observable<Page<FieldValueCounter>> {
    const params = HttpUtils.getPaginationParams(0, 100);
    const requestOptionsArgs: RequestOptionsArgs = HttpUtils.getDefaultRequestOptions();

    requestOptionsArgs.search = params;
    return this.http.get(this.metricsFieldValueCountersUrl, requestOptionsArgs)
                    .map(response => this.extractData(response, false))
                    .catch(this.errorHandler.handleError);
  }

  /**
   * Retrieves all aggregate counters.
   */
  private  getAllAggregateCounters(): Observable<Page<AggregateCounter>> {
    const params = HttpUtils.getPaginationParams(0, 100);
    const requestOptionsArgs: RequestOptionsArgs = HttpUtils.getDefaultRequestOptions();

    requestOptionsArgs.search = params;
    return this.http.get(this.metricsAggregateCountersUrl, requestOptionsArgs)
                    .map(response => this.extractData(response, false))
                    .catch(this.errorHandler.handleError);
  }

  private extractData(response: Response, handleRates: boolean): Page<BaseCounter> {
    const body = response.json();
    const items: BaseCounter[] = [];
    const cache: BaseCounter[] = [];

    if (handleRates) {
      for (const oldCounter of this.counters.items) {
        cache[oldCounter.name] = oldCounter;
      }
      if (body._embedded && body._embedded.counterResourceList) {
        for (const counterResourceListItems of body._embedded.counterResourceList) {
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
      } else if (body._embedded && body._embedded.aggregateCounterResourceList) {
        for (const aggregateCounterResourceListItems of body._embedded.aggregateCounterResourceList) {
          const counter = new AggregateCounter().deserialize(aggregateCounterResourceListItems);
          items.push(counter);
        }
      }
    }

    const page = new Page<BaseCounter>();
    page.items = items;
    page.totalElements = body.page.totalElements;
    page.pageNumber = body.page.number;
    page.pageSize = body.page.size;
    page.totalPages = body.page.totalPages;

    if (handleRates) {
      this.counters.update(page as Page<Counter>);
    }
    return page;
  }

  /**
   * Adds a new empty dashboard item to the dashboardItems array.
   * @param {number} index the location it should be added.
   * @returns {DashboardItem} the new instance of the {DashboardItem}.
   */
  addNewDashboardItem(index?: number): DashboardItem {
    if (!this.dashboardItems) {
      this.dashboardItems = [];
    }

    const dashboardItem = new DashboardItem();
    dashboardItem.id = this.rowId++;

    if (index) {
      this.dashboardItems.splice(index, 0, dashboardItem);
    } else {
      this.dashboardItems.push(dashboardItem);
    }
    return dashboardItem;
  }

  /**
   * Remove dashboard item from dashboardItems array and splice the array.
   * @param {number} index the offset of the dashboard item to remove.
   */
  removeDashboardItem(index: number): void {
    if (!this.dashboardItems || this.dashboardItems.length === 0) {
      return;
    }
    this.stopPollingOfSingleDashboardItem(this.dashboardItems[index]);
    this.dashboardItems.splice(index, 1);
  }

  /**
   * Initialize the array of {@link dashboardItem}s. Will add 1 new
   * {@link DashboardItem} as starting point.
   */
  initializeDashboardItems() {
    if (!this.dashboardItems) {
      this.addNewDashboardItem();
    } else {
      for (const dashboardItem of this.dashboardItems) {
        console.log(`Start polling for dashboard item`, dashboardItem);
        this.startPollingForSingleDashboardItem(dashboardItem);
      }
    }
  }

  /**
   * Retrieve all metrics for a specific type.
   * @param {MetricType} metricType the specific metric type to retrieve.
   * @returns {Observable<Page<Counter>>} Page containing the metrics.
   */
  getCountersForMetricType(metricType: MetricType): Observable<Page<BaseCounter>> {
    if (MetricType.COUNTER === metricType) {
      return this.getAllCounters();
    } else if (MetricType.AGGREGATE_COUNTER === metricType) {
      return this.getAllAggregateCounters();
    } else if (MetricType.FIELD_VALUE_COUNTER === metricType) {
      return this.getAllFieldValueCounters();
    } else {
      this.toastyService.error(`Metric type ${metricType.name} is not supported.`);
      return undefined;
    }
  }

  /**
   * All pollers of all {@link DashboarItem}s are stopped.
   */
  stopAllDashboardPollers() {
    for (const dashboardItemToDisable of this.dashboardItems) {
      this.stopPollingOfSingleDashboardItem(dashboardItemToDisable);
    }
  }

  /**
   * Empties dashboard array and inserts a single dashboard item.
   * All pollers are stopped.
   */
  resetDashboard() {
    this.stopAllDashboardPollers();
    this.dashboardItems.length = 0;
    this.addNewDashboardItem();
  }

    /**
   * Starts the polling process for a single counters. Method
   * will check if the poller is already running and will
   * start the poller only if the poller is undefined or
   * stopped. The subscription is store on the {@link DashboardItem}.
   */
  public startPollingForSingleDashboardItem(dashboardItem: DashboardItem) {
    if ((!dashboardItem.counterPoller || dashboardItem.counterPoller.closed)
        && dashboardItem.counter) {

      let counterServiceCall: Observable<any>;
      let resultProcessor: Function;

      const localThis = this;

      if (dashboardItem.metricType === MetricType.COUNTER) {
        counterServiceCall = this.getSingleCounter(dashboardItem.counter.name);
        resultProcessor = function(result: Counter) {
          const counter = dashboardItem.counter as Counter;
          if (counter.value) {
            const rates = counter.rates;
            const res = (result.value - counter.value) / dashboardItem.refreshRate;

            rates.push(res);
            rates.splice(0, counter.rates.length - localThis.totalCacheSize());
            counter.rates = rates.slice();
          }
          counter.value = result.value;
        };
      } else if (dashboardItem.metricType === MetricType.FIELD_VALUE_COUNTER) {
        counterServiceCall = this.getSingleFieldValueCounter(dashboardItem.counter.name);
        resultProcessor = function(result: FieldValueCounter) {
          const counter = dashboardItem.counter as FieldValueCounter;
          counter.values = result.values.slice();
        };
      } else if (dashboardItem.metricType === MetricType.AGGREGATE_COUNTER) {
        counterServiceCall = this.getSingleAggregateCounter(dashboardItem.counter as AggregateCounter);
        resultProcessor = function(result: AggregateCounter) {
          const counter = dashboardItem.counter as AggregateCounter;
          counter.counts = result.counts.slice();
        };
      }

      dashboardItem.counterPoller = Observable.interval(dashboardItem.refreshRate * 1000)
        .switchMap(() => counterServiceCall).subscribe(
          result => resultProcessor(result),
          error => {
            console.log('error', error);
            this.toastyService.error(error);
          }
        );
    }
  }

  /**
   * Stops the polling process for counters if the poller
   * is running and is defined.
   */
  public stopPollingOfSingleDashboardItem(dashboardItem: DashboardItem) {
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
  public restartPollingOfSingleDashboardItem(dashboardItem: DashboardItem) {
    this.stopPollingOfSingleDashboardItem(dashboardItem);
    if (dashboardItem.refreshRate > 0 && dashboardItem.counter) {
      this.startPollingForSingleDashboardItem(dashboardItem);
    }
  }

  /**
   * Retrieves a single counter.
   *
   * @param counterName Name of the counter for which to retrieve details
   */
  private getSingleCounter(counterName: string): Observable<Counter> {
          const requestOptionsArgs: RequestOptionsArgs = HttpUtils.getDefaultRequestOptions();
          return this.http.get(this.metricsCountersUrl + '/' + counterName, requestOptionsArgs)
                          .map(response => {
                            const body = response.json();
                            console.log('body', body);
                            return new Counter().deserialize(body);
                          })
                          .catch(this.errorHandler.handleError);
  }

  /**
   * Retrieves a single Field-Value Counter.
   *
   * @param counterName Name of the counter for which to retrieve details
   */
  private getSingleFieldValueCounter(counterName: string): Observable<Counter> {
    const requestOptionsArgs: RequestOptionsArgs = HttpUtils.getDefaultRequestOptions();
    return this.http.get(this.metricsFieldValueCountersUrl + '/' + counterName, requestOptionsArgs)
                    .map(response => {
                      const body = response.json();
                      return new FieldValueCounter().deserialize(body);
                    })
                    .catch(this.errorHandler.handleError);
    }

  /**
   * Retrieves a single Aggregate Counter.
   *
   * @param counterName Name of the counter for which to retrieve details
   */
  private getSingleAggregateCounter(counter: AggregateCounter): Observable<Counter> {
    const requestOptionsArgs: RequestOptionsArgs = HttpUtils.getDefaultRequestOptions();
    const params = new URLSearchParams();

    requestOptionsArgs.params = params;

    params.append('resolution', counter.resolutionType.name.toLowerCase());

    return this.http.get(this.metricsAggregateCountersUrl + '/' + counter.name, requestOptionsArgs)
                    .map(response => {
                      const body = response.json();
                      return new AggregateCounter().deserialize(body);
                    })
                    .catch(this.errorHandler.handleError);
  }
}
