import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { StreamDefinition } from '../model/stream-definition';
import { StreamsService } from '../streams.service';
import { Modal } from '../../shared/components/modal/modal-abstract';
import { Observable } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { BlockerService } from '../../shared/components/blocker/blocker.service';
import { AppError } from '../../shared/model/error.model';

@Component({
  selector: 'app-stream-destroy',
  templateUrl: './streams-destroy.component.html'
})
export class StreamsDestroyComponent extends Modal implements OnDestroy {

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
              private blockerService: BlockerService,
              private loggerService: LoggerService,
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
      .subscribe((data) => {
        let successMessgage = `${data.length} stream definition was destroyed.`;
        if (data.length > 1) {
          successMessgage = `${data.length} stream definitions were destroyed.`;
        }
        this.notificationService.success(successMessgage);
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
