import { createAction } from '@ngrx/store';
import * as fromSettings from './settings.reducer';
import * as SettingsActions from './settings.action';

describe('settings/store/settings.reducer.ts', () => {

  it('should return init state', () => {
    const newState = fromSettings.reducer(undefined, createAction('noop'));
    expect(newState).toEqual(fromSettings.initialState);
  });

  it('should load and update', () => {
    let expectedState: fromSettings.SettingsState = {
      settings: [{ name: fromSettings.themeActiveKey, value: 'value1'}]
    };
    let newState = fromSettings.reducer(undefined, SettingsActions.loaded({
      settings: [{ name: fromSettings.themeActiveKey, value: 'value1'}]
    }));
    expect(newState).toEqual(expectedState);
    expectedState = {
      settings: [{ name: fromSettings.themeActiveKey, value: 'value2'}]
    };
    newState = fromSettings.reducer(newState, SettingsActions.update({
      setting: { name: fromSettings.themeActiveKey, value: 'value2' }
    }));
    expect(newState).toEqual(expectedState);
  });
});
