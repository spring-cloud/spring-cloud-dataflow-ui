import { createAction, props } from '@ngrx/store';
import { SettingModel } from '../../shared/model/setting.model';

export const loaded = createAction(
  '[Settings] loaded',
  props<{ settings: SettingModel[] }>()
);

export const update = createAction(
  '[Setting] update',
  props<{ setting: SettingModel }>()
);

export const updateError = createAction(
  '[Setting] update error',
  props<{ setting: SettingModel }>()
);

export const updateOk = createAction(
  '[Setting] update ok',
  props<{ setting: SettingModel }>()
);
