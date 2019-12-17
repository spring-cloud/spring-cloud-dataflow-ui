import { Component, OnDestroy, OnInit } from '@angular/core';
import { Page } from '../../shared/model/page';
import { ListDefaultParams, OrderParams } from '../../shared/components/shared.interface';
import { Subject } from 'rxjs';
import { TasksService } from '../tasks.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Router } from '@angular/router';
import { TaskSchedule } from '../model/task-schedule';
import { map, takeUntil } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TaskSchedulesDestroyComponent } from '../task-schedules-destroy/task-schedules-destroy.component';
import { ViewChild } from '@angular/core';
import { ListBarComponent } from '../../shared/components/list/list-bar.component';
import { TasksTabulationComponent } from '../components/tasks-tabulation/tasks-tabulation.component';

/**
 * Provides {@link TaskSchedule} related services.
 *
 * @author Damien Vitrac
 *
 */
@Component({
  selector: 'app-tasks-schedules',
  templateUrl: './task-schedules.component.html',
  styleUrls: ['styles.scss']
})
export class TaskSchedulesComponent implements OnInit, OnDestroy {

  /**
   * Current page of Tasks Schedules
   */
  taskSchedules: Page<TaskSchedule>;

  /**
   * List Bar Component
   */
  @ViewChild('listBar', { static: true })
  listBar: ListBarComponent;

  /**
   * Unsubscribe
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

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
  params: ListDefaultParams = {
    sort: 'SCHEDULE_ID',
    order: OrderParams.ASC,
    page: 0,
    size: 100000,
    q: ''
  };

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
   * IsLoaded state
   * @type {boolean}
   */
  isLoaded = false;

  /**
   * Constructor
   *
   * @param {BsModalService} modalService
   * @param {TasksService} tasksService
   * @param {NotificationService} notificationService
   * @param {Router} router
   * @param {LoggerService} loggerService
   */
  constructor(private modalService: BsModalService,
              private tasksService: TasksService,
              private notificationService: NotificationService,
              private router: Router,
              private loggerService: LoggerService) {
  }

  /**
   * Retrieves the {@link TaskDefinition}s to be displayed on the page.
   */
  ngOnInit() {
    this.context = this.tasksService.schedulesContext;
    this.params = { ...this.context };
    this.itemsSelected = this.context.itemsSelected || [];
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
   * Schedules Actions
   */
  schedulesActions() {
    return [
      {
        id: 'destroy-schedules',
        icon: 'trash',
        action: 'destroySelected',
        title: 'Destroy schedule(s)'
      },
    ];
  }

  /**
   * Schedule Actions
   * @param {number} index
   */
  scheduleActions(index: number) {
    return [
      {
        id: 'details-schedule' + index,
        icon: 'info-circle',
        action: 'details',
        title: 'Show details',
        isDefault: true
      },
      {
        divider: true
      },
      {
        id: 'destroy-schedule' + index,
        icon: 'trash',
        action: 'destroy',
        title: 'Delete schedule'
      },
      {
        divider: true
      },
      {
        id: 'create-schedule' + index,
        icon: 'clock-o',
        action: 'create',
        title: 'Add new schedule'
      }
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
      case 'destroy':
        this.destroySchedules([args]);
        break;
      case 'destroySelected':
        this.destroySelectedSchedules();
        break;
      case 'create':
        this.createNewSchedule(args);
        break;
    }
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
   * Initializes the taskSchedules attribute with the results from Spring Cloud Data Flow server.
   */
  refresh() {
    this.tasksService
      .getSchedules(this.params)
      .pipe(map(((page: Page<TaskSchedule>) => {
        this.form.checkboxes = page.items.map((schedule) => this.itemsSelected.indexOf(schedule.name) > -1);
        return page;
      })))
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((page: Page<TaskSchedule>) => {
          if (page.items.length === 0 && this.params.page > 0) {
            this.params.page = 0;
            this.refresh();
            return;
          }
          this.isLoaded = true;
          this.taskSchedules = page;
          this.changeCheckboxes();
          this.updateContext();
        },
        error => {
          this.notificationService.error(error);
        }
      );
  }

  /**
   * Determine if there is no task schedule
   */
  isSchedulesEmpty(): boolean {
    if (this.taskSchedules) {
      if (this.taskSchedules.totalPages < 2) {
        return this.params.q === '' && this.taskSchedules.items.length === 0;
      }
    }
    return false;
  }

  /**
   * Update the list of selected checkbox
   */
  changeCheckboxes() {
    if (!this.taskSchedules || (this.taskSchedules.items.length !== this.form.checkboxes.length)) {
      return;
    }
    const value: Array<string> = this.taskSchedules.items.map((schedule, index) => {
      if (this.form.checkboxes[index]) {
        return schedule.name;
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
   * Run the search
   */
  search(params: ListDefaultParams) {
    this.params.q = params.q;
    this.params.page = 0;
    this.refresh();
  }

  /**
   * Starts the destroy process of multiple {@link TaskDefinition}s
   * by opening a confirmation modal dialog.
   */
  destroySelectedSchedules() {
    const schedules = this.taskSchedules.items
      .filter((item) => this.itemsSelected.indexOf(item.name) > -1);
    this.destroySchedules(schedules);
  }

  /**
   * Starts the destroy the {@link TaskSchedule}s in parameter
   * by opening a confirmation modal dialog.
   * @param {TaskSchedule[]} taskSchedules
   */
  destroySchedules(taskSchedules: TaskSchedule[]) {
    if (taskSchedules.length === 0) {
      return;
    }
    this.loggerService.log(`Destroy ${taskSchedules} task schedule(s).`, taskSchedules);
    const className = taskSchedules.length > 1 ? 'modal-lg' : 'modal-md';
    this.modal = this.modalService.show(TaskSchedulesDestroyComponent, { class: className });
    this.modal.content.open({ taskSchedules: taskSchedules }).subscribe(() => {
      this.refresh();
    });
  }

  /**
   * Route to {@link TaskSchedule} details page.
   * @param {TaskSchedule} taskSchedule
   */
  details(taskSchedule: TaskSchedule) {
    this.router.navigate([`tasks/schedules/${taskSchedule.name}`]);
  }

  /**
   * Route to {@link TaskSchedule} details task page.
   * @param {TaskSchedule} taskSchedule
   */
  taskDetails(taskSchedule: TaskSchedule) {
    this.router.navigate([`tasks/definitions/${taskSchedule.taskName}`]);
  }

  /**
   * Route to create {@link TaskSchedule} page.
   * @param {TaskSchedule} taskSchedule
   */
  createNewSchedule(taskSchedule: TaskSchedule) {
    this.router.navigate([`tasks/schedules/create/${taskSchedule.taskName}`]);
  }

}
