import { Moment } from 'moment';

/**
 * Aggregate Counter Value model object for the Analytics module.
 *
 * @author Gunnar Hillert
 */
export class AggregateCounterValue {
  constructor(
    public key: Moment,
    public value: number
  ) {}
}
