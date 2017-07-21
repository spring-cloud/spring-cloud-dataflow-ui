import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Router, ActivatedRoute, Params } from '@angular/router';
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
    this.busy = this.tasksService.getExecutions().subscribe(
      data => {
        this.taskExecutions = data;
        this.toastyService.success('Task Executions loaded.');
      }
    );
  }

  getPage(page: number) {
    console.log(`Getting page ${page}.`)
    this.tasksService.taskExecutions.pageNumber = page - 1;
    this.loadTaskExecutions();
  }

  details(item: TaskExecution) {
    this.router.navigate(['tasks/executions/' + item.executionId]);
  }
}
