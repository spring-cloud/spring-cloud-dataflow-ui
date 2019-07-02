import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { TasksService } from '../../tasks.service';
import { ListDefaultParams, SortParams } from '../../../shared/components/shared.interface';
import { TaskExecution } from '../../model/task-execution';
import { map } from 'rxjs/operators';
import { Page } from '../../../shared/model';
import { AuthService } from '../../../auth/auth.service';
import { TaskExecutionsDestroyComponent } from '../../task-executions-destroy/task-executions-destroy.component';
import { LoggerService } from '../../../shared/services/logger.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

/**
 * Component that shows the executions of a Task
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-task-definition-executions',
  templateUrl: 'task-definition-executions.component.html',
  styleUrls: ['../styles.scss'],
})
export class TaskDefinitionExecutionsComponent implements OnInit, OnDestroy {

  /**
   * Observable of page of task executions
   */
  executions$: Observable<any>;

  /**
   * Params Subject
   */
  params$: Subject<ListDefaultParams>;

  /**
   * Current forms value
   */
  form: any = {
    checkboxes: []
  };

  /**
   * Contain a key application of each selected task executions
   * @type {Array}
   */
  itemsSelected: Array<number> = [];

  /**
   * Modal reference
   */
  modal: BsModalRef;

  /**
   * Constructor
   *
   * @param {ActivatedRoute} route
   * @param {Router} router
   * @param {AuthService} authService
   * @param loggerService
   * @param {BsModalService} modalService
   * @param {LoggerService} loggerService
   * @param {BsModalService} modalService
   * @param {TasksService} tasksService
   */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private loggerService: LoggerService,
              private modalService: BsModalService,
              private tasksService: TasksService) {
    this.params$ = new Subject<ListDefaultParams>();
  }

  /**
   * Init component, call refresh method
   */
  ngOnInit() {
    this.params$.subscribe((params: ListDefaultParams) => {
      this.executions$ = this.tasksService.getTaskExecutions(params)
        .pipe(map((page: Page<TaskExecution>) => {
          this.form.checkboxes = page.items.map((task) => {
              if (task.parentExecutionId) {
                return null;
              }
              return this.itemsSelected.indexOf(task.executionId) > -1;
            });
          return page;
        }))
        .pipe(map((page) => {
            return {
              page: page,
              params: params
            };
          }
        ));
    });
    this.route.parent.params.subscribe((params: Params) => {
      this.params$.next({
        q: params.id,
        sort: null,
        order: null,
        page: 0,
        size: 30
      });
    });
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    this.params$.complete();
    this.params$.unsubscribe();
  }


  /**
   * Execution actions
   * @param {TaskExecution} item
   * @param {number} index
   */
  executionActions(item: TaskExecution, index: number) {
    return [
      {
        id: 'details-execution' + index,
        icon: 'info-circle',
        action: 'details',
        title: 'Show details',
        isDefault: true
      },
      {
        id: 'destroy-task' + index,
        icon: 'trash',
        action: 'destroy',
        title: 'Clean up Task Execution',
        isDefault: false,
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DESTROY']) || item.parentExecutionId
      },
    ];
  }

  /**
   * Tasks Actions
   */
  executionsActions() {
    return [
      {
        id: 'destroy-executions',
        icon: 'trash',
        action: 'destroySelected',
        title: 'Clean up Task Execution(s)',
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DESTROY'])
      }
    ];
  }

  /**
   * Apply Action
   * @param action
   * @param item
   */
  applyAction(action: string, item: TaskExecution, params, page) {
    switch (action) {
      case 'details':
        this.details(item);
        break;
      case 'destroy':
        this.destroyExecutions([item], params);
        break;
      case 'destroySelected':
        this.destroySelectedExecutions(page, params);
        break;
    }
  }

  /**
   * Refresh
   * Create an observable which provides the required data
   * @param {ListDefaultParams} params
   */
  refresh(params: ListDefaultParams) {
    this.params$.next(params);
  }

  /**
   * Update event from the Paginator Pager
   * @param params
   */
  changePaginationPager(params: ListDefaultParams, paramsPaginator) {
    params.page = paramsPaginator.page;
    params.size = paramsPaginator.size;
    this.refresh(params);
  }

  /**
   * Apply sort
   * Triggered on column header click
   * @param {ListDefaultParams} params
   * @param {SortParams} sort
   */
  applySort(params: ListDefaultParams, sort: SortParams) {
    params.sort = sort.sort;
    params.order = sort.order;
    this.refresh(params);
  }

  /**
   * Route to {@link TaskExecution} details page.
   * @param {TaskExecution} taskExecution
   */
  details(taskExecution: TaskExecution) {
    this.router.navigate([`tasks/executions/${taskExecution.executionId}`]);
  }


  /**
   * Update the list of selected checkbox
   */
  changeCheckboxes(taskExecutions) {

    if (!taskExecutions) {
      return;
    }
    const taskCheckable = taskExecutions.items;
    if (taskCheckable.length !== this.form.checkboxes.length) {
      return;
    }
    const value: Array<number> = taskCheckable
      .map((ex, index) => {
        if (this.form.checkboxes[index] && !ex.parentExecutionId) {
          return ex.executionId;
        }
      })
      .filter((a) => a != null);
    this.itemsSelected = value;
  }

  /**
   * Starts the destroy process of multiple {@link TaskExecution}s
   * by opening a confirmation modal dialog.
   */
  destroySelectedExecutions(page, params) {
    const taskExecutions = page.items
      .filter((item) => this.itemsSelected.indexOf(item.executionId) > -1);
    this.destroyExecutions(taskExecutions, params);
  }

  /**
   * Destroys the {@link TaskExecution}s that are provided as via the taskExecutions parameter.
   * Will open a confirmation modal dialog.
   * @param {TaskExecution[]} taskExecutions
   */
  destroyExecutions(taskExecutions: TaskExecution[], params) {
    if (taskExecutions.length === 0) {
      return;
    }
    this.loggerService.log(`Destroy ${taskExecutions} task execution(s).`, taskExecutions);
    const className = taskExecutions.length > 1 ? 'modal-lg' : 'modal-md';
    this.modal = this.modalService.show(TaskExecutionsDestroyComponent, { class: className });
    this.modal.content.open({ taskExecutions: taskExecutions }).subscribe(() => {
      this.refresh(params);
    });
  }

  /**
   * Number of selected task executions
   * @returns {number}
   */
  countSelected(): number {
    return this.form.checkboxes.filter((a) => a && !a.parentExecutionId).length;
  }

}
