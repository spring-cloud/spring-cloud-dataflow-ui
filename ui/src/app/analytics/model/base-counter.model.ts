import { Serializable } from '../../shared/model';

/**
 * Counter model object for the Analytics module.
 *
 * @author Gunnar Hillert
 */
export abstract class BaseCounter implements Serializable<BaseCounter> {
  constructor(
    public name?: string
  ) {}

  /**
   * For a given JSON data object, this method
   * will populate the corresponding BaseCounter object with
   * the provided properties.
   *
   * @param input JSON input data
   */
  public deserialize(input) {
    this.name = input.name;
    return this;
  }
}
