import * as fromRoot from '../../reducers/reducer';
import * as AboutActions from './about.action';
import { createReducer, on } from '@ngrx/store';

export const aboutFeatureKey = 'about';

export interface DependencyState {
  name: string;
  version: string;
  url: string;
  checksumSha1: string;
  checksumSha256: string;

}

export interface RuntimeEnvironmentState {
  deployerImplementationVersion: string;
  deployerName: string;
  deployerSpiVersion: string;
  javaVersion: string;
  platformApiVersion: string;
  platformClientVersion: string;
  platformHostVersion: string;
  platformSpecificInfo: object;
  platformType: string;
  springBootVersion: string;
  springVersion: string;
}

export interface AboutState {
  versions: {
    implementation: DependencyState,
    core: DependencyState,
    dashboard: DependencyState,
    shell: DependencyState
  };
  features: {
    streams: boolean,
    tasks: boolean,
    schedules: boolean,
    monitoringDashboardType: string
  };
  runtimeEnvironment: {
    appDeployer: RuntimeEnvironmentState,
    taskLaunchers: Array<RuntimeEnvironmentState>
  };
  'monitoringDashboardInfo': {
    url?: string,
    refreshInterval?: number,
    dashboardType?: string,
    source?: string
  };
  security: {
    isAuthentication: boolean,
    isAuthenticated: boolean,
    username: string,
    roles: Array<string>
  };
}

export interface State extends fromRoot.State {
  [aboutFeatureKey]: AboutState;
}

export const getVersions = (state: State) => {
  return state[aboutFeatureKey].versions;
};

export const getFeatures = (state: State) => {
  return state[aboutFeatureKey].features;
};

export const getRuntimeEnvironment = (state: State) => {
  return state[aboutFeatureKey].runtimeEnvironment;
};

export const getAbout = (state: State) => {
  return state[aboutFeatureKey];
};

export const getMonitoring = (state: State) => {
  return state[aboutFeatureKey].monitoringDashboardInfo;
};

export const getSecurity = (state: State) => {
  return state[aboutFeatureKey].security;
};

export const initialState: AboutState = {
  versions: {
    implementation: null,
    core: null,
    dashboard: null,
    shell: null
  },
  features: {
    streams: false,
    tasks: false,
    schedules: false,
    monitoringDashboardType: 'NONE'
  },
  runtimeEnvironment: {
    appDeployer: null,
    taskLaunchers: []
  },
  monitoringDashboardInfo: {
    url: '',
    source: '',
    refreshInterval: 10
  },
  security: {
    isAuthentication: true,
    isAuthenticated: false,
    username: '',
    roles: []
  }
};

export const reducer = createReducer(
  initialState,
  on(AboutActions.loaded, (state, { versions, features, runtimeEnvironment, monitoringDashboardInfo, security }) => ({
    versions,
    features,
    runtimeEnvironment,
    monitoringDashboardInfo,
    security,
  }))
);
