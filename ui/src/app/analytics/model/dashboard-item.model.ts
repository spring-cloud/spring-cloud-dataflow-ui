import { Serializable } from '../../shared/model';
import { MetricType } from './metric-type.model';
import { Counter } from './counter.model';
import { Subscription } from 'rxjs/Subscription';

/**
 * Counter model object for the Analytics module.
 *
 * @author Gunnar Hillert
 */
export class DashboardItem implements Serializable<DashboardItem> {

  public id: number;
  public metricType: MetricType;
  public counter: Counter;
  public visualization: string;
  public refreshRate: number;

  public counterPoller: Subscription;
  public chartHeight = 140;
  public barSize = 2;

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
