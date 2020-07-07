import { createAction, props } from '@ngrx/store';
import { Setting } from '../../shared/model/setting';

export const loaded = createAction(
  '[Settings] loaded',
  props<{ settings: Setting[] }>()
);

export const update = createAction(
  '[Setting] update',
  props<{ setting: Setting }>()
);

export const updateError = createAction(
  '[Setting] update error',
  props<{ setting: Setting }>()
);

export const updateOk = createAction(
  '[Setting] update ok',
  props<{ setting: Setting }>()
);
