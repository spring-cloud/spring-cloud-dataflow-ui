import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TasksService } from '../../tasks.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { map, mergeMap, share } from 'rxjs/operators';
import { Page } from '../../../shared/model/page';
import { TaskDefinition } from '../../model/task-definition';
import { TaskExecution } from '../../model/task-execution';
import { TaskSchedule } from '../../model/task-schedule';
import { SharedAboutService } from '../../../shared/services/shared-about.service';
import { FeatureInfo } from '../../../shared/model/about/feature-info.model';

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

  constructor(private tasksService: TasksService,
              private sharedAboutService: SharedAboutService) {
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {

    this.params$ = this.sharedAboutService.getFeatureInfo()
      .pipe(map((featureInfo: FeatureInfo) => ({
        schedulerEnabled: featureInfo.schedulerEnabled
      })));

    this.counters$ = this.sharedAboutService.getFeatureInfo()
      .pipe(mergeMap(
        (featureInfo: FeatureInfo) => {
          const arr = [];
          arr.push(this.tasksService.getDefinitions({ q: '', size: 1, page: 0, sort: null, order: null }),
            this.tasksService.getExecutions({ q: '', size: 1, page: 0, sort: null, order: null }));
          if (featureInfo.schedulerEnabled) {
            arr.push(this.tasksService.getSchedules({ task: '', size: 1, page: 0, sort: null, order: null }));
          }
          return forkJoin(...arr);
        }, (featureInfo: FeatureInfo, counters) => {
          const result = {
            schedulerEnabled: featureInfo.schedulerEnabled,
            definitions: (counters[0] as Page<TaskDefinition>).totalElements,
            executions: (counters[1] as Page<TaskExecution>).totalElements
          };
          if (result.schedulerEnabled) {
            result['schedules'] = (counters[2] as Page<TaskSchedule>).totalElements;
          }
          return result;
        }
      ))
      .pipe(share());
  }

}
