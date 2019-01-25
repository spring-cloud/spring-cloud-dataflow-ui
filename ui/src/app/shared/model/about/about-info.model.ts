import { FeatureInfo } from './feature-info.model';
import { VersionInfo } from './version-info.model';
import { SecurityInfo } from './security-info.model';
import { RuntimeEnvironment } from './runtime-environment.model';
import { Serializable } from '../serialization/serializable.model';
import { GrafanaInfo } from './grafana.model';

/**
 * Represents meta-information about Spring Cloud Data Flow.
 *
 * The information herein is used by the {@link AboutComponent},
 * {@link RolesDirective} and the {@link AppComponent}.
 *
 * @author Gunnar Hillert
 */
export class AboutInfo implements Serializable<AboutInfo> {
    public versionInfo = new VersionInfo();
    public featureInfo = new FeatureInfo();
    public securityInfo = new SecurityInfo();
    public runtimeEnvironment = new RuntimeEnvironment();
    public grafanaInfo = new GrafanaInfo();

    constructor() {
    }

    public deserialize(input) {
      this.versionInfo = new VersionInfo().deserialize(input.versionInfo);
      this.featureInfo = new FeatureInfo().deserialize(input.featureInfo);
      this.securityInfo = new SecurityInfo().deserialize(input.securityInfo);
      this.runtimeEnvironment = new RuntimeEnvironment().deserialize(input.runtimeEnvironment);
      this.grafanaInfo = new GrafanaInfo().deserialize(input.grafanaInfo);
      return this;
    }
  }
