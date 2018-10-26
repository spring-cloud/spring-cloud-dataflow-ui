import { DateTime } from 'luxon';

/**
 * Aggregate Counter Value model object for the Analytics module.
 *
 * @author Gunnar Hillert
 */
export class AggregateCounterValue {
  constructor(
    public key: DateTime,
    public value: number
  ) {}
}
