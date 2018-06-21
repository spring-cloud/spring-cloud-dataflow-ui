import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TasksService } from '../../tasks.service';
import { SortParams } from '../../../shared/components/shared.interface';
import { TaskExecution } from '../../model/task-execution';
import { Page } from '../../../shared/model/page';
import { TaskExecutionListParams } from '../../components/tasks.interface';
import { Subject } from 'rxjs/Subject';

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
  params$: Subject<TaskExecutionListParams>;

  /**
   * Constructor
   *
   * @param {ActivatedRoute} route
   * @param {Router} router
   * @param {TasksService} tasksService
   */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private tasksService: TasksService) {
    this.params$ = new Subject<TaskExecutionListParams>();
  }

  /**
   * Init component, call refresh method
   */
  ngOnInit() {
    this.params$.subscribe((params: TaskExecutionListParams) => {
      this.executions$ = this.tasksService.getTaskExecutions(params)
        .mergeMap(
          (page: Page<TaskExecution>) => Observable.of(params),
          (page, params) => ({
            page: page,
            params: params
          })
        );
    });
    this.route.parent.params.subscribe((params: Params) => {
      this.params$.next({
        task: params.id,
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
   * Refresh
   * Create an observable which provides the required data
   * @param {TaskExecutionListParams} params
   */
  refresh(params: TaskExecutionListParams) {
    this.params$.next(params);
  }

  /**
   * Determine if there is no task execution
   * @param {Page<TaskExecution>} page
   * @returns {boolean}
   */
  isExecutionsEmpty(page: Page<TaskExecution>): boolean {
    if (page.totalPages < 2) {
      return page.items.length === 0;
    }
    return false;
  }

  /**
   * Used for requesting a new page. The past is page number is
   * 1-index-based. It will be converted to a zero-index-based
   * page number under the hood.
   * @param {TaskExecutionListParams} params
   * @param page 1-index-based
   */
  getPage(params: TaskExecutionListParams, page: number) {
    params.page = page - 1;
    this.refresh(params);
  }

  /**
   * Apply sort
   * Triggered on column header click
   * @param {TaskExecutionListParams} params
   * @param {SortParams} sort
   */
  applySort(params: TaskExecutionListParams, sort: SortParams) {
    params.sort = sort.sort;
    params.order = sort.order;
    this.refresh(params);
  }

  /**
   * Changes items per page
   * Reset the pagination (first page)
   * @param {TaskExecutionListParams} params
   * @param {number} size
   */
  changeSize(params: TaskExecutionListParams, size: number) {
    params.size = size;
    params.page = 0;
    this.refresh(params);
  }

  /**
   * Route to {@link TaskExecution} details page.
   * @param {TaskExecution} taskExecution
   */
  details(taskExecution: TaskExecution) {
    this.router.navigate([`tasks/executions/${taskExecution.executionId}`]);
  }

}
