import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from '../tasks.service';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { TaskDefinition } from '../model/task-definition';
import { RoutingStateService } from '../../shared/services/routing-state.service';

/**
 * @author Glenn Renfro
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-task',
  templateUrl: 'task-definition.component.html',
  styleUrls: ['styles.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskDefinitionComponent implements OnInit {

  /**
   * Observable of Task Definition
   */
  taskDefinition$: Observable<TaskDefinition>;

  /**
   * Constructor
   *
   * @param {ActivatedRoute} route
   * @param {RoutingStateService} routingStateService
   * @param {TasksService} tasksService
   */
  constructor(private route: ActivatedRoute,
              private routingStateService: RoutingStateService,
              private tasksService: TasksService) {
  }

  /**
   * Init
   */
  ngOnInit() {
    this.taskDefinition$ = this.route.params
      .pipe(mergeMap(
        val => this.tasksService.getDefinition(val.id),
        (val1, val2) => val2
      ));
  }

  /**
   * Back action
   * Navigate to the previous URL or /tasks/definitions
   */
  cancel() {
    this.routingStateService.back('/tasks/definitions', /^(\/tasks\/definitions\/)/);
  }

}
