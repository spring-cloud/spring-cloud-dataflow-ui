import { Serializable } from '../../shared/model';
import { MetricType } from './metric-type.model';
import { BaseCounter } from './base-counter.model';
import { Page } from '../../shared/model';
import { Subscription } from 'rxjs/Subscription';

/**
 * Counter model object for the Analytics module.
 *
 * @author Gunnar Hillert
 */
export class DashboardItem implements Serializable<DashboardItem> {

  public id: number;
  public metricType: MetricType;
  public counter: BaseCounter;
  public visualization: string;
  public refreshRate  = 5;

  public counterPoller: Subscription;
  public chartHeight = 140;
  public numberOfBars = 5;

  public counters: BaseCounter[] = [];
  public countersIsLoading: Subscription;

  public maxNumberOfSlices = 20;
  public useAllData = true;

  constructor(
  ) { }

  public totalCacheSize() {
    return Math.max(Math.ceil(60 / this.refreshRate), 20);
  }

  /**
   * For a given JSON data object, this method
   * will populate the corresponding Counter object with
   * the provided properties.
   *
   * @param input JSON input data
   */
  public deserialize(input) {
    return this;
  }
}
