import {Component, OnInit, ViewChild} from '@angular/core';
import {JobExecution} from '../../../shared/model/job.model';
import {mergeMap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {JobService} from '../../../shared/api/job.service';
import {ConfirmComponent} from '../../../shared/component/confirm/confirm.component';
import {NotificationService} from '../../../shared/service/notification.service';
import {HttpError} from '../../../shared/model/error.model';
import {TaskExecution} from '../../../shared/model/task-execution.model';
import {Task} from '../../../shared/model/task.model';
import {TaskConversion} from '../../../flo/task/model/models';
import {TaskService} from '../../../shared/api/task.service';
import {ToolsService} from '../../../flo/task/tools.service';
import get from 'lodash.get';
import {LogComponent} from '../../executions/execution/log/log.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-job-execution',
  templateUrl: './execution.component.html',
  styles: []
})
export class ExecutionComponent implements OnInit {
  loading = true;
  execution: JobExecution;
  taskExecution: TaskExecution;
  task: Task;
  loadingApplications = true;
  loadingExecution = true;
  loadingTask = true;
  applications: any;
  @ViewChild('restartModal', {static: true}) restartModal: ConfirmComponent;
  @ViewChild('stopModal', {static: true}) stopModal: ConfirmComponent;
  @ViewChild('logModal', {static: true}) logModal: LogComponent;

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private toolsService: ToolsService,
    private taskService: TaskService,
    private router: Router,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        mergeMap(val => {
          this.execution = new JobExecution();
          this.execution.jobExecutionId = val.executionId;
          return this.jobService.getExecution(val.executionId);
        })
      )
      .subscribe(
        (execution: JobExecution) => {
          this.execution = execution;
          this.getTaskExecution();
          this.loading = false;
        },
        error => {
          this.notificationService.error(this.translate.instant('commons.message.error'), error);
          if (HttpError.is404(error)) {
            this.router.navigateByUrl('/tasks-jobs/job-executions');
          }
        }
      );
  }

  getTaskExecution(): void {
    this.loadingExecution = true;
    this.taskService.getExecution(this.execution.taskExecutionId.toString()).subscribe(
      (taskExecution: TaskExecution) => {
        this.taskExecution = taskExecution;
        this.getTask();
        this.loadingExecution = false;
      },
      error => {
        this.loadingExecution = false;
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
      }
    );
  }

  getTask(): void {
    this.loadingTask = true;
    this.taskService.getTask(this.taskExecution.taskName).subscribe(
      (task: Task) => {
        this.task = task;
        this.getApplications();
        this.loadingTask = false;
      },
      error => {
        this.loadingTask = false;
      }
    );
  }

  getApplications(): void {
    this.loadingApplications = true;
    this.toolsService.parseTaskTextToGraph(this.task.dslText, this.task.name).subscribe(
      (taskConversion: TaskConversion) => {
        let apps = [];
        if (taskConversion.graph && taskConversion.graph.nodes) {
          apps = taskConversion.graph.nodes
            .map(node => {
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
            })
            .filter(app => app !== null);
        }
        this.applications = apps;
        this.loadingApplications = false;
      },
      () => {
        this.loadingApplications = false;
      }
    );
  }

  restart(): void {
    this.restartModal.open();
  }

  restartJob(): void {
    this.jobService.restart(this.execution).subscribe(
      () => {
        this.notificationService.success(
          this.translate.instant('jobs.main.message.successStopTitle'),
          this.translate.instant('jobs.main.message.successRestartMessage', {name: this.execution.name})
        );
      },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
      }
    );
  }

  hasLog(): boolean {
    return this.taskExecution.externalExecutionId !== '';
  }

  viewLog(): void {
    this.logModal.open(`Log task execution ${this.taskExecution.executionId}`, this.taskExecution);
  }

  navigateTask(): void {
    this.router.navigateByUrl(`/tasks-jobs/tasks/${this.task.name}`);
  }

  navigateTaskExecution(): void {
    this.router.navigateByUrl(`/tasks-jobs/task-executions/${this.taskExecution.executionId}`);
  }

  relaunch(): void {
    this.router.navigateByUrl(`/tasks-jobs/tasks/${this.task.name}/launch`);
  }

  stop(): void {
    this.stopModal.open();
  }

  stopJob(): void {
    this.jobService.stop(this.execution).subscribe(
      () => {
        this.notificationService.success(
          this.translate.instant('jobs.main.message.successStopTitle'),
          this.translate.instant('jobs.main.message.successStopMessage', {name: this.execution.name})
        );
      },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
      }
    );
  }
}
