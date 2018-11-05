import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TasksService } from '../tasks.service';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { TaskSchedule } from '../model/task-schedule';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TaskSchedulesDestroyComponent } from '../task-schedules-destroy/task-schedules-destroy.component';
import { LoggerService } from '../../shared/services/logger.service';

/**
 * Task Schedule Component
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-task-schedule',
  templateUrl: 'task-schedule.component.html',
  styleUrls: ['styles.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskScheduleComponent implements OnInit {

  /**
   * Observable of Task Schedule
   */
  taskSchedule$: Observable<TaskSchedule>;

  /**
   * Modal reference
   */
  modal: BsModalRef;

  /**
   * Constructor
   *
   * @param {ActivatedRoute} route
   * @param {RoutingStateService} routingStateService
   * @param {BsModalService} modalService
   * @param {LoggerService} loggerService
   * @param {TasksService} tasksService
   */
  constructor(private route: ActivatedRoute,
              private routingStateService: RoutingStateService,
              private modalService: BsModalService,
              private loggerService: LoggerService,
              private tasksService: TasksService) {
  }

  /**
   * Init
   */
  ngOnInit() {
    this.taskSchedule$ = this.route.params
      .pipe(mergeMap(
        (params: Params) => this.tasksService.getSchedule(params.id)
      ));
  }

  /**
   * Destroy the task schedule
   *
   * @param {TaskSchedule} taskSchedule
   */
  destroy(taskSchedule: TaskSchedule) {
    this.loggerService.log(`Destroy ${taskSchedule.name} task schedule.`, taskSchedule.name);
    this.modal = this.modalService.show(TaskSchedulesDestroyComponent, { class: 'modal-md' });
    this.modal.content.open({ taskSchedules: [taskSchedule] }).subscribe(() => {
      this.cancel();
    });
  }

  /**
   * Back action
   * Navigate to the previous URL or /tasks/schedules
   */
  cancel() {
    this.routingStateService.back('/tasks/schedules', /^(\/tasks\/schedules\/)/);
  }

}
