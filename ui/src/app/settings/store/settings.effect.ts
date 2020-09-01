import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap, catchError, tap, take, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SettingsService } from '../settings.service';
import * as SettingsActions from './settings.action';
import { ThemeService } from '../../layout/theme/theme.service';
import { themeActiveKey } from './settings.reducer';

@Injectable()
export class SettingsEffect {

  updateSetting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.update),
      exhaustMap((setting) => this.settingsService.update(setting.setting)
        .pipe(
          map(() => SettingsActions.updateOk({setting: setting.setting})),
          catchError(() => of(SettingsActions.updateError({setting: setting.setting})))
        )
      )
    ),
    { dispatch: true }
  );

  initialSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.loaded),
      take(1),
      map(action => action.settings.find(s => s.name === themeActiveKey)?.value as string),
      tap(theme => {
        this.themeService.switchTheme(theme);
      })
    ),
    { dispatch: false }
  );

  updateTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.updateOk),
      tap(action => {
        if (action.setting.name === themeActiveKey) {
          this.themeService.switchTheme(action.setting.value as string);
        }
      })
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private settingsService: SettingsService,
    private themeService: ThemeService
  ) {}
}
