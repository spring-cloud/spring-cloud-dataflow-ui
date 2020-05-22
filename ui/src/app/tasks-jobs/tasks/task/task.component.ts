import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../../shared/api/task.service';
import { Task } from '../../../shared/model/task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { DestroyComponent } from '../destroy/destroy.component';
import { NotificationService } from '../../../shared/service/notification.service';
import { HttpError } from '../../../shared/model/error.model';
import { TaskConversion } from '../../../flo/task/model/models';
import { ToolsService } from '../../../flo/task/tools.service';
import get from 'lodash.get';
import { TaskExecution, TaskExecutionPage } from '../../../shared/model/task-execution.model';
import { LogComponent } from '../../executions/execution/log/log.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit {
  loading = true;
  loadingExecution = true;
  task: Task;
  applications: Array<any>;
  executions: TaskExecutionPage;
  execution: TaskExecution;

  @ViewChild('destroyModal', { static: true }) destroyModal: DestroyComponent;
  @ViewChild('logModal', { static: true }) logModal: LogComponent;

  constructor(private taskService: TaskService,
              private router: Router,
              private notificationService: NotificationService,
              private toolsService: ToolsService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        mergeMap(
          val => {
            this.task = new Task();
            this.task.name = val.name;
            return this.taskService.getTask(val.name);
          }
        ),
      )
      .subscribe((task: Task) => {
        this.task = task;
        this.getExecutions();
        this.getApplications();
        this.loading = false;
      }, (error) => {
        this.notificationService.error('An error occurred', error);
        if (HttpError.is404(error)) {
          this.back();
        }
      });
  }

  getApplications() {
    this.toolsService
      .parseTaskTextToGraph(this.task.dslText, this.task.name)
      .subscribe((taskConversion: TaskConversion) => {
        let apps = [];
        if (taskConversion.graph && taskConversion.graph.nodes) {
          apps = taskConversion.graph.nodes.map((node) => {
            if (node.name === 'START' || node.name === 'END') {
              return null;
            }
            const item = {
              name: node.name,
              origin: node.name,
              type: 'task'
            };
            if (get(node, 'metadata.label')) {
              item.name = get(node, 'metadata.label');
            }
            return item;
          }).filter((app) => app !== null);
        }
        this.applications = apps;
      });
  }

  getExecutions() {
    this.loadingExecution = true;
    this.taskService.getExecutions(0, 10, this.task.name, 'TASK_EXECUTION_ID', 'DESC')
      .subscribe((page: TaskExecutionPage) => {
        this.executions = page;
        if (this.executions.total > 0) {
          this.execution = this.executions.items[0];
        }
        this.loadingExecution = false;
      }, (error) => {
        this.loadingExecution = false;
        this.notificationService.error('An error occured', error);
      });
  }

  openLog(execution: TaskExecution) {
    this.logModal.open(`Log task execution ${execution.executionId}`, execution);
  }

  navigateExecution(executionId: number) {
    this.router.navigateByUrl(`tasks-jobs/task-executions/${executionId}`);
  }

  destroy() {
    this.destroyModal.open([this.task]);
  }

  launch() {
    this.router.navigateByUrl(`tasks-jobs/tasks/${this.task.name}/launch`);
  }

  back() {
    this.router.navigateByUrl('tasks-jobs/tasks');
  }

}
