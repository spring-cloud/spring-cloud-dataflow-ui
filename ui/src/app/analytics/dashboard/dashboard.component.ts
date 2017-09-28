import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AnalyticsService } from '../analytics.service';
import { DashboardItem } from './../model/dashboard-item.model';
import { MetricType } from './../model/metric-type.model';
import { BaseCounter } from './../model/base-counter.model';
import { FieldValueCounterValue } from '../model/field-value-counter-value.model';

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

  test: FieldValueCounterValue[] = [
    new FieldValueCounterValue('en', 4613),
    new FieldValueCounterValue('es', 1842),
    new FieldValueCounterValue('ja', 1693),
    new FieldValueCounterValue('pt', 1400),
    new FieldValueCounterValue('und', 883)];

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

  /**
   * Move dashboard item in the array up one position.
   * @param {number} currentIndex The offset in the array move.
   */
  moveUpItem(currentIndex: number) {
    this.dashboardItems.splice(currentIndex - 1, 0, this.dashboardItems.splice(currentIndex, 1)[0]);
  }

  /**
   * Move dashboard item in the array down one position.
   * @param {number} currentIndex The offset in the array move.
   */
  moveDownItem(currentIndex: number) {
    this.dashboardItems.splice(currentIndex + 1, 0, this.dashboardItems.splice(currentIndex, 1)[0]);
  }

  /**
   * Empties dashboard array and inserts a single dashboard item.
   */
  resetDashboard() {
    this.analyticsService.resetDashboard();
  }

  /**
   * Retrieves metrics for specific type.
   * @param {MetricType} metricType to retrieve.
   */
  onMetricTypeChange(metricType: MetricType, dashBoardItem: DashboardItem) {
    console.log('Selected Metric Type:', metricType);
    dashBoardItem.counters = [];
    dashBoardItem.visualization = undefined;

    this.analyticsService.getCountersForMetricType(metricType).subscribe(result => {
      dashBoardItem.counters = result.items;
    });
  }

  /**
   * Starts polling for the specific dashboardItem.
   * @param {DashboardItem} dashBoardItem that polling should occur on.
   */
  onCounterNameChange(dashBoardItem: DashboardItem) {
    console.log('Selected counter:', dashBoardItem.counter);
    console.log('Time to start polling for dashBoardItem:', dashBoardItem);
    dashBoardItem.visualization = undefined;
    this.analyticsService.restartPollingOfSingleDashboardItem(dashBoardItem);
  }

  /**
   * Set the refresh rate for a specific item.
   * @param {number} newRefreshRate the updatedat refresh rate.
   * @param {DashboardItem} dashboardItem the item to get the new rate.
   */
  onRefreshRateChange(newRefreshRate: number, dashboardItem: DashboardItem) {
    console.log('New refresh rate:', newRefreshRate);
    this.analyticsService.restartPollingOfSingleDashboardItem(dashboardItem);
  }

  /**
   * No action on this method as of yet.
   * @param {string} selectedVisualization
   * @param {DashboardItem} dashboardItem
   */
  onVisualizationChange(selectedVisualization: string, dashboardItem: DashboardItem) {
    console.log('A visualization was selected:', selectedVisualization);
  }

  /**
   * returns true if both counter names are the same or if counters are undefined.
   * @param {BaseCounter} counter1 the first counter in the set to compare.
   * @param {BaseCounter} counter2 the second counter in the set to compare.
   * @returns {boolean} true if counter names are the same or both are undefined.
   */
  compareCounter(counter1: BaseCounter, counter2: BaseCounter) {
    if (counter1 && counter2) {
      return counter1.name === counter2.name;
    } else {
      return true;
    }
  }
}
