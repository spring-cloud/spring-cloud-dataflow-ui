import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TasksService } from '../../tasks.service';

/**
 * Component used to display the tabulation with counters.
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-tasks-header',
  templateUrl: 'tasks-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksHeaderComponent implements OnInit {

  /**
   * Counters Oservable
   */
  counters$: Observable<any>;

  /**
   * Constructor
   * @param {TasksService} tasksService
   */
  constructor(private tasksService: TasksService) {
  }

  /**
   * Init
   */
  ngOnInit() {
    this.refresh();
  }

  /**
   * Refresh counters
   */
  refresh() {
    this.counters$ = this.tasksService
      .getDefinitions({ q: '', size: 1, page: 0, sort: null, order: null });
  }


}
