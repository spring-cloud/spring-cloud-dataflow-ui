/**
 * Represents a deployment history of a stream definition
 *
 * @author Damien Vitrac
 */
export class StreamHistory {

  public stream: string;

  public version: number;

  public firstDeployed: Date;

  public statusCode: string;

  public description: string;

  public platformName: string;

  constructor(stream: string, version: number, firstDeployed: Date, statusCode: string, description: string, platformName: string) {
    this.stream = stream;
    this.version = version;
    this.firstDeployed = firstDeployed;
    this.statusCode = statusCode;
    this.description = description;
    this.platformName = platformName;
  }

  static fromJSON(input) {
    let firstDeployed;
    let statusCode;
    let description;
    if (input['info']) {
      description = input.info.description;
      firstDeployed = input.info.firstDeployed;
      if (input.info['status'] && input.info.status['statusCode']) {
        statusCode = input.info.status.statusCode;
      }
    }
    return new StreamHistory(input.name, input.version, firstDeployed, statusCode, description, input.platformName);
  }

  /**
   * Create an Array<StreamHistory> from a json
   * @param input
   * @returns {Array<StreamHistory>}
   */
  static listFromJSON(input): Array<StreamHistory> {
    if (input && Array.isArray(input)) {
      return input.map(StreamHistory.fromJSON);
    }
    return [];
  }

}
