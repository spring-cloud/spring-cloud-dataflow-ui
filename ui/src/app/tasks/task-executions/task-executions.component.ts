import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from '../../shared/model/page';
import { TaskExecution } from '../model/task-execution';
import { TasksService } from '../tasks.service';
import { Subject } from 'rxjs/Subject';
import { BusyService } from '../../shared/services/busy.service';
import { takeUntil } from 'rxjs/operators';
import { TaskListParams } from '../components/tasks.interface';
import { OrderParams, SortParams } from '../../shared/components/shared.interface';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { AppError } from '../../shared/model/error.model';

/**
 * Component that display the Task Executions.
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-task-executions',
  templateUrl: './task-executions.component.html',
  styleUrls: ['./../task-definitions/styles.scss']
})
export class TaskExecutionsComponent implements OnInit, OnDestroy {

  /**
   * Current page of Tasks definitions
   */
  taskExecutions: Page<TaskExecution>;

  /**
   * Busy Subscriptions
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Current forms value
   */
  form: any = {
    q: ''
  };

  /**
   * State of App List Params
   */
  params: TaskListParams = {
    sort: 'TASK_EXECUTION_ID',
    order: OrderParams.ASC,
    page: 0,
    size: 30,
    q: ''
  };

  /**
   * Storage context
   */
  context: any;

  /**
   * Constructor
   *
   * @param {BusyService} busyService
   * @param {TasksService} tasksService
   * @param {NotificationService} notificationService
   * @param {LoggerService} loggerService
   * @param {Router} router
   */
  constructor(private busyService: BusyService,
              public tasksService: TasksService,
              public notificationService: NotificationService,
              public loggerService: LoggerService,
              private router: Router) {
  }

  /**
   * Retrieves the {@link TaskDefinition}s to be displayed on the page.
   */
  ngOnInit() {
    this.context = this.tasksService.executionsContext;
    this.params = { ...this.context };
    this.form = { q: this.context.q };
    this.refresh();
  }

  /**
   * Close subscription
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Initializes the taskDefinitions attribute with the results from Spring Cloud Data Flow server.
   */
  refresh() {
    const busy = this.tasksService
      .getExecutions(this.params)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((page: Page<TaskExecution>) => {
          if (page.items.length === 0 && this.params.page > 0) {
            this.params.page = 0;
            this.refresh();
            return;
          }
          this.taskExecutions = page;
          this.updateContext();
        },
        error => {
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        }
      );

    this.busyService.addSubscription(busy);
  }

  /**
   * Write the context in the service.
   */
  updateContext() {
    this.context.q = this.params.q;
    this.context.sort = this.params.sort;
    this.context.order = this.params.order;
    this.context.page = this.params.page;
    this.context.size = this.params.size;
  }

  /**
   * Apply sort
   * Triggered on column header click
   *
   * @param {SortParams} sort
   */
  applySort(sort: SortParams) {
    this.params.sort = sort.sort;
    this.params.order = sort.order;
    this.refresh();
  }

  /**
   * Determine if there is no task execution
   */
  isExecutionsEmpty(): boolean {
    if (this.taskExecutions) {
      if (this.taskExecutions.totalPages < 2) {
        return this.taskExecutions.items.length === 0;
      }
    }
    return false;
  }

  /**
   * Used for requesting a new page. The past is page number is
   * 1-index-based. It will be converted to a zero-index-based
   * page number under the hood.
   *
   * @param page 1-index-based
   */
  getPage(page: number) {
    this.loggerService.log(`Getting page ${page}.`);
    this.params.page = page - 1;
    this.refresh();
  }

  /**
   * Changes items per page
   * Reset the pagination (first page)
   * @param {number} size
   */
  changeSize(size: number) {
    this.params.size = size;
    this.params.page = 0;
    this.updateContext();
    this.refresh();
  }

  /**
   * Route to {@link TaskExecution} details page.
   * @param {TaskExecution} taskExecution
   */
  details(taskExecution: TaskExecution) {
    this.router.navigate([`tasks/executions/${taskExecution.executionId}`]);
  }

}
