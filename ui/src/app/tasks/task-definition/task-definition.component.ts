import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TasksService } from '../tasks.service';
import { mergeMap, share } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { TaskDefinition } from '../model/task-definition';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { AppError, HttpAppError } from '../../shared/model/error.model';
import { NotificationService } from '../../shared/services/notification.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Page } from '../../shared/model/page';
import { TaskExecution } from '../model/task-execution';
import { TaskSchedule } from '../model/task-schedule';
import { LoggerService } from '../../shared/services/logger.service';
import { TaskDefinitionsDestroyComponent } from '../task-definitions-destroy/task-definitions-destroy.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { FeatureInfo } from '../../shared/model/about/feature-info.model';

/**
 * @author Glenn Renfro
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-task',
  templateUrl: 'task-definition.component.html',
  styleUrls: ['styles.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskDefinitionComponent implements OnInit {

  /**
   * Observable of Task Definition
   */
  task$: Observable<any>;

  counters$: Observable<any>;

  /**
   * Modal reference
   */
  modal: BsModalRef;

  /**
   * Constructor
   *
   * @param {ActivatedRoute} route
   * @param {NotificationService} notificationService
   * @param {RoutingStateService} routingStateService
   * @param {Router} router
   * @param {LoggerService} loggerService
   * @param {BsModalService} modalService
   * @param {SharedAboutService} sharedAboutService
   * @param {TasksService} tasksService
   */
  constructor(private route: ActivatedRoute,
              private notificationService: NotificationService,
              private routingStateService: RoutingStateService,
              private router: Router,
              private loggerService: LoggerService,
              private modalService: BsModalService,
              private sharedAboutService: SharedAboutService,
              private tasksService: TasksService) {
  }

  /**
   * Init
   */
  ngOnInit() {
    this.task$ = this.route.params
      .pipe(mergeMap(
        val => this.sharedAboutService.getFeatureInfo(),
        (params: Params, featureInfo: FeatureInfo) => {
          return {
            id: params.id,
            schedulerEnabled: featureInfo.schedulerEnabled
          };
        }
      ))
      .pipe(mergeMap(
        (params: any) => this.tasksService.getDefinition(params.id),
        (params: any, taskDefinition: TaskDefinition) => ({
          schedulerEnabled: params.schedulerEnabled,
          definition: taskDefinition
        })
      )).catch((error) => {
        if (HttpAppError.is404(error)) {
          this.cancel();
        }
        this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        return Observable.throw(error);
      });

    this.counters$ = this.route.params
      .pipe(mergeMap(
        val => this.sharedAboutService.getFeatureInfo(),
        (params: Params, featureInfo: FeatureInfo) => ({
          id: params.id,
          schedulerEnabled: featureInfo.schedulerEnabled
        })
      ))
      .pipe(mergeMap(
        (params: any) => {
          const arr = [];
          arr.push(this.tasksService.getTaskExecutions({ task: params.id, size: 1, page: 0, sort: null, order: null }));
          if (params.schedulerEnabled) {
            arr.push(this.tasksService.getSchedules({ task: params.id, size: 1, page: 0, sort: null, order: null }));
          }
          return forkJoin(...arr);
        }, (params: any, forks) => {
          const result = { executions: (forks[0] as Page<TaskExecution>).totalElements };
          if (params.schedulerEnabled) {
            result['schedules'] = (forks[1] as Page<TaskSchedule>).totalElements;
          }
          return result;
        }
      ))
      .pipe(share());
  }


  /**
   * Navigate to the schedule creation page
   * @param {TaskDefinition} taskDefinition
   */
  schedule(taskDefinition: TaskDefinition) {
    this.router.navigate([`/tasks/schedules/create/${taskDefinition.name}`]);
  }

  /**
   * Launch page
   * @param {TaskDefinition} taskDefinition
   */
  launch(taskDefinition: TaskDefinition) {
    this.router.navigate([`/tasks/definitions/launch/${taskDefinition.name}`]);
  }

  /**
   * Destroy the task
   *
   * @param {TaskDefinition} taskDefinition
   */
  destroy(taskDefinition: TaskDefinition) {
    this.loggerService.log(`Destroy ${taskDefinition.name} task definition.`, taskDefinition.name);
    this.modal = this.modalService.show(TaskDefinitionsDestroyComponent, { class: 'modal-md' });
    this.modal.content.open({ taskDefinitions: [taskDefinition] }).subscribe(() => {
      this.router.navigate([`/tasks/definitions`]);
    });
  }

  /**
   * Back action
   * Navigate to the previous URL or /tasks/definitions
   */
  cancel() {
    this.routingStateService.back('/tasks/definitions', /^(\/tasks\/definitions\/)/);
  }

}
