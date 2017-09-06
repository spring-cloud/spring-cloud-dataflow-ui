import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AnalyticsService } from '../analytics.service';
import { Page } from '../../shared/model';

import { ToastyService } from 'ng2-toasty';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { Counter } from './model/counter.model';

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
export class CountersComponent implements OnInit {

  public refreshRate: number;

  get counters() {
    return this.analyticsService.counters;
  }

  constructor(
    public analyticsService: AnalyticsService,
    private toastyService: ToastyService,
    private router: Router ) {
    }

  /**
   * As soon as the page loads we start the process of polling
   * for counters.
   */
  ngOnInit() {
    this.startPollingForCounters();
    this.refreshRate = this.analyticsService.counterInterval;
  }

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

  public totalCacheSize(): number {
    return this.analyticsService.totalCacheSize();
  }

  public changeRefreshRate() {
    console.log('Changing refreshrate to ...' + this.refreshRate);
    this.analyticsService.counterInterval = this.refreshRate;
  }
}
