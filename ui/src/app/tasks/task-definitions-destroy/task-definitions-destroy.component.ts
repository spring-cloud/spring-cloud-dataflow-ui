import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { BsModalRef } from 'ngx-bootstrap';
import { Modal } from '../../shared/components/modal/modal-abstract';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { BusyService } from '../../shared/services/busy.service';
import { TaskDefinition } from '../model/task-definition';
import { TasksService } from '../tasks.service';

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
   * @param {ToastyService} toastyService
   */
  constructor(private modalRef: BsModalRef,
              private tasksService: TasksService,
              private busyService: BusyService,
              private toastyService: ToastyService) {
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
    console.log(`Proceeding to destroy ${this.taskDefinitions.length} task definition(s).`, this.taskDefinitions);
    const busy = this.tasksService.destroyDefinitions(this.taskDefinitions)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data) => {
        this.toastyService.success(`${data.length} task definition(s) destroy.`);
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
