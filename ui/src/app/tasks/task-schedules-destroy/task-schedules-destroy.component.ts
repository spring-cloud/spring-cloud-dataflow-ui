import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Modal } from '../../shared/components/modal/modal-abstract';
import { Observable } from 'rxjs';
import { TasksService } from '../tasks.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { TaskSchedule } from '../model/task-schedule';
import { BlockerService } from '../../shared/components/blocker/blocker.service';
import { AppError } from '../../shared/model/error.model';

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
              private blockerService: BlockerService,
              private loggerService: LoggerService,
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
      .subscribe((data) => {
        this.notificationService.success(`${data.length} task schedule(s) deleted.`);
        this.confirm.emit('done');
        this.cancel();
        this.blockerService.unlock();
      }, error => {
        this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        this.blockerService.unlock();
      });
  }

  /**
   * Destroy operations
   */
  ngOnDestroy() {
  }

}
