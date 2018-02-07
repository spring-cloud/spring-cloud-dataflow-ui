import {Component, Output, EventEmitter} from '@angular/core';
import {StreamsService} from '../streams.service';
import {ToastyService} from 'ng2-toasty';
import {Subscription} from 'rxjs/Subscription';
import {StreamDefinition} from '../model/stream-definition';
import {BsModalRef} from 'ngx-bootstrap';

/**
 * Component used to deploy stream definitions.
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream-deploy-multi',
  templateUrl: './stream-deploy-multi.component.html'
})
export class StreamDeployMultiComponent {

  /**
   * Subscription used for the busy component.
   */
  busy: Subscription;

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
   * @param toastyService used to display the status of a deployment
   */
  constructor(private streamsService: StreamsService,
              private modalRef: BsModalRef,
              private toastyService: ToastyService) {

  }

  /**
   * Close the modal
   */
  cancel() {
    this.modalRef.hide();
  }

  /**
   * Applies the deploy process of multiple {@link StreamDefinition}s
   */
  deployDefinitions() {
    console.log(`Proceeding to deploy ${this.streamDefinitions.length} stream definition(s).`, this.streamDefinitions);
    this.busy = this.streamsService.deployMultipleStreamDefinitions(this.streamDefinitions).subscribe(
      data => {
        this.confirm.emit(data);
        this.cancel();
      },
      error => {
        this.toastyService.error(error);
      }
    );
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
