import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { StreamsService } from '../streams.service';
import { ToastyService } from 'ng2-toasty';
import { Subscription } from 'rxjs/Subscription';
import { StreamDefinition } from '../model/stream-definition';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { BusyService } from '../../shared/services/busy.service';
import { Modal } from '../../shared/components/modal/modal-abstract';
import { Observable } from 'rxjs/Observable';

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
   * Subscription Busy
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
   * @param busyService
   * @param toastyService used to display the status of a deployment
   */
  constructor(private streamsService: StreamsService,
              private modalRef: BsModalRef,
              private busyService: BusyService,
              private toastyService: ToastyService) {

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
    console.log(`Proceeding to deploy ${this.streamDefinitions.length} stream definition(s).`, this.streamDefinitions);
    const busy = this.streamsService.deployMultipleStreamDefinitions(this.streamDefinitions)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data) => {
        this.toastyService.success(`${data.length} stream definition(s) deployed.`);
        this.confirm.emit(data);
        this.cancel();
      }, (error) => {
        this.toastyService.error(error);
      });

    this.busyService.addSubscription(busy);
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
