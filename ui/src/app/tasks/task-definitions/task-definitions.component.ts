import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../shared/model/page';
import { Router } from '@angular/router';
import { TaskDefinition } from '../model/task-definition';
import { TasksService } from '../tasks.service';
import { Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TaskListParams } from '../components/tasks.interface';
import { ListDefaultParams, OrderParams, SortParams } from '../../shared/components/shared.interface';
import { TaskDefinitionsDestroyComponent } from '../task-definitions-destroy/task-definitions-destroy.component';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { AppError } from '../../shared/model/error.model';
import { TaskSchedule } from '../model/task-schedule';
import { TaskSchedulesDestroyComponent } from '../task-schedules-destroy/task-schedules-destroy.component';
import { GroupRouteService } from '../../shared/services/group-route.service';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { FeatureInfo } from '../../shared/model/about/feature-info.model';
import { ListBarComponent } from '../../shared/components/list/list-bar.component';
import { AuthService } from '../../auth/auth.service';
import { AppsService } from '../../apps/apps.service';
import { TasksTabulationComponent } from '../components/tasks-tabulation/tasks-tabulation.component';
import { GrafanaService } from '../../shared/grafana/grafana.service';

/**
 * Provides {@link TaskDefinition} related services.
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 * @author Glenn Renfro
 * @author Damien Vitrac
 * @author Christian Tzolov
 *
 */
@Component({
  selector: 'app-tasks-definitions',
  templateUrl: './task-definitions.component.html',
  styleUrls: ['styles.scss']
})
export class TaskDefinitionsComponent implements OnInit, OnDestroy {

  /**
   * Current page of task definitions
   */
  taskDefinitions: Page<TaskDefinition>;

  /**
   * Unsubscribe
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * List Bar Component
   */
  @ViewChild('listBar', { static: true })
  listBar: ListBarComponent;

  /**
   * Modal reference
   */
  modal: BsModalRef;

  /**
   * Current forms value
   */
  form: any = {
    checkboxes: []
  };

  /**
   * State of App List Params
   */
  params: TaskListParams = {
    sort: 'name',
    order: OrderParams.ASC,
    page: 0,
    size: 30,
    q: ''
  };

  /**
   * Schedule Enabled state
   * @type {boolean}
   */
  schedulesEnabled = false;

  /**
   * Contain a key application of each selected application
   * @type {Array}
   */
  itemsSelected: Array<string> = [];

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

  /**
   * Constructor
   *
   * @param {TasksService} tasksService
   * @param {BsModalService} modalService
   * @param {AppsService} appsService
   * @param {LoggerService} loggerService
   * @param {GroupRouteService} groupRouteService
   * @param {Router} router
   * @param {AuthService} authService
   * @param {SharedAboutService} sharedAboutService
   * @param {NotificationService} notificationService
   * @param {GrafanaService} grafanaService
   */
  constructor(public tasksService: TasksService,
              private modalService: BsModalService,
              private appsService: AppsService,
              private loggerService: LoggerService,
              private groupRouteService: GroupRouteService,
              private router: Router,
              private authService: AuthService,
              private sharedAboutService: SharedAboutService,
              private notificationService: NotificationService,
              private grafanaService: GrafanaService) {
  }

  /**
   * Tasks Actions
   */
  tasksActions() {
    return [
      {
        id: 'destroy-tasks',
        icon: 'trash',
        action: 'destroySelected',
        title: 'Destroy task(s)',
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DESTROY'])
      },
      {
        id: 'schedule-tasks',
        icon: 'clock-o',
        action: 'scheduleSelected',
        title: 'Schedule task(s)',
        hidden: !this.schedulesEnabled || !this.authService.securityInfo.canAccess(['ROLE_SCHEDULE'])
      }
    ];
  }

