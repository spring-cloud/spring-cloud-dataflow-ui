import { SettingsService } from '../../settings/settings.service';
import { of } from 'rxjs';
import { SettingModel } from '../../shared/model/setting.model';

export class SettingsServiceMock {

  static mock: SettingsServiceMock = null;

  static DATA = [
    { name: 'theme-active', value: 'dark' },
    { name: 'results-per-page', value: '20' },
  ];

  constructor() {
  }

  load() {
    return of(SettingsServiceMock.DATA);
  }

  update() {
    return of({});
  }

  dispatch() {
    return of({});
  }

  themeActiveSetting() {
    return of('dark');
  }

  getContext(name: string) {
    const ctx = SettingsServiceMock.DATA.find(x => x.name === name)?.value || [];
    return of(ctx);
  }

  getSettings() {
    return of(SettingsServiceMock.DATA);
  }

  updateContext(name: string, settings: SettingModel[]) {
    return of({});
  }

  static get provider() {
    if (!SettingsServiceMock.mock) {
      SettingsServiceMock.mock = new SettingsServiceMock();
    }
    return { provide: SettingsService, useValue: SettingsServiceMock.mock };
  }

}
