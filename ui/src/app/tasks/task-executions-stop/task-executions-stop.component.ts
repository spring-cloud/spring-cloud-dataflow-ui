import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Modal } from '../../shared/components/modal/modal-abstract';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { TasksService } from '../tasks.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { BlockerService } from '../../shared/components/blocker/blocker.service';
import { TaskExecution } from '../model/task-execution';

/**
 * Component used to stop task execution(s).
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-task-executions-stop',
  templateUrl: './task-executions-stop.component.html'
})
export class TaskExecutionsStopComponent extends Modal implements OnDestroy {

  /**
   * Unsubscribe
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Task Definitions
   */
  taskExecutions: TaskExecution[];

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
  open(args: { taskExecutions: TaskExecution[] }): Observable<any> {
    this.taskExecutions = args.taskExecutions;
    return this.confirm;
  }

  /**
   * Stop submit
   * Blocking action
   */
  stop() {
    this.loggerService.log(`Proceeding to stop ${this.taskExecutions.length} task executions(s).`, this.taskExecutions);
    this.blockerService.lock();
    this.tasksService.stopExecutions(this.taskExecutions)
      .pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
      .subscribe((data) => {
        this.notificationService.success(`Request submitted to stop ${data.length} task execution(s).`);
        this.confirm.emit('done');
        this.cancel();
      }, () => {
        this.notificationService.error('An error occurred while stopping task executions. ' +
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
