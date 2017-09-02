import { createSelector, createFeatureSelector } from '@ngrx/store';
import {
  Actions, TASK_DEFINITIONS_FILTER, TASK_DEFINITIONS_FILTER_DEBOUNCE, TASK_DEFINITIONS_LOADED, TASK_DEFINITIONS_PAGE,
  TASK_DEFINITIONS_RESET,
  TASK_DEFINITIONS_SORT, TASK_DEFINITIONS_UPDATE
} from './tasks-actions';
import { AppState } from '../../store/app-reducer';
import {Page} from "../../shared/model/page";
import {TaskDefinition} from "../model/task-definition";

/**
 * Main tasks state keeping its sub-feature states.
 */
export interface TasksState extends AppState {
  definitions: TaskDefinitionsState;
}

/**
 * State keeping related information about
 * tasks definitions page.
 */
export interface TaskDefinitionsState {
  filter: string;
  page: number;
  sort: { [id: string]: boolean };
  items: Page<TaskDefinition>;
}

/**
 * Initial state for TaskDefinitionsState.
 *
 * @type {{filter: string; page: number; sort: {}}}
 */
const initialState: TaskDefinitionsState = {
  filter: '',
  page: 0,
  sort: {},
  items: undefined
};

export function DefinitionsReducer(state: TaskDefinitionsState, action: Actions): TaskDefinitionsState {
  switch (action.type) {
    case TASK_DEFINITIONS_UPDATE:
      // in terms of state same as debounce but update
      // is just causing load in effect
    case TASK_DEFINITIONS_FILTER_DEBOUNCE:
      // return state as is for state not to change
      // effect will debounce and cause TaskDefinitionsFilterAction
      return state;
    case TASK_DEFINITIONS_FILTER:
      // simply update filter field
      return Object.assign({}, state, {
        filter: action.payload
      });
    case TASK_DEFINITIONS_PAGE:
      // simply update page number field
      return Object.assign({}, state, {
        page: action.page
      });
    case TASK_DEFINITIONS_SORT:
      // depending on arbitrary field flip its status
      let sortState = state.sort[action.id];
      if (sortState === undefined) {
        sortState = true;
      } else if (sortState) {
        sortState = false;
      } else {
        sortState = undefined;
      }
      return Object.assign({}, state, {
        sort: Object.assign({}, state.sort, {[action.id]: sortState})
      });
    case TASK_DEFINITIONS_LOADED:
      // we get items to show, so update that field
      return Object.assign({}, state, {
        items: action.items
      });
    case TASK_DEFINITIONS_RESET:
      // reset filter and sort
      return Object.assign({}, state, {
        filter: '',
        sort: {}
      });
    default:
      // just need to have some initial state
      return initialState;
  }
}

export const reducers = {
  definitions: DefinitionsReducer
};

/**
 * Main tasks feature selector.
 *
 * @type {MemoizedSelector<Object, TasksState>}
 */
export const getTasksState = createFeatureSelector<TasksState>('tasks');

/**
 * Get filter from task definition state.
 *
 * @param {TaskDefinitionsState} state
 */
export const getFilter = (state: TaskDefinitionsState) => state.filter;

/**
 * Get page number from task definition state.
 *
 * @param {TaskDefinitionsState} state
 */
export const getPage = (state: TaskDefinitionsState) => state.page;

/**
 * Get sort from task definition state.
 *
 * @param {TaskDefinitionsState} state
 */
export const getSort = (state: TaskDefinitionsState) => state.sort;

/**
 * Get paged items from task definition state.
 *
 * @param {TaskDefinitionsState} state
 */
export const getItems = (state: TaskDefinitionsState) => state.items;

/**
 * Get pagination instance from task definition state. If this is not
 * yet initialised then return undefined.
 *
 * @param {TaskDefinitionsState} state
 * @returns {PaginationInstance}
 */
export const getPaginationInstance = (state: TaskDefinitionsState) => {
  if (state.items) {
    return state.items.getPaginationInstance();
  }
};

/**
 * Create selector from tasks selecting tasks definition state.
 *
 * @type {MemoizedSelector<Object, TaskDefinitionsState>}
 */
export const getTaskDefinitionsState = createSelector(
  getTasksState,
  (state: TasksState) => state.definitions
);

/**
 * Create selector from tasks selecting filter string.
 *
 * @type {MemoizedSelector<Object, string>}
 */
export const getTaskDefinitionsFilter = createSelector(
  getTaskDefinitionsState,
  getFilter
);

/**
 * Create selector from tasks selecting paged tasks definitions.
 *
 * @type {MemoizedSelector<Object, Page<TaskDefinition>>}
 */
export const getTaskDefinitions = createSelector(
  getTaskDefinitionsState,
  getItems
);

/**
 * Create selector from tasks selecting pagination instance.
 *
 * @type {MemoizedSelector<Object, PaginationInstance>}
 */
export const getTaskDefinitionsPaginationInstance = createSelector(
  getTaskDefinitionsState,
  getPaginationInstance
);

/**
 * Create selector from tasks selecting map of sorting states.
 *
 * @type {MemoizedSelector<Object, {[p: string]: boolean}>}
 */
export const getTaskDefinitionsSort = createSelector(
  getTaskDefinitionsState,
  getSort
);
