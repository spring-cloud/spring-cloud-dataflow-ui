import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AnalyticsService } from '../analytics.service';
import { DashboardItem } from './../model/dashboard-item.model';
import { MetricType } from './../model/metric-type.model';
import { Counter } from './../model/counter.model';

/**
 * The dashboard component provides
 * the ability to register various types of counters.
 *
 * @author Gunnar Hillert
 */
@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  busy: Subscription;
  public counters: Counter[] = [];

  public get dashboardItems() {
    return this.analyticsService.dashboardItems;
  }

  public get metricTypes() {
    return this.analyticsService.metricTypes;
  }

  constructor(public analyticsService: AnalyticsService) {}
  ngOnInit() {
    this.analyticsService.getAllDashboardItems();
  }

  /**
   * Removes a dashboard item
   *
   * @param index Index of the entry
   */
  removeDashboardItem(index: number) {
    this.analyticsService.removeDashboardItem(index);
  }

  /**
   * Adds a new {@link DashboardItem} at the specified index
   * @param index Insertion index
   */
  addNewDashboardItem(index: number) {
    console.log('Adding new DashboardItem after index ' + index);
    this.analyticsService.addNewDashboardItem(index + 1);
  }

  moveUpItem(dashboardItem: DashboardItem, currentIndex: number) {
    this.dashboardItems.splice(currentIndex - 1, 0, this.dashboardItems.splice(currentIndex, 1)[0]);
  }
  moveDownItem(dashboardItem: DashboardItem, currentIndex: number) {
    this.dashboardItems.splice(currentIndex + 1, 0, this.dashboardItems.splice(currentIndex, 1)[0]);
  }

  resetDashboard() {
    this.analyticsService.resetDashboard();
  }

  onMetricTypeChange(metricType: MetricType) {
    console.log('Selected Metric Type:', metricType);
    this.analyticsService.getStreamsForMetricType(metricType).subscribe(result => {
      console.log(result);
      this.counters = result.items;
    });
  }

  onCounterNameChange(dashBoardItem: DashboardItem) {
    console.log('Selected counter:', dashBoardItem.counter);
    console.log('Time to start polling for dashBoardItem:', dashBoardItem);
    this.analyticsService.startPollingForSingleDashboardItem(dashBoardItem);
  }

  onRefreshRateChange(newRefreshRate: number, dashboardItem: DashboardItem) {
    console.log('New refresh rate:', newRefreshRate);
    this.analyticsService.restartPollingOfSingleDashboarItem(dashboardItem);
  }

  onVisualizationChange(selectedVisualization: string, dashboardItem: DashboardItem) {
    console.log('A visualization was selected:', selectedVisualization);
  }

  compareCounter(counter1: Counter, counter2: Counter) {
    if (counter1 && counter2) {
      console.log(`Comparing counter1 ${counter1} and counter2 ${counter2}`);
      return counter1.name === counter2.name;
    } else {
      return true;
    }
  }
}
