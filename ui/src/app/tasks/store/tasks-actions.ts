import { Action } from '@ngrx/store';
import { Page } from '../../shared/model/page';
import { TaskDefinition } from '../model/task-definition';

// constants identifying actions types
export const TASK_DEFINITIONS_FILTER = 'tasks:definitions:filter';
export const TASK_DEFINITIONS_FILTER_DEBOUNCE = 'tasks:definitions:filter:debounce';
export const TASK_DEFINITIONS_PAGE = 'tasks:definitions:page';
export const TASK_DEFINITIONS_SORT = 'tasks:definitions:sort';
export const TASK_DEFINITIONS_LOADED = 'tasks:definitions:loaded';
export const TASK_DEFINITIONS_UPDATE = 'tasks:definitions:update';
export const TASK_DEFINITIONS_RESET = 'tasks:definitions:reset';

/**
 * Action indicating that tasks definitions should be updated.
 */
export class TaskDefinitionsUpdateAction implements Action {
  readonly type = TASK_DEFINITIONS_UPDATE;
}

/**
 * Action indicating that tasks definitions filter
 * and sorting is reseted.
 */
export class TaskDefinitionsResetAction implements Action {
  readonly type = TASK_DEFINITIONS_RESET;
}

/**
 * Action which sends raw filter string similar to
 * TaskDefinitionsFilterAction except we use different action
 * for effect to able to debounce.
 */
export class TaskDefinitionsFilterDebounceAction implements Action {
  readonly type = TASK_DEFINITIONS_FILTER_DEBOUNCE;

  constructor(public payload: string) {
  }
}

/**
 * Action which sends filter string.
 */
export class TaskDefinitionsFilterAction implements Action {
  readonly type = TASK_DEFINITIONS_FILTER;

  constructor(public payload: string) {
  }
}

/**
 * Action notifying new page number.
 */
export class TaskDefinitionsPageAction implements Action {
  readonly type = TASK_DEFINITIONS_PAGE;

  constructor(public page: number) {
  }
}

/**
 * Action notifying new sort field.
 */
export class TaskDefinitionsSortAction implements Action {
  readonly type = TASK_DEFINITIONS_SORT;

  constructor(public id: string) {
  }
}

/**
 * Action notifying new loaded task definitions.
 */
export class TaskDefinitionsLoadedAction implements Action {
  readonly type = TASK_DEFINITIONS_LOADED;

  constructor(public items: Page<TaskDefinition>) {
  }
}

/**
 * Type having all supported actions.
 */
export type Actions =
  TaskDefinitionsFilterAction
  | TaskDefinitionsFilterDebounceAction
  | TaskDefinitionsPageAction
  | TaskDefinitionsSortAction
  | TaskDefinitionsLoadedAction
  | TaskDefinitionsUpdateAction
  | TaskDefinitionsResetAction;
