import { Component, OnInit } from '@angular/core';
import { TaskExecution } from '../model/task-execution';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../tasks.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { NotificationService } from '../../shared/services/notification.service';
import { AppError, HttpAppError } from '../../shared/model/error.model';

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
  taskExecution$: Observable<TaskExecution>;

  /**
   * Constructor
   *
   * @param {TasksService} tasksService
   * @param {RoutingStateService} routingStateService
   * @param {NotificationService} notificationService
   * @param {Router} router
   * @param {ActivatedRoute} route
   * @param {TasksService} tasksService
   */
  constructor(private tasksService: TasksService,
              private routingStateService: RoutingStateService,
              private notificationService: NotificationService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.taskExecution$ = this.route.params
      .pipe(
        mergeMap(
          (val) => this.tasksService.getExecution(val.id)
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


}
