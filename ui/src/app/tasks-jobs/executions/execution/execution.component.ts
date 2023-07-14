import {Component, OnInit, ViewChild} from '@angular/core';
import {TaskExecution} from '../../../shared/model/task-execution.model';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskService} from '../../../shared/api/task.service';
import {mergeMap} from 'rxjs/operators';
import {StopComponent} from '../stop/stop.component';
import {CleanupComponent} from '../cleanup/cleanup.component';
import {NotificationService} from '../../../shared/service/notification.service';
import {HttpError} from '../../../shared/model/error.model';
import {LogComponent} from './log/log.component';
import {Task} from '../../../shared/model/task.model';
import {TaskConversion} from '../../../flo/task/model/models';
import {ToolsService} from '../../../flo/task/tools.service';
import get from 'lodash.get';
import {TranslateService} from '@ngx-translate/core';

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
  @ViewChild('logModal', {static: true}) logModal: LogComponent;
  @ViewChild('stopModal', {static: true}) stopModal: StopComponent;
  @ViewChild('cleanModal', {static: true}) cleanModal: CleanupComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private toolsService: ToolsService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        mergeMap(params => {
          this.execution = new TaskExecution();
          this.execution.executionId = params.executionId;
          this.execution.schemaTarget = params.schemaTarget;
          return this.taskService.getExecution(this.execution);
        })
      )
      .subscribe(
        (execution: TaskExecution) => {
          this.execution = execution;
          this.loading = false;
          this.getTask();
        },
        error => {
          this.notificationService.error('An error occurred', error);
          if (HttpError.is404(error)) {
            this.router.navigateByUrl('/tasks-jobs/task-executions');
          }
        }
      );
  }

  getTask(): void {
    this.loadingTask = true;
    this.taskService.getTask(this.execution.taskName).subscribe(
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
    this.loadingApplication = true;
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
        this.loadingApplication = false;
      },
      () => {
        this.loadingApplication = false;
      }
    );
  }

  navigateTask(): void {
    this.router.navigateByUrl(`/tasks-jobs/tasks/${this.task.name}`);
  }

  relaunch(): void {
    this.router.navigateByUrl(`/tasks-jobs/tasks/${this.task.name}/launch`);
  }

  hasLog(): boolean {
    return !!this.execution?.externalExecutionId;
  }

  log(): void {
    this.logModal.open(
      this.translate.instant('executions.execution.logTitle', {id: this.execution.executionId}),
      this.execution
    );
  }

  stop(): void {
    this.stopModal.open(this.execution);
  }

  cleanup(): void {
    this.cleanModal.open([this.execution]);
  }

  back(): void {
    this.router.navigateByUrl('/tasks-jobs/task-executions');
  }
}
