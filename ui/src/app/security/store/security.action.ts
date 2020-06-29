import { createAction, props } from '@ngrx/store';

export const loaded = createAction(
    '[Security] Loaded',
    props<{ enabled: boolean, authenticated: boolean, username: string, roles: string[] }>()
);
export const logout = createAction('[Security] Logout');
export const unauthorised = createAction('[Security] Unauthorised');
