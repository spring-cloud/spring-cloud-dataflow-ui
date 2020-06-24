import { createReducer, createSelector, on } from '@ngrx/store';
import * as SecurityActions from './security.action';
import * as fromRoot from '../../reducers/reducer';

export const securityFeatureKey = 'security';

export interface SecurityState {
  enabled: boolean;
  authenticated: boolean;
  username: string;
  roles: string[];
}

export interface State extends fromRoot.State {
  [securityFeatureKey]: SecurityState;
}

export const getSecurity = (state: State) => {
  return state[securityFeatureKey];
};

export const getEnabled = (state: State) => {
  return state[securityFeatureKey].enabled;
};

export const getAuthenticated = (state: State) => {
  return state[securityFeatureKey].authenticated;
};

export const getUsername = (state: State) => {
  return state[securityFeatureKey].username;
};

export const getRoles = (state: State) => {
  return state[securityFeatureKey].roles;
};

export const getShouldProtect = createSelector(
  getEnabled,
  getAuthenticated,
  (enabled, authenticated) => !enabled ? false : (enabled && !authenticated)
);

export const initialState: SecurityState = {
  enabled: true,
  authenticated: false,
  username: undefined,
  roles: []
};

export const reducer = createReducer(
  initialState,
  on(SecurityActions.loaded, (state, props) => ({
    enabled: props.enabled,
    authenticated: props.authenticated,
    username: props.username,
    roles: props.roles })),
  on(SecurityActions.logout, state => ({
    enabled: state.enabled,
    authenticated: false,
    username: undefined,
    roles: [] }))
);