  /**
   * Task Actions
   * @param {TaskDefinition} item
   * @param {number} index
   */
  taskActions(index: number) {
    return [
      {
        id: 'details-task' + index,
        icon: 'info-circle',
        action: 'details',
        title: 'Show details',
        isDefault: true
      },
      {
        divider: true,
        hidden: !this.grafanaEnabled
      },
      {
        id: 'grafana-task' + index,
        action: 'grafana',
        icon: 'grafana',
        custom: true,
        title: 'Grafana Dashboard',
        isDefault: true,
        hidden: !this.grafanaEnabled
      },
      {
        divider: true,
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DEPLOY'])
      },
      {
        id: 'launch-task' + index,
        icon: 'play',
        action: 'launch',
        title: 'Launch task',
        isDefault: true,
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DEPLOY'])
      },
      {
        divider: true,
        hidden: !this.schedulesEnabled || !this.authService.securityInfo.canAccess(['ROLE_SCHEDULE'])
      },
      {
        id: 'task-schedule' + index,
        icon: 'clock-o',
        action: 'schedule',
        title: 'Schedule task',
        disabled: !this.schedulesEnabled,
        hidden: !this.schedulesEnabled || !this.authService.securityInfo.canAccess(['ROLE_SCHEDULE'])
      },
      {
        id: 'delete-schedules' + index,
        icon: 'trash',
        action: 'delete-schedules',
        title: 'Delete schedule',
        disabled: !this.schedulesEnabled,
        hidden: !this.schedulesEnabled || !this.authService.securityInfo.canAccess(['ROLE_SCHEDULE'])
      },
      {
        divider: true,
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DESTROY'])
      },
      {
        id: 'destroy-task' + index,
        icon: 'trash',
        action: 'destroy',
        title: 'Destroy task',
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DESTROY'])
      },
    ];
  }

  /**
   * Apply Action
   * @param action
   * @param args
   */
  applyAction(action: string, args?: any) {
    switch (action) {
      case 'details':
        this.details(args);
        break;
      case 'launch':
        this.launch(args);
        break;
      case 'schedule':
        this.schedule(args);
        break;
      case 'delete-schedules':
        this.destroySchedules(args);
        break;
      case 'destroy':
        this.destroy(args);
        break;
      case 'destroySelected':
        this.destroySelectedTasks();
        break;
      case 'scheduleSelected':
        this.scheduleSelectedTasks();
        break;
      case 'grafana':
        this.grafanaTaskDashboard(args);
        break;
    }
  }

