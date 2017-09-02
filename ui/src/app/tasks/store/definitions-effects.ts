import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import {
  TASK_DEFINITIONS_FILTER, TASK_DEFINITIONS_FILTER_DEBOUNCE, TASK_DEFINITIONS_PAGE, TASK_DEFINITIONS_RESET,
  TASK_DEFINITIONS_SORT, TASK_DEFINITIONS_UPDATE, TaskDefinitionsFilterAction, TaskDefinitionsFilterDebounceAction,
  TaskDefinitionsLoadedAction
} from './tasks-actions';
import { TasksService } from '../tasks.service';
import { getTaskDefinitionsState, TasksState } from './tasks-reducer';

@Injectable()
export class DefinitionsEffects {

  /**
   * Effect which debounces given input filter strings
   * and passes new actual action for filter.
   *
   * @type {Observable<TaskDefinitionsFilterAction>}
   */
  @Effect() filterdebounce$: Observable<TaskDefinitionsFilterAction> = this.actions
    .ofType<TaskDefinitionsFilterDebounceAction>(TASK_DEFINITIONS_FILTER_DEBOUNCE)
    // debounce raw inputs for not every key stroke
    // causing update
    .debounceTime(500)
    // then return new action to cause filtering
    .map(action => new TaskDefinitionsFilterAction(action.payload));

  /**
   * Effect which is used to listen all other related actions
   * and result a call to backend tasks service to update definitions.
   *
   * @type {Observable<TaskDefinitionsLoadedAction>}
   */
  @Effect() load$: Observable<TaskDefinitionsLoadedAction> = this.actions
    .ofType<TaskDefinitionsFilterDebounceAction>(TASK_DEFINITIONS_FILTER, TASK_DEFINITIONS_PAGE, TASK_DEFINITIONS_SORT,
      TASK_DEFINITIONS_UPDATE, TASK_DEFINITIONS_RESET)
    // compine action(which we don't use) with selector from
    // store having needed stuff for definitions state needed
    // to talk with tasks service.
    .withLatestFrom(this.store.select(getTaskDefinitionsState))
    // switch map to observable from service
    .switchMap(([action, state]) => this.tasksService.getDefinitions(state.sort['DEFINITION_NAME'],
      state.sort['DEFINITION'], state.page, 10, state.filter))
    // return paged definitions
    .map(definitions => new TaskDefinitionsLoadedAction(definitions));

  constructor(private actions: Actions, private tasksService: TasksService, private store: Store<TasksState>) {
  }
}
