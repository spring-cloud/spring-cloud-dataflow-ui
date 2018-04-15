import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TasksService } from '../../tasks.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { map } from 'rxjs/operators';
import { Page } from '../../../shared/model/page';
import { TaskDefinition } from '../../model/task-definition';
import { TaskExecution } from '../../model/task-execution';
import { Subscription } from 'rxjs/Subscription';

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

  counters$: Observable<any>;

  constructor(private tasksService: TasksService) {
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.counters$ = forkJoin(
      this.tasksService.getDefinitions({ q: '', size: 1, page: 0, sort: null, order: null }),
      this.tasksService.getExecutions({ q: '', size: 1, page: 0, sort: null, order: null })
    ).pipe(map((results) => {
      return {
        definitions: (results[0] as Page<TaskDefinition>).totalElements,
        executions: (results[1] as Page<TaskExecution>).totalElements
      };
    }));
  }

}
