import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { themeActiveKey, themeActiveDefault, getThemeActiveSetting } from '../../settings/store/settings.reducer';
import { loaded, update } from '../../settings/store/settings.action';
import { Setting } from '../model/setting';
import { State } from '../../reducers/reducer';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private DEFAULT: Setting[] = [{ name: themeActiveKey, value: themeActiveDefault }];

  constructor(
    private store: Store<State>
  ) { }

  load(): Observable<Setting[]> {
    // TODO: this should come from a permanent storage
    return of(this.DEFAULT).pipe(
      tap((settings) => this.store.dispatch(loaded({ settings })))
    );
  }

  update(setting: Setting): Observable<void> {
    // TODO: should update permanent storage
    return from(new Promise<void>(resolve => resolve()));
  }

  dispatch(setting: Setting): void {
    this.store.dispatch(update({ setting }));
  }

  themeActiveSetting(): Observable<string> {
    return this.store.pipe(select(getThemeActiveSetting));
  }
}
