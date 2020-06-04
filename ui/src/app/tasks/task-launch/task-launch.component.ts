import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TasksService} from '../tasks.service';
import {catchError, finalize, map, mergeMap, takeUntil} from 'rxjs/operators';
import {EMPTY, Observable, Subject} from 'rxjs';
import {TaskDefinition} from '../model/task-definition';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../shared/services/notification.service';
import {AppError, HttpAppError} from '../../shared/model/error.model';
import {RoutingStateService} from '../../shared/services/routing-state.service';
import {TaskLaunchParams} from '../components/tasks.interface';
import {TaskLaunchValidator} from './task-launch.validator';
import {KvRichTextValidator} from '../../shared/components/kv-rich-text/kv-rich-text.validator';
import {BlockerService} from '../../shared/components/blocker/blocker.service';

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
   * Unsubscribe
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Observable of Task Definition
   */
  task$: Observable<any>;

  /**
   * Form
   */
  form: FormGroup;

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
   * Form Subbmitted
   */
  submitted = false;

  /**
   * Constructor
   *
   * @param {TasksService} tasksService
   * @param {NotificationService} notificationService
   * @param {RoutingStateService} routingStateService
   * @param {BlockerService} blockerService
   * @param {ActivatedRoute} route
   * @param {Router} router
   */
  constructor(private tasksService: TasksService,
              private notificationService: NotificationService,
              private routingStateService: RoutingStateService,
              private blockerService: BlockerService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  /**
   * Initialize
   * Load the task definitions and the platforms
   */
  ngOnInit() {
    this.task$ = this.route.params
      .pipe(
        mergeMap(taskName => this.tasksService.getDefinitionWithManifest(taskName.id).pipe(
          map(taskDefinition => {
            let parameters = '';
            if (taskDefinition.lastTaskExecution && taskDefinition.lastTaskExecution.deploymentProperties) {
                parameters = Object.keys(taskDefinition.lastTaskExecution.deploymentProperties).map(key => {
                  if (taskDefinition.lastTaskExecution.deploymentProperties[key] === '******') {
                    return '';
                  }
                  return `${key}=${taskDefinition.lastTaskExecution.deploymentProperties[key]}`;
                })
                  .filter(param => !!param)
                  .join('\n');
            }
            return {
              taskDefinition: taskDefinition,
              parameters
            };
          })
        )),
        mergeMap(
          taskDefinition => this.tasksService.getPlatforms()
            .pipe(map(platforms => {
              if (platforms.length === 0) {
                this.form = new FormGroup({
                  args: new FormControl('', KvRichTextValidator.validateKvRichText(this.kvValidators.args)),
                  props: new FormControl(taskDefinition.parameters, KvRichTextValidator.validateKvRichText(this.kvValidators.props)),
                  platform: new FormControl('')
                });
              } else {
                this.form = new FormGroup({
                  args: new FormControl('', KvRichTextValidator.validateKvRichText(this.kvValidators.args)),
                  props: new FormControl(taskDefinition.parameters, KvRichTextValidator.validateKvRichText(this.kvValidators.props)),
                  platform: new FormControl('', Validators.required)
                });
              }
              if (platforms.length === 1) {
                this.form.get('platform').setValue(platforms[0].name);
              }
              return {
                taskDefinition: taskDefinition.taskDefinition,
                platforms: platforms
              };
            }))
        ),
        catchError((error) => {
          if (HttpAppError.is404(error)) {
            this.router.navigate(['/tasks/definitions']);
          }
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
          return EMPTY;
        })
      );
  }


  /**
   * Destroy
   *
   * Will clean up any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Prepare params
   * @param {string} name
   * @param {Array<string>} taskArguments
   * @param {Array<string>} taskProperties
   * @param {string} platform
   * @returns {TaskLaunchParams}
   */
  prepareParams(name: string, taskArguments: Array<string>, taskProperties: Array<string>, platform: string): TaskLaunchParams {
    if (platform && platform !== 'default') {
      taskProperties.push(`spring.cloud.dataflow.task.platformName=${platform}`);
    }
    return {
      name: name,
      args: taskArguments.filter((a) => a !== '').join(' '),
      props: taskProperties.filter((a) => a !== '').join(', ')
    };
  }

  /**
   * Launch the task
   *
   * @param name
   */
  submit(name: string) {
    this.submitted = true;
    if (!this.form.valid) {
      this.notificationService.error('Some field(s) are invalid.');
    } else {
      const taskArguments = this.form.get('args').value.toString().split('\n');
      const taskProperties = this.form.get('props').value.toString().split('\n');
      const platform = this.form.get('platform').value;
      this.blockerService.lock();
      this.tasksService.launchDefinition(this.prepareParams(name, taskArguments, taskProperties, platform))
        .pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
        .subscribe(
          data => {
            this.notificationService.success('Successfully launched task "' + name + '"');
            this.router.navigate(['/tasks/definitions']);
          },
          error => {
            this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
          }
        );
    }
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

  /**
   * Can select the platform target
   * @param task
   */
  canSelectPlatform(task): boolean {
    return task.platforms && task.platforms.length > 1;
  }

}
