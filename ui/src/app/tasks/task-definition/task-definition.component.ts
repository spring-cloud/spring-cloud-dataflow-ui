import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TasksService } from '../tasks.service';
import { mergeMap, share, map, catchError } from 'rxjs/operators';
import { Observable, forkJoin, EMPTY } from 'rxjs';
import { TaskDefinition } from '../model/task-definition';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { AppError, HttpAppError } from '../../shared/model/error.model';
import { NotificationService } from '../../shared/services/notification.service';
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
        (params: Params) => this.sharedAboutService.getFeatureInfo()
          .pipe(map((featureInfo: FeatureInfo) => {
            return {
              id: params.id,
              schedulesEnabled: featureInfo.schedulesEnabled
            };
          }))
      ))
      .pipe(
        mergeMap(
          (params: any) => this.tasksService.getDefinition(params.id)
            .pipe(map((taskDefinition: TaskDefinition) => {
              return {
                schedulesEnabled: params.schedulesEnabled,
                definition: taskDefinition
              };
            })),
        ),
        catchError((error) => {
          if (HttpAppError.is404(error)) {
            this.cancel();
          }
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
          return EMPTY;
        })
      );

    this.counters$ = this.route.params
      .pipe(
        mergeMap(
          (params: Params) => this.sharedAboutService.getFeatureInfo()
            .pipe(map((featureInfo: FeatureInfo) => {
              return {
                id: params.id,
                schedulesEnabled: featureInfo.schedulesEnabled
              };
            }))
        ),
        mergeMap(
          (params: any) => {
            const arr = [];
            arr.push(this.tasksService.getTaskExecutions({ q: params.id, size: 1, page: 0, sort: null, order: null }));
            if (params.schedulesEnabled) {
              arr.push(this.tasksService.getSchedules({ q: params.id, size: 1, page: 0, sort: null, order: null }));
            }
            return forkJoin([...arr])
              .pipe(map((forks) => {
                const result = { executions: (forks[0] as Page<TaskExecution>).totalElements };
                if (params.schedulesEnabled) {
                  result['schedules'] = (forks[1] as Page<TaskSchedule>).totalElements;
                }
                return result;
              }));
          }
        ),
        share()
      );
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
