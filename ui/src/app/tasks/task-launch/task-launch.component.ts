import { Component, OnInit, OnDestroy, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { TasksService } from '../tasks.service';
import { PropertyTableComponent } from '../../shared/components/property-table/property-table.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-task-launch',
  templateUrl: './task-launch.component.html',
})
export class TaskLaunchComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  id: string;
  @ViewChildren(PropertyTableComponent) propertyTables;

  constructor(
    private tasksService: TasksService,
    private toastyService: ToastyService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
   }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  back() {
    this.router.navigate(['tasks/definitions']);
  }

  launch(name: string) {
    const taskArguments = [];
    const taskProperties = [];
    this.propertyTables.toArray().forEach(t => {
      if (t.id === 'arguments') {
        t.getProperties().forEach(item => {
          taskArguments.push(item.key + '=' + item.value);
        });
      }
      if (t.id === 'properties') {
        t.getProperties().forEach(item => {
          taskProperties.push(item.key + '=' + item.value);
        });
      }
    });
    this.tasksService.launchDefinition(name, taskArguments.join(','), taskProperties.join(','))
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(
      data => {
        this.toastyService.success('Successfully launched task "' + name + '"');
      },
      error => {
        this.toastyService.error(error);
      }
    );
    this.router.navigate(['tasks/definitions']);
  }
}
