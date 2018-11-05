import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { mergeMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TasksService } from '../../tasks.service';
import { TaskDefinition } from '../../model/task-definition';
import { TaskSchedule } from '../../model/task-schedule';

/**
 * Component that shows the summary details of a Task Schedule
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-task-schedule-summary',
  templateUrl: 'task-schedule-summary.component.html',
  styleUrls: ['../styles.scss'],
})
export class TaskScheduleSummaryComponent implements OnInit {

  /**
   * Observable of schedule information
   * Contains the task schedule and a related task definition
   */
  schedule$: Observable<any>;

  /**
   * Constructor
   *
   * @param {ActivatedRoute} route
   * @param {Router} router
   * @param {TasksService} tasksService
   */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private tasksService: TasksService) {
  }

  /**
   * Init component, call refresh method
   */
  ngOnInit() {
    this.refresh();
  }

  /**
   * Refresh
   */
  refresh() {
    this.schedule$ = this.route.parent.params
      .pipe(mergeMap(
        (params: Params) => this.tasksService.getSchedule(params.id)
      ))
      .pipe(mergeMap(
        (schedule: TaskSchedule) => this.tasksService.getDefinition(schedule.taskName)
          .pipe(map((task: TaskDefinition) => {
            return {
              schedule: schedule,
              task: task
            };
          })),
      ));
  }

  /**
   * Navigate to the task page
   * @param {string} taskName
   */
  detailsTask(taskName: string) {
    this.router.navigate([`/tasks/definitions/${taskName}`]);
  }

}
