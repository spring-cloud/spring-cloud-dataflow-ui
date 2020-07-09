import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { Observable, EMPTY, Subject, of, throwError, forkJoin } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, finalize, map, mergeMap, takeUntil } from 'rxjs/operators';
import { TasksService } from '../tasks.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskScheduleCreateValidator } from './task-schedule-create.validator';
import { GroupRouteService } from '../../shared/services/group-route.service';
import { NotificationService } from '../../shared/services/notification.service';
import { TaskLaunchValidator } from '../task-launch/task-launch.validator';
import { TaskSchedule } from '../model/task-schedule';
import { Page } from '../../shared/model/page';
import { AppError } from '../../shared/model/error.model';
import { KvRichTextValidator } from '../../shared/components/kv-rich-text/kv-rich-text.validator';
import { BlockerService } from '../../shared/components/blocker/blocker.service';
import { Platform } from '../../shared/model/platform';
import { Task } from 'protractor/built/taskScheduler';

/**
 * Component handling a creation of a task schedule.
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-task-schedule-create',
  templateUrl: './task-schedule-create.component.html',
  styleUrls: ['styles.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskScheduleCreateComponent implements OnInit {

  /**
   * Unsubscribe
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Schedule Object
   */
  schedule$: Observable<any>;

  /**
   * Form Group
   */
  form: FormGroup;

  /**
   * Form Submitted
   */
  submitted = false;

  /**
   * Validators args / props component
   */
  kvValidators = {
    args: {
      key: [Validators.required],
      value: []
    },
    props: {
      key: [Validators.required, TaskLaunchValidator.key],
      value: []
    }
  };

  /**
   * Constructor
   *
   * @param {RoutingStateService} routingStateService
   * @param {TasksService} tasksService
   * @param {Router} router
   * @param {GroupRouteService} groupRouteService
   * @param {BlockerService} blockerService
   * @param {NotificationService} notificationService
   * @param {ActivatedRoute} route
   */
  constructor(private routingStateService: RoutingStateService,
              private tasksService: TasksService,
              private router: Router,
              private groupRouteService: GroupRouteService,
              private blockerService: BlockerService,
              private notificationService: NotificationService,
              private route: ActivatedRoute) {
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.schedule$ = this.route.params
      .pipe(
        mergeMap(
          (params: Params) => {
            let result: Observable<any>;
            if (this.groupRouteService.isSimilar(params.id)) {
              if (this.groupRouteService.group(params.id)) {
                result = of(this.groupRouteService.group(params.id));
              } else {
                return throwError(`Group selection not found.`);
              }
            } else {
              result = this.tasksService.getDefinition(params.id);
            }
            return result.pipe(map((data) => {
              if (this.groupRouteService.isSimilar(params.id)) {
                return {
                  params: params,
                  taskDefinitions: data
                };
              } else {
                return {
                  params: params,
                  taskDefinitions: [data.name]
                };
              }
            }));
          }
        ),
        mergeMap(
          ({ params, taskDefinitions }) => this.tasksService.getPlatforms()
            .pipe(map((platforms) => {
              return {
                params,
                taskDefinitions,
                platforms
              };
            }))
        ),
        mergeMap(
          (config) => forkJoin([...config.platforms.map((platform) =>
            this.tasksService.getSchedules({
              q: '',
              page: 0,
              size: 10000,
              sort: null,
              order: null,
              platform: platform.name
            })
          )]).pipe(
            map((schedules: Page<TaskSchedule>[]) => {
              const names = [];
              schedules.forEach((page: Page<TaskSchedule>) => {
                names.push(...page.items.map((item) => item.name.toLowerCase()));
              });
              return {
                params: config.params,
                platforms: config.platforms,
                taskDefinitions: config.taskDefinitions,
                schedules: names
              };
            })
          )
        ),
        map((config) => {
          this.buildForm(config);
          return config;
        }),
        catchError((error) => {
          this.notificationService.error(error.toString());
          this.cancel();
          return EMPTY;
        })
      );
  }

  /**
   * Build the form
   */
  buildForm(config) {
    const names = new FormArray(config.taskDefinitions.map(() => {
      return new FormControl('', [
        Validators.required, ((control: FormControl) => {
          return TaskScheduleCreateValidator.existName(control, config.schedules);
        })
      ]);
    }), [TaskScheduleCreateValidator.uniqueName]);
    this.form = new FormGroup({
      'cron': new FormControl('', [Validators.required, TaskScheduleCreateValidator.cron]),
      'names': names,
      'platform': new FormControl(config.platforms.length > 1 ? '' : 'default', [Validators.required]),
      'args': new FormControl('', KvRichTextValidator.validateKvRichText(this.kvValidators.args)),
      'props': new FormControl('', KvRichTextValidator.validateKvRichText(this.kvValidators.props))
    });
  }

  /**
   * Create a schedule
   */
  submit(schedule) {
    this.submitted = true;
    if (!this.form.valid) {
      this.notificationService.error('Some field(s) are missing or invalid.');
    } else {
      const getClean = (val: string): Array<string> => val.split('\n')
        .filter((a) => a !== '');

      const taskArguments = getClean(this.form.get('args').value);
      const taskProperties = getClean(this.form.get('props').value);
      const platform = getClean(this.form.get('platform').value);
      const cronExpression = this.form.get('cron').value;
      const scheduleParams = schedule.taskDefinitions
        .map((taskName: string, index: number) => ({
            args: taskArguments.join(' '),
            props: taskProperties.join(','),
            cronExpression: cronExpression,
            task: taskName,
            platform: platform,
            schedulerName: (this.form.get('names') as FormArray).controls
              .map((control: FormControl) => control.value)[index]
          })
        );

      this.blockerService.lock();
      this.tasksService.createSchedules(scheduleParams)
        .pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
        .subscribe(
          data => {
            if (scheduleParams.length === 1) {
              this.notificationService.success(`Successfully schedule creation "${scheduleParams[0].schedulerName}"`);
            } else {
              this.notificationService.success(`Successfully ${scheduleParams.length} schedules creation`);
            }
            this.cancel();
          },
          error => {
            this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
          }
        );
    }
  }

  /**
   * Navigate to the task page
   * @param {string} taskName
   */
  detailsTask(taskName: string) {
    this.router.navigate([`/tasks/definitions/${taskName}`]);
  }

  /**
   * Cancel
   */
  cancel() {
    this.routingStateService.back('/tasks/definitions');
  }

}
