import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../tasks.service';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { TaskDefinition } from '../model/task-definition';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { AppError, HttpAppError } from '../../shared/model/error.model';
import { NotificationService } from '../../shared/services/notification.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { TaskExecution } from '../model/task-execution';
import { Page } from '../../shared/model/page';
import { LoggerService } from '../../shared/services/logger.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TaskDefinitionsDestroyComponent } from '../task-definitions-destroy/task-definitions-destroy.component';

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

  /**
   * Modal
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
   * @param {TasksService} tasksService
   */
  constructor(private route: ActivatedRoute,
              private notificationService: NotificationService,
              private routingStateService: RoutingStateService,
              private router: Router,
              private loggerService: LoggerService,
              private modalService: BsModalService,
              private tasksService: TasksService) {
  }

  /**
   * Init
   */
  ngOnInit() {
    this.task$ = this.route.params
      .pipe(mergeMap(
        val => forkJoin([
          this.tasksService.getDefinition(val.id),
          this.tasksService.getTaskExecutions({ task: val.id, size: 1, page: 0, sort: null, order: null }),
        ]),
        (val1, val2) => {
          return {
            definition: val2[0],
            executions: (val2[1] as Page<TaskExecution>).totalElements
          };
        }
      ))
      .catch((error) => {
        if (HttpAppError.is404(error)) {
          this.cancel();
        }
        this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        return Observable.throw(error);
      });;
  }

  /**
   * Deploy the stream, navigation to the dedicate page
   *
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
