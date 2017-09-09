import { Component, OnInit, OnDestroy } from '@angular/core';

import { AnalyticsService } from '../analytics.service';
import { Counter } from '../model/counter.model';

/**
 * Main entry point to the Apps Module. Provides
 * a paginated list of {@link AppRegistration}s and
 * also provides operation to unregister {@link AppRegistration}s.
 *
 * @author Gunnar Hillert
 */
@Component({
  templateUrl: './counters.component.html'
})
export class CountersComponent implements OnInit, OnDestroy {

  public refreshRate: number;
  public refreshRateFormField: number;

  get counters() {
    return this.analyticsService.counters;
  }

  constructor(public analyticsService: AnalyticsService) {}

  /**
   * As soon as the page loads we start the process of polling
   * for counters.
   */
  ngOnInit() {
    this.startPollingForCounters();
    this.refreshRate = this.analyticsService.counterInterval;
    this.refreshRateFormField = this.analyticsService.counterInterval;
  }

  /**
   * When the component is destroyed, make sure the poller is
   * stopped also.
   */
  ngOnDestroy() {
    this.analyticsService.stopPollingForCounters();
  }

  trackByIndex(index: number, data: any) { return index; }

  /**
   * Load a paginated list of {@link Counter}s.
   */
  public startPollingForCounters() {
    this.analyticsService.startPollingForCounters();
  }

  /**
   * Used for requesting a new page. The page number is
   * 1-index-based. It will be converted to a zero-index-based
   * page number under the hood.
   *
   * @param page 1-index-based
   */
  getPage(page: number) {
    console.log(`Getting page ${page}.`);
    this.analyticsService.counters.pageNumber = page - 1;
  }

  /**
   * Returns the size of the rate-cache from the underlying
   * {@link AnalyticsService}.
   */
  public totalCacheSize(): number {
    return this.analyticsService.totalCacheSize();
  }

  /**
   * Changes the refresh rate of the poller to the value
   * specified in "this.refreshRate".
   */
  public changeRefreshRate() {
    console.log('Changing refresh rate to ...' + this.refreshRateFormField);
    this.analyticsService.counterInterval = this.refreshRateFormField;
    this.refreshRate = this.analyticsService.counterInterval;
  }
}
