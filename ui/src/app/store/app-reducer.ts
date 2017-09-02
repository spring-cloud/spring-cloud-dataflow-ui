import { ActionReducerMap } from '@ngrx/store';

/**
 * Top level state interface is just a map of keys to inner state types
 * and optional root app state i.e. navigation and toasts(not yet implemented).
 */
export interface AppState {
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const reducers: ActionReducerMap<AppState> = {
};
