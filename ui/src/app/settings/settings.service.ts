import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { themeActiveKey, themeActiveDefault, getThemeActiveSetting } from './store/settings.reducer';
import { loaded, update } from './store/settings.action';
import { Setting } from '../shared/model/setting';
import { State } from '../reducers/reducer';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(private store: Store<State>,
              private localStorageService: LocalStorageService) {
  }

  load(): Observable<Setting[]> {
    const activeKey: string = this.localStorageService.get('themeActiveKey') || themeActiveKey;
    const activeValue: string = this.localStorageService.get('themeActiveValue') || themeActiveDefault;
    const settings: Setting[] = [{ name: activeKey, value: activeValue }];
    return of(settings).pipe(
      tap((settings) => this.store.dispatch(loaded({ settings })))
    );
  }

  update(setting: Setting): Observable<void> {
    this.localStorageService.set('themeActiveKey', setting.name);
    this.localStorageService.set('themeActiveValue', setting.value);
    return from(new Promise<void>(resolve => resolve()));
  }

  dispatch(setting: Setting): void {
    this.store.dispatch(update({ setting }));
  }

  themeActiveSetting(): Observable<string> {
    return this.store.pipe(select(getThemeActiveSetting));
  }
}
