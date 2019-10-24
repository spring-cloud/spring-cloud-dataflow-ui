import { Component, OnInit } from '@angular/core';
import { TaskExecution } from '../model/task-execution';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../tasks.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { NotificationService } from '../../shared/services/notification.service';
import { AppError, HttpAppError } from '../../shared/model/error.model';
import { TaskExecutionsStopComponent } from '../task-executions-stop/task-executions-stop.component';
import { TaskExecutionsDestroyComponent } from '../task-executions-destroy/task-executions-destroy.component';
import { LoggerService } from '../../shared/services/logger.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

/**
 * Component that display a Task Execution.
 *
 * @author Vitrac Damien
 */
@Component({
  selector: 'app-task-execution',
  templateUrl: './task-execution.component.html',
  styleUrls: ['./../task-definitions/styles.scss']
})

export class TaskExecutionComponent implements OnInit {

  /**
   * Observable of Task Execution
   */
  taskExecution$: Observable<any>;

  /**
   * Modal reference
   */
  modal: BsModalRef;

  /**
   * Constructor
   *
   * @param {TasksService} tasksService
   * @param {RoutingStateService} routingStateService
   * @param {NotificationService} notificationService
   * @param {LoggerService} loggerService
   * @param {BsModalService} modalService
   * @param {Router} router
   * @param {ActivatedRoute} route
   * @param {TasksService} tasksService
   */
  constructor(private tasksService: TasksService,
              private routingStateService: RoutingStateService,
              private notificationService: NotificationService,
              private loggerService: LoggerService,
              private modalService: BsModalService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.refresh();
  }

  /**
   * Refresh Method
   */
  refresh() {
    this.taskExecution$ = this.route.params
      .pipe(
        mergeMap(
          (val) => this.tasksService.getExecution(val.id)
        ),
        mergeMap(
          (val) => {
            if (val.taskExecutionStatus === 'COMPLETE' || val.taskExecutionStatus === 'ERROR') {
              return this.tasksService.getTaskExecutionLogs(val).pipe(
                map(logs => {
                  return {
                    task: val,
                    logs: logs
                  };
                })
              );
            } else {
              return of({
                task: val,
                logs: null
              });
            }
          }
        ),
        catchError(error => {
          if (HttpAppError.is404(error) || HttpAppError.is400(error)) {
            this.cancel();
          }
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
          return EMPTY;
        })
      );
  }

  /**
   * Back action
   * Navigate to the previous URL or /tasks/executions
   */
  cancel() {
    this.routingStateService.back('/tasks/executions', /^(\/tasks\/executions\/)/);
  }

  /**
   * Prepare args (split line into array)
   * @param {Array<any>} args
   * @returns {Array<any>}
   */
  getArguments(args: Array<any>): Array<any> {
    return args.map((arg) => arg.split('='));
  }

  /**
   * Route to {@link TaskDefinition} launch page.
   * @param {taskDefinitionName} taskDefinitionName
   */
  launch(taskDefinitionName: string) {
    this.router.navigate([`tasks/definitions/launch/${taskDefinitionName}`]);
  }

  /**
   * Route to {@link TaskDefinition} details page.
   * @param {taskDefinitionName} taskDefinitionName
   */
  detailsTask(taskDefinitionName: string) {
    this.router.navigate([`tasks/definitions/${taskDefinitionName}`]);
  }

  /**
   * Task Execution running
   * @param {TaskExecution} execution
   */
  isRunning(execution: TaskExecution): boolean {
    if (execution && (execution.taskExecutionStatus === 'COMPLETE' || execution.taskExecutionStatus === 'ERROR')) {
      return false;
    }
    return true;
  }

  /**
   * Stop a task execution
   * @param {TaskExecution} execution
   */
  stop(execution: TaskExecution) {
    if (!this.isRunning(execution)) {
      this.notificationService.error('The task execution can not be stopped, the execution is already terminated.');
      return;
    }
    this.loggerService.log(`Stop ${execution} task execution`, execution);
    this.modal = this.modalService.show(TaskExecutionsStopComponent, { class: 'modal-md' });
    this.modal.content.open({ taskExecutions: [execution] }).subscribe(() => {
      this.refresh();
    });
  }

  /**
   * Destroy the task execution
   * @param {TaskExecution} taskExecution
   */
  destroy(taskExecution: TaskExecution) {
    this.loggerService.log(`Destroy ${taskExecution.executionId} task execution.`, taskExecution);
    this.modal = this.modalService.show(TaskExecutionsDestroyComponent, { class: 'modal-md' });
    this.modal.content.open({ taskExecutions: [taskExecution] }).subscribe(() => {
      this.cancel();
    });
  }

}
