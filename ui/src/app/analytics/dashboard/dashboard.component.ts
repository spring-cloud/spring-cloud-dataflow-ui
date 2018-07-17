import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import { AggregateCounterResolutionType, DashboardItem, MetricType } from '../model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { AppError } from '../../shared/model/error.model';
import { ConfirmService } from '../../shared/components/confirm/confirm.service';

/**
 * The dashboard component provides
 * the ability to register various types of counters.
 *
 * @author Gunnar Hillert
 */
@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Returns the {@link DashboardItem}s from the
   * {@link AnalyticsService}.
   */
  public get dashboardItems() {
    return this.analyticsService.dashboardItems;
  }

  /**
   * Returns all supported {@link MetricType}s.
   */
  public get metricTypes() {
    return this.analyticsService.metricTypes;
  }

  constructor(public analyticsService: AnalyticsService,
              private loggerService: LoggerService,
              private confirmService: ConfirmService,
              private notificationService: NotificationService) {
  }

  /**
   * Called upon initialization of the component.
   * Will initialize the array of {@link DashboardItem}s that
   * is part of {@link AnalyticsService#dashboardItems} with 1
   * {@link DashboardItem}.
   */
  ngOnInit() {
    this.analyticsService.initializeDashboardItems();
  }

  /**
   * When the component is destroyed, make sure all pollers are
   * stopped also. Will also cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    this.analyticsService.stopAllDashboardPollers();
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Removes a dashboard item.
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
    this.loggerService.log('Adding new DashboardItem after index ' + index);
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
   * All pollers are stopped.
   */
  resetDashboard() {
    const title = `Confirm reset the dashboard`;
    const description = `This action will delete all the charts. Are you sure?`;
    this.confirmService.open(title, description).subscribe(() => {
      this.analyticsService.resetDashboard();
      this.notificationService.success('The dashboard has been reset.');
    });
  }

  /**
   * Called once the user selects a {@link MetricType}.
   * @param {MetricType} metricType that was selected
   * @param {DashboardItem} dashBoardItem for which the {@link MetricType} was selected
   */
  onMetricTypeChange(metricType: MetricType, dashBoardItem: DashboardItem) {
    this.loggerService.log('Selected Metric Type:', metricType);
    this.analyticsService.stopPollingOfSingleDashboardItem(dashBoardItem);
    dashBoardItem.visualization = undefined;
    dashBoardItem.counters = undefined;
    dashBoardItem.counter = undefined;

    dashBoardItem.countersIsLoading = this.analyticsService.getCountersForMetricType(metricType)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(result => {
          dashBoardItem.counters = result.items;
        },
        error => {
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        });
  }

  isCountersDropDownEnabled(dashboardItem: DashboardItem): boolean {
    if (!dashboardItem.metricType
      || (dashboardItem.countersIsLoading
        && !dashboardItem.countersIsLoading.closed)) {
      return true;
    } else {
      return false;
    }
  }

  isVisualizationDropDownEnabled(dashboardItem: DashboardItem): boolean {
    if (!dashboardItem.metricType
      || !dashboardItem.counter) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Starts polling for the specific dashboardItem up selection of the respective counter.
   * @param {DashboardItem} dashBoardItem that polling should occur on.
   */
  onCounterNameChange(dashBoardItem: DashboardItem) {
    this.loggerService.log('Selected counter:', dashBoardItem.counter);
    this.loggerService.log('Time to start polling for dashBoardItem:', dashBoardItem);
    this.analyticsService.restartPollingOfSingleDashboardItem(dashBoardItem);
  }

  /**
   * Set the refresh rate for a specific item.
   * @param {number} newRefreshRate the updatedat refresh rate.
   * @param {DashboardItem} dashboardItem the item to get the new rate.
   */
  onRefreshRateChange(newRefreshRate: number, dashboardItem: DashboardItem) {
    this.loggerService.log('New refresh rate:', newRefreshRate);
    this.analyticsService.restartPollingOfSingleDashboardItem(dashboardItem);
  }

  /**
   * No action on this method as of yet.
   * @param {string} selectedVisualization
   * @param {DashboardItem} dashboardItem
   */
  onVisualizationChange(selectedVisualization: string, dashboardItem: DashboardItem) {
    this.loggerService.log('A visualization was selected:', selectedVisualization);
  }

  compareVisualization(visualization1, visualization2) {
    return visualization1 === visualization2;
  }

  /**
   * Returns all AggregateCounterResolutionTypes.
   */
  getAllAggregateCounterResolutionTypes(): AggregateCounterResolutionType[] {
    return AggregateCounterResolutionType.getAggregateCounterResolutionTypes();
  }

  /**
   * Executed if the {@link AggregateCounterResolutionType} value is changed.
   * Only used when dealing with {@link AggregateCounter}s. Upon change,
   * will also make a reasonable adjustment to the number of bars that are
   * shown for the bar chart.
   *
   * @param {AggregateCounterResolutionType} resolutionType which the user has selected
   * @param {DashboardItem} dashboardItem for which the {@link ResolutionType} was selected
   */
  onResolutionTypeChange(resolutionType: AggregateCounterResolutionType, dashboardItem: DashboardItem) {
    this.loggerService.log('Selected Resolution Type:', resolutionType);

    if (AggregateCounterResolutionType.MINUTE === resolutionType) {
      dashboardItem.numberOfBars = 60;
    } else if (AggregateCounterResolutionType.HOUR === resolutionType) {
      dashboardItem.numberOfBars = 24;
    } else if (AggregateCounterResolutionType.DAY === resolutionType) {
      dashboardItem.numberOfBars = 7;
    } else if (AggregateCounterResolutionType.MONTH === resolutionType) {
      dashboardItem.numberOfBars = 12;
    } else if (AggregateCounterResolutionType.YEAR === resolutionType) {
      dashboardItem.numberOfBars = 10;
    } else {
      this.loggerService.log(`Unsupported AggregateCounterResolutionType '${resolutionType}'.`);
    }

    this.analyticsService.restartPollingOfSingleDashboardItem(dashboardItem);
  }
}
