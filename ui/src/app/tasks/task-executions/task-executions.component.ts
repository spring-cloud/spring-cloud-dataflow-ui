import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from '../../shared/model/page';
import { TaskExecution } from '../model/task-execution';
import { TasksService } from '../tasks.service';
import { Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { TaskListParams } from '../components/tasks.interface';
import { OrderParams, SortParams } from '../../shared/components/shared.interface';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { AppError } from '../../shared/model/error.model';
import { AuthService } from '../../auth/auth.service';
import { TasksTabulationComponent } from '../components/tasks-tabulation/tasks-tabulation.component';
import { GrafanaService } from '../../shared/grafana/grafana.service';
import { TaskExecutionsStopComponent } from '../task-executions-stop/task-executions-stop.component';
import { TaskExecutionsDestroyComponent } from '../task-executions-destroy/task-executions-destroy.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

/**
 * Component that displays the Task Executions.
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
   * Unsubscribe
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Modal reference
   */
  modal: BsModalRef;

  /**
   * Current form value
   */
  form: any = {
    checkboxes: []
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
   * Grafana Subscription
   */
  grafanaEnabledSubscription: Subscription;

  /**
   * Featured Info
   */
  grafanaEnabled = false;

  /*
   * Contains a key application of each selected task executions
   * @type {Array}
   */
  itemsSelected: Array<number> = [];

  /**
   * Constructor
   *
   * @param {TasksService} tasksService
   * @param {NotificationService} notificationService
   * @param {AuthService} authService
   * @param {LoggerService} loggerService
   * @param {BsModalService} modalService
   * @param {Router} router
   * @param {GrafanaService} grafanaService
   */
  constructor(public tasksService: TasksService,
              public notificationService: NotificationService,
              private authService: AuthService,
              public loggerService: LoggerService,
              private grafanaService: GrafanaService,
              private modalService: BsModalService,
              private router: Router) {
  }

  /**
   * Retrieves the {@link TaskDefinition}s to be displayed on the page.
   */
  ngOnInit() {
    this.context = this.tasksService.executionsContext;
    this.params = { ...this.context };
    this.grafanaEnabledSubscription = this.grafanaService.isAllowed().subscribe((active: boolean) => {
      this.grafanaEnabled = active;
    });
    this.form = { checkboxes: [] };
    this.itemsSelected = this.context.itemsSelected || [];
    this.refresh();
  }

  /**
   * Execution actions
   * @param {TaskExecution} item
   * @param {number} index
   */
  executionActions(item: TaskExecution, index: number) {
    const isRunning = item.taskExecutionStatus !== 'COMPLETE' && item.taskExecutionStatus !== 'ERROR';
    return [
      {
        id: 'details-execution' + index,
        icon: 'info-circle',
        action: 'details',
        title: 'Show details',
        isDefault: true
      },
      {
        divider: true
      },
      {
        id: 'grafana-task-execution' + index,
        action: 'grafana',
        icon: 'grafana',
        custom: true,
        title: 'Grafana Dashboard',
        isDefault: true,
        hidden: !this.grafanaEnabled
      },
      {
        divider: true,
        hidden: !this.grafanaEnabled
      },
      {
        id: 'details-task' + index,
        icon: 'info-circle',
        action: 'detailstask',
        title: 'Show task details',
        isDefault: false
      },
      {
        id: 'launch-task' + index,
        icon: 'play',
        action: 'launch',
        title: 'Relaunch task',
        isDefault: false,
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DEPLOY'])
      },
      {
        id: 'stop-task' + index,
        icon: 'stop',
        action: 'stop',
        title: 'Stop task',
        isDefault: false,
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DEPLOY']),
        disabled: !isRunning
      },
      {
        divider: true,
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DESTROY']) || item.parentExecutionId
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
   * Task Actions
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
  applyAction(action: string, item: TaskExecution) {
    switch (action) {
      case 'details':
        this.details(item);
        break;
      case 'detailstask':
        this.detailsTask(item.taskName);
        break;
      case 'launch':
        this.launch(item.taskName);
        break;
      case 'grafana':
        this.grafanaTaskExecutionDashboard(item);
        break;
      case 'stop':
        this.stop([item]);
        break;
      case 'destroy':
        this.destroyExecutions([item]);
        break;
      case 'destroySelected':
        this.destroySelectedExecutions();
        break;
    }
  }

  /**
   * Close subscription
   */
  ngOnDestroy() {
    this.grafanaEnabledSubscription.unsubscribe();
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Initializes the taskDefinitions attribute with the results from Spring Cloud Data Flow server.
   */
  refresh() {
    this.tasksService
      .getExecutions(this.params)
      .pipe(map((page: Page<TaskExecution>) => {
        this.form.checkboxes = page.items.map((task) => {
          if (task.parentExecutionId) {
            return null;
          }
          return this.itemsSelected.indexOf(task.executionId) > -1;
        });
        return page;
      }))
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((page: Page<TaskExecution>) => {
          if (page.items.length === 0 && this.params.page > 0) {
            this.params.page = 0;
            this.refresh();
            return;
          }
          this.taskExecutions = page;
          this.changeCheckboxes();
          this.updateContext();
        },
        error => {
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        }
      );
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
    this.context.itemsSelected = this.itemsSelected;
  }

  /**
   * Update the list of selected checkboxes
   */
  changeCheckboxes() {
    if (!this.taskExecutions) {
      return;
    }
    const taskCheckable = this.taskExecutions.items;
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
    this.updateContext();
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
   * Change pagination / Pager
   * @param params
   */
  changePaginationPager(params) {
    this.params.page = params.page;
    this.params.size = params.size;
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

  /**
   * Route to {@link TaskDefinition} details page.
   * @param {taskDefinitionName} taskDefinitionName
   */
  detailsTask(taskDefinitionName: string) {
    this.router.navigate([`tasks/definitions/${taskDefinitionName}`]);
  }

  /**
   * Route to {@link TaskDefinition} launch page.
   * @param {taskDefinitionName} taskDefinitionName
   */
  launch(taskDefinitionName: string) {
    this.router.navigate([`tasks/definitions/launch/${taskDefinitionName}`]);
  }

  /**
   * Navigate to the grafana task Dashboard
   * @param taskExecution
   */
  grafanaTaskExecutionDashboard(taskExecution: TaskExecution) {
    this.grafanaService.getDashboardTaskExecution(taskExecution).subscribe((url: string) => {
      window.open(url);
    });
  }

  /**
   * Stop a task execution
   * @param taskExecutions
   */
  stop(taskExecutions: TaskExecution[]) {
    this.loggerService.log(`Stop ${taskExecutions} task execution(s).`, taskExecutions);
    const className = taskExecutions.length > 1 ? 'modal-lg' : 'modal-md';
    this.modal = this.modalService.show(TaskExecutionsStopComponent, { class: className });
    this.modal.content.open({ taskExecutions: taskExecutions }).subscribe(() => {
      this.refresh();
    });
  }

  /**
   * Starts the destroy process of multiple {@link TaskExecution}s
   * by opening a confirmation modal dialog.
   */
  destroySelectedExecutions() {
    const taskExecutions = this.taskExecutions.items
      .filter((item) => this.itemsSelected.indexOf(item.executionId) > -1);
    this.destroyExecutions(taskExecutions);
  }

  /**
   * Starts the destroy the {@link TaskExecution}s in parameter
   * by opening a confirmation modal dialog.
   * @param {TaskExecution[]} taskExecutions
   */
  destroyExecutions(taskExecutions: TaskExecution[]) {
    if (taskExecutions.length === 0) {
      return;
    }
    this.loggerService.log(`Destroy ${taskExecutions} task execution(s).`, taskExecutions);
    const className = taskExecutions.length > 1 ? 'modal-lg' : 'modal-md';
    this.modal = this.modalService.show(TaskExecutionsDestroyComponent, { class: className });
    this.modal.content.open({ taskExecutions: taskExecutions }).subscribe(() => {
      if (this.taskExecutions.items.length === 0 &&
        this.taskExecutions.pageNumber > 0) {
        this.taskExecutions.pageNumber = this.taskExecutions.pageNumber - 1;
      }
      this.refresh();
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
