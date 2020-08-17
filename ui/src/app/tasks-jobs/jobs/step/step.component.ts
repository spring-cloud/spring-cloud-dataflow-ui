import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../../shared/api/job.service';
import { map, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { ExecutionStepProgress, ExecutionStepResource, JobExecution } from '../../../shared/model/job.model';
import { NotificationService } from '../../../shared/service/notification.service';
import { HttpError } from '../../../shared/model/error.model';
import { TaskExecution } from '../../../shared/model/task-execution.model';
import { Task } from '../../../shared/model/task.model';
import { TaskConversion } from '../../../flo/task/model/models';
import { ToolsService } from '../../../flo/task/tools.service';
import get from 'lodash.get';
import { TaskService } from '../../../shared/api/task.service';
import { LogComponent } from '../../executions/execution/log/log.component';

@Component({
  selector: 'app-execution-step',
  templateUrl: './step.component.html'
})
export class StepComponent implements OnInit {

  loading = true;
  loadingApplications = true;
  execution: JobExecution;
  stepResource: ExecutionStepResource;
  stepProgress: ExecutionStepProgress;
  taskExecution: TaskExecution;
  task: Task;
  loadingExecution = true;
  loadingTask = true;
  applications: any;
  @ViewChild('logModal', { static: true }) logModal: LogComponent;

  constructor(private route: ActivatedRoute,
              private jobService: JobService,
              private router: Router,
              private taskService: TaskService,
              private toolsService: ToolsService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.route.params
      .pipe(mergeMap(
        params => forkJoin([
          this.jobService.getExecution(params.executionId),
          this.jobService.getExecutionStep(params.executionId, params.stepId),
          this.jobService.getExecutionStepProgress(params.executionId, params.stepId)
        ]).pipe(
          map((results) => {
            // this.jobId = val.jobid;
            return {
              execution: results[0],
              step: results[1],
              stepProgress: results[2]
            };
          }))
        )
      )
      .subscribe((details) => {
        this.execution = details.execution;
        this.stepResource = details.step;
        this.stepProgress = details.stepProgress;
        this.getTaskExecution();
        this.loading = false;
      }, (error) => {
        this.notificationService.error('An error occurred', error);
        if (HttpError.is404(error)) {
          this.router.navigateByUrl('/tasks-jobs/job-executions');
        }
      });
  }

  getTaskExecution() {
    this.loadingExecution = true;
    this.taskService.getExecution(this.execution.taskExecutionId.toString())
      .subscribe((taskExecution) => {
        this.taskExecution = taskExecution;
        this.getTask();
        this.loadingExecution = false;
      }, (error) => {
        this.loadingExecution = false;
        this.notificationService.error('An error occurred', error);
      });
  }

  getTask() {
    this.loadingTask = true;
    this.taskService.getTask(this.taskExecution.taskName)
      .subscribe((task) => {
        this.task = task;
        this.getApplications();
        this.loadingTask = false;
      }, (error) => {
        this.loadingTask = false;
      });
  }

  getApplications() {
    this.loadingApplications = true;
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
        this.loadingApplications = false;
      }, () => {
        this.loadingApplications = false;
      });
  }

  viewLog() {
    this.logModal.open(`Log task execution ${this.taskExecution.executionId}`, this.taskExecution);
  }

  navigateTask() {
    this.router.navigateByUrl(`/tasks-jobs/tasks/${this.task.name}`);
  }

  navigateTaskExecution() {
    this.router.navigateByUrl(`/tasks-jobs/task-executions/${this.taskExecution.executionId}`);
  }

  relaunch() {
    this.router.navigateByUrl(`/tasks-jobs/tasks/${this.task.name}/launch`);
  }

}
