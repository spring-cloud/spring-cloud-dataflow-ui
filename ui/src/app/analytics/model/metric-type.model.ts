import { Serializable } from '../../shared/model';

/**
 * MetricType model object for the Analytics module.
 *
 * @author Gunnar Hillert
 */
export class MetricType {
  constructor(
    public id: number,
    public name: string,
    public supportedVisualizations: string[]
  ) { }

  static COUNTER = new MetricType(1, 'Counters', ['Bar-Chart', 'Graph-Chart']);
  static AGGREGATE_COUNTER = new MetricType(2, 'Aggregate-Counters', ['Bar-Chart']);
  static FIELD_VALUE_COUNTER = new MetricType(3, 'Field-Value-Counters', ['Bubble-Chart', 'Pie-Chart']);

  static getMetricTypes(): MetricType[] {
    const metricTypes: MetricType[] = [];
    const countersMetricType = MetricType.COUNTER;
    const aggregateCountersMetricType = MetricType.AGGREGATE_COUNTER;
    const fieldValueCountersMetricType = MetricType.FIELD_VALUE_COUNTER;
    metricTypes.push(countersMetricType);
    metricTypes.push(aggregateCountersMetricType);
    metricTypes.push(fieldValueCountersMetricType);
    return metricTypes;
  }
}
