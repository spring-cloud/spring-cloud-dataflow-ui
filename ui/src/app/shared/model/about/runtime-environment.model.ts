import { Serializable } from '../serialization/serializable.model';
import { RuntimeEnvironmentDetails } from './runtime-environment-details.model';

/**
 * Provides information about the runtime environment.
 *
 * @author Gunnar Hillert
 * @author Ilayaperumal Gopinathan
 */
export class RuntimeEnvironment implements Serializable<RuntimeEnvironment> {

  public appDeployer: RuntimeEnvironmentDetails;
  public taskLaunchers: Array<RuntimeEnvironmentDetails>;

  public deserialize(input) {
    this.appDeployer = new RuntimeEnvironmentDetails().deserialize(input.appDeployer);
    this.taskLaunchers = new Array<RuntimeEnvironmentDetails>();
    for (const taskLauncher of input.taskLaunchers) {
      this.taskLaunchers.push(new RuntimeEnvironmentDetails().deserialize(taskLauncher));
    }
    return this;
  }
}
