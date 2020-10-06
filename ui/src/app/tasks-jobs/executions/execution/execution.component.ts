import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskExecution } from '../../../shared/model/task-execution.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../shared/api/task.service';
import { mergeMap } from 'rxjs/operators';
import { StopComponent } from '../stop/stop.component';
import { CleanupComponent } from '../cleanup/cleanup.component';
import { NotificationService } from '../../../shared/service/notification.service';
import { HttpError } from '../../../shared/model/error.model';
import { LogComponent } from './log/log.component';
import { Task } from '../../../shared/model/task.model';
import { TaskConversion } from '../../../flo/task/model/models';
import { ToolsService } from '../../../flo/task/tools.service';
import get from 'lodash.get';

@Component({
  selector: 'app-execution',
  templateUrl: './execution.component.html'
})
export class ExecutionComponent implements OnInit {

  loading = true;
  loadingTask = true;
  loadingApplication = false;
  execution: TaskExecution;
  task: Task;
  applications: any;
  @ViewChild('logModal', { static: true }) logModal: LogComponent;
  @ViewChild('stopModal', { static: true }) stopModal: StopComponent;
  @ViewChild('cleanModal', { static: true }) cleanModal: CleanupComponent;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private taskService: TaskService,
              private toolsService: ToolsService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        mergeMap(
          (params) => {
            this.execution = new TaskExecution();
            this.execution.executionId = params.executionId;
            return this.taskService.getExecution(params.executionId);
          }
        ),
      )
      .subscribe((execution) => {
        this.execution = execution;
        this.loading = false;
        this.getTask();
      }, (error) => {
        this.notificationService.error('An error occurred', error);
        if (HttpError.is404(error)) {
          this.router.navigateByUrl('/tasks-jobs/task-executions');
        }
      });
  }

  getTask() {
    this.loadingTask = true;
    this.taskService.getTask(this.execution.taskName)
      .subscribe((task) => {
        this.task = task;
        this.getApplications();
        this.loadingTask = false;
      }, (error) => {
        this.loadingTask = false;
      });
  }

  getApplications() {
    this.loadingApplication = true;
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
        this.loadingApplication = false;
      }, () => {
        this.loadingApplication = false;
      });
  }

  navigateTask() {
    this.router.navigateByUrl(`/tasks-jobs/tasks/${this.task.name}`);
  }

  relaunch() {
    this.router.navigateByUrl(`/tasks-jobs/tasks/${this.task.name}/launch`);
  }

  hasLog() {
    return (this.execution.taskExecutionStatus === 'COMPLETE' || this.execution.taskExecutionStatus === 'ERROR')
      && this.execution.externalExecutionId;
  }

  log() {
    this.logModal.open(`Log task execution ${this.execution.executionId}`, this.execution);
  }

  stop() {
    this.stopModal.open(this.execution);
  }

  cleanup() {
    this.cleanModal.open([this.execution]);
  }

  back() {
    this.router.navigateByUrl(`/tasks-jobs/task-executions`);
  }

}
