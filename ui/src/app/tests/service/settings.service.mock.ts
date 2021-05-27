import {SettingsService} from '../../settings/settings.service';
import {Observable, of} from 'rxjs';
import {SettingModel} from '../../shared/model/setting.model';

export class SettingsServiceMock {
  static mock: SettingsServiceMock = null;

  static DATA = [
    {name: 'theme-active', value: 'dark'},
    {name: 'results-per-page', value: '20'}
  ];

  constructor() {}

  load(): Observable<any> {
    return of(SettingsServiceMock.DATA);
  }

  update(): Observable<any> {
    return of({});
  }

  dispatch(): Observable<any> {
    return of({});
  }

  themeActiveSetting(): Observable<any> {
    return of('dark');
  }

  getContext(name: string): Observable<any> {
    const ctx = SettingsServiceMock.DATA.find(x => x.name === name)?.value || [];
    return of(ctx);
  }

  getSettings(): Observable<any> {
    return of(SettingsServiceMock.DATA);
  }

  updateContext(name: string, settings: SettingModel[]): Observable<any> {
    return of({});
  }

  static get provider(): any {
    if (!SettingsServiceMock.mock) {
      SettingsServiceMock.mock = new SettingsServiceMock();
    }
    return {provide: SettingsService, useValue: SettingsServiceMock.mock};
  }
}
