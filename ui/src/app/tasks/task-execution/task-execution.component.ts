import { Component, OnInit } from '@angular/core';
import { TaskExecution } from '../model/task-execution';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from '../tasks.service';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { RoutingStateService } from '../../shared/services/routing-state.service';

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
   * @param {ActivatedRoute} route
   */
  constructor(private tasksService: TasksService,
              private routingStateService: RoutingStateService,
              private route: ActivatedRoute) {
  }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.taskExecution$ = this.route.params
      .pipe(mergeMap(
        (val) => this.tasksService.getExecution(val.id),
        (val1, val2) => val2
      ));
  }

  /**
   * Back action
   * Navigate to the previous URL or /tasks/executions
   */
  cancel() {
    this.routingStateService.back('/tasks/executions', /^(\/tasks\/executions\/)/);
  }

}
