import {createAction, props} from '@ngrx/store';

export const loaded = createAction(
  '[Security] Loaded',
  props<{enabled: boolean; authenticated: boolean; username: string; roles: string[]; clientRegistrations: string[]}>()
);
export const logout = createAction(
  '[Security] Logout',
  props<{enabled: boolean; authenticated: boolean; username: string; roles: string[]; clientRegistrations: string[]}>()
);
export const unauthorised = createAction(
  '[Security] Unauthorised',
  props<{enabled: boolean; authenticated: boolean; username: string; roles: string[]; clientRegistrations: string[]}>()
);
