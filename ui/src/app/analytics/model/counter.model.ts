import { Serializable } from '../../shared/model';

/**
 * Counter model object for the Analytics module.
 *
 * @author Gunnar Hillert
 */
export class Counter implements Serializable<Counter> {
  public rates: number[] = [];

  constructor(
    public name?: string,
    public value?: number
  ) { }

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
    this.name = input.name;
    this.value = input.value;
    return this;
  }
}
