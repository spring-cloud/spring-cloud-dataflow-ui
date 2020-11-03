import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold } from 'jasmine-marbles';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import * as SettingsActions from './settings.action';
import { SettingsEffect } from './settings.effect';
import * as fromSettings from './settings.reducer';
import { ThemeService } from '../../layout/theme/theme.service';
import { SettingsService } from '../settings.service';

describe('settings/store/settings.effect.ts', () => {

  let effects: SettingsEffect;
  let actions$: Observable<Action>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const themeServiceSpy = jasmine.createSpyObj('ThemeService', ['switchTheme']);
  const settingsServiceSpy = jasmine.createSpyObj('SettingsService', ['update']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        SettingsEffect,
        provideMockActions(() => actions$),
        { provide: Router, useValue: routerSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: SettingsService, useValue: settingsServiceSpy }
      ]
    })
    .compileComponents();
    effects = TestBed.inject(SettingsEffect);
  }));

  it('should update settings', () => {
    // You can't directly test RxJS code that consumes Promises or uses any of the other schedulers
    // https://rxjs.dev/guide/testing/marble-testing
    (settingsServiceSpy.update as jasmine.Spy).and.returnValue(cold('(a|)', {a: (void 0)}));
    actions$ = of(SettingsActions.update({
        setting: { name: fromSettings.themeActiveKey, value: 'value1' },
    }));
    const expected = cold('(a|)', {
      a: SettingsActions.updateOk({
        setting: { name: fromSettings.themeActiveKey, value: 'value1' },
      })
    });
    expect(effects.updateSetting$).toBeObservable(expected);
    expect (settingsServiceSpy.update).toHaveBeenCalledWith({
      name: fromSettings.themeActiveKey, value: 'value1'
    });
  });

  it('should switch initial theme', () => {
    actions$ = of(SettingsActions.loaded({
      settings: [ {name: fromSettings.themeActiveKey, value: 'value1'} ]
    }));
    const expected = cold('(a|)', {a: 'value1'});
    expect(effects.initialSettings$).toBeObservable(expected);
    expect (themeServiceSpy.switchTheme).toHaveBeenCalledWith('value1');
  });

  it('should switch theme', () => {
    actions$ = of(SettingsActions.updateOk({
      setting: { name: fromSettings.themeActiveKey, value: 'value1' }
    }));
    const expected = cold('(a|)', {
      a: SettingsActions.updateOk({
        setting: { name: fromSettings.themeActiveKey, value: 'value1' },
      })
    });
    expect(effects.updateTheme$).toBeObservable(expected);
    expect (themeServiceSpy.switchTheme).toHaveBeenCalledWith('value1');
  });
});
