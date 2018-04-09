import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from '../tasks.service';
import { Subscription } from 'rxjs/Subscription';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { TaskDefinition } from '../model/task-definition';

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
   * @param {TasksService} tasksService
   */
  constructor(private route: ActivatedRoute,
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

}
