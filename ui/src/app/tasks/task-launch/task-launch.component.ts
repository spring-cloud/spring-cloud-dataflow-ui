import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TasksService } from '../tasks.service';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { TaskDefinition } from '../model/task-definition';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BusyService } from '../../shared/services/busy.service';
import { TaskLaunchValidator } from './task-launch.validator';
import { NotificationService } from '../../shared/services/notification.service';
import { AppError } from '../../shared/model/error.model';
import { RoutingStateService } from '../../shared/services/routing-state.service';

/**
 * Component that provides a launcher of task.
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-task-launch',
  templateUrl: './task-launch.component.html',
  styleUrls: ['./styles.scss']
})
export class TaskLaunchComponent implements OnInit, OnDestroy {

  /**
   * Busy Subscriptions
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Observable of Task Definition
   */
  taskDefinition$: Observable<TaskDefinition>;

  /**
   * Form
   */
  form: FormGroup;

  /**
   * Constructor
   *
   * @param {TasksService} tasksService
   * @param {NotificationService} notificationService
   * @param {BusyService} busyService
   * @param {RoutingStateService} routingStateService
   * @param {ActivatedRoute} route
   * @param {Router} router
   */
  constructor(private tasksService: TasksService,
              private notificationService: NotificationService,
              private busyService: BusyService,
              private routingStateService: RoutingStateService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  /**
   * Initialize
   */
  ngOnInit() {
    this.buildForm();
    this.taskDefinition$ = this.route.params
      .pipe(mergeMap(
        val => this.tasksService.getDefinition(val.id)
      ));
  }

  /**
   * Build the form
   */
  buildForm() {
    this.form = new FormGroup({
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
   * Destroy
   *
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Launch the task
   *
   * @param {string} name
   */
  submit(name: string) {
    const isEmpty = (dictionary): boolean => Object.entries(dictionary).every((a) => a[1] === '');
    const getClean = (arr: FormArray): Array<string> => {
      return arr.controls.map((group) => {
        return !isEmpty(group.value)
          ? `${group.get('key').value}=${group.get('val').value}`
          : '';
      }).filter((a) => a !== '');
    };
    const taskArguments = getClean(this.form.get('args') as FormArray);
    const taskProperties = getClean(this.form.get('params') as FormArray);
    const busy = this.tasksService.launchDefinition({
      name: name,
      args: taskArguments.join(','),
      props: taskProperties.join(',')
    }).pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        data => {
          this.notificationService.success('Successfully launched task "' + name + '"');
          this.router.navigate(['/tasks/definitions']);
        },
        error => {
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        }
      );
    this.busyService.addSubscription(busy);
  }

  /**
   * Back action
   * Navigate to the previous URL or /tasks/definitions
   *
   * @param {TaskDefinition} taskDefinition
   */
  cancel(taskDefinition: TaskDefinition) {
    this.routingStateService.back(`/tasks/definitions/${taskDefinition.name}`);
  }

}
