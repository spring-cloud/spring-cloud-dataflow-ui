import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { StreamsService } from '../streams.service';
import { StreamDefinition } from '../model/stream-definition';
import { BsModalRef } from 'ngx-bootstrap';
import { finalize, takeUntil } from 'rxjs/operators';
import { Modal } from '../../shared/components/modal/modal-abstract';
import { Observable, Subject } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { AppError } from '../../shared/model/error.model';
import { BlockerService } from '../../shared/components/blocker/blocker.service';

/**
 * Component used to deploy stream definitions.
 *
 * @author Damien Vitrac
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-streams-deploy',
  templateUrl: './streams-deploy.component.html'
})
export class StreamsDeployComponent extends Modal implements OnDestroy {

  /**
   * Unsubscribe
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Collections of StreamDefinition to unregister
   */
  streamDefinitions: StreamDefinition[];

  /**
   * StreamDefinition selected to edit deployment parameters
   */
  selectStreamDefinition: StreamDefinition;

  /**
   * Output event throw after import completed
   */
  @Output() confirm = new EventEmitter();

  /**
   * Adds deployment properties to the FormBuilder
   * @param modalRef Modal reference
   * @param streamsService The service used to deploy the stream.
   * @param blockerService
   * @param notificationService used to display the status of a deployment
   * @param loggerService
   */
  constructor(private streamsService: StreamsService,
              private modalRef: BsModalRef,
              private loggerService: LoggerService,
              private blockerService: BlockerService,
              private notificationService: NotificationService) {

    super(modalRef);
  }

  /**
   * Initialize data
   */
  open(args: { streamDefinitions: StreamDefinition[] }): Observable<any> {
    this.streamDefinitions = args.streamDefinitions;
    return this.confirm;
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Applies the deploy process of multiple {@link StreamDefinition}s
   */
  deployDefinitions() {
    this.loggerService.log(`Proceeding to deploy ${this.streamDefinitions.length} stream definition(s).`, this.streamDefinitions);
    this.blockerService.lock();
    this.streamsService.deployMultipleStreamDefinitions(this.streamDefinitions)
      .pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
      .subscribe((data) => {
        this.notificationService.success(`${data.length} stream definition(s) deployed.`);
        this.confirm.emit(data);
        this.cancel();
      }, (error) => {
        this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
      });
  }

  /**
   * Start the process to add deployment properties to a stream definition
   *
   * @param streamDefinition
   */
  viewDeploymentProperties(streamDefinition: StreamDefinition) {
    this.selectStreamDefinition = streamDefinition;
  }

  /**
   * Back to the stream definitions list to deploy modal
   */
  back() {
    this.selectStreamDefinition = null;
  }

}
