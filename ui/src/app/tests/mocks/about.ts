import { Observable, of } from 'rxjs';
import { FeatureInfo } from '../../shared/model/about/feature-info.model';
import { AboutInfo } from '../../shared/model/about/about-info.model';
import { RuntimeEnvironment } from '../../shared/model/about/runtime-environment.model';
import { RuntimeEnvironmentDetails } from '../../shared/model/about/runtime-environment-details.model';
import { SecurityInfo } from '../../shared/model/about/security-info.model';
import { VersionInfo } from '../../shared/model/about/version-info.model';
import { Dependency } from '../../shared/model/about/dependency.model';

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
 * @author Gunnar Hillert
 */

export class MockAboutService {

  private _isAboutInfoAvailable = true;
  private _isFeatureEnabled = true;
  private _isPlatformSpecificInformationAvailable = true;

  get isAboutInfoAvailable() {
    return this._isAboutInfoAvailable;
  }

  set isAboutInfoAvailable(params: boolean) {
    this._isAboutInfoAvailable = params;
  }

  get isFeatureEnabled(): boolean {
    return this._isFeatureEnabled;
  }

  set featureEnabled(param: boolean) {
    this._isFeatureEnabled = param;
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

  private getRuntimeEnvironment() {

    const appDeployer = new RuntimeEnvironmentDetails();

    appDeployer.deployerImplementationVersion = 'DEP_IMP_VER';
    appDeployer.deployerName = 'FOODeployer';
    appDeployer.deployerSpiVersion = 'DEP_SPI_VER';
    appDeployer.javaVersion = 'JAV_VER';
    appDeployer.platformApiVersion = 'PLA_API_VER';
    appDeployer.platformClientVersion = 'PLA_CLI_VER';
    appDeployer.platformHostVersion = 'PLA_HOS_VER';
    appDeployer.springVersion = 'SPR_VER';
    appDeployer.platformType = 'FOO_PLATFORM';
    appDeployer.springBootVersion = 'SPR_BOO_VER';
    appDeployer.platformSpecificInfo = new Map([['key1', 'value1'], ['key2', 'value2']]);

    const taskLauncher = new RuntimeEnvironmentDetails();

    taskLauncher.deployerImplementationVersion = 'DEP_IMP_VER_TASK';
    taskLauncher.deployerName = 'FOODeployer_TASK';
    taskLauncher.deployerSpiVersion = 'DEP_SPI_VER_TASK';
    taskLauncher.javaVersion = 'JAV_VER_TASK';
    taskLauncher.platformApiVersion = 'PLA_API_VER_TASK';
    taskLauncher.platformClientVersion = 'PLA_CLI_VER_TASK';
    taskLauncher.platformHostVersion = 'PLA_HOS_VER_TASK';
    taskLauncher.springVersion = 'SPR_VER_TASK';
    taskLauncher.platformType = 'FOO_PLATFORM_TASK';
    taskLauncher.springBootVersion = 'SPR_BOO_VER_TASK';
    taskLauncher.platformSpecificInfo = new Map([['key1_task', 'value1_task'], ['key2_task', 'value2_task']]);

    const runtimeEnvironment = new RuntimeEnvironment();
    runtimeEnvironment.appDeployer = appDeployer;
    runtimeEnvironment.taskLaunchers = [taskLauncher];
    return runtimeEnvironment;
  }

  private getSecurityInfo() {
    const securityInfo = new SecurityInfo();
    securityInfo.isAuthenticationEnabled = true;
    securityInfo.isAuthenticated = true;
    securityInfo.roles = ['base_role'];
    securityInfo.username = 'joe';
    return securityInfo;
  }

  private getFeatureInfo() {
    const featureInfo = new FeatureInfo();
    featureInfo.streamsEnabled = true;
    featureInfo.tasksEnabled = true;
    featureInfo.schedulesEnabled = true;
    featureInfo.grafanaEnabled = true;
    return featureInfo;
  }

  private getVersionInfo() {

    const core = new Dependency();

    core.name = 'BAZ';
    core.version = 'BOO';
    core.url = '';

    const dashboard = new Dependency();

    dashboard.name = 'QUE';
    dashboard.version = 'QIX';
    dashboard.url = '';

    const implementation = new Dependency();

    implementation.name = 'FOO';
    implementation.version = 'BAR';
    implementation.url = '';

    const shell = new Dependency();

    shell.name = 'QUX';
    shell.version = 'QUUX';
    shell.checksumSha1 = 'checksumSample1';
    shell.checksumSha256 = 'checksumSample256';
    shell.url = '';

    const versionInfo = new VersionInfo();

    versionInfo.core = core;
    versionInfo.dashboard = dashboard;
    versionInfo.implementation = implementation;
    versionInfo.shell = shell;

    return versionInfo;
  }

  private getDataflowVersionInfo() {
    const dataflowVersionInfo = new AboutInfo();
    dataflowVersionInfo.featureInfo = this.getFeatureInfo();
    dataflowVersionInfo.runtimeEnvironment = this.getRuntimeEnvironment();
    dataflowVersionInfo.securityInfo = this.getSecurityInfo();
    dataflowVersionInfo.versionInfo = this.getVersionInfo();
    return dataflowVersionInfo;
  }

  getAboutInfo(): Observable<AboutInfo> {
    let dataFlowVersion = null;
    if (this.isAboutInfoAvailable) {
      dataFlowVersion = this.getDataflowVersionInfo();
    }
    return of(dataFlowVersion);
  }

  getDetails(): Observable<AboutInfo> {
    let dataFlowVersion: AboutInfo = null;
    if (this._isAboutInfoAvailable) {
      dataFlowVersion = this.getDataflowVersionInfo();
      if (!this._isFeatureEnabled) {
        dataFlowVersion.securityInfo.isAuthenticationEnabled = false;
        dataFlowVersion.securityInfo.isAuthenticated = false;
        dataFlowVersion.featureInfo.streamsEnabled = false;
        dataFlowVersion.featureInfo.tasksEnabled = false;
        dataFlowVersion.featureInfo.schedulesEnabled = false;
        dataFlowVersion.featureInfo.grafanaEnabled = false;
      }
      if (!this._isPlatformSpecificInformationAvailable) {
        for (const taskLauncher of dataFlowVersion.runtimeEnvironment.taskLaunchers) {
          taskLauncher.platformSpecificInfo = new Map();
        }
        dataFlowVersion.runtimeEnvironment.appDeployer.platformSpecificInfo = new Map();
      }
    }
    return of(dataFlowVersion);
  }
}


