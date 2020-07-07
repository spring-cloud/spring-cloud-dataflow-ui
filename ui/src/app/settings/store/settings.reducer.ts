import { createReducer, on } from '@ngrx/store';
import * as SettingsActions from './settings.action';
import * as fromRoot from '../../reducers/reducer';
import { Setting } from '../../shared/model/setting';

export const settingsFeatureKey = 'settings';
export const themeActiveKey = 'theme-active';
export const themeActiveDefault = 'dark';

export interface SettingsState {
  settings: Setting[];
}

export interface State extends fromRoot.State {
  [settingsFeatureKey]: SettingsState;
}

export const getSettings = (state: State) => {
  return state.settings.settings;
};

export const getThemeActiveSetting = (state: State) => {
  return state.settings.settings.find(s => s.name === themeActiveKey)?.value;
};

export const initialState: SettingsState = {
  settings: [
    { name: themeActiveKey, value: themeActiveDefault }
  ]
};

function mergeSettings(left: Setting[], right: Setting[]): Setting[] {
  const to = [];
  const toMap = new Map<string, string>();
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

function updateSettings(settings: Setting[], setting: Setting): Setting[] {
  const to = [];
  settings.forEach(v => {
    if (v.name === setting.name) {
      to.push({ name: v.name, value: setting.value});
    } else {
      to.push({ name: v.name, value: v.value});
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
