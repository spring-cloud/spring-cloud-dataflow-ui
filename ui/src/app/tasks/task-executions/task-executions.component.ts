import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ToastyService } from 'ng2-toasty';
import { Router } from '@angular/router';
import { Page } from '../../shared/model/page';
import { TaskExecution } from '../model/task-execution';
import { TasksService } from '../tasks.service';
import { Subject } from 'rxjs/Subject';
import { BusyService } from '../../shared/services/busy.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-task-executions',
  templateUrl: './task-executions.component.html',
})
export class TaskExecutionsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  taskExecutions: Page<TaskExecution>;
  executionIdSort: boolean = undefined;
  taskNameSort: boolean = undefined;
  startTimeSort: boolean = undefined;
  endTimeSort: boolean = undefined;
  exitCodeSort: boolean = undefined;

  constructor(
    private busyService: BusyService,
    public tasksService: TasksService,
    private toastyService: ToastyService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loadTaskExecutions();
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.  
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  loadTaskExecutions() {
    const busy = this.tasksService.getExecutions(this.executionIdSort, this.taskNameSort, this.startTimeSort,
        this.endTimeSort, this.exitCodeSort)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(
      data => {
        this.taskExecutions = data;
        this.toastyService.success('Task Executions loaded.');
      }
    );
    this.busyService.addSubscription(busy);
  }

  getPage(page: number) {
    console.log(`Getting page ${page}.`);
    this.tasksService.taskExecutions.pageNumber = page - 1;
    this.loadTaskExecutions();
  }

  details(item: TaskExecution) {
    this.router.navigate(['tasks/executions/' + item.executionId]);
  }

  toggleExecutionIdSort() {
    if (this.executionIdSort === undefined) {
      this.executionIdSort = true;
    } else if (this.executionIdSort) {
      this.executionIdSort = false;
    } else {
      this.executionIdSort = undefined;
    }
    this.loadTaskExecutions();
  }

  toggleTaskNameSort() {
    if (this.taskNameSort === undefined) {
      this.taskNameSort = true;
    } else if (this.taskNameSort) {
      this.taskNameSort = false;
    } else {
      this.taskNameSort = undefined;
    }
    this.loadTaskExecutions();
  }

  toggleStartTimeSort() {
    if (this.startTimeSort === undefined) {
      this.startTimeSort = true;
    } else if (this.startTimeSort) {
      this.startTimeSort = false;
    } else {
      this.startTimeSort = undefined;
    }
    this.loadTaskExecutions();
  }

  toggleEndTimeSort() {
    if (this.endTimeSort === undefined) {
      this.endTimeSort = true;
    } else if (this.endTimeSort) {
      this.endTimeSort = false;
    } else {
      this.endTimeSort = undefined;
    }
    this.loadTaskExecutions();
  }

  toggleExitCodeSort() {
    if (this.exitCodeSort === undefined) {
      this.exitCodeSort = true;
    } else if (this.exitCodeSort) {
      this.exitCodeSort = false;
    } else {
      this.exitCodeSort = undefined;
    }
    this.loadTaskExecutions();
  }
}
