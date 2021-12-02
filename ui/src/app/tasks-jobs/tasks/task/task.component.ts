import {Component, OnInit, ViewChild} from '@angular/core';
import {TaskService} from '../../../shared/api/task.service';
import {Task} from '../../../shared/model/task.model';
import {ActivatedRoute, Router} from '@angular/router';
import {map, mergeMap} from 'rxjs/operators';
import {DestroyComponent} from '../destroy/destroy.component';
import {NotificationService} from '../../../shared/service/notification.service';
import {HttpError} from '../../../shared/model/error.model';
import {TaskConversion} from '../../../flo/task/model/models';
import {ToolsService} from '../../../flo/task/tools.service';
import get from 'lodash.get';
import {TaskExecution, TaskExecutionPage} from '../../../shared/model/task-execution.model';
import {LogComponent} from '../../executions/execution/log/log.component';
import {AboutService} from '../../../shared/api/about.service';
import {AboutState} from '../../../shared/store/about.reducer';
import {ScheduleService} from '../../../shared/api/schedule.service';
import {SchedulePage} from '../../../shared/model/schedule.model';
import {CleanupComponent} from '../cleanup/cleanup.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit {
  loading = true;
  loadingExecution = true;
  loadingApplications = true;
  loadingSchedules = true;
  task: Task;
  applications: Array<any>;
  executions: TaskExecutionPage;
  schedules: SchedulePage;
  scheduleEnabled = false;

  @ViewChild('destroyModal', {static: true}) destroyModal: DestroyComponent;
  @ViewChild('logModal', {static: true}) logModal: LogComponent;
  @ViewChild('cleanupModal', {static: true}) cleanupModal: CleanupComponent;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private notificationService: NotificationService,
    private toolsService: ToolsService,
    private scheduleService: ScheduleService,
    private aboutService: AboutService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        mergeMap(param =>
          this.aboutService.getAbout().pipe(
            map((about: AboutState) => {
              this.scheduleEnabled = about.features.schedules;
              return {
                name: param.name,
                scheduleEnabled: about.features.schedules
              };
            })
          )
        ),
        mergeMap(({name, scheduleEnabled}) => {
          this.task = new Task();
          this.task.name = name;
          return this.taskService.getTask(name, true).pipe(
            map(task => ({
              scheduleEnabled,
              task
            }))
          );
        })
      )
      .subscribe(
        ({task, scheduleEnabled}: {task: Task; scheduleEnabled: boolean}) => {
          this.task = task;
          this.getExecutions();
          this.getApplications();
          if (scheduleEnabled) {
            this.getSchedules();
          }
          this.loading = false;
        },
        error => {
          this.notificationService.error($localize `An error occurred`, error);
          if (HttpError.is404(error)) {
            this.back();
          }
        }
      );
  }

  getSchedules(): void {
    this.scheduleService.getSchedulesByTask(this.task.name).subscribe(
      (schedules: SchedulePage) => {
        this.schedules = schedules;
        this.loadingSchedules = false;
      },
      error => {
        this.notificationService.error($localize `An error occurred`, error);
        this.loadingSchedules = false;
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

  getExecutions(): void {
    this.loadingExecution = true;
    this.taskService.getExecutions(0, 10, this.task.name, 'TASK_EXECUTION_ID', 'DESC').subscribe(
      (page: TaskExecutionPage) => {
        this.executions = page;
        this.loadingExecution = false;
      },
      error => {
        this.loadingExecution = false;
        this.notificationService.error($localize `An error occurred`, error);
      }
    );
  }

  hasLog(execution: TaskExecution): boolean {
    return (
      (execution.taskExecutionStatus === 'COMPLETE' || execution.taskExecutionStatus === 'ERROR') &&
      execution.externalExecutionId !== ''
    );
  }

  openLog(execution: TaskExecution): void {
    this.logModal.open($localize `Log task execution` + ` ${execution.executionId}`, execution);
  }

  navigateExecution(executionId: number): void {
    this.router.navigateByUrl(`tasks-jobs/task-executions/${executionId}`);
  }

  destroy(): void {
    this.destroyModal.open([this.task]);
  }

  launch(): void {
    this.router.navigateByUrl(`tasks-jobs/tasks/${this.task.name}/launch`);
  }

  schedule(): void {
    this.router.navigateByUrl(`tasks-jobs/schedules/${this.task.name}/create`);
  }

  cleanup(): void {
    this.cleanupModal.open(this.task);
  }

  back(): void {
    this.router.navigateByUrl('tasks-jobs/tasks');
  }
}
