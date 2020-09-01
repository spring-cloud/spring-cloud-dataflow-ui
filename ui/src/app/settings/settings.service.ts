import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  themeActiveDefault,
  getThemeActiveSetting,
  getContextSettings, State, getSettings
} from './store/settings.reducer';
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
      {
        name: 'manage/apps',
        value: [
          { name: 'current', value: 1 },
          { name: 'size', value: 20 },
          { name: 'name', value: '' },
          { name: 'type', value: '' },
          { name: 'by', value: 'name' },
          { name: 'reverse', value: false },
          { name: 'sizeName', value: '' },
          { name: 'sizeType', value: '' },
          { name: 'sizeVersion', value: '' },
          { name: 'sizeUri', value: '' }
        ]
      },
      {
        name: 'manage/records',
        value: [
          { name: 'current', value: 1 },
          { name: 'size', value: 20 },
          { name: 'name', value: '' },
          { name: 'by', value: 'id' },
          { name: 'reverse', value: true },
          { name: 'sizeId', value: '' },
          { name: 'actionType', value: '' },
          { name: 'operationType', value: '' },
          { name: 'dates', value: null },
          { name: 'sizeCorrelationId', value: '' },
          { name: 'sizeCreatedOn', value: '' },
          { name: 'sizeAuditAction', value: '' },
          { name: 'sizeAuditOperation', value: '' },
          { name: 'sizeCreatedBy', value: '' },
          { name: 'sizePlatformName', value: '' },
        ]
      },
      {
        name: 'streams/list',
        value: [
          { name: 'current', value: 1 },
          { name: 'size', value: 20 },
          { name: 'name', value: '' },
          { name: 'by', value: 'name' },
          { name: 'reverse', value: false },
          { name: 'sizeName', value: '' },
          { name: 'sizeDescription', value: '' },
          { name: 'sizeDslText', value: '' },
          { name: 'sizeStatus', value: '' },
          { name: 'expanded', value: null },
        ]
      },
      {
        name: 'tasks-jobs/tasks',
        value: [
          { name: 'current', value: 1 },
          { name: 'size', value: 20 },
          { name: 'name', value: '' },
          { name: 'by', value: 'taskName' },
          { name: 'reverse', value: false },
          { name: 'sizeName', value: '' },
          { name: 'sizeDescription', value: '' },
          { name: 'sizeStatus', value: '' },
        ]
      },
      {
        name: 'tasks-jobs/executions',
        value: [
          { name: 'current', value: 1 },
          { name: 'size', value: 20 },
          { name: 'name', value: '' },
          { name: 'by', value: 'TASK_EXECUTION_ID' },
          { name: 'reverse', value: false },
          { name: 'sizeId', value: '' },
          { name: 'sizeDuration', value: '' },
          { name: 'sizeStart', value: '' },
          { name: 'sizeEnd', value: '' },
          { name: 'sizeExit', value: '' },
        ]
      },
      {
        name: 'tasks-jobs/jobs',
        value: [
          { name: 'current', value: 1 },
          { name: 'size', value: 20 },
          { name: 'name', value: '' },
          { name: 'by', value: 'TASK_EXECUTION_ID' },
          { name: 'reverse', value: true },
          { name: 'sizeId', value: '' },
          { name: 'sizeTaskId', value: '' },
          { name: 'sizeInstanceId', value: '' },
          { name: 'sizeStart', value: '' },
          { name: 'sizeStepCount', value: '' },
          { name: 'sizeStatus', value: '' },
        ]
      },
      {
        name: 'tasks-jobs/schedules',
        value: [
          { name: 'current', value: 1 },
          { name: 'size', value: 10000 },
          { name: 'reverse', value: true },
          { name: 'sizeName', value: '' },
          { name: 'sizeTaskName', value: '' },
          { name: 'sizeCronExpression', value: '' },
        ]
      },
      {
        name: 'app',
        value: []
      },
      {
        name: 'stream',
        value: [
          { name: 'visualize', value: false }
        ]
      },
      {
        name: 'task',
        value: [
          { name: 'visualize', value: false }
        ]
      },
      {
        name: 'execution',
        value: []
      },
      {
        name: 'job',
        value: []
      },
      {
        name: 'schedule',
        value: []
      }
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

  getContext(name: string): Observable<SettingModel[]> {
    return this.store.pipe(
      select((state) => getContextSettings(state?.settings?.settings, name) as SettingModel[] || [])
    );
  }

  getAllSettings(): Observable<SettingModel[]> {
    return this.store.pipe(select(getSettings));
  }

  updateContext(name: string, settings: SettingModel[]) {
    this.store.dispatch(update({ setting: { name, value: settings } }));
  }

}
