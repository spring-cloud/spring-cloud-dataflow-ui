import { Serializable } from '../serialization/serializable.model';
import { RuntimeEnvironmentDetails } from './runtime-environment-details.model';

/**
 * Provides information about the runtime environment.
 *
 * @author Gunnar Hillert
 */
export class RuntimeEnvironment implements Serializable<RuntimeEnvironment> {

  public appDeployer: RuntimeEnvironmentDetails;
  public taskLauncher: RuntimeEnvironmentDetails;

  public deserialize(input) {
    this.appDeployer = new RuntimeEnvironmentDetails().deserialize(input.appDeployer);
    this.taskLauncher = new RuntimeEnvironmentDetails().deserialize(input.taskLauncher);
    return this;
  }
}
