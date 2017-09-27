import { Serializable } from '../../shared/model';
import { BaseCounter } from './base-counter.model';
import { FieldValueCounterValue } from './field-value-counter-value.model';
/**
 * Field-Value Counter model object for the Analytics module.
 *
 * @author Gunnar Hillert
 */
export class FieldValueCounter extends BaseCounter implements Serializable<FieldValueCounter> {

  public values: FieldValueCounterValue[];

  constructor(
    public name?: string
  ) {
    super(name);
  }

  /**
   * For a given JSON data object, this method
   * will populate the corresponding FieldValueCounter object with
   * the provided properties.
   *
   * @param input JSON input data
   */
  public deserialize(input) {
    super.deserialize(input);

    this.values = [];
    for (const key of Object.keys(input.values)) {
      const fvc = new FieldValueCounterValue(key, input.values[key]);
      this.values.push(fvc);
    }
    return this;
  }

}

