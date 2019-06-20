import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { TasksService } from '../../tasks.service';
import { map, mergeMap, share } from 'rxjs/operators';
import { Page } from '../../../shared/model/page';
import { TaskDefinition } from '../../model/task-definition';
import { TaskExecution } from '../../model/task-execution';
import { TaskSchedule } from '../../model/task-schedule';
import { SharedAboutService } from '../../../shared/services/shared-about.service';
import { FeatureInfo } from '../../../shared/model/about/feature-info.model';
import { Router } from '@angular/router';
import { AppsService } from '../../../apps/apps.service';

/**
 * Component used to display the tabulation with counters.
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-tasks-tabulation',
  templateUrl: 'tasks-tabulation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksTabulationComponent implements OnInit {

  params$: Observable<any>;

  counters$: Observable<any>;

  hardRefresh: BehaviorSubject<any> = new BehaviorSubject(new Date());

  /**
   * Constructor
   *
   * @param {TasksService} tasksService
   * @param {SharedAboutService} sharedAboutService
   * @param appsService
   * @param {Router} router
   */
  constructor(private tasksService: TasksService,
              private sharedAboutService: SharedAboutService,
              private appsService: AppsService,
              private router: Router) {
  }

  ngOnInit() {
    this.refresh();
  }

  forceRefresh() {
    this.hardRefresh.next(new Date())
  }

  refresh() {
    this.params$ = this.sharedAboutService.getFeatureInfo()
      .pipe(map((featureInfo: FeatureInfo) => ({
        schedulesEnabled: featureInfo.schedulesEnabled
      })));
    this.counters$ = this.sharedAboutService.getFeatureInfo()
      .pipe(mergeMap(
        (featureInfo: FeatureInfo) => {
          return this.hardRefresh.pipe(map((a) => {
              return featureInfo;
            }
          ));
        }
      ))
      .pipe(mergeMap(
        (featureInfo: FeatureInfo) => {
          const arr = [];
          arr.push(this.tasksService.getDefinitions({ q: '', size: 1, page: 0, sort: null, order: null }),
            this.tasksService.getExecutions({ q: '', size: 1, page: 0, sort: null, order: null }));
          if (featureInfo.schedulesEnabled) {
            arr.push(this.tasksService.getSchedules({ q: '', size: 1, page: 0, sort: null, order: null }));
          }
          return forkJoin([...arr])
            .pipe(map((counters) => {
              const result = {
                schedulesEnabled: featureInfo.schedulesEnabled,
                definitions: (counters[0] as Page<TaskDefinition>).totalElements,
                executions: (counters[1] as Page<TaskExecution>).totalElements
              };
              if (result.schedulesEnabled) {
                result['schedules'] = (counters[2] as Page<TaskSchedule>).totalElements;
              }
              return result;
            }));
        }
      ))
      .pipe(share());
  }

  createTask() {
    this.router.navigate(['/tasks/create']);
  }

}
