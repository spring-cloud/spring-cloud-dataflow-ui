import { createAction, props } from '@ngrx/store';
import { AboutState } from './about.reducer';

export const loaded = createAction('[About] Loaded', props<AboutState>());
