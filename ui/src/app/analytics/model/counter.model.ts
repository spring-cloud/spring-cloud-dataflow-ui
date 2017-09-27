import { Serializable } from '../../shared/model';
import { BaseCounter } from './base-counter.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
/**
 * Counter model object for the Analytics module.
 *
 * @author Gunnar Hillert
 */
export class Counter extends BaseCounter implements Serializable<Counter> {
  public _rates: number[] = [];
  public ratesObservable = new BehaviorSubject(this._rates);

  constructor(
    name?: string,
    public value?: number
  ) {
    super(name);
   }

  set rates(rates: number[]) {
    this._rates = rates;
    this.ratesObservable.next(this._rates);
  }
  get rates() {
    return this._rates;
  }

  get latestRate(): number {
    return this.rates.length ? this.rates[this.rates.length - 1] : undefined;
  }

  /**
   * For a given JSON data object, this method
   * will populate the corresponding Counter object with
   * the provided properties.
   *
   * @param input JSON input data
   */
  public deserialize(input) {
    super.deserialize(input);
    this.value = input.value;
    return this;
  }
}
