import { AboutState, DependencyState, RuntimeEnvironmentState } from './about.reducer';
import set from 'lodash.set';
import get from 'lodash.get';

const parseDependency = (input): DependencyState => {
  return {
    name: input.name,
    version: input.version,
    url: input.url,
    checksumSha1: input.checksumSha1,
    checksumSha256: input.checksumSha256
  };
};

const parsePlatformSpecificInfo = (input) => {
  if (input) {
    const map = {};
    Object.keys(input).forEach(key => {
      set(map, key, input[key]);
    });
    return map;
  }
  return null;
};

const parseRuntimeEnvironment = (input): RuntimeEnvironmentState => {
  return {
    deployerImplementationVersion: input.deployerImplementationVersion,
    deployerName: input.deployerName,
    deployerSpiVersion: input.deployerSpiVersion,
    javaVersion: input.javaVersion,
    platformApiVersion: input.platformApiVersion,
    platformClientVersion: input.platformClientVersion,
    platformHostVersion: input.platformHostVersion,
    platformSpecificInfo: parsePlatformSpecificInfo(input.platformSpecificInfo),
    platformType: input.platformType,
    springBootVersion: input.springBootVersion,
    springVersion: input.springVersion
  };
};

export const parse = (input): AboutState => {
  return {
    versions: {
      implementation: parseDependency(input.versionInfo.implementation),
      core: parseDependency(input.versionInfo.core),
      dashboard: parseDependency(input.versionInfo.dashboard),
      shell: parseDependency(input.versionInfo.shell),
    },
    features: {
      streams: get(input, 'featureInfo.streamsEnabled', false),
      tasks: get(input, 'featureInfo.tasksEnabled', false),
      schedules: get(input, 'featureInfo.schedulesEnabled', false),
      monitoringDashboardType: get(input, 'featureInfo.monitoringDashboardType', 'NONE'),
    },
    runtimeEnvironment: {
      appDeployer: parseRuntimeEnvironment(input.runtimeEnvironment.appDeployer),
      taskLaunchers: input.runtimeEnvironment.taskLaunchers.map(parseRuntimeEnvironment)
    },
    monitoringDashboardInfo: {
      url: input.monitoringDashboardInfo?.url || '',
      source: input.monitoringDashboardInfo?.source || '',
      refreshInterval: +input.monitoringDashboardInfo?.refreshInterval || 10
    },
    security: {
      isAuthentication: input.securityInfo.authenticationEnabled,
      isAuthenticated: input.securityInfo.authenticated,
      username: input.securityInfo.username,
      roles: input.securityInfo.roles as string[]
    }
  };
};
