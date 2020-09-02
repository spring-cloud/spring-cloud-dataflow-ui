import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { from, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { getThemeActiveSetting, settingsFeatureKey, State, themeActiveDefault } from './store/settings.reducer';
import { loaded, update } from './store/settings.action';
import { SettingModel } from '../shared/model/setting.model';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(private store: Store<State>,
              private localStorageService: LocalStorageService) {
  }

  load(): Observable<SettingModel[]> {
    const activeValue: string = this.localStorageService.get('themeActiveValue') || themeActiveDefault;
    const settings: SettingModel[] = [
      { name: 'theme-active', value: activeValue },
      { name: 'results-per-page', value: '20' },
    ];
    return of(settings).pipe(
      tap((sett) => this.store.dispatch(loaded({ settings: sett })))
    );
  }

  update(setting: SettingModel): Observable<void> {
    if (setting.name === 'theme-active') {
      this.localStorageService.set('themeActiveValue', setting.value);
    }
    return from(new Promise<void>(resolve => resolve()));
  }

  dispatch(setting: SettingModel): void {
    this.store.dispatch(update({ setting }));
  }

  themeActiveSetting(): Observable<string> {
    return this.store.pipe(select(getThemeActiveSetting));
  }

  getSettings(): Observable<SettingModel[]> {
    return this.store.pipe(select(state => state[settingsFeatureKey].settings));
  }

}
