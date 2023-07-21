import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {DateTime} from 'luxon';
import {saveAs} from 'file-saver';
import {Task} from '../../../shared/model/task.model';
import {NotificationService} from '../../../shared/service/notification.service';
import {HttpError} from '../../../shared/model/error.model';
import {ClipboardCopyService} from '../../../shared/service/clipboard-copy.service';
import {TaskService} from '../../../shared/api/task.service';
import {TaskLaunchService} from './task-launch.service';
import {TranslateService} from '@ngx-translate/core';
import {LaunchResponse} from '../../../shared/model/task-execution.model';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  providers: [TaskLaunchService],
  styles: []
})
export class LaunchComponent implements OnInit, OnDestroy {
  task: Task;
  loading = true;
  isLaunching = false;
  state: any = {view: 'builder'};
  ngUnsubscribe$: Subject<any> = new Subject();
  properties: Array<string> = [];
  arguments: Array<string> = [];
  ignoreProperties: Array<string> = [];

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private taskService: TaskService,
    private router: Router,
    private clipboardCopyService: ClipboardCopyService,
    private translate: TranslateService
  ) {}

  /**
   * Initialize compoment
   * Subscribe to route params and load a config for a task
   */
  ngOnInit(): void {
    this.route.params
      .pipe(
        mergeMap(params => {
          this.task = new Task();
          this.task.name = params.name;
          return this.taskService.getTask(params.name, true);
        }),
        map((task: Task) => {
          let parameters = '';
          if (task.lastTaskExecution && task.lastTaskExecution.deploymentProperties) {
            parameters = Object.keys(task.lastTaskExecution.deploymentProperties)
              .map(key =>
                task.lastTaskExecution.deploymentProperties[key] === '******'
                  ? ''
                  : `${key}=${task.lastTaskExecution.deploymentProperties[key]}`
              )
              .filter(param => !!param)
              .join('\n');
          }
          return {
            task,
            parameters
          };
        }),
        mergeMap(({task, parameters}) =>
          this.taskService.getPlatforms().pipe(
            map(platforms => ({
              platforms,
              task,
              parameters
            }))
          )
        )
      )
      .subscribe(
        ({task, parameters, platforms}) => {
          this.task = task;
          this.loading = false;
        },
        error => {
          this.notificationService.error('An error occurred', error);
          if (HttpError.is404(error)) {
            this.router.navigate(['/tasks-jobs/tasks']);
          }
        }
      );
  }

  /**
   * On Destroy operations
   */
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }

  /**
   * Update the properties
   */
  updateProperties(value: Array<string>): void {
    this.properties = value.sort();
  }

  updateArguments(value: Array<string>): void {
    this.arguments = value.sort();
  }

  /**
   * Run export file
   * Update the properties
   * @param value Array of properties
   */
  runPropertiesExport(value: Array<string>): void {
    this.updateProperties(value);
    if (this.properties.length === 0) {
      this.notificationService.error(
        this.translate.instant('commons.message.error'),
        this.translate.instant('tasks.launch.main.message.errorExportPropertyContent')
      );
    } else {
      const propertiesText = this.properties.join('\n');
      const date = DateTime.local().toFormat('yyyy-MM-HHmmss');
      const filename = `${this.task.name}_${date}.txt`;
      const blob = new Blob([propertiesText], {type: 'text/plain'});
      saveAs(blob, filename);
    }
  }

  runArgumentsExport(value: Array<string>): void {
    this.updateArguments(value);
    if (this.arguments.length === 0) {
      this.notificationService.error(
        this.translate.instant('commons.message.error'),
        this.translate.instant('tasks.launch.main.message.errorExportArgumentContent')
      );
    } else {
      const argumentsText = this.arguments.join('\n');
      const date = DateTime.local().toFormat('yyyy-MM-HHmmss');
      const filename = `${this.task.name}_${date}.txt`;
      const blob = new Blob([argumentsText], {type: 'text/plain'});
      saveAs(blob, filename);
    }
  }

  /**
   * Run copy to clipboard
   * Update the properties
   * @param value Array of properties
   */
  runPropertiesCopy(value: Array<string>): void {
    this.updateProperties(value);
    if (this.properties.length === 0) {
      this.notificationService.error(
        this.translate.instant('commons.message.error'),
        this.translate.instant('tasks.launch.main.message.errorCopyPropertyContent')
      );
    } else {
      const propertiesText = this.properties.join('\n');
      this.clipboardCopyService.executeCopy(propertiesText);
      this.notificationService.success(
        this.translate.instant('tasks.launch.main.message.successCopyTitle'),
        this.translate.instant('tasks.launch.main.message.successCopyContent')
      );
    }
  }

  runArgumentsCopy(value: Array<string>): void {
    this.updateArguments(value);
    if (this.arguments.length === 0) {
      this.notificationService.error(
        this.translate.instant('commons.message.error'),
        this.translate.instant('tasks.launch.main.message.errorCopyArgumentContent')
      );
    } else {
      const argumentsText = this.arguments.join('\n');
      this.clipboardCopyService.executeCopy(argumentsText);
      this.notificationService.success(
        this.translate.instant('tasks.launch.main.message.successCopyTitle'),
        this.translate.instant('tasks.launch.main.message.successCopyArgsContent')
      );
    }
  }

  /**
   * Run launch
   * Update the properties
   * @param value Array of properties
   */
  runLaunch(props: Array<string>, args: Array<string>): void {
    this.isLaunching = true;
    this.updateProperties(props);
    this.updateArguments(args);
    const prepared = this.prepareParams(this.task.name, this.arguments, this.properties);
    this.taskService.launch(prepared.name, prepared.args, prepared.props).subscribe(
      (launchResponse: LaunchResponse) => {
        this.notificationService.success(
          this.translate.instant('tasks.launch.main.message.successTitle'),
          this.translate.instant('tasks.launch.main.message.successContent', {name: this.task.name})
        );
        this.router.navigate([
          `tasks-jobs/task-executions/${launchResponse.executionId ?? 0}/schemaTarget/${
            launchResponse.schemaTarget ?? 'boot2'
          }`
        ]);
      },
      error => {
        this.isLaunching = false;
        const err = error.message ? error.message : error.toString();
        this.notificationService.error(
          this.translate.instant('commons.message.error'),
          err ? err : this.translate.instant('tasks.launch.main.message.errorLaunchContent')
        );
      }
    );
  }

  prepareParams(name: string, args: Array<string>, props: Array<string>): {name: string; args: string; props: string} {
    return {
      name,
      args: args.filter(a => a !== '').join(' '),
      props: props.filter(a => a !== '').join(', ')
    };
  }
}
