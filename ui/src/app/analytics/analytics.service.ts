import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ErrorHandler, Page } from '../shared/model';
import { Counter } from './counters/model/counter.model';
import { HttpUtils } from '../shared/support/http.utils';

/**
 * @author Gunnar Hillert
 */
@Injectable()
export class AnalyticsService {

  private metricsCountersUrl = '/metrics/counters';

  public counters: Page<Counter>;
  public _counterInterval = 2;
  public counterPoller: Subscription;
  public countersCache: number[];

  constructor(private http: Http, private errorHandler: ErrorHandler) {
  }

  set counterIntervall(rate: number) {
    if (rate && !isNaN(rate)) {
      if (rate < 0.01) {
          rate = 0;
          this.stopPollingForCounters();
      } else {
        console.log('Setting intervall to ' + rate);
        this._counterInterval = rate;
        if (this.counterPoller && !this.counterPoller.closed) {
          this.stopPollingForCounters();
          this.startPollingForCounters();
        }
      }
    }
  }

  get counterIntervall(): number {
    return this._counterInterval;
  }

  public totalCacheSize() {
    return Math.max(Math.ceil(60 / this._counterInterval), 20);
  }

  startPollingForCounters() {
    if (!this.counterPoller || this.counterPoller.closed) {
      this.counterPoller = Observable.interval(this._counterInterval * 1000)
        .switchMap(() => this.getAllCounters(true)).subscribe();
    }
  }

  stopPollingForCounters() {
    if (this.counterPoller && !this.counterPoller.closed) {
      this.counterPoller.unsubscribe();
    }
  }

  getAllCounters(detailed = false): Observable<Page<Counter>> {

      if (!this.counters) {
        this.counters = new Page<Counter>();
      }

      const params = HttpUtils.getPaginationParams(this.counters.pageNumber, this.counters.pageSize);
      const requestOptionsArgs: RequestOptionsArgs = HttpUtils.getDefaultRequestOptions();

      if (detailed) {
        params.append('detailed', detailed.toString());
      }

      requestOptionsArgs.search = params;
      return this.http.get(this.metricsCountersUrl, requestOptionsArgs)
                      .map(this.extractData.bind(this))
                      .catch(this.errorHandler.handleError);
  }

  private extractData(response: Response): Page<Counter> {
    const body = response.json();
    const items: Counter[] = [];
    const cache: Counter[] = [];
    for (const oldCounter of this.counters.items) {
      cache[oldCounter.name] = oldCounter;
    }
    if (body._embedded && body._embedded.counterResourceList) {
      for (const counterResourceListItems of body._embedded.counterResourceList) {
        const counter = new Counter().deserialize(counterResourceListItems);

        if (cache[counter.name]) {
          const cached = cache[counter.name];
          counter.rates = cached.rates;
          counter.rates.push((counter.value - cached.value) / this._counterInterval);
          counter.rates.splice(0, counter.rates.length - this.totalCacheSize());
        }
        items.push(counter);
      }
    }

    const page = new Page<Counter>();
    page.items = items;
    page.totalElements = body.page.totalElements;
    page.pageNumber = body.page.number;
    page.pageSize = body.page.size;
    page.totalPages = body.page.totalPages;
    this.counters.update(page);
    return page;
  }
}
