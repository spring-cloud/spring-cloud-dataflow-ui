import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Modal } from '../../shared/components/modal/modal-abstract';
import { Observable } from 'rxjs';
import { TaskDefinition } from '../model/task-definition';
import { TasksService } from '../tasks.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { BlockerService } from '../../shared/components/blocker/blocker.service';
import { AppError } from '../../shared/model/error.model';

/**
 * Component used to destroy task definitions.
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-task-definitions-destroy',
  templateUrl: './task-definitions-destroy.component.html'
})
export class TaskDefinitionsDestroyComponent extends Modal implements OnDestroy {

  /**
   * Task Definitions
   */
  taskDefinitions: TaskDefinition[];

  /**
   * Emit after undeploy success
   */
  confirm: EventEmitter<string> = new EventEmitter();

  /**
   * Initialize component
   *
   * @param {BsModalRef} modalRef used to control the current modal
   * @param {TasksService} tasksService
   * @param {BlockerService} blockerService
   * @param {NotificationService} notificationService
   * @param {LoggerService} loggerService
   */
  constructor(private modalRef: BsModalRef,
              private tasksService: TasksService,
              private blockerService: BlockerService,
              private loggerService: LoggerService,
              private notificationService: NotificationService) {
    super(modalRef);
  }

  /**
   * Initialize
   */
  open(args: { taskDefinitions: TaskDefinition[] }): Observable<any> {
    this.taskDefinitions = args.taskDefinitions;
    return this.confirm;
  }

  /**
   * Submit destroy task(s)
   */
  destroy() {
    this.loggerService.log(`Proceeding to destroy ${this.taskDefinitions.length} task definition(s).`, this.taskDefinitions);
    this.blockerService.lock();
    this.tasksService.destroyDefinitions(this.taskDefinitions)
      .subscribe((data) => {
        this.notificationService.success(`${data.length} task definition(s) destroyed.`);
        this.confirm.emit('done');
        this.cancel();
        this.blockerService.unlock();
      }, error => {
        this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        this.blockerService.unlock();
      });
  }

  /**
   * On Destroy operations
   */
  ngOnDestroy() {
  }

}
