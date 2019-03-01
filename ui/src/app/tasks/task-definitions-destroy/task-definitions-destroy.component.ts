import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Modal } from '../../shared/components/modal/modal-abstract';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BusyService } from '../../shared/services/busy.service';
import { TaskDefinition } from '../model/task-definition';
import { TasksService } from '../tasks.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';

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
   * Busy Subscriptions
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
   * @param {BusyService} busyService
   * @param {NotificationService} notificationService
   * @param {LoggerService} loggerService
   */
  constructor(private modalRef: BsModalRef,
              private tasksService: TasksService,
              private busyService: BusyService,
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
    const busy = this.tasksService.destroyDefinitions(this.taskDefinitions)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data) => {
        this.notificationService.success(`${data.length} task definition(s) destroyed.`);
        this.confirm.emit('done');
        this.cancel();
      }, () => {
        this.notificationService.error('An error occurred when bulk deleting Composed Tasks. ' +
          'Please check the server logs for more details.');
        this.confirm.emit('done');
        this.cancel();
      });
    this.busyService.addSubscription(busy);
  }

  /**
   * On Destroy operations
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

}
