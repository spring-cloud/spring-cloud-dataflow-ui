export class About {
  versions: {
    implementation: Dependency,
    core: Dependency,
    dashboard: Dependency,
    shell: Dependency
  };
  features = {
    streams: false,
    tasks: false,
    schedules: false,
    grafana: false
  };
  runtimeEnvironment: {
    appDeployer: RuntimeEnvironment,
    taskLaunchers: Array<RuntimeEnvironment>
  };
  grafana = {
    url: '',
    token: '',
    refreshInterval: 10
  };
  security = {
    isAuthentication: true,
    isAuthenticated: false,
    username: '',
    roles: []
  };

  static parse(input) {
    const about = new About();
    about.versions = {
      implementation: Dependency.parse(input.versionInfo.implementation),
      core: Dependency.parse(input.versionInfo.core),
      dashboard: Dependency.parse(input.versionInfo.dashboard),
      shell: Dependency.parse(input.versionInfo.shell),
    };
    about.features = {
      streams: input.featureInfo.streamsEnabled,
      tasks: input.featureInfo.tasksEnabled,
      schedules: input.featureInfo.schedulesEnabled,
      grafana: input.featureInfo.grafanaEnabled
    };
    about.runtimeEnvironment = {
      appDeployer: RuntimeEnvironment.parse(input.runtimeEnvironment.appDeployer),
      taskLaunchers: input.runtimeEnvironment.taskLaunchers.map(RuntimeEnvironment.parse)
    };
    about.grafana = {
      url: input.grafanaInfo?.url || '',
      token: input.grafanaInfo?.token || '',
      refreshInterval: +input.grafanaInfo?.refreshInterval || 10
    };
    about.security = {
      isAuthentication: input.securityInfo.authenticationEnabled,
      isAuthenticated: input.securityInfo.authenticated,
      username: input.securityInfo.username,
      roles: input.securityInfo.roles as string[]
    };
    return about;
  }
}

export class Dependency {
  name: string;
  version: string;
  url: string;
  checksumSha1: string;
  checksumSha256: string;

  static parse(input) {
    const dependency = new Dependency();
    dependency.name = input.name;
    dependency.version = input.version;
    dependency.url = input.url;
    dependency.checksumSha1 = input.checksumSha1;
    dependency.checksumSha256 = input.checksumSha256;
    return dependency;
  }
}

export class RuntimeEnvironment {
  deployerImplementationVersion: string;
  deployerName: string;
  deployerSpiVersion: string;
  javaVersion: string;
  platformApiVersion: string;
  platformClientVersion: string;
  platformHostVersion: string;
  platformSpecificInfo = new Map<string, string>();
  platformType: string;
  springBootVersion: string;
  springVersion: string;

  static parse(input) {
    const runtimeEnvironment = new RuntimeEnvironment();
    runtimeEnvironment.deployerImplementationVersion = input.deployerImplementationVersion;
    runtimeEnvironment.deployerName = input.deployerName;
    runtimeEnvironment.deployerSpiVersion = input.deployerSpiVersion;
    runtimeEnvironment.javaVersion = input.javaVersion;
    runtimeEnvironment.platformApiVersion = input.platformApiVersion;
    runtimeEnvironment.platformClientVersion = input.platformClientVersion;
    runtimeEnvironment.platformHostVersion = input.platformHostVersion;
    runtimeEnvironment.platformSpecificInfo = RuntimeEnvironment.parsePlatformSpecificInfo(input.platformSpecificInfo);
    runtimeEnvironment.platformType = input.platformType;
    runtimeEnvironment.springBootVersion = input.springBootVersion;
    runtimeEnvironment.springVersion = input.springVersion;
    return runtimeEnvironment;
  }

  private static parsePlatformSpecificInfo(json: any): Map<string, string> {
    if (json) {
      const map = new Map<string, string>();
      Object.keys(json).forEach(key => {
        map.set(key, json[key]);
      });
      return map;
    }
    return null;
  }

}
