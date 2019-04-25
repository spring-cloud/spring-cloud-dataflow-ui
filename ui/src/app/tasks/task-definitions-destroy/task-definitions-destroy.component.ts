import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Modal } from '../../shared/components/modal/modal-abstract';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { TaskDefinition } from '../model/task-definition';
import { TasksService } from '../tasks.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { BlockerService } from '../../shared/components/blocker/blocker.service';

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
   * Unsubscribe
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

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
              private loggerService: LoggerService,
              private blockerService: BlockerService,
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
   * Blocking action
   */
  destroy() {
    this.loggerService.log(`Proceeding to destroy ${this.taskDefinitions.length} task definition(s).`, this.taskDefinitions);
    this.blockerService.lock();
    this.tasksService.destroyDefinitions(this.taskDefinitions)
      .pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
      .subscribe((data) => {
        this.notificationService.success(`${data.length} task definition(s) destroyed.`);
        this.confirm.emit('done');
        this.cancel();
      }, () => {
        this.notificationService.error('An error occurred while bulk deleting Composed Tasks. ' +
          'Please check the server logs for more details.');
        this.confirm.emit('done');
        this.cancel();
      });
  }

  /**
   * On Destroy operations
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

}
