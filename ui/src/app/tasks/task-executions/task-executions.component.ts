import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ToastyService } from 'ng2-toasty';
import { Router } from '@angular/router';
import { Page } from '../../shared/model/page';
import { TaskExecution } from '../model/task-execution';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-task-executions',
  templateUrl: './task-executions.component.html',
})
export class TaskExecutionsComponent implements OnInit {

  taskExecutions: Page<TaskExecution>;
  busy: Subscription;
  executionIdSort: boolean = undefined;
  taskNameSort: boolean = undefined;
  startTimeSort: boolean = undefined;
  endTimeSort: boolean = undefined;
  exitCodeSort: boolean = undefined;

  constructor(
    public tasksService: TasksService,
    private toastyService: ToastyService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loadTaskExecutions();
  }

  loadTaskExecutions() {
    this.busy = this.tasksService.getExecutions(this.executionIdSort, this.taskNameSort, this.startTimeSort,
        this.endTimeSort, this.exitCodeSort).subscribe(
      data => {
        this.taskExecutions = data;
        this.toastyService.success('Task Executions loaded.');
      }
    );
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
