import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, share } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TasksService } from '../../tasks.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { TaskSchedule } from '../../model/task-schedule';
import { TaskSchedulesDestroyComponent } from '../../task-schedules-destroy/task-schedules-destroy.component';
import { ListDefaultParams, OrderParams } from '../../../shared/components/shared.interface';
import { Page } from '../../../shared/model/page';

/**
 * Component that shows the executions of a Stream Schedule
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-task-definition-schedules',
  templateUrl: 'task-definition-schedules.component.html',
  styleUrls: ['../styles.scss'],
})
export class TaskDefinitionScheduleComponent implements OnInit, OnDestroy {

  /**
   * Observable of page of task schedules
   */
  schedules$: Observable<any>;

  /**
   * Params Subject
   */
  params$: Subject<ListDefaultParams>;

  /**
   * Last Params
   */
  lastParams: ListDefaultParams;

  /**
   * Current forms value
   */
  form: any = {
    checkboxes: []
  };

  /**
   * Contain a key application of each selected application
   * @type {Array}
   */
  itemsSelected: Array<string> = [];

  /**
   * Modal reference
   */
  modal: BsModalRef;

  /**
   * Constructor
   *
   * @param {ActivatedRoute} route
   * @param {Router} router
   * @param {LoggerService} loggerService
   * @param {BsModalService} modalService
   * @param {TasksService} tasksService
   */
  constructor(private route: ActivatedRoute,
              private router: Router,
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
      this.schedules$ = this.tasksService.getSchedules(params)
        .pipe(map((page: Page<TaskSchedule>) => {
          this.form.checkboxes = page.items.map((schedule) => {
            return this.itemsSelected.indexOf(schedule.name) > -1;
          });
          this.changeCheckboxes(page);
          return page;
        }))
        .pipe(map((page: Page<TaskSchedule>) => {
          return {
            page: page,
            params: params
          };
        }))
        .pipe(share());
    });

    this.route.parent.params.subscribe((params: Params) => {
      this.refresh({
        q: params.id,
        sort: 'SCHEDULE_ID',
        order: OrderParams.ASC,
        page: 0,
        size: 100000
      });
    });
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
   * @param {TaskSchedule} item
   * @param {number} index
   */
  scheduleActions(item: TaskSchedule, index: number) {
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
        this.destroySelectedSchedules(args);
        break;
    }
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
   * @param {ScheduleExecutionListParams} params
   */
  refresh(params: ListDefaultParams) {
    this.lastParams = params;
    this.params$.next(params);
  }

  /**
   * Determine if there is no task execution
   * @param {Page<TaskExecution>} page
   * @returns {boolean}
   */
  isSchedulesEmpty(page: Page<TaskSchedule>): boolean {
    if (page.totalPages < 2) {
      return page.items.length === 0;
    }
    return false;
  }

  /**
   * Update the list of selected checkbox
   */
  changeCheckboxes(page: Page<TaskSchedule>) {
    if (page.items.length !== this.form.checkboxes.length) {
      return;
    }
    const value: Array<string> = page.items.map((schedule, index) => {
      if (this.form.checkboxes[index]) {
        return schedule.name;
      }
    }).filter((a) => a != null);
    this.itemsSelected = value;
  }

  /**
   * Number of selected task definitions
   * @returns {number}
   */
  countSelected(): number {
    return this.form.checkboxes.filter((a) => !!a).length;
  }

  /**
   * Starts the destroy process of multiple {@link TaskDefinition}s
   * by opening a confirmation modal dialog.
   */
  destroySelectedSchedules(page: Page<TaskSchedule>) {
    const schedules = page.items
      .filter((item) => this.itemsSelected.indexOf(item.name) > -1);
    this.destroySchedules(schedules);
  }

  /**
   * Starts the destroy the {@link TaskSchedule}s in parameter
   * by opening a confirmation modal dialog.
   * @param {Page<TaskSchedule>} page
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
      this.refresh(this.lastParams);
    });
  }

  /**
   * Route to {@link TaskSchedule} details page.
   * @param {TaskSchedule} taskSchedule
   */
  details(taskSchedule: TaskSchedule) {
    this.router.navigate([`tasks/schedules/${taskSchedule.name}`]);
  }

}
