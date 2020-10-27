import { createReducer, on } from '@ngrx/store';
import * as ContextActions from './context.action';
import * as fromRoot from '../../reducers/reducer';
import { ContextModel } from '../model/context.model';

export const contextFeatureKey = 'context';

export interface State extends fromRoot.State {
  [contextFeatureKey]: ContextModel[];
}

export const getContexts = (state: State) => {
  return state[contextFeatureKey];
};

export const getContext = (contexts: ContextModel[], name: string) => {
  return contexts.find(s => s.name === name)?.value;
};

export const initialState = [
  {
    name: 'apps',
    value: [
      { name: 'current', value: 1 },
      { name: 'size', value: '' },
      { name: 'name', value: '' },
      { name: 'type', value: '' },
      { name: 'by', value: 'name' },
      { name: 'reverse', value: false },
      { name: 'sizeName', value: '' },
      { name: 'sizeType', value: '160' },
      { name: 'sizeVersion', value: '' },
      { name: 'sizeUri', value: '' }
    ]
  },
  {
    name: 'manage/records',
    value: [
      { name: 'current', value: 1 },
      { name: 'size', value: '' },
      { name: 'name', value: '' },
      { name: 'by', value: 'id' },
      { name: 'reverse', value: true },
      { name: 'sizeId', value: '' },
      { name: 'actionType', value: '' },
      { name: 'operationType', value: '' },
      { name: 'dates', value: null },
      { name: 'sizeId', value: '100' },
      { name: 'sizeCorrelationId', value: '' },
      { name: 'sizeCreatedOn', value: '250' },
      { name: 'sizeAuditAction', value: '140' },
      { name: 'sizeAuditOperation', value: '180' },
      { name: 'sizeCreatedBy', value: '' },
      { name: 'sizePlatformName', value: '' },
    ]
  },
  {
    name: 'streams/list',
    value: [
      { name: 'current', value: 1 },
      { name: 'size', value: '' },
      { name: 'name', value: '' },
      { name: 'by', value: 'name' },
      { name: 'reverse', value: false },
      { name: 'sizeName', value: '' },
      { name: 'sizeDescription', value: '' },
      { name: 'sizeDslText', value: '' },
      { name: 'sizeStatus', value: '140' },
      { name: 'expanded', value: null },
    ]
  },
  {
    name: 'tasks-jobs/tasks',
    value: [
      { name: 'current', value: 1 },
      { name: 'size', value: '' },
      { name: 'name', value: '' },
      { name: 'by', value: 'taskName' },
      { name: 'reverse', value: false },
      { name: 'sizeName', value: '' },
      { name: 'sizeDescription', value: '' },
      { name: 'sizeDsl', value: '' },
      { name: 'sizeStatus', value: '140' },
    ]
  },
  {
    name: 'tasks-jobs/executions',
    value: [
      { name: 'current', value: 1 },
      { name: 'size', value: '' },
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
      { name: 'size', value: '' },
      { name: 'name', value: '' },
      { name: 'by', value: 'TASK_EXECUTION_ID' },
      { name: 'reverse', value: true },
      { name: 'sizeId', value: '' },
      { name: 'sizeTaskId', value: '' },
      { name: 'sizeInstanceId', value: '' },
      { name: 'sizeStart', value: '' },
      { name: 'sizeStepCount', value: '' },
      { name: 'sizeStatus', value: '' },
      { name: 'dates', value: null },
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

function updateSettings(contexts: ContextModel[], context: ContextModel): ContextModel[] {
  const to = [];
  let isOverride = false;
  contexts.forEach(v => {
    if (v.name === context.name) {
      to.push({ name: v.name, value: context.value });
      isOverride = true;
    } else {
      to.push({ name: v.name, value: v.value });
    }
  });
  if (!isOverride) {
    to.push(context);
  }
  return to;
}

export const reducer = createReducer(
  initialState,
  on(ContextActions.updated, (state, context) => {
    return updateSettings(state, context);
  }),
);
