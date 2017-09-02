import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { PaginationInstance } from 'ngx-pagination';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ToastyService } from 'ng2-toasty';
import { ModalDirective} from 'ngx-bootstrap/modal';
import { Page } from '../../shared/model/page';
import { TaskDefinition } from '../model/task-definition';
import { TasksService } from '../tasks.service';
import {
  TasksState,
  getTaskDefinitionsFilter,
  getTaskDefinitions,
  getTaskDefinitionsPaginationInstance,
  getTaskDefinitionsSort
} from '../store/tasks-reducer';
import {
  TaskDefinitionsFilterDebounceAction, TaskDefinitionsPageAction, TaskDefinitionsResetAction, TaskDefinitionsSortAction,
  TaskDefinitionsUpdateAction
} from "../store/tasks-actions";

@Component({
  selector: 'app-task-definition',
  templateUrl: './task-definitions.component.html',
})
export class TaskDefinitionsComponent implements OnInit {

  busy: Subscription;
  taskDefinitionToDestroy: TaskDefinition;

  // undefined indicates that order is not selected
  // thus we simply show double arrow.
  // for sorting toggles, we just switch
  // and first sort with true which equals desc
  definitionNameSort: boolean = undefined;
  definitionSort: boolean = undefined;

  // only exists to be able to update
  // filter input field from a store
  // when component is initialised
  definitionFilter: string;

  // observable page is updated from a store
  taskDefinitions: Observable<Page<TaskDefinition>>;

  // pagination instance is updated from a store
  paginationInstance: PaginationInstance;

  @ViewChild('childPopover')
  public childPopover: PopoverDirective;

  @ViewChild('childModal')
  public childModal: ModalDirective;

  constructor(
    private tasksService: TasksService,
    private toastyService: ToastyService,
    private router: Router,
    private store: Store<TasksState>
  ) {
    this.paginationInstance = {
      currentPage: 0,
      totalItems: 10,
      itemsPerPage: 10
    };
  }

  ngOnInit() {
    this.taskDefinitions = this.store.select(getTaskDefinitions);

    this.store.select(getTaskDefinitionsFilter).do(state => {
      if (state) {
        this.definitionFilter = state;
      }
    }).take(1).subscribe();

    this.store.select(getTaskDefinitionsPaginationInstance).do(instance => {
      if (instance) {
        this.paginationInstance = instance;
      }
    }).subscribe();

    this.store.select(getTaskDefinitionsSort).do(sort => {
      this.definitionNameSort = sort['DEFINITION_NAME'];
      this.definitionSort = sort['DEFINITION'];
    }).subscribe();
    this.loadTaskDefinitions();
  }

  loadTaskDefinitions() {
    this.store.dispatch(new TaskDefinitionsUpdateAction());
  }

  reset() {
    this.store.dispatch(new TaskDefinitionsResetAction());
    // need to reset filter here as we don't want to listen
    // store as its only taken once in ngOnInit
    this.definitionFilter = '';
  }

  /**
   * Used for requesting a new page. The past is page number is
   * 1-index-based. It will be converted to a zero-index-based
   * page number under the hood.
   *
   * @param page 1-index-based
   */
  getPage(page: number) {
    this.store.dispatch(new TaskDefinitionsPageAction(page - 1));
  }

  bulkDefineTasks() {
    this.router.navigate(['tasks/bulk-define-tasks']);
  }

  launchTask(item: TaskDefinition) {
    this.router.navigate(['tasks/definitions/launch/' + item.name]);
  }

  destroyTask(item: TaskDefinition) {
    this.taskDefinitionToDestroy = item;
    this.showChildModal();
  }

  toggleDefinitionNameSort() {
    this.store.dispatch(new TaskDefinitionsSortAction('DEFINITION_NAME'));
  }

  toggleDefinitionSort() {
    this.store.dispatch(new TaskDefinitionsSortAction('DEFINITION'));
  }

  public proceed(taskDefinition: TaskDefinition): void {
    console.log('Proceeding to destroy definition...', taskDefinition);
    this.tasksService.destroyDefinition(taskDefinition.name).subscribe(
      data => {
        this.cancel();
        this.toastyService.success('Successfully destroyed task definition "'
          + taskDefinition.name + '"');
        this.loadTaskDefinitions();
      },
      error => {
        this.toastyService.error(error);
      }
    );
  }

  filter(query: string) {
    this.store.dispatch(new TaskDefinitionsFilterDebounceAction(query));
  }

  /**
   * Displays modal dialog box that confirms the user wants to destroy a {@link TaskDefinition}.
   */
  public showChildModal(): void {
    this.childModal.show();
  }

  /**
   *  Hides the modal dialog box that confirms whether the user wants to
   *  destroy a {@link TaskDefinition}.
   */
  public hideChildModal(): void {
    this.childModal.hide();
  }

  /**
   * Hides the modal dialog box.
   */
  public cancel = function() {
    this.hideChildModal();
  };
}
