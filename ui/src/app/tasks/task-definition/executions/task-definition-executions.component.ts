import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { TasksService } from '../../tasks.service';
import { ListDefaultParams, SortParams } from '../../../shared/components/shared.interface';
import { TaskExecution } from '../../model/task-execution';
import { map } from 'rxjs/operators';

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
   * Constructor
   *
   * @param {ActivatedRoute} route
   * @param {Router} router
   * @param {TasksService} tasksService
   */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private tasksService: TasksService) {
    this.params$ = new Subject<ListDefaultParams>();
  }

  /**
   * Init component, call refresh method
   */
  ngOnInit() {
    this.params$.subscribe((params: ListDefaultParams) => {
      this.executions$ = this.tasksService.getTaskExecutions(params)
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

}
