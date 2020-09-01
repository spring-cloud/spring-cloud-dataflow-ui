import { SettingsService } from '../../settings/settings.service';
import { of } from 'rxjs';
import { SettingModel } from '../../shared/model/setting.model';

export class SettingsServiceMock {

  static mock: SettingsServiceMock = null;

  static DATA = [
    { name: 'theme-active', value: 'dark' },
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

  getAllSettings() {
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
