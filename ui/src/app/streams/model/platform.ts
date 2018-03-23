import { Serializable } from '../../shared/model/serialization/serializable.model';

/**
 * Represents a Platform.
 *
 * @author Damien Vitrac
 */
export class Platform implements Serializable<Platform> {

  public name: String;
  public type: String;
  public description: String;

  constructor(name: String = '', type: String = '', description: String = '') {
    this.name = name;
    this.type = type;
    this.description = description;
  }

  deserialize(inputJson) {
    this.name = inputJson.name;
    this.type = inputJson.type;
    this.description = inputJson.description;
    return this;
  }

}
