import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {from, Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {getThemeActiveSetting, settingsFeatureKey, State} from './store/settings.reducer';
import {loaded, update} from './store/settings.action';
import {SettingModel} from '../shared/model/setting.model';
import {LocalStorageService} from '../shared/service/local-storage.service';

const DEFAULT_LANG = 'en';
const DEFAULT_REVERSE_PROXY_FIX_ACTIVE = 'false';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  language = ['en'];

  constructor(
    private store: Store<State>,
    private localStorageService: LocalStorageService
  ) {}

  load(languages: Array<string>): Observable<SettingModel[]> {
    this.language = languages;
    const isDarkConfig = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    let activeThemeValue: string = isDarkConfig ? 'dark' : 'default';
    let activeLanguageValue: string = DEFAULT_LANG;
    let reverseProxyFixActiveValue: string = DEFAULT_REVERSE_PROXY_FIX_ACTIVE;

    if (navigator?.language) {
      activeLanguageValue = navigator.language.split('-')[0];
    }
    if (languages.indexOf(activeLanguageValue) === -1) {
      activeLanguageValue = DEFAULT_LANG;
    }

    if (this.localStorageService.get('themeActiveValue')) {
      activeThemeValue = this.localStorageService.get('themeActiveValue');
    }

    if (this.localStorageService.get('languageActiveValue')) {
      if (languages.indexOf(this.localStorageService.get('languageActiveValue')) > -1) {
        activeLanguageValue = this.localStorageService.get('languageActiveValue');
      }
    }

    if (this.localStorageService.get('reverseProxyFixActiveValue')) {
      reverseProxyFixActiveValue = this.localStorageService.get('reverseProxyFixActiveValue');
    }

    const settings: SettingModel[] = [
      {name: 'language-active', value: activeLanguageValue},
      {name: 'theme-active', value: activeThemeValue},
      {name: 'results-per-page', value: '20'},
      {name: 'reverse-proxy-fix-active', value: reverseProxyFixActiveValue}
    ];
    return of(settings).pipe(tap(sett => this.store.dispatch(loaded({settings: sett}))));
  }

  update(setting: SettingModel): Observable<void> {
    if (setting.name === 'theme-active') {
      this.localStorageService.set('themeActiveValue', setting.value);
    }
    if (setting.name === 'language-active') {
      this.localStorageService.set('languageActiveValue', setting.value);
    }
    if (setting.name === 'reverse-proxy-fix-active') {
      this.localStorageService.set('reverseProxyFixActiveValue', setting.value);
    }
    return from(new Promise<void>(resolve => resolve()));
  }

  dispatch(setting: SettingModel): void {
    this.store.dispatch(update({setting}));
  }

  themeActiveSetting(): Observable<string> {
    return this.store.pipe(select(getThemeActiveSetting));
  }

  getSettings(): Observable<SettingModel[]> {
    return this.store.pipe(select(state => state[settingsFeatureKey].settings));
  }
}
