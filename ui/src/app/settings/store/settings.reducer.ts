import { createReducer, on } from '@ngrx/store';
import * as SettingsActions from './settings.action';
import * as fromRoot from '../../reducers/reducer';
import { SettingModel } from '../../shared/model/setting.model';

export const settingsFeatureKey = 'settings';
export const themeActiveKey = 'theme-active';

export interface SettingsState {
  settings: SettingModel[];
}

export interface State extends fromRoot.State {
  [settingsFeatureKey]: SettingsState;
}

export const getThemeActiveSetting = (state: State): string => {
  return getSetting(state.settings.settings, themeActiveKey);
};

export const getSetting = (settings: SettingModel[], name: string) => {
  return settings.find(s => s.name === name)?.value;
};

export const initialState: SettingsState = {
  settings: [
    { name: themeActiveKey, value: 'default' }
  ]
};

function mergeSettings(left: SettingModel[], right: SettingModel[]): SettingModel[] {
  const to = [];
  const toMap = new Map<string, string | SettingModel[]>();
  left.forEach(v => {
    toMap.set(v.name, v.value);
  });
  right.forEach(v => {
    toMap.set(v.name, v.value);
  });
  toMap.forEach((v, k) => {
    to.push({ name: k, value: v });
  });
  return to;
}

function updateSettings(settings: SettingModel[], setting: SettingModel): SettingModel[] {
  const to = [];
  let isOverride = false;
  settings.forEach(v => {
    if (v.name === setting.name) {
      to.push({ name: v.name, value: setting.value });
      isOverride = true;
    } else {
      to.push({ name: v.name, value: v.value });
    }
  });
  return to;
}

export const reducer = createReducer(
  initialState,
  on(SettingsActions.update, (state, setting) => {
    return { settings: updateSettings(state.settings, setting.setting) };
  }),
  on(SettingsActions.loaded, (state, settings) => {
    return { settings: mergeSettings(state.settings, settings.settings) };
  })
);
