import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Modal } from '../../shared/components/modal/modal-abstract';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { TasksService } from '../tasks.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { TaskSchedule } from '../model/task-schedule';
import { BlockerService } from '../../shared/components/blocker/blocker.service';

/**
 * Component used to delete task schedules.
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-task-schedules-destroy',
  templateUrl: './task-schedules-destroy.component.html'
})
export class TaskSchedulesDestroyComponent extends Modal implements OnDestroy {

  /**
   * Unsubscribe
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Task Schedules
   */
  taskSchedules: TaskSchedule[];

  /**
   * Emit after delete success
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
  open(args: { taskSchedules: TaskSchedule[] }): Observable<any> {
    this.taskSchedules = args.taskSchedules;
    return this.confirm;
  }

  /**
   * Submit destroy task schedule(s)
   */
  destroy() {
    this.loggerService.log(`Proceeding to delete ${this.taskSchedules.length} task schedule(s).`, this.taskSchedules);
    this.blockerService.lock();
    this.tasksService.destroySchedules(this.taskSchedules)
      .pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
      .subscribe((data) => {
        this.notificationService.success(`${data.length} task schedule(s) deleted.`);
        this.confirm.emit('done');
        this.cancel();
      }, () => {
        this.notificationService.error('An error occurred while bulk deleting Schedules. ' +
          'Please check the server logs for more details.');
        this.confirm.emit('done');
        this.cancel();
      });
  }

  /**
   * Destroy operations
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

}
