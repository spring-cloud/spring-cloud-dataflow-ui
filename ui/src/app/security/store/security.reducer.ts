import {createReducer, createSelector, on} from '@ngrx/store';
import * as SecurityActions from './security.action';
import * as fromRoot from '../../reducers/reducer';

export const securityFeatureKey = 'security';

export interface SecurityState {
  enabled: boolean;
  authenticated: boolean;
  username: string;
  roles: string[];
  clientRegistrations?: string[];
}

export interface State extends fromRoot.State {
  [securityFeatureKey]: SecurityState;
}

export const getSecurity = (state: State): any => state[securityFeatureKey];

export const getEnabled = (state: State): boolean => state[securityFeatureKey].enabled;

export const getAuthenticated = (state: State): boolean => state[securityFeatureKey].authenticated;

export const getUsername = (state: State): string => state[securityFeatureKey].username;

export const getClientRegistrations = (state: State): string[] => state[securityFeatureKey].clientRegistrations;

export const getRoles = (state: State): string[] => state[securityFeatureKey].roles;

export const getShouldProtect = createSelector(getEnabled, getAuthenticated, (enabled, authenticated) =>
  !enabled ? false : enabled && !authenticated
);

export const isOAuth2 = createSelector(getClientRegistrations, clientRegistrations => clientRegistrations.length > 0);

export const initialState: SecurityState = {
  enabled: true,
  authenticated: false,
  username: undefined,
  roles: [],
  clientRegistrations: []
};

export const reducer = createReducer(
  initialState,
  on(SecurityActions.loaded, (state, props) => ({
    enabled: props.enabled,
    authenticated: props.authenticated,
    username: props.username,
    roles: props.roles,
    clientRegistrations: props.clientRegistrations
  })),
  on(SecurityActions.logout, (state, props) => ({
    enabled: state.enabled,
    authenticated: false,
    username: undefined,
    roles: props.roles,
    clientRegistrations: props.clientRegistrations
  }))
);
