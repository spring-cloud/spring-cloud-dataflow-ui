import { Serializable } from '../serialization/serializable.model';
import { Dependency } from './dependency.model';

/**
 * Provides version information about core libraries used.
 *
 * @author Gunnar Hillert
 */
export class VersionInfo implements Serializable<VersionInfo> {

  public implementation: Dependency;
  public core: Dependency;
  public dashboard: Dependency;
  public shell: Dependency;

  public deserialize(input) {
    this.implementation = new Dependency().deserialize(input.implementation);
    this.core = new Dependency().deserialize(input.core);
    this.dashboard = new Dependency().deserialize(input.dashboard);
    this.shell = new Dependency().deserialize(input.shell);
    return this;
  }
}
