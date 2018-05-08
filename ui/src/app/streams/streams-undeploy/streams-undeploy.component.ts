import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { StreamDefinition } from '../model/stream-definition';
import { StreamsService } from '../streams.service';
import { Modal } from '../../shared/components/modal/modal-abstract';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { BusyService } from '../../shared/services/busy.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-streams-undeploy',
  templateUrl: './streams-undeploy.component.html'
})
export class StreamsUndeployComponent extends Modal implements OnDestroy {

  /**
   * Busy Subscriptions
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
   * @param {BusyService} busyService
   * @param {NotificationService} notificationService
   */
  constructor(private modalRef: BsModalRef,
              private streamsService: StreamsService,
              private busyService: BusyService,
              private notificationService: NotificationService) {

    super(modalRef);
  }

  open(args: { streamDefinitions: StreamDefinition[] }): Observable<any> {
    this.streamDefinitions = args.streamDefinitions;
    return this.confirm;
  }

  /**
   * Submit undeploy stream(s)
   */
  undeploy() {
    console.log(`Proceeding to undeploy ${this.streamDefinitions.length} stream definition(s).`, this.streamDefinitions);
    const busy = this.streamsService
      .undeployMultipleStreamDefinitions(this.streamDefinitions)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data) => {
        this.notificationService.success(`${data.length} stream definition(s) undeploy.`);
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
