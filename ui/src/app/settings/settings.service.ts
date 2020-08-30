import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { themeActiveKey, themeActiveDefault, getThemeActiveSetting } from './store/settings.reducer';
import { loaded, update } from './store/settings.action';
import { SettingModel } from '../shared/model/setting.model';
import { State } from '../reducers/reducer';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(private store: Store<State>,
              private localStorageService: LocalStorageService) {
  }

  load(): Observable<SettingModel[]> {
    const activeKey: string = this.localStorageService.get('themeActiveKey') || themeActiveKey;
    const activeValue: string = this.localStorageService.get('themeActiveValue') || themeActiveDefault;
    const settings: SettingModel[] = [{ name: activeKey, value: activeValue }];
    return of(settings).pipe(
      tap((sett) => this.store.dispatch(loaded({ settings: sett })))
    );
  }

  update(setting: SettingModel): Observable<void> {
    this.localStorageService.set('themeActiveKey', setting.name);
    this.localStorageService.set('themeActiveValue', setting.value);
    return from(new Promise<void>(resolve => resolve()));
  }

  dispatch(setting: SettingModel): void {
    this.store.dispatch(update({ setting }));
  }

  themeActiveSetting(): Observable<string> {
    return this.store.pipe(select(getThemeActiveSetting));
  }
}
