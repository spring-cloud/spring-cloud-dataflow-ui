import { Observable } from 'rxjs/Observable';
import { AppInfo } from '../../tasks/model/app-info';
import { Page} from '../../shared/model/page';
import { AppRegistration } from '../../shared/model/app-registration.model';
import { TaskExecution } from '../../tasks/model/task-execution';
import { FeatureInfo } from '../../shared/model/about/feature-info.model';

/**
 * Mock for AboutService.
 *
 * Create a mocked about service:
 * const aboutService = new MockAboutService();
 * TestBed.configureTestingModule({
 *   providers: [
 *     { provide: AboutService, useValue: aboutService }
 *   ]
 * }).compileComponents();
 *
 * @author Glenn Renfro
 */

export class SecurityInfo {
  public authenticationEnabled = true;
  public authorizationEnabled = true;
  public formLogin = true;
  public authenticated = true;
  public roles = 'base_role';
  public username = 'joe';
}

export class Dashboard {
  public name = 'QUE';
  public version = 'QIX';
  public url = '';
}

export class Shell {
  public name = 'QUX';
  public version = 'QUUX';
  public checksumSha1 = 'checksumSample1';
  public checksumSha256 = 'checksumSample256';
  public url = '';
}

export class Implementation {
  public name = 'FOO';
  public version = 'BAR';
  public url = '';
}

export class Core {
  public name = 'BAZ';
  public version = 'BOO';
  public url = '';
}

export class VersionInfo {
  public implementation = new Implementation();
  public core = new Core;
  public dashboard = new Dashboard();
  public shell = new Shell();
}

export class AppDeployer {
  public deployerImplementationVersion = 'DEP_IMP_VER';
  public deployerName = 'FOODeployer';
  public deployerSpiVersion = 'DEP_SPI_VER';
  public javaVersion = 'JAV_VER';
  public platformApiVersion = 'PLA_API_VER';
  public platformClientVersion = 'PLA_CLI_VER';
  public platformHostVersion = 'PLA_HOS_VER';
  public springVersion = 'SPR_VER';
  public platformType = 'FOO_PLATFORM';
  public springBootVersion = 'SPR_BOO_VER';
  public platformSpecificInfo = {'key1': 'value1', 'key2': 'value2'};
}

export class TaskLauncher {
  public deployerImplementationVersion = 'DEP_IMP_VER_TASK';
  public deployerName = 'FOODeployer_TASK';
  public deployerSpiVersion = 'DEP_SPI_VER_TASK';
  public javaVersion = 'JAV_VER_TASK';
  public platformApiVersion = 'PLA_API_VER_TASK';
  public platformClientVersion = 'PLA_CLI_VER_TASK';
  public platformHostVersion = 'PLA_HOS_VER_TASK';
  public springVersion = 'SPR_VER_TASK';
  public platformType = 'FOO_PLATFORM_TASK';
  public springBootVersion = 'SPR_BOO_VER_TASK';
  public platformSpecificInfo = {'key1_task': 'value1_task', 'key2_task': 'value2_task'};

}

export class RuntimeEnvironment {
  public appDeployer = new AppDeployer();
  public taskLauncher = new TaskLauncher();
}

export class DataflowVersionInfo {
  public versionInfo = new VersionInfo();
  public featureInfo = new FeatureInfo();
  public securityInfo = new SecurityInfo();
  public runtimeEnvironment = new RuntimeEnvironment();

  constructor() {
    this.featureInfo.analyticsEnabled = true;
    this.featureInfo.streamsEnabled = true;
    this.featureInfo.tasksEnabled = true;
    this.featureInfo.skipperEnabled = true;
  }
}

export class MockAboutService {

  private _isAboutInfoAvailable = true;
  private _isFeatureEnabled = true;
  private _isPlatformSpecificInformationAvailable = true;

  get isAboutInfoAvailable() {
    return this._isAboutInfoAvailable;
  }

  set isAboutInfoAvailable(params: any) {
    this._isAboutInfoAvailable = params;
  }

  get isFeatureEnabled() {
    return this._isFeatureEnabled;
  }

  set isFeatureEnabled(params: any) {
    this._isFeatureEnabled = params;
  }

  get isPlatformSpecificInformationAvailable(): boolean {
    return this._isPlatformSpecificInformationAvailable;
  }

  set isPlatformSpecificInformationAvailable(value: boolean) {
    this._isPlatformSpecificInformationAvailable = value;
  }

  get featureInfo(): FeatureInfo {
    return new FeatureInfo();
  }

  getAboutInfo(): Observable<DataflowVersionInfo> {
    let dataFlowVersion = null;
    if (this.isAboutInfoAvailable) {
      dataFlowVersion = new DataflowVersionInfo();
    }
    return Observable.of(dataFlowVersion);
  }

  getDetails(): Observable<DataflowVersionInfo> {
    let dataFlowVersion = null;
    if (this.isAboutInfoAvailable) {
      dataFlowVersion = new DataflowVersionInfo();
      if (!this.isFeatureEnabled) {
        dataFlowVersion.securityInfo.authenticationEnabled = false;
        dataFlowVersion.securityInfo.authorizationEnabled = false;
        dataFlowVersion.securityInfo.formLogin = false;
        dataFlowVersion.securityInfo.authenticated = false;
        dataFlowVersion.featureInfo.analyticsEnabled = false;
        dataFlowVersion.featureInfo.streamsEnabled = false;
        dataFlowVersion.featureInfo.tasksEnabled = false;
        dataFlowVersion.featureInfo.skipperEnabled = false;
      }
      if (!this.isPlatformSpecificInformationAvailable) {
        dataFlowVersion.runtimeEnvironment.taskLauncher.platformSpecificInfo = {};
        dataFlowVersion.runtimeEnvironment.appDeployer.platformSpecificInfo = {};
      }
    }
    return Observable.of(dataFlowVersion);
  }
}


