import { Serializable } from '../../shared/model';
import { BaseCounter } from './base-counter.model';

/**
 * Aggregate Counter model object for the Analytics module.
 *
 * @author Gunnar Hillert
 */
export class AggregateCounter extends BaseCounter implements Serializable<AggregateCounter> {

  public counts: [Date, number];

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
    this.counts = input.counts;
    return this;
  }

}
