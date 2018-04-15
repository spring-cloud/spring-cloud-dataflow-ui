import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { RenderService } from '../../components/flo/render.service';
import { MetamodelService } from '../../components/flo/metamodel.service';
import { TasksService } from '../../tasks.service';
import { Observable } from 'rxjs/Observable';
import { TaskDefinition } from '../../model/task-definition';

/**
 * Component that shows the graph of a Task Definition
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-task-graph',
  templateUrl: 'task-graph.component.html'
})
export class TaskGraphComponent implements OnInit, OnDestroy {

  /**
   * Stream name
   */
  taskDefinition$: Observable<TaskDefinition>;

  /**
   * Constructor
   *
   * @param {ActivatedRoute} route
   * @param {TasksService} tasksService
   * @param {MetamodelService} metamodelService
   * @param {RenderService} renderService
   */
  constructor(private route: ActivatedRoute,
              private tasksService: TasksService,
              public metamodelService: MetamodelService,
              public renderService: RenderService) {
  }

  /**
   * Initialize
   */
  ngOnInit() {
    this.taskDefinition$ = this.route.parent.params
      .pipe(mergeMap(
        val => this.tasksService.getDefinition(val.id),
        (val1, val2) => val2
      ));
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    this.metamodelService.clearCachedData();
  }

}
