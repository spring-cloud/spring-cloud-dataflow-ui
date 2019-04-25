import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { StreamDefinition } from '../model/stream-definition';
import { StreamsService } from '../streams.service';
import { Modal } from '../../shared/components/modal/modal-abstract';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { BlockerService } from '../../shared/components/blocker/blocker.service';

@Component({
  selector: 'app-stream-destroy',
  templateUrl: './streams-destroy.component.html'
})
export class StreamsDestroyComponent extends Modal implements OnDestroy {

  /**
   * Unsubscribe
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Stream Definitions
   */
  streamDefinitions: StreamDefinition[];

  /**
   * Emit after undeploy success
   */
  confirm: EventEmitter<string> = new EventEmitter();

  /**
   * Initialize component
   *
   * @param {BsModalRef} modalRef used to control the current modal
   * @param {StreamsService} streamsService
   * @param {BlockerService} blockerService
   * @param {NotificationService} notificationService
   * @param {LoggerService} loggerService
   */
  constructor(private modalRef: BsModalRef,
              private streamsService: StreamsService,
              private loggerService: LoggerService,
              private blockerService: BlockerService,
              private notificationService: NotificationService) {
    super(modalRef);
  }

  /**
   * Initialize
   */
  open(args: { streamDefinitions: StreamDefinition[] }): Observable<any> {
    this.streamDefinitions = args.streamDefinitions;
    return this.confirm;
  }

  /**
   * Submit destroy stream(s)
   */
  destroy() {
    this.loggerService.log(`Proceeding to destroy ${this.streamDefinitions.length} stream definition(s).`, this.streamDefinitions);
    this.blockerService.lock();
    this.streamsService.destroyMultipleStreamDefinitions(this.streamDefinitions)
      .pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
      .subscribe((data) => {
        let successMessgage: string;
        if (data.length > 1) {
          successMessgage = `${data.length} stream definitions were destroyed.`;
        } else {
          successMessgage = `${data.length} stream definition was destroyed.`;
        }

        this.notificationService.success(successMessgage);
        this.confirm.emit('done');
        this.cancel();
      }, () => {
        this.notificationService.error('An error occurred while bulk deleting Streams. ' +
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
