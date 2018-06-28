import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { TasksService } from '../tasks.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskScheduleCreateValidator } from './task-schedule-create.validator';
import { GroupRouteService } from '../../shared/services/group-route.service';
import { NotificationService } from '../../shared/services/notification.service';
import { TaskLaunchValidator } from '../task-launch/task-launch.validator';
import { Subject } from 'rxjs/Subject';
import { BusyService } from '../../shared/services/busy.service';
import { TaskSchedule } from '../model/task-schedule';
import { Page } from '../../shared/model/page';
import { EMPTY } from 'rxjs/index';

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
   * Busy Subscriptions
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
   * Constructor
   *
   * @param {RoutingStateService} routingStateService
   * @param {TasksService} tasksService
   * @param {BusyService} busyService
   * @param {Router} router
   * @param {GroupRouteService} groupRouteService
   * @param {NotificationService} notificationService
   * @param {ActivatedRoute} route
   */
  constructor(private routingStateService: RoutingStateService,
              private tasksService: TasksService,
              private busyService: BusyService,
              private router: Router,
              private groupRouteService: GroupRouteService,
              private notificationService: NotificationService,
              private route: ActivatedRoute) {
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.schedule$ = this.route.params
      .pipe(mergeMap(
        (params: Params) => {
          let result: Observable<any>;
          if (this.groupRouteService.isSimilar(params.id)) {
            if (this.groupRouteService.group(params.id)) {
              result = Observable.of(this.groupRouteService.group(params.id));
            } else {
              return Observable.throwError(`Group selection not found.`);
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
      ))
      .pipe(mergeMap(
        (schedule) => this.tasksService.getSchedules({ task: '', page: 0, size: 10000, sort: null, order: null })
          .pipe(map((schedules: Page<TaskSchedule>) => {
            return {
              params: schedule.params,
              taskDefinitions: schedule.taskDefinitions,
              schedules: schedules.items.map((item) => item.name.toLowerCase())
            };
          })),
      ))
      .pipe(map((schedule) => {
        this.buildForm(schedule);
        return schedule;
      }))
      .catch((error) => {
        this.notificationService.error(error.toString());
        this.cancel();
        return EMPTY;
      });
  }

  /**
   * Build the form
   */
  buildForm(schedule) {
    const names = new FormArray(schedule.taskDefinitions.map(() => {
      return new FormControl('', [
        Validators.required, ((control: FormControl) => {
          return TaskScheduleCreateValidator.existName(control, schedule.schedules);
        })
      ]);
    }), [TaskScheduleCreateValidator.uniqueName]);
    this.form = new FormGroup({
      'cron': new FormControl('', [Validators.required, TaskScheduleCreateValidator.cron]),
      'names': names,
      'params': new FormArray([]),
      'args': new FormArray([])
    });
    const isEmpty = (dictionary): boolean => Object.entries(dictionary).every((a) => a[1] === '');
    const clean = (array: FormArray, addFunc) => {
      if (!isEmpty(array.controls[array.controls.length - 1].value)) {
        return addFunc(array);
      }
    };
    const add = (arr: FormArray) => {
      const group = new FormGroup({
        'key': new FormControl(''),
        'val': new FormControl('')
      }, { validators: TaskLaunchValidator.keyRequired });
      group.valueChanges.subscribe(() => {
        clean(arr, add);
      });
      arr.push(group);
    };
    add(this.form.get('params') as FormArray);
    add(this.form.get('args') as FormArray);
  }

  /**
   * Create a schedule
   */
  submit(schedule) {
    const isEmpty = (dictionary): boolean => Object.entries(dictionary).every((a) => a[1] === '');
    const getClean = (arr: FormArray): Array<string> => arr.controls
      .map((group) => !isEmpty(group.value) ? `${group.get('key').value}=${group.get('val').value}` : '')
      .filter((a) => a !== '');

    const taskArguments = getClean(this.form.get('args') as FormArray);
    const taskProperties = getClean(this.form.get('params') as FormArray);
    const cronExpression = this.form.get('cron').value;
    const scheduleParams = schedule.taskDefinitions
      .map((taskName: string, index: number) => ({
          args: taskArguments.join(','),
          props: taskProperties.join(','),
          cronExpression: cronExpression,
          task: taskName,
          schedulerName: (this.form.get('names') as FormArray).controls
            .map((control: FormControl) => control.value)[index]
        })
      );
    const busy = this.tasksService.createSchedules(scheduleParams)
      .pipe(takeUntil(this.ngUnsubscribe$))
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
          this.notificationService.error(error);
        }
      );
    this.busyService.addSubscription(busy);
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
