/**
 * Mimics the corresponding AggregateCounterResolution class from the
 * server-side. Represents a time-resolution supported by the
 * Aggregate Counter REST endpoint. Used by the Analytics module.
 *
 * Supports the following resolutions:
 *
 * - minute
 * - hour
 * - day
 * - month
 * - year
 *
 * @author Gunnar Hillert
 *
 */
export class AggregateCounterResolutionType {
  constructor(
    public id: number,
    public name: string,
    public isDefault: boolean
  ) { }

  static MINUTE = new AggregateCounterResolutionType(1, 'Minute', true);
  static HOUR = new AggregateCounterResolutionType(2, 'Hour', false);
  static DAY = new AggregateCounterResolutionType(3, 'Day', false);
  static MONTH = new AggregateCounterResolutionType(4, 'Month', false);
  static YEAR = new AggregateCounterResolutionType(5, 'Year', false);

  static getAggregateCounterResolutionTypes(): AggregateCounterResolutionType[] {
    const metricTypes: AggregateCounterResolutionType[] = [];
    metricTypes.push(AggregateCounterResolutionType.MINUTE);
    metricTypes.push(AggregateCounterResolutionType.HOUR);
    metricTypes.push(AggregateCounterResolutionType.DAY);
    metricTypes.push(AggregateCounterResolutionType.MONTH);
    metricTypes.push(AggregateCounterResolutionType.YEAR);
    return metricTypes;
  }
}
