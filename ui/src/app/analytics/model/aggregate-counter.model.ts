import { Serializable } from '../../shared/model';
import { BaseCounter } from './base-counter.model';
import { AggregateCounterValue } from './aggregate-counter-value.model';
import { AggregateCounterResolutionType } from './aggregate-counter-resolution-type.model';
import { DateTime } from 'luxon';

/**
 * Aggregate Counter model object for the Analytics module.
 *
 * @author Gunnar Hillert
 */
export class AggregateCounter extends BaseCounter implements Serializable<AggregateCounter> {

  public counts: AggregateCounterValue[];
  public resolutionType = AggregateCounterResolutionType.MINUTE;

  constructor(
    public name?: string
  ) {
    super(name);
  }

  /**
   * For a given JSON data object, this method
   * will populate the corresponding AggregateCounter object with
   * the provided properties.
   *
   * @param input JSON input data
   */
  public deserialize(input) {
    super.deserialize(input);
    this.counts = [];
    for (const key of Object.keys(input.counts)) {
      const fvc = new AggregateCounterValue(DateTime.fromISO(key), input.counts[key]);
      this.counts.push(fvc);
    }
    return this;
  }

  /**
   * Return the values of the {@link AggregateCounterValue} array.
   */
  public getValues(): number[] {
    return this.counts.map(value => value.value);
  }
}
