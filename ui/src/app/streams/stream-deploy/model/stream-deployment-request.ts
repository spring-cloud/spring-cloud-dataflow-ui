/**
 * Represents the stream deployment request that is sent from the deployment controller to the deployment service.
 * @author Glenn Renfro
 */

export class StreamDeploymentRequest {
  public name: String;
  public properties: {};

  constructor(name: String,
              properties: {}) {
    this.name = name;
    this.properties = properties;
  }
}
