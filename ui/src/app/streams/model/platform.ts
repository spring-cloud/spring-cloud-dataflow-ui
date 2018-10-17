/**
 * Represents a Platform.
 *
 * @author Damien Vitrac
 */
export class Platform {

  public name: String;
  public type: String;
  public description: String;

  constructor(name: String = '', type: String = '', description: String = '') {
    this.name = name;
    this.type = type;
    this.description = description;
  }

  /**
   * Create a Platform from a json
   * @param inputJson
   * @returns {Platform}
   */
  static fromJSON(inputJson): Platform {
    return new Platform(inputJson.name, inputJson.type, inputJson.description);
  }

  /**
   * Create an Array<Platform> from a json
   * @param input
   * @returns {Array<Platform>}
   */
  static listFromJSON(input): Array<Platform> {
    if (input && Array.isArray(input)) {
      return input.map(Platform.fromJSON);
    }
    return [];
  }

}
