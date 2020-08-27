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
    grafana: boolean,
    wavefront: boolean,
  };
  runtimeEnvironment: {
    appDeployer: RuntimeEnvironmentState,
    taskLaunchers: Array<RuntimeEnvironmentState>
  };
  grafana: {
    url: string,
    token: string,
    refreshInterval: number
  };
  wavefront: {
    url: string,
    token: string,
    source: string,
    refreshInterval: number
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

export const getGrafana = (state: State) => {
  return state[aboutFeatureKey].grafana;
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
    grafana: false,
    wavefront: false
  },
  runtimeEnvironment: {
    appDeployer: null,
    taskLaunchers: []
  },
  grafana: {
    url: '',
    token: '',
    refreshInterval: 10
  },
  wavefront: {
    url: '',
    token: '',
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
  on(AboutActions.loaded, (state, { versions, features, runtimeEnvironment, grafana, security }) => ({
    versions,
    features,
    runtimeEnvironment,
    grafana,
    security,
  }))
);