  /**
   * Retrieves the {@link TaskDefinition}s to be displayed on the page.
   */
  ngOnInit() {
    this.context = this.tasksService.tasksContext;
    this.params = { ...this.context };
    this.form = { q: this.context.q, checkboxes: [] };
    this.itemsSelected = this.context.itemsSelected || [];

    this.sharedAboutService.getFeatureInfo()
      .subscribe((featureInfo: FeatureInfo) => {
        this.schedulesEnabled = !!featureInfo.schedulesEnabled;
        this.refresh();
      });
    this.grafanaEnabledSubscription = this.grafanaService.isAllowed().subscribe((active: boolean) => {
      this.grafanaEnabled = active;
    });
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
      .getDefinitions(this.params)
      .pipe(
        map((page: Page<TaskDefinition>) => {
          this.form.checkboxes = page.items.map((task) => {
            return this.itemsSelected.indexOf(task.name) > -1;
          });
          return page;
        }),
        takeUntil(this.ngUnsubscribe$))
      .subscribe((page: Page<TaskDefinition>) => {
          if (page.items.length === 0 && this.params.page > 0) {
            this.params.page = 0;
            this.refresh();
            return;
          }
          this.taskDefinitions = page;
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
   * Run the search
   */
  search(params: ListDefaultParams) {
    this.params.q = params.q;
    this.params.page = 0;
    this.refresh();
  }

  /**
   * Update the list of selected checkbox
   */
  changeCheckboxes() {
    if (!this.taskDefinitions || (this.taskDefinitions.items.length !== this.form.checkboxes.length)) {
      return;
    }
    const value: Array<string> = this.taskDefinitions.items.map((app, index) => {
      if (this.form.checkboxes[index]) {
        return app.name;
      }
    }).filter((a) => a != null);
    this.itemsSelected = value;
    this.updateContext();
  }

  /**
   * Number of selected task definitions
   * @returns {number}
   */
  countSelected(): number {
    return this.form.checkboxes.filter((a) => a).length;
  }

  /**
   * Update event from the Paginator Pager
   * @param params
   */
  changePaginationPager(params) {
    this.params.page = params.page;
    this.params.size = params.size;
    this.updateContext();
    this.refresh();
  }

  /**
   * Removes the {@link TaskDefinition} from the repository.  Shows modal dialog
   * prior to deletion to verify if user wants to destroy definition.
   * @param item the task definition to be removed.
   */
  destroy(item: TaskDefinition) {
    this.destroyTasks([item]);
  }

  /**
   * Starts the destroy process of multiple {@link TaskDefinition}s
   * by opening a confirmation modal dialog.
   */
  destroySelectedTasks() {
    const taskDefinitions = this.taskDefinitions.items
      .filter((item) => this.itemsSelected.indexOf(item.name) > -1);
    this.destroyTasks(taskDefinitions);
  }

  /**
   * Starts the schedule process of multiple {@link TaskDefinition}s
   */
  scheduleSelectedTasks() {
    const taskDefinitions = this.taskDefinitions.items
      .filter((item) => this.itemsSelected.indexOf(item.name) > -1);
    this.scheduleTasks(taskDefinitions);
  }

  /**
   * Starts the destroy the {@link TaskDefinition}s in parameter
   * by opening a confirmation modal dialog.
   * @param {TaskDefinition[]} taskDefinitions
   */
  destroyTasks(taskDefinitions: TaskDefinition[]) {
    if (taskDefinitions.length === 0) {
      return;
    }
    this.loggerService.log(`Destroy ${taskDefinitions} task definition(s).`, taskDefinitions);
    const className = taskDefinitions.length > 1 ? 'modal-lg' : 'modal-md';
    this.modal = this.modalService.show(TaskDefinitionsDestroyComponent, { class: className });
    this.modal.content.open({ taskDefinitions: taskDefinitions }).subscribe(() => {
      if (this.taskDefinitions.items.length === 0 &&
        this.taskDefinitions.pageNumber > 0) {
        this.taskDefinitions.pageNumber = this.taskDefinitions.pageNumber - 1;
      }
      this.refresh();
    });
  }

  /**
   * Starts the destroy the {@link TaskSchedule[]}s
   * by opening a confirmation modal dialog.
   * @param {TaskDefinition} taskDefinition
   */
  destroySchedules(taskDefinition: TaskDefinition) {
    this.modal = this.modalService.show(TaskSchedulesDestroyComponent, { class: 'modal-lg' });
    this.tasksService
      .getSchedules({
        q: taskDefinition.name,
        sort: 'SCHEDULE_ID',
        order: OrderParams.ASC,
        page: 0,
        size: 1000
      }).pipe(map((page: Page<TaskSchedule>) => {
      if (page.totalElements === 0) {
        this.notificationService.error('No schedule exists for this task.');
        this.modal.hide();
      } else {
        this.loggerService.log(`Delete ${page.items} task schedule(s).`, page.items);
        this.modal.content.open({ taskSchedules: page.items }).subscribe(() => {
          this.refresh();
        });
      }
      return page;
    })).subscribe();
  }

  /**
   * Starts the schedule the {@link TaskDefinition}s in parameter
   * @param {TaskDefinition[]} taskDefinitions
   */
  scheduleTasks(taskDefinitions: TaskDefinition[]) {
    if (taskDefinitions.length === 0) {
      return;
    }
    this.loggerService.log(`Schedule ${taskDefinitions} task definition(s).`, taskDefinitions);
    if (taskDefinitions.length === 1) {
      this.schedule(taskDefinitions[0]);
    } else {
      const key = this.groupRouteService.create(taskDefinitions.map((task) => task.name));
      this.router.navigate([`tasks/schedules/create/${key}`]);
    }
  }

  /**
   * Route to {@link TaskDefinition} details page.
   * @param {TaskDefinition} taskDefinition
   */
  details(taskDefinition: TaskDefinition) {
    this.router.navigate([`tasks/definitions/${taskDefinition.name}`]);
  }

  /**
   * Route to {@link TaskDefinition} launch page.
   * @param {TaskDefinition} taskDefinition
   */
  launch(taskDefinition: TaskDefinition) {
    this.router.navigate([`tasks/definitions/launch/${taskDefinition.name}`]);
  }

  /**
   * Route to {@link TaskDefinition} schedule page.
   * @param {TaskDefinition} taskDefinition
   */
  schedule(taskDefinition: TaskDefinition) {
    this.router.navigate([`tasks/schedules/create/${taskDefinition.name}`]);
  }

  /**
   * Create task
   */
  createTask() {
    this.router.navigate([`tasks/create`]);
  }

  /**
   * Navigate to the register app
   */
  registerApps() {
    this.router.navigate(['/apps/add']);
  }

  /**
   * Navigate to the grafana task Dashboard
   * @param taskDefinition
   */
  grafanaTaskDashboard(taskDefinition: TaskDefinition) {
    this.grafanaService.getDashboardTask(taskDefinition).subscribe((url: string) => {
      window.open(url);
    });
  }
}
